/**
 * Enhanced Authentication GraphQL Resolvers
 *
 * Implements authentication with email verification and login attempt tracking
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import { RateLimitPresets } from '../../../app/services/rate-limiter.service'
import {
  AuthenticationError,
  ConflictError,
  ValidationError,
} from '../../../core/errors/types'
import type { IEmailService } from '../../../core/services/email.service'
import type { ILogger } from '../../../core/services/logger.interface'
import type { IPasswordService } from '../../../core/services/password.service.interface'
import { signToken } from '../../../core/utils/jwt'
import { rateLimitSensitiveOperations } from '../../../graphql/middleware/rules'
import { builder } from '../../../graphql/schema/builder'
import { commonValidations } from '../../../graphql/schema/helpers'
import {
  applyRateLimit,
  createRateLimitConfig,
} from '../../../graphql/schema/plugins/rate-limit.plugin'
import { prisma } from '../../../prisma'
import { LoginAttemptService } from '../services/login-attempt.service'
import { VerificationTokenService } from '../services/verification-token.service'

// Get services from container
const getPasswordService = () =>
  container.resolve<IPasswordService>('IPasswordService')
const getEmailService = () => container.resolve<IEmailService>('IEmailService')
const getVerificationTokenService = () =>
  container.resolve<VerificationTokenService>(VerificationTokenService)
const getLoginAttemptService = () =>
  container.resolve<LoginAttemptService>(LoginAttemptService)
const getLogger = () => container.resolve<ILogger>('ILogger')

// Enhanced Signup mutation with email verification
builder.mutationField('signupWithVerification', (t) =>
  t.field({
    type: builder.objectType('SignupResult', {
      fields: (t) => ({
        success: t.boolean({ resolve: () => true }),
        message: t.string({ resolve: (parent) => parent.message }),
        requiresEmailVerification: t.boolean({
          resolve: (parent) => parent.requiresEmailVerification,
        }),
      }),
    }),
    description: 'Create a new user account with email verification',
    grantScopes: ['public'],
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
          schema: commonValidations.password,
        },
      }),
      name: t.arg.string({
        required: false,
        validate: {
          schema: z.string().min(1).max(100),
        },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger()
      logger.info('Signup attempt', { email: args.email })

      // Apply rate limiting
      await applyRateLimit(
        {
          ...createRateLimitConfig.forAuth('signup'),
          options: RateLimitPresets.signup,
        },
        args,
        context,
      )

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: args.email },
      })

      if (existingUser) {
        logger.warn('Signup failed - email already exists', {
          email: args.email,
        })
        throw new ConflictError('An account with this email already exists')
      }

      // Hash password
      const passwordService = getPasswordService()
      const hashedPassword = await passwordService.hash(args.password)

      // Create user (not verified by default)
      const user = await prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
          name: args.name || null,
          emailVerified: false,
        },
      })

      logger.info('User created successfully', {
        userId: user.id,
        email: user.email,
      })

      // Create verification token
      const verificationService = getVerificationTokenService()
      const token = await verificationService.createEmailVerificationToken(
        user.id,
      )

      // Send verification email
      const emailService = getEmailService()
      await emailService.sendVerificationEmail(user.email, token)

      return {
        success: true,
        message:
          'Account created successfully. Please check your email to verify your account.',
        requiresEmailVerification: true,
      }
    },
  }),
)

// Enhanced Login mutation with attempt tracking
builder.mutationField('loginSecure', (t) =>
  t.field({
    type: builder.objectType('LoginResult', {
      fields: (t) => ({
        token: t.string({
          nullable: true,
          resolve: (parent) => parent.token,
        }),
        user: t.prismaField({
          type: 'User',
          nullable: true,
          resolve: async (query, parent) => {
            if (!parent.userId) return null
            return prisma.user.findUnique({
              ...query,
              where: { id: parent.userId },
            })
          },
        }),
        requiresEmailVerification: t.boolean({
          resolve: (parent) => parent.requiresEmailVerification,
        }),
        message: t.string({
          nullable: true,
          resolve: (parent) => parent.message,
        }),
      }),
    }),
    description: 'Authenticate with email and password',
    grantScopes: ['public'],
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
      const logger = getLogger()
      const loginAttemptService = getLoginAttemptService()
      const ipAddress = context.ipAddress || 'unknown'

      logger.info('Login attempt', { email: args.email, ipAddress })

      // Check account lockout
      await loginAttemptService.checkAccountLockout(args.email)

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
        // Record failed attempt
        await loginAttemptService.recordAttempt({
          email: args.email,
          ipAddress,
          success: false,
        })

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
        // Record failed attempt
        await loginAttemptService.recordAttempt({
          email: args.email,
          ipAddress,
          success: false,
        })

        logger.warn('Login failed - invalid password', {
          email: args.email,
          userId: user.id,
        })
        throw new AuthenticationError('Invalid email or password')
      }

      // Check email verification
      if (!user.emailVerified) {
        logger.warn('Login blocked - email not verified', {
          email: args.email,
          userId: user.id,
        })

        return {
          token: null,
          userId: null,
          requiresEmailVerification: true,
          message: 'Please verify your email address before logging in.',
        }
      }

      // Record successful attempt and clear failed attempts
      await loginAttemptService.recordAttempt({
        email: args.email,
        ipAddress,
        success: true,
      })
      await loginAttemptService.clearFailedAttempts(args.email)

      // Check if password needs rehashing
      if (passwordService.needsRehash) {
        const needsRehash = await passwordService.needsRehash(user.password)
        if (needsRehash) {
          const newHash = await passwordService.hash(args.password)
          await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash },
          })
          logger.info('Password rehashed during login', { userId: user.id })
        }
      }

      logger.info('Login successful', { email: args.email, userId: user.id })

      // Generate token
      const token = signToken({ userId: user.id, email: user.email })

      return {
        token,
        userId: user.id,
        requiresEmailVerification: false,
        message: null,
      }
    },
  }),
)

// Verify email mutation
builder.mutationField('verifyEmail', (t) =>
  t.field({
    type: builder.objectType('VerifyEmailResult', {
      fields: (t) => ({
        success: t.boolean({ resolve: () => true }),
        message: t.string({ resolve: (parent) => parent.message }),
      }),
    }),
    description: 'Verify email address with token',
    grantScopes: ['public'],
    args: {
      token: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1),
        },
      }),
    },
    resolve: async (_parent, args) => {
      const verificationService = getVerificationTokenService()
      const emailService = getEmailService()
      const logger = getLogger()

      try {
        const userId = await verificationService.verifyEmailWithToken(
          args.token,
        )

        // Get user for welcome email
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (user) {
          // Send welcome email
          await emailService.sendWelcomeEmail(
            user.email,
            user.name || undefined,
          )
        }

        logger.info('Email verified successfully', { userId })

        return {
          success: true,
          message: 'Email verified successfully. You can now log in.',
        }
      } catch (error) {
        logger.error('Email verification failed', { error, token: args.token })

        if (error instanceof ValidationError) {
          throw error
        }

        throw new ValidationError(['Invalid or expired verification token'])
      }
    },
  }),
)

// Resend verification email mutation
builder.mutationField('resendVerificationEmail', (t) =>
  t.field({
    type: builder.objectType('ResendVerificationResult', {
      fields: (t) => ({
        success: t.boolean({ resolve: () => true }),
        message: t.string({ resolve: (parent) => parent.message }),
      }),
    }),
    description: 'Resend email verification link',
    grantScopes: ['public'],
    shield: rateLimitSensitiveOperations,
    args: {
      email: t.arg.string({
        required: true,
        validate: {
          schema: commonValidations.email,
        },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger()
      const verificationService = getVerificationTokenService()
      const emailService = getEmailService()

      // Apply rate limiting
      await applyRateLimit(
        {
          ...createRateLimitConfig.forAuth('resendVerification'),
          options: RateLimitPresets.resendEmail,
        },
        args,
        context,
      )

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      })

      if (!user) {
        // Don't reveal whether email exists
        return {
          success: true,
          message:
            'If an account exists with this email, a verification link has been sent.',
        }
      }

      if (user.emailVerified) {
        return {
          success: true,
          message: 'This email has already been verified.',
        }
      }

      // Create new verification token
      const token = await verificationService.createEmailVerificationToken(
        user.id,
      )

      // Send verification email
      await emailService.sendVerificationEmail(user.email, token)

      logger.info('Verification email resent', {
        userId: user.id,
        email: user.email,
      })

      return {
        success: true,
        message:
          'If an account exists with this email, a verification link has been sent.',
      }
    },
  }),
)

// Request password reset mutation
builder.mutationField('requestPasswordReset', (t) =>
  t.field({
    type: builder.objectType('PasswordResetResult', {
      fields: (t) => ({
        success: t.boolean({ resolve: () => true }),
        message: t.string({ resolve: (parent) => parent.message }),
      }),
    }),
    description: 'Request a password reset email',
    grantScopes: ['public'],
    shield: rateLimitSensitiveOperations,
    args: {
      email: t.arg.string({
        required: true,
        validate: {
          schema: commonValidations.email,
        },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger()
      const verificationService = getVerificationTokenService()
      const emailService = getEmailService()

      // Apply rate limiting
      await applyRateLimit(
        {
          ...createRateLimitConfig.forAuth('passwordReset'),
          options: RateLimitPresets.passwordReset,
        },
        args,
        context,
      )

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      })

      if (user) {
        // Create password reset token
        const token = await verificationService.createPasswordResetToken(
          user.id,
        )

        // Send password reset email
        await emailService.sendPasswordResetEmail(user.email, token)

        logger.info('Password reset email sent', {
          userId: user.id,
          email: user.email,
        })
      }

      // Always return success to prevent email enumeration
      return {
        success: true,
        message:
          'If an account exists with this email, a password reset link has been sent.',
      }
    },
  }),
)

// Reset password mutation
builder.mutationField('resetPassword', (t) =>
  t.field({
    type: builder.objectType('ResetPasswordResult', {
      fields: (t) => ({
        success: t.boolean({ resolve: () => true }),
        message: t.string({ resolve: (parent) => parent.message }),
      }),
    }),
    description: 'Reset password with token',
    grantScopes: ['public'],
    args: {
      token: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1),
        },
      }),
      newPassword: t.arg.string({
        required: true,
        validate: {
          schema: commonValidations.password,
        },
      }),
    },
    resolve: async (_parent, args) => {
      const logger = getLogger()
      const verificationService = getVerificationTokenService()
      const passwordService = getPasswordService()

      try {
        // Verify token and get user ID
        const userId = await verificationService.verifyPasswordResetToken(
          args.token,
        )

        // Hash new password
        const hashedPassword = await passwordService.hash(args.newPassword)

        // Update user password
        await prisma.user.update({
          where: { id: userId },
          data: { password: hashedPassword },
        })

        // Mark token as used
        await verificationService.completePasswordReset(args.token)

        logger.info('Password reset successful', { userId })

        return {
          success: true,
          message:
            'Password reset successfully. You can now log in with your new password.',
        }
      } catch (error) {
        logger.error('Password reset failed', { error, token: args.token })

        if (error instanceof ValidationError) {
          throw error
        }

        throw new ValidationError(['Invalid or expired reset token'])
      }
    },
  }),
)
