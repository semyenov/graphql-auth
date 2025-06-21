/**
 * Rate limiting middleware
 * Provides application-level rate limiting for HTTP requests
 */

import type { IncomingMessage, ServerResponse } from 'http'
import type { Socket } from 'net'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { config } from '../config'

/**
 * Create rate limiter instance
 */
const rateLimiter = new RateLimiterMemory({
  points: config.rateLimit.maxRequests, // Number of requests
  duration: config.rateLimit.windowMs / 1000, // Per window in seconds
  blockDuration: 60, // Block for 1 minute after limit exceeded
})

/**
 * Rate limiting middleware for HTTP requests
 */
interface ExtendedRequest extends IncomingMessage {
  ip?: string
  connection: Socket & { remoteAddress?: string }
}

interface ExtendedResponse extends ServerResponse {
  status: (code: number) => ExtendedResponse
  json: (data: unknown) => void
}

export async function rateLimitMiddleware(
  req: ExtendedRequest,
  res: ExtendedResponse,
  next: () => Promise<void>,
) {
  try {
    // Use IP address as key
    const key = req.ip || req.connection?.remoteAddress || 'unknown'

    // Consume 1 point for this request
    await rateLimiter.consume(key)

    // Continue to next middleware
    await next()
  } catch (error) {
    // Check if it's a rate limiter response
    const rateLimiterRes = error as {
      msBeforeNext?: number
      remainingPoints?: number
    }

    // Rate limit exceeded
    const msBeforeNext = rateLimiterRes.msBeforeNext ?? 60000
    const retryAfter = Math.round(msBeforeNext / 1000)

    // Set rate limit headers
    res.setHeader('Retry-After', retryAfter)
    res.setHeader('X-RateLimit-Limit', config.rateLimit.maxRequests)
    res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints ?? 0)
    res.setHeader(
      'X-RateLimit-Reset',
      new Date(Date.now() + msBeforeNext).toISOString(),
    )

    // Send error response
    res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please retry after ${retryAfter} seconds`,
      retryAfter,
    })
  }
}

/**
 * Create custom rate limiter with specific options
 */
export function createRateLimiter(options: {
  points: number
  duration: number
  keyPrefix?: string
}) {
  return new RateLimiterMemory({
    points: options.points,
    duration: options.duration,
    keyPrefix: options.keyPrefix,
  })
}

/**
 * Rate limit presets for different operations
 */
export const RATE_LIMIT_PRESETS = {
  // Authentication operations
  login: {
    points: 5,
    duration: 900, // 15 minutes
  },
  signup: {
    points: 3,
    duration: 3600, // 1 hour
  },
  passwordReset: {
    points: 3,
    duration: 3600, // 1 hour
  },

  // API operations
  read: {
    points: 100,
    duration: 60, // 1 minute
  },
  write: {
    points: 20,
    duration: 60, // 1 minute
  },
  upload: {
    points: 10,
    duration: 300, // 5 minutes
  },
} as const
