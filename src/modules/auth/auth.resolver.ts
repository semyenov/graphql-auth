/**
 * Authentication Module Resolver
 *
 * Consolidated authentication operations following the Direct Resolvers pattern.
 * Combines basic auth, token management, and enhanced auth features.
 */

import { z } from 'zod'
import { ServiceFactory, Services } from '@/app/config/service-registry'
import { normalizeError } from '@/app/errors/handlers'
import {
  AuthenticationError,
  ConflictError,
  ValidationError,
} from '@/app/errors/types'
import { builder } from '@/graphql/schema/builder'
import { commonValidations } from '@/graphql/schema/helpers'
import {
  applyRateLimit,
  createRateLimitConfig,
} from '@/graphql/schema/plugins/rate-limit.plugin'
import { prisma } from '@/modules/shared/database'
import { isAuthenticatedUser } from '@/modules/shared/rules/common.rules'
import { RateLimitPresets } from '@/modules/shared/services/rate-limiter.service'
import { rateLimitAuth } from './auth.rules'
import { requireAuthentication } from './guards/auth.guards'
import { signToken } from './services/jwt.service'
import { AuthTokensType } from './types/auth.types'

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
      const logger = ServiceFactory.createResolverLogger('signup')
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
      const hashedPassword = await Services.password.hash(args.password)

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

      // Create email verification token
      const verificationToken =
        await Services.verificationToken.createEmailVerificationToken(user.id)

      // Send welcome email with verification link
      await Services.email.sendVerificationEmail({
        to: user.email,
        name: user.name || 'User',
        token: verificationToken,
      })

      // Generate auth token
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
      const logger = ServiceFactory.createResolverLogger('login')
      const normalizedEmail = args.email.toLowerCase()
      const ipAddress = context.request?.ip || context.ipAddress || 'unknown'

      logger.info('Login attempt', { email: normalizedEmail })

      try {
        // Check for account lockout
        await Services.loginAttempt.checkAccountLockout(normalizedEmail)

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
          // Record failed attempt
          await Services.loginAttempt.recordAttempt({
            email: normalizedEmail,
            ipAddress,
            success: false,
          })
          logger.warn('Login failed - user not found', {
            email: normalizedEmail,
          })
          throw new AuthenticationError('Invalid email or password')
        }

        // Verify password
        const isValid = await Services.password.verify(
          args.password,
          user.password,
        )

        if (!isValid) {
          // Record failed attempt
          await Services.loginAttempt.recordAttempt({
            email: normalizedEmail,
            ipAddress,
            success: false,
          })
          logger.warn('Login failed - invalid password', {
            email: normalizedEmail,
            userId: user.id,
          })
          throw new AuthenticationError('Invalid email or password')
        }

        // Clear failed attempts on successful login
        await Services.loginAttempt.clearFailedAttempts(normalizedEmail)

        // Record successful login
        await Services.loginAttempt.recordAttempt({
          email: normalizedEmail,
          ipAddress,
          success: true,
        })

        logger.info('Login successful', {
          email: normalizedEmail,
          userId: user.id,
        })

        // Generate token
        const token = signToken({ userId: user.id })
        return token
      } catch (error) {
        logger.error('Login error', normalizeError(error))
        throw error
      }
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
      const logger = ServiceFactory.createResolverLogger('loginWithTokens')
      const normalizedEmail = args.email.toLowerCase()
      const ipAddress = context.request?.ip || context.ipAddress || 'unknown'

      logger.info('Login with tokens attempt', { email: normalizedEmail })

      try {
        // Check for account lockout
        await Services.loginAttempt.checkAccountLockout(normalizedEmail)

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
          await Services.loginAttempt.recordAttempt({
            email: normalizedEmail,
            ipAddress,
            success: false,
          })
          logger.warn('Login failed - user not found', {
            email: normalizedEmail,
          })
          throw new AuthenticationError('Invalid email or password')
        }

        // Verify password
        const isValid = await Services.password.verify(
          args.password,
          user.password,
        )

        if (!isValid) {
          await Services.loginAttempt.recordAttempt({
            email: normalizedEmail,
            ipAddress,
            success: false,
          })
          logger.warn('Login failed - invalid password', {
            email: normalizedEmail,
            userId: user.id,
          })
          throw new AuthenticationError('Invalid email or password')
        }

        // Clear failed attempts and record success
        await Services.loginAttempt.clearFailedAttempts(normalizedEmail)
        await Services.loginAttempt.recordAttempt({
          email: normalizedEmail,
          ipAddress,
          success: true,
        })

        // Generate tokens
        const { accessToken, refreshToken } =
          await Services.token.generateTokens({
            id: user.id,
            email: user.email,
          })

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
      const logger = ServiceFactory.createResolverLogger('refreshToken')
      logger.info('Token refresh attempt')

      try {
        const { accessToken, refreshToken } =
          await Services.token.refreshTokens(args.refreshToken)

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
      const logger = ServiceFactory.createResolverLogger('logout')
      const userId = requireAuthentication(context)

      logger.info('Logout attempt', { userId: userId.value })

      try {
        await Services.token.revokeAllTokens(userId.value)

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
// Enhanced Authentication Features
// ============================================================================

/**
 * Verify email mutation
 */
builder.mutationField('verifyEmail', (t) =>
  t.boolean({
    description: 'Verify email address with token',
    args: {
      token: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1) },
      }),
    },
    resolve: async (_parent, args, _context) => {
      const logger = ServiceFactory.createResolverLogger('verifyEmail')

      try {
        const result = await Services.verificationToken.verifyEmailToken(
          args.token,
        )

        logger.info('Email verified successfully', {
          userId: result.userId,
          email: result.email,
        })

        return true
      } catch (error) {
        logger.error('Email verification failed', normalizeError(error))
        throw error
      }
    },
  }),
)

/**
 * Resend verification email mutation
 */
builder.mutationField('resendVerificationEmail', (t) =>
  t.boolean({
    description: 'Resend email verification link',
    grantScopes: ['authenticated'],
    shield: isAuthenticatedUser,
    resolve: async (_parent, _args, context) => {
      const logger = ServiceFactory.createResolverLogger(
        'resendVerificationEmail',
      )
      const userId = requireAuthentication(context)

      try {
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth('resendVerification'),
            options: RateLimitPresets.resendEmail,
          },
          { userId: userId.value },
          context,
        )

        // Get user details
        const user = await prisma.user.findUnique({
          where: { id: userId.value },
          select: { email: true, emailVerified: true, name: true },
        })

        if (!user) {
          throw new AuthenticationError('User not found')
        }

        if (user.emailVerified) {
          throw new ValidationError(['Email is already verified'])
        }

        // Create new verification token
        const token =
          await Services.verificationToken.createEmailVerificationToken(
            userId.value,
          )

        // Send verification email
        await Services.email.sendVerificationEmail({
          to: user.email,
          name: user.name || 'User',
          token,
        })

        logger.info('Verification email resent', {
          userId: userId.value,
          email: user.email,
        })

        return true
      } catch (error) {
        logger.error('Resend verification email failed', normalizeError(error))
        throw error
      }
    },
  }),
)

/**
 * Request password reset mutation
 */
builder.mutationField('requestPasswordReset', (t) =>
  t.boolean({
    description: 'Request a password reset email',
    args: {
      email: t.arg.string({
        required: true,
        validate: { schema: commonValidations.email },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = ServiceFactory.createResolverLogger('requestPasswordReset')
      const normalizedEmail = args.email.toLowerCase()

      try {
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth('passwordReset'),
            options: RateLimitPresets.passwordReset,
          },
          { email: normalizedEmail },
          context,
        )

        // Always return success to avoid email enumeration
        try {
          // Create reset token (will throw if user doesn't exist)
          const token =
            await Services.verificationToken.createPasswordResetToken(
              normalizedEmail,
            )

          // Get user for email
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { name: true },
          })

          if (user) {
            // Send password reset email
            await Services.email.sendPasswordResetEmail({
              to: normalizedEmail,
              name: user.name || 'User',
              token,
            })

            logger.info('Password reset email sent', { email: normalizedEmail })
          }
        } catch (error) {
          // Log error but don't throw to prevent email enumeration
          logger.warn('Password reset request for non-existent email', {
            email: normalizedEmail,
          })
        }

        return true
      } catch (error) {
        logger.error('Password reset request failed', normalizeError(error))
        throw error
      }
    },
  }),
)

/**
 * Reset password mutation
 */
builder.mutationField('resetPassword', (t) =>
  t.boolean({
    description: 'Reset password with token',
    args: {
      token: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1) },
      }),
      newPassword: t.arg.string({
        required: true,
        validate: { schema: commonValidations.password },
      }),
    },
    resolve: async (_parent, args, _context) => {
      const logger = ServiceFactory.createResolverLogger('resetPassword')

      try {
        // Verify token and get user
        const result =
          await Services.verificationToken.verifyPasswordResetToken(args.token)

        // Hash new password
        const hashedPassword = await Services.password.hash(args.newPassword)

        // Update user password
        await prisma.user.update({
          where: { id: result.userId },
          data: { password: hashedPassword },
        })

        // Revoke all refresh tokens for security
        await Services.token.revokeAllTokens(result.userId)

        // Mark token as used
        await prisma.verificationToken.update({
          where: { token: args.token },
          data: { usedAt: new Date() },
        })

        logger.info('Password reset successful', {
          userId: result.userId,
          email: result.email,
        })

        return true
      } catch (error) {
        logger.error('Password reset failed', normalizeError(error))
        throw error
      }
    },
  }),
)

/**
 * Change password mutation (for authenticated users)
 */
builder.mutationField('changePassword', (t) =>
  t.boolean({
    description: 'Change password for authenticated user',
    grantScopes: ['authenticated'],
    shield: isAuthenticatedUser,
    args: {
      currentPassword: t.arg.string({
        required: true,
        validate: { schema: z.string().min(1) },
      }),
      newPassword: t.arg.string({
        required: true,
        validate: { schema: commonValidations.password },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = ServiceFactory.createResolverLogger('changePassword')
      const userId = requireAuthentication(context)

      try {
        // Get user
        const user = await prisma.user.findUnique({
          where: { id: userId.value },
          select: { password: true },
        })

        if (!user) {
          throw new AuthenticationError('User not found')
        }

        // Verify current password
        const isValid = await Services.password.verify(
          args.currentPassword,
          user.password,
        )

        if (!isValid) {
          throw new AuthenticationError('Current password is incorrect')
        }

        // Hash new password
        const hashedPassword = await Services.password.hash(args.newPassword)

        // Update password
        await prisma.user.update({
          where: { id: userId.value },
          data: { password: hashedPassword },
        })

        // Revoke all refresh tokens for security
        await Services.token.revokeAllTokens(userId.value)

        logger.info('Password changed successfully', { userId: userId.value })

        return true
      } catch (error) {
        logger.error('Password change failed', normalizeError(error))
        throw error
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
