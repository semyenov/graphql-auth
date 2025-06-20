/**
 * Authentication GraphQL Resolvers (Direct Implementation)
 * 
 * Implements authentication logic directly in Pothos resolvers without use cases.
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import type { ILogger } from '../../../core/services/logger.interface'
import type { IPasswordService } from '../../../core/services/password.service.interface'
import type { ITokenService } from '../../../core/services/token.service.interface'
import { AuthenticationError, ConflictError, normalizeError } from '../../../errors'
import { builder } from '../../../schema/builder'
import { AuthResult, createAuthSuccess } from '../../../schema/result-types'
import { signToken } from '../../../utils/jwt'
import { RateLimitPresets } from '../../services/rate-limiter.service'
import { commonValidations } from '../pothos-helpers'
import { applyRateLimit, createRateLimitConfig } from '../rate-limit-plugin'

// Get services from container
const getPasswordService = () => container.resolve<IPasswordService>('IPasswordService')
const getTokenService = () => container.resolve<ITokenService>('ITokenService')
const getLogger = () => container.resolve<ILogger>('ILogger')

// Signup mutation with direct implementation
builder.mutationField('signupDirect', (t) =>
  t.string({
    description: 'Create a new user account',
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
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'signupDirect' })
      logger.info('Signup attempt', { email: args.email })

      // Apply rate limiting
      await applyRateLimit(
        {
          ...createRateLimitConfig.forAuth('signup'),
          options: RateLimitPresets.signup,
        },
        args,
        context
      )

      // Check if user already exists
      const existingUser = await context.prisma.user.findUnique({
        where: { email: args.email },
      })

      if (existingUser) {
        logger.warn('Signup failed - email already exists', { email: args.email })
        throw new ConflictError('An account with this email already exists')
      }

      // Hash password
      const passwordService = getPasswordService()
      const hashedPassword = await passwordService.hash(args.password)

      // Create user
      const user = await context.prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
          name: args.name || null,
        },
      })

      logger.info('User created successfully', { userId: user.id, email: user.email })

      // Generate token
      const token = signToken({ userId: user.id, email: user.email })

      return token
    },
  })
)

// Login mutation with direct implementation
builder.mutationField('loginDirect', (t) =>
  t.string({
    description: 'Authenticate and receive a token',
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
      const logger = getLogger().child({ resolver: 'loginDirect' })
      logger.info('Login attempt', { email: args.email })

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
      const user = await context.prisma.user.findUnique({
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

      logger.info('Login successful', { email: args.email, userId: user.id })

      // Generate token
      const token = signToken({ userId: user.id, email: user.email })

      return token
    },
  })
)

// Me query with direct implementation
builder.queryField('meDirect', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    description: 'Get the currently authenticated user',
    grantScopes: ['authenticated'],
    resolve: async (query, _parent, _args, context: EnhancedContext) => {
      if (!context.userId) {
        return null
      }

      return context.prisma.user.findUnique({
        ...query,
        where: { id: context.userId.value },
      })
    },
  })
)

// Safe signup mutation with union result type
builder.mutationField('safeSignup', (t) =>
  t.field({
    type: AuthResult,
    description: 'Create a new user account with comprehensive error handling',
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
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'safeSignup' })
      
      try {
        logger.info('Safe signup attempt', { email: args.email })
        
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth('signup'),
            options: RateLimitPresets.signup,
          },
          args,
          context
        )
        
        // Check if user already exists
        const existingUser = await context.prisma.user.findUnique({
          where: { email: args.email },
        })
        
        if (existingUser) {
          logger.warn('Signup failed - email already exists', { email: args.email })
          return new ConflictError('An account with this email already exists')
        }
        
        // Hash password
        const passwordService = getPasswordService()
        const hashedPassword = await passwordService.hash(args.password)
        
        // Create user
        const user = await context.prisma.user.create({
          data: {
            email: args.email,
            password: hashedPassword,
            name: args.name || null,
          },
        })
        
        logger.info('User created successfully', { userId: user.id, email: user.email })
        
        // Generate token
        const token = signToken({ userId: user.id, email: user.email })
        
        return createAuthSuccess(token, user.id)
      } catch (error) {
        logger.error('Safe signup error', { error, email: args.email })
        return normalizeError(error)
      }
    },
  })
)

// Safe login mutation with union result type
builder.mutationField('safeLogin', (t) =>
  t.field({
    type: AuthResult,
    description: 'Authenticate with comprehensive error handling',
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
      const logger = getLogger().child({ resolver: 'safeLogin' })
      
      try {
        logger.info('Safe login attempt', { email: args.email })
        
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
        const user = await context.prisma.user.findUnique({
          where: { email: args.email },
        })
        
        if (!user) {
          logger.warn('Login failed - user not found', { email: args.email })
          return new AuthenticationError('Invalid email or password')
        }
        
        // Verify password
        const passwordService = getPasswordService()
        const isValidPassword = await passwordService.verify(args.password, user.password)
        
        if (!isValidPassword) {
          logger.warn('Login failed - invalid password', { email: args.email, userId: user.id })
          return new AuthenticationError('Invalid email or password')
        }
        
        logger.info('Login successful', { email: args.email, userId: user.id })
        
        // Generate token
        const token = signToken({ userId: user.id, email: user.email })
        
        return createAuthSuccess(token, user.id)
      } catch (error) {
        logger.error('Safe login error', { error, email: args.email })
        return normalizeError(error)
      }
    },
  })
)