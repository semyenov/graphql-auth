/**
 * Rate Limiting Service
 *
 * Provides rate limiting functionality for GraphQL operations
 */

import Redis from 'ioredis'
import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
} from 'rate-limiter-flexible'
import { RateLimitError } from '../../core/errors/types'
import { logger } from '../../core/utils/logger'

export interface RateLimiterOptions {
  points: number // Number of requests
  duration: number // Per duration in seconds
  blockDuration?: number // Block duration in seconds after limit exceeded
}

export class RateLimiterService {
  private static instance: RateLimiterService
  private limiters: Map<string, RateLimiterMemory | RateLimiterRedis> =
    new Map()
  private redis?: Redis

  private constructor() {
    // Try to connect to Redis if available
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL, {
          enableOfflineQueue: false,
          maxRetriesPerRequest: 1,
        })

        this.redis.on('error', (err) => {
          logger.warn(
            'Redis connection error, falling back to memory rate limiting',
            { error: err.message },
          )
          this.redis = undefined
        })

        logger.info('Rate limiter using Redis backend')
      } catch (_error) {
        logger.warn('Failed to connect to Redis, using memory rate limiting')
      }
    } else {
      logger.info('Rate limiter using in-memory backend')
    }
  }

  static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService()
    }
    return RateLimiterService.instance
  }

  /**
   * Creates or gets a rate limiter for a specific key
   */
  private getRateLimiter(key: string, options: RateLimiterOptions) {
    // Create a unique key based on all options to ensure different limits use different instances
    const limiterKey = `${key}:${options.points}:${options.duration}:${options.blockDuration || 0}`

    if (!this.limiters.has(limiterKey)) {
      const limiterOptions = {
        keyPrefix: key,
        points: options.points,
        duration: options.duration,
        blockDuration: options.blockDuration || 0,
      }

      if (this.redis) {
        this.limiters.set(
          limiterKey,
          new RateLimiterRedis({
            ...limiterOptions,
            storeClient: this.redis,
          }),
        )
      } else {
        this.limiters.set(limiterKey, new RateLimiterMemory(limiterOptions))
      }
    }

    const limiter = this.limiters.get(limiterKey)
    if (!limiter) {
      throw new Error(`Rate limiter not found for key: ${limiterKey}`)
    }
    return limiter
  }

  /**
   * Consumes points for a specific key and identifier
   */
  async consume(
    key: string,
    identifier: string,
    options: RateLimiterOptions,
    points = 1,
  ): Promise<void> {
    // Skip rate limiting in test environment for non-rate-limit tests
    if (process.env.NODE_ENV === 'test' && !process.env.TEST_RATE_LIMITING) {
      return
    }

    const limiter = this.getRateLimiter(key, options)

    try {
      await limiter.consume(identifier, points)
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        const retryAfter = Math.round(error.msBeforeNext / 1000) || 60
        throw new RateLimitError(
          `Too many requests. Please retry after ${retryAfter} seconds`,
          retryAfter,
        )
      }
      throw error
    }
  }

  /**
   * Gets current points for a specific key and identifier
   */
  async getPoints(key: string, identifier: string): Promise<number | null> {
    const limiter = this.limiters.get(key)
    if (!limiter) return null

    try {
      const res = await limiter.get(identifier)
      return res ? res.remainingPoints : null
    } catch {
      return null
    }
  }

  /**
   * Resets points for a specific key and identifier
   */
  async reset(key: string, identifier: string): Promise<void> {
    // Reset for all possible limiter instances with this key prefix
    for (const [limiterKey, limiter] of this.limiters.entries()) {
      if (limiterKey.startsWith(`${key}:`)) {
        try {
          await limiter.delete(identifier)
        } catch (error) {
          logger.error('Failed to reset rate limit', { key, identifier, error })
        }
      }
    }
  }

  /**
   * Resets all in-memory limiters.
   * Primarily for use in testing environments.
   */
  async resetAll(): Promise<void> {
    if (this.redis) {
      // In a real scenario with Redis, you might want a more sophisticated
      // approach, like deleting keys with a specific prefix.
      // For in-memory, clearing the map is sufficient.
      logger.warn(
        'RateLimiterService.resetAll() called with Redis. This is not fully implemented for Redis and may not clear all keys.',
      )
      // A simple flush for testing purposes if redis is used.
      try {
        await this.redis.flushdb()
      } catch (error) {
        logger.error('Failed to flush Redis DB in resetAll', { error })
      }
    }
    this.limiters.clear()
    logger.info('All in-memory rate limiters have been reset.')
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.redis) {
      await this.redis.quit()
    }
    this.limiters.clear()
  }
}

// Rate limiting presets
export const RateLimitPresets = {
  // Authentication endpoints
  login: {
    points: 5, // 5 attempts
    duration: 15 * 60, // per 15 minutes
    blockDuration: 15 * 60, // block for 15 minutes
  },
  signup: {
    points: 3, // 3 signups
    duration: 60 * 60, // per hour
    blockDuration: 60 * 60, // block for 1 hour
  },
  passwordReset: {
    points: 3, // 3 attempts
    duration: 60 * 60, // per hour
    blockDuration: 60 * 60, // block for 1 hour
  },

  // General API endpoints
  generalApi: {
    points: 100, // 100 requests
    duration: 60, // per minute
  },

  // Expensive operations
  expensiveOperation: {
    points: 10, // 10 requests
    duration: 60 * 60, // per hour
  },
}

// Export singleton instance
export const rateLimiter = RateLimiterService.getInstance()
