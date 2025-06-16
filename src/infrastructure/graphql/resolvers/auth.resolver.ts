/**
 * Authentication GraphQL Resolvers
 * 
 * Handles authentication-related GraphQL operations using enhanced Pothos patterns.
 */

import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context'
import { builder } from '../../../schema/builder'
import { RateLimitPresets } from '../../services/rate-limiter.service'
import { commonValidations } from '../pothos-helpers'
import { applyRateLimit, createRateLimitConfig } from '../rate-limit-plugin'

// Signup mutation with validation and error handling
builder.mutationField('signup', (t) =>
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
      try {
        // Apply rate limiting
        await applyRateLimit(
          {
            ...createRateLimitConfig.forAuth('signup'),
            options: RateLimitPresets.signup,
          },
          args,
          context
        )

        const result = await context.useCases.auth.signup.execute({
          email: args.email,
          password: args.password,
          name: args.name || null,
        })
        return result.token
      } catch (error) {
        // Let the error propagate with proper GraphQL formatting
        throw error
      }
    },
  })
)

// Login mutation with validation
builder.mutationField('login', (t) =>
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
          schema: z.string().min(1), // Just check non-empty for login
        },
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
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

        const result = await context.useCases.auth.login.execute({
          email: args.email,
          password: args.password,
        })
        return result.token
      } catch (error) {
        // Let the error propagate with proper GraphQL formatting
        throw error
      }
    },
  })
)