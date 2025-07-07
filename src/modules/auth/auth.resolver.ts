/**
 * Authentication Module Resolver
 *
 * Consolidated authentication operations following the Direct Resolvers pattern.
 * Combines basic auth, token management, and enhanced auth features.
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import type { IPasswordService } from '@/modules/auth/interfaces/password.service.interface'
import type { ITokenService } from '@/modules/auth/interfaces/token.service.interface'
import { prisma } from '@/modules/shared/database'
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
import { isAuthenticatedUser } from '@/modules/shared/rules/common.rules'
import { RateLimitPresets } from '@/modules/shared/services/rate-limiter.service'
import { normalizeError } from '../../app/errors/handlers'
import { AuthenticationError, ConflictError } from '../../app/errors/types'
import { builder } from '../../graphql/schema/builder'
import { commonValidations } from '../../graphql/schema/helpers'
import {
  applyRateLimit,
  createRateLimitConfig,
} from '../../graphql/schema/plugins/rate-limit.plugin'
import { rateLimitAuth } from './auth.rules'
import { requireAuthentication } from './guards/auth.guards'
import { signToken } from './services/jwt.service'
import { AuthTokensType } from './types/auth.types'

// Service getters
const getPasswordService = () =>
  container.resolve<IPasswordService>('IPasswordService')
const getLogger = () => container.resolve<ILogger>('ILogger')
const getTokenService = () => container.resolve<ITokenService>('ITokenService')

// ============================================================================
// Basic Authentication
// ============================================================================

/**
 * Signup mutation - Create new user account
 */
builder.mutationField('signup', (t) =>
  t.string({
    description: 'Create a new user account',
    shield: rateLimitAuth,
    args: {
      email: t.arg.string({
        required: true,
        validate: { schema: commonValidations.email },
      }),
      password: t.arg.string({
        required: true,
        validate: { schema: commonValidations.password },
      }),
      name: t.arg.string({
        required: false,
        validate: { schema: z.string().min(1).max(100) },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'signup' })
      const normalizedEmail = args.email.toLowerCase()
      logger.info('Signup attempt', { email: normalizedEmail })

      // Apply rate limiting
      await applyRateLimit(
        {
          ...createRateLimitConfig.forAuth('signup'),
          options: RateLimitPresets.signup,
        },
        { ...args, email: normalizedEmail },
        context,
      )

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      })

      if (existingUser) {
        logger.warn('Signup failed - email already exists', {
          email: normalizedEmail,
        })
        throw new ConflictError('An account with this email already exists')
      }

      // Hash password and create user
      const passwordService = getPasswordService()
      const hashedPassword = await passwordService.hash(args.password)

      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          name: args.name || null,
        },
      })

      logger.info('User created successfully', {
        userId: user.id,
        email: user.email,
      })

      // Generate token
      const token = signToken({ userId: user.id })
      return token
    },
  }),
)

/**
 * Login mutation - Basic authentication
 */
builder.mutationField('login', (t) =>
  t.string({
    description: 'Login with email and password',
    shield: rateLimitAuth,
    args: {
      email: t.arg.string({
        required: true,
        validate: { schema: commonValidations.email },
      }),
      password: t.arg.string({
        required: true,
        validate: { schema: commonValidations.password },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'login' })
      const normalizedEmail = args.email.toLowerCase()
      logger.info('Login attempt', { email: normalizedEmail })

      // Apply rate limiting
      await applyRateLimit(
        {
          ...createRateLimitConfig.forAuth('login'),
          options: RateLimitPresets.login,
        },
        { ...args, email: normalizedEmail },
        context,
      )

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      })

      if (!user) {
        logger.warn('Login failed - user not found', { email: normalizedEmail })
        throw new AuthenticationError('Invalid email or password')
      }

      // Verify password
      const passwordService = getPasswordService()
      const isValid = await passwordService.verify(args.password, user.password)

      if (!isValid) {
        logger.warn('Login failed - invalid password', {
          email: normalizedEmail,
          userId: user.id,
        })
        throw new AuthenticationError('Invalid email or password')
      }

      logger.info('Login successful', {
        email: normalizedEmail,
        userId: user.id,
      })

      // Generate token
      const token = signToken({ userId: user.id })
      return token
    },
  }),
)

// ============================================================================
// Token-based Authentication
// ============================================================================

/**
 * Login with tokens - Returns both access and refresh tokens
 */
builder.mutationField('loginWithTokens', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Authenticate and receive access and refresh tokens',
    shield: rateLimitAuth,
    args: {
      email: t.arg.string({
        required: true,
        validate: { schema: commonValidations.email },
      }),
      password: t.arg.string({
        required: true,
        validate: { schema: commonValidations.password },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'loginWithTokens' })
      const normalizedEmail = args.email.toLowerCase()
      logger.info('Login with tokens attempt', { email: normalizedEmail })

      try {
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth('login'),
            options: RateLimitPresets.login,
          },
          { ...args, email: normalizedEmail },
          context,
        )

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        })

        if (!user) {
          logger.warn('Login failed - user not found', {
            email: normalizedEmail,
          })
          throw new AuthenticationError('Invalid email or password')
        }

        // Verify password
        const passwordService = getPasswordService()
        const isValid = await passwordService.verify(
          args.password,
          user.password,
        )

        if (!isValid) {
          logger.warn('Login failed - invalid password', {
            email: normalizedEmail,
            userId: user.id,
          })
          throw new AuthenticationError('Invalid email or password')
        }

        // Generate tokens
        const tokenService = getTokenService()
        const { accessToken, refreshToken } = await tokenService.generateTokens(
          { id: user.id, email: user.email },
        )

        logger.info('Login with tokens successful', {
          email: args.email,
          userId: user.id,
        })

        return {
          accessToken,
          refreshToken,
          user,
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

/**
 * Refresh token mutation
 */
builder.mutationField('refreshToken', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Refresh access token using refresh token',
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
        const { accessToken, refreshToken } = await tokenService.refreshTokens(
          args.refreshToken,
        )

        logger.info('Token refresh successful')

        return {
          accessToken,
          refreshToken,
        }
      } catch (error) {
        logger.warn('Token refresh error', { error })
        throw normalizeError(error)
      }
    },
  }),
)

/**
 * Logout mutation - Revoke all refresh tokens
 */
builder.mutationField('logout', (t) =>
  t.boolean({
    description: 'Logout and revoke all refresh tokens',
    grantScopes: ['authenticated'],
    shield: isAuthenticatedUser,
    resolve: async (_parent, _args, context) => {
      const logger = getLogger().child({ resolver: 'logout' })
      const userId = requireAuthentication(context)

      logger.info('Logout attempt', { userId })

      try {
        const tokenService = getTokenService()
        await tokenService.revokeAllTokens(userId.value)

        logger.info('Logout successful', { userId: userId.value })
        return true
      } catch (error) {
        logger.warn('Logout error', { userId: userId.value, error })
        throw normalizeError(error)
      }
    },
  }),
)

// ============================================================================
// User Profile
// ============================================================================

/**
 * Me query - Get current user
 */
builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    description: 'Get the currently authenticated user',
    resolve: async (query, _parent, _args, context) => {
      // Return null if not authenticated
      if (!context.user) {
        return null
      }

      return prisma.user.findUnique({
        ...query,
        where: { id: context.user.id },
      })
    },
  }),
)
