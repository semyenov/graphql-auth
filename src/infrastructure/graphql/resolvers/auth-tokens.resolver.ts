/**
 * Authentication with Tokens GraphQL Resolvers
 * 
 * Handles authentication with refresh tokens
 */

import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context'
import { builder } from '../../../schema/builder'
import { AuthTokensType } from '../types/auth.types'
import { commonValidations } from '../pothos-helpers'
import { applyRateLimit, createRateLimitConfig } from '../rate-limit-plugin'
import { RateLimitPresets } from '../../services/rate-limiter.service'
import { LoginWithTokensUseCase } from '../../../features/auth/application/use-cases/login-with-tokens.use-case'
import { RefreshTokenUseCase } from '../../../features/auth/application/use-cases/refresh-token.use-case'
import { TokenService } from '../../../features/auth/infrastructure/services/token.service'
import { container } from 'tsyringe'

// Login with tokens mutation
builder.mutationField('loginWithTokens', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Authenticate and receive access and refresh tokens',
    authScopes: {
      public: true,
    },
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
      // Apply rate limiting
      await applyRateLimit(
        {
          ...createRateLimitConfig.forAuth('login'),
          options: RateLimitPresets.login,
        },
        args,
        context
      )

      const loginUseCase = container.resolve(LoginWithTokensUseCase)
      const result = await loginUseCase.execute({
        email: args.email,
        password: args.password,
      })

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }
    },
  })
)

// Refresh token mutation
builder.mutationField('refreshToken', (t) =>
  t.field({
    type: AuthTokensType,
    description: 'Refresh access token using a refresh token',
    authScopes: {
      public: true,
    },
    args: {
      refreshToken: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1),
        },
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const refreshUseCase = container.resolve(RefreshTokenUseCase)
      const result = await refreshUseCase.execute({
        refreshToken: args.refreshToken,
      })

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }
    },
  })
)

// Logout mutation (revokes all refresh tokens)
builder.mutationField('logout', (t) =>
  t.boolean({
    description: 'Logout user and revoke all refresh tokens',
    authScopes: {
      authenticated: true,
    },
    resolve: async (_parent, _args, context: EnhancedContext) => {
      if (!context.userId) {
        throw new Error('Not authenticated')
      }

      const tokenService = container.resolve(TokenService)
      
      // Revoke all refresh tokens for the user
      await tokenService.revokeAllTokens(context.userId.value)
      
      return true
    },
  })
)