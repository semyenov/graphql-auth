/**
 * Direct Authentication with Tokens GraphQL Resolvers
 *
 * Handles authentication with refresh tokens using direct implementation
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import { normalizeError } from '../../../app/errors/handlers'
import { AuthenticationError } from '../../../app/errors/types'
import type { ILogger } from '../../../app/services/logger.interface'
import type { IPasswordService } from '../../../app/services/password.service.interface'
import { RateLimitPresets } from '../../../app/services/rate-limiter.service'
import type { ITokenService } from '../../../app/services/token.service.interface'
import {
  isAuthenticatedUser,
  rateLimitSensitiveOperations,
} from '../../../graphql/middleware/rules'
import { builder } from '../../../graphql/schema/builder'
import { commonValidations } from '../../../graphql/schema/helpers'
import {
  applyRateLimit,
  createRateLimitConfig,
} from '../../../graphql/schema/plugins/rate-limit.plugin'
import { prisma } from '../../../prisma'
import { requireAuthentication } from '../guards/auth.guards'
import { AuthTokensType } from '../types/auth.types'

// Get services from container
const getPasswordService = () =>
  container.resolve<IPasswordService>('IPasswordService')
const getLogger = () => container.resolve<ILogger>('ILogger')
const getTokenService = () => container.resolve<ITokenService>('ITokenService')

// Login with tokens mutation (direct implementation)
builder.mutationField('loginWithTokens', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Authenticate and receive access and refresh tokens',
    shield: rateLimitSensitiveOperations,
    args: {
      email: t.arg.string({
        required: true,
        validate: {
          schema: commonValidations.email,
        },
      }),
      password: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1),
        },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'loginWithTokens' })
      logger.info('Login with tokens attempt', { email: args.email })

      try {
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth('login'),
            options: RateLimitPresets.login,
          },
          args,
          context,
        )

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: args.email },
        })

        if (!user) {
          logger.warn('Login failed - user not found', { email: args.email })
          throw new AuthenticationError('Invalid email or password')
        }

        // Verify password
        const passwordService = getPasswordService()
        const isValidPassword = await passwordService.verify(
          args.password,
          user.password,
        )

        if (!isValidPassword) {
          logger.warn('Login failed - invalid password', {
            email: args.email,
            userId: user.id,
          })
          throw new AuthenticationError('Invalid email or password')
        }

        // Check if password needs rehashing (e.g., upgrading from bcrypt to argon2)
        const needsRehash =
          passwordService.needsRehash &&
          (await passwordService.needsRehash(user.password))
        if (needsRehash) {
          // Rehash the password with the new algorithm
          const newHash = await passwordService.hash(args.password)
          await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash },
          })
          logger.info('Password rehashed during login', { userId: user.id })
        }

        // Generate tokens
        const tokenService = getTokenService()
        const tokens = await tokenService.generateTokens({
          id: user.id,
          email: user.email,
        })

        logger.info('Login with tokens successful', {
          email: args.email,
          userId: user.id,
        })

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }
      } catch (error) {
        logger.warn('Login with tokens error', {
          email: args.email,
          error,
        })
        throw normalizeError(error)
      }
    },
  }),
)

// Refresh token mutation (direct implementation)
builder.mutationField('refreshToken', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Refresh access token using a refresh token',
    shield: rateLimitSensitiveOperations,
    args: {
      refreshToken: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1),
        },
      }),
    },
    resolve: async (_parent, args, _context) => {
      const logger = getLogger().child({ resolver: 'refreshToken' })
      logger.info('Token refresh attempt')

      try {
        const tokenService = getTokenService()
        const tokens = await tokenService.refreshTokens(args.refreshToken)

        logger.info('Token refresh successful')

        return tokens
      } catch (error) {
        logger.warn('Token refresh error', { error })
        throw normalizeError(error)
      }
    },
  }),
)

// Logout mutation (direct implementation)
builder.mutationField('logout', (t) =>
  t.boolean({
    description: 'Logout user and revoke all refresh tokens',
    shield: isAuthenticatedUser,
    resolve: async (_parent, _args, context) => {
      const logger = getLogger().child({ resolver: 'logout' })

      try {
        const userId = requireAuthentication(context)
        logger.info('Logout attempt', { userId })

        const tokenService = getTokenService()

        // Revoke all refresh tokens for the user (extract numeric value)
        await tokenService.revokeAllTokens(userId.value)

        logger.info('Logout successful', { userId })
        return true
      } catch (error) {
        logger.error('Logout error', error as Error)
        throw normalizeError(error)
      }
    },
  }),
)
