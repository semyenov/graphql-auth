/**
 * Direct Authentication with Tokens GraphQL Resolvers
 * 
 * Handles authentication with refresh tokens using direct implementation
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import { requireAuthentication } from '../../../context/auth'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import type { ILogger } from '../../../core/services/logger.interface'
import type { IPasswordService } from '../../../core/services/password.service.interface'
import { AuthenticationError, normalizeError } from '../../../errors'
import { TokenService } from '../../../features/auth/infrastructure/services/token.service'
import { builder } from '../../../schema/builder'
import { RateLimitPresets } from '../../services/rate-limiter.service'
import { commonValidations } from '../pothos-helpers'
import { applyRateLimit, createRateLimitConfig } from '../rate-limit-plugin'
import { AuthTokensType } from '../types/auth.types'
import { prisma } from '../../../prisma'

// Get services from container
const getPasswordService = () => container.resolve<IPasswordService>('IPasswordService')
const getLogger = () => container.resolve<ILogger>('ILogger')

// Login with tokens mutation (direct implementation)
builder.mutationField('loginWithTokensDirect', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Authenticate and receive access and refresh tokens',
    grantScopes: ['public'],
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
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'loginWithTokensDirect' })
      logger.info('Login with tokens attempt', { email: args.email })

      try {
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth('login'),
            options: RateLimitPresets.login,
          },
          args,
          context
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
        const isValidPassword = await passwordService.verify(args.password, user.password)

        if (!isValidPassword) {
          logger.warn('Login failed - invalid password', { email: args.email, userId: user.id })
          throw new AuthenticationError('Invalid email or password')
        }

        // Generate tokens
        const tokenService = container.resolve(TokenService)
        const tokens = await tokenService.generateTokens({
          id: user.id,
          email: user.email,
        })

        logger.info('Login with tokens successful', { email: args.email, userId: user.id })

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }
      } catch (error) {
        logger.error('Login with tokens error', error as Error, { email: args.email })
        throw normalizeError(error)
      }
    },
  })
)

// Refresh token mutation (direct implementation)
builder.mutationField('refreshTokenDirect', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Refresh access token using a refresh token',
    grantScopes: ['public'],
    args: {
      refreshToken: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1),
        },
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'refreshTokenDirect' })
      logger.info('Token refresh attempt')

      try {
        const tokenService = container.resolve(TokenService)
        const tokens = await tokenService.refreshTokens(args.refreshToken)

        logger.info('Token refresh successful')

        return tokens
      } catch (error) {
        logger.error('Token refresh error', error as Error)
        throw normalizeError(error)
      }
    },
  })
)

// Logout mutation (direct implementation)
builder.mutationField('logoutDirect', (t) =>
  t.boolean({
    description: 'Logout user and revoke all refresh tokens',
    grantScopes: ['authenticated'],
    resolve: async (_parent, _args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'logoutDirect' })

      try {
        const userId = requireAuthentication(context)
        logger.info('Logout attempt', { userId })

        const tokenService = container.resolve(TokenService)

        // Revoke all refresh tokens for the user (extract numeric value)
        await tokenService.revokeAllTokens(userId.value)

        logger.info('Logout successful', { userId })
        return true
      } catch (error) {
        logger.error('Logout error', error as Error)
        throw normalizeError(error)
      }
    },
  })
)