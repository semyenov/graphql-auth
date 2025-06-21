/**
 * Rate Limiting Middleware
 *
 * GraphQL middleware for applying rate limits to operations
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import { rule, shield } from 'graphql-shield'
import { RateLimitError } from '../../core/errors/types'
import type { Context } from '../context/context.types'

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  max: number
  windowMs: number
  message?: string
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMIT_CONFIGS = {
  auth: { max: 5, windowMs: 60000 }, // 5 requests per minute for auth
  mutation: { max: 10, windowMs: 60000 }, // 10 mutations per minute
  query: { max: 100, windowMs: 60000 }, // 100 queries per minute
  strict: { max: 1, windowMs: 60000 }, // 1 request per minute for sensitive operations
} as const

/**
 * Create a rate limiting rule
 */
export function createRateLimitRule(config: RateLimitConfig) {
  return rule({ cache: 'strict' })(async (_parent, _args, context: Context) => {
    try {
      // Get client identifier (IP address or user ID)
      const clientId =
        context.userId?.value ||
        context.request?.ip ||
        context.req.headers['x-forwarded-for'] ||
        'unknown'

      // For now, just log the rate limiting attempt since we don't have
      // a rate limiter instance in context yet
      console.log(
        `Rate limit check for client ${clientId}: ${config.max}/${config.windowMs}ms`,
      )

      // Placeholder implementation - would need actual rate limiter
      // In a real implementation, you would check against a rate limiter
      // service like Redis or in-memory store

      return true
    } catch (_error) {
      return new RateLimitError(
        config.message || 'Rate limit exceeded. Please try again later.',
        Math.ceil(config.windowMs / 1000),
      )
    }
  })
}

/**
 * Pre-configured rate limiting rules
 */
export const authRateLimitRule = createRateLimitRule(RATE_LIMIT_CONFIGS.auth)
export const mutationRateLimitRule = createRateLimitRule(
  RATE_LIMIT_CONFIGS.mutation,
)
export const queryRateLimitRule = createRateLimitRule(RATE_LIMIT_CONFIGS.query)
export const strictRateLimitRule = createRateLimitRule(
  RATE_LIMIT_CONFIGS.strict,
)

/**
 * Rate limiting middleware using GraphQL Shield
 */
export const rateLimitMiddleware = shield(
  {
    Query: {
      // Apply query rate limits
      feed: queryRateLimitRule,
      searchUsers: queryRateLimitRule,
      me: queryRateLimitRule,
      drafts: queryRateLimitRule,
    },
    Mutation: {
      // Apply auth rate limits to auth operations
      signup: authRateLimitRule,
      login: authRateLimitRule,
      refreshToken: authRateLimitRule,
      logout: authRateLimitRule,

      // Apply mutation rate limits to other operations
      createPost: mutationRateLimitRule,
      updatePost: mutationRateLimitRule,
      deletePost: mutationRateLimitRule,
      togglePublishPost: mutationRateLimitRule,
      updateUserProfile: mutationRateLimitRule,
      incrementPostViewCount: queryRateLimitRule, // Treat as query-level limit
    },
  },
  {
    allowExternalErrors: true,
    fallbackRule: rule()(async () => true), // Allow by default
  },
)

/**
 * Helper function to combine multiple rate limit rules with AND logic
 */
export function combineRateLimitRules(
  ...rules: ReturnType<typeof createRateLimitRule>[]
) {
  // For now, just return the first rule as a placeholder
  // In a real implementation, you would check all rules
  return rules[0] || rule()(async () => true)
}
