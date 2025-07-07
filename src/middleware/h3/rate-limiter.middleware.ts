/**
 * H3 Rate Limiting Middleware
 *
 * Applies rate limiting to HTTP endpoints using the existing RateLimiterService
 */

import {
  createError,
  defineEventHandler,
  getRequestIP,
  type H3Event,
  readBody,
} from 'h3'
import { RateLimitError } from '@/app/errors/types'
import {
  type RateLimiterOptions,
  RateLimitPresets,
  rateLimiter,
} from '@/modules/shared/services/rate-limiter.service'

/**
 * Extract identifier from event (IP address or user ID)
 */
function getIdentifier(event: H3Event): string {
  // Try to get user ID from context if authenticated
  const authHeader = event.node.req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    // In a real implementation, we would decode the JWT here
    // For now, use IP address
    return getRequestIP(event) || 'unknown'
  }

  // Fall back to IP address
  return getRequestIP(event) || 'unknown'
}

/**
 * Create rate limiting middleware for specific endpoints
 */
export function createRateLimiterMiddleware(
  key: string,
  options: RateLimiterOptions = RateLimitPresets.generalApi,
) {
  return defineEventHandler(async (event) => {
    try {
      const identifier = getIdentifier(event)
      await rateLimiter.consume(key, identifier, options)
    } catch (error) {
      if (error instanceof RateLimitError) {
        // Set rate limit headers
        event.node.res.setHeader('X-RateLimit-Limit', options.points.toString())
        event.node.res.setHeader('X-RateLimit-Remaining', '0')
        const retryAfter = error.retryAfter || 60
        event.node.res.setHeader(
          'X-RateLimit-Reset',
          new Date(Date.now() + retryAfter * 1000).toISOString(),
        )
        event.node.res.setHeader('Retry-After', retryAfter.toString())

        throw createError({
          statusCode: 429,
          statusMessage: error.message,
          data: {
            code: 'RATE_LIMIT_ERROR',
            retryAfter: error.retryAfter,
          },
        })
      }
      throw error
    }
  })
}

/**
 * GraphQL-specific rate limiting middleware
 * Applies different limits based on operation type
 */
export function createGraphQLRateLimiterMiddleware() {
  return defineEventHandler(async (event) => {
    // Only apply to GraphQL endpoint
    if (!event.path.includes('/graphql')) {
      return
    }

    const identifier = getIdentifier(event)

    // For GraphQL, we need to check the operation type
    // This is a simplified version - in production, you'd parse the query
    const body =
      event.method === 'POST' ? await readBody(event).catch(() => null) : null

    if (body?.operationName) {
      // Apply specific limits for known operations
      const operationLimits: Record<string, RateLimiterOptions> = {
        login: RateLimitPresets.login,
        signup: RateLimitPresets.signup,
        resetPassword: RateLimitPresets.passwordReset,
        verifyEmail: RateLimitPresets.verifyEmail,
        resendVerificationEmail: RateLimitPresets.resendEmail,
      }

      const options =
        operationLimits[body.operationName] || RateLimitPresets.generalApi

      try {
        await rateLimiter.consume(
          `graphql:${body.operationName}`,
          identifier,
          options,
        )
      } catch (error) {
        if (error instanceof RateLimitError) {
          event.node.res.setHeader(
            'X-RateLimit-Limit',
            options.points.toString(),
          )
          event.node.res.setHeader('X-RateLimit-Remaining', '0')
          const retryAfter2 = error.retryAfter || 60
          event.node.res.setHeader(
            'X-RateLimit-Reset',
            new Date(Date.now() + retryAfter2 * 1000).toISOString(),
          )
          event.node.res.setHeader('Retry-After', retryAfter2.toString())

          throw createError({
            statusCode: 429,
            statusMessage: error.message,
            data: {
              code: 'RATE_LIMIT_ERROR',
              retryAfter: error.retryAfter,
            },
          })
        }
        throw error
      }
    } else {
      // General GraphQL rate limit
      try {
        await rateLimiter.consume(
          'graphql:general',
          identifier,
          RateLimitPresets.generalApi,
        )
      } catch (error) {
        if (error instanceof RateLimitError) {
          throw createError({
            statusCode: 429,
            statusMessage: error.message,
            data: {
              code: 'RATE_LIMIT_ERROR',
              retryAfter: error.retryAfter,
            },
          })
        }
        throw error
      }
    }
  })
}
