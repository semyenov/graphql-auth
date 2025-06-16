/**
 * Rate Limiting Service
 * 
 * Provides rate limiting functionality for GraphQL operations
 */

import { RateLimiterMemory, RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'
import Redis from 'ioredis'
import { RateLimitError } from '../../errors'
import { logger } from '../../utils/logger'

export interface RateLimiterOptions {
    points: number // Number of requests
    duration: number // Per duration in seconds
    blockDuration?: number // Block duration in seconds after limit exceeded
}

export class RateLimiterService {
    private static instance: RateLimiterService
    private limiters: Map<string, RateLimiterMemory | RateLimiterRedis> = new Map()
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
                    logger.warn('Redis connection error, falling back to memory rate limiting', { error: err.message })
                    this.redis = undefined
                })
                
                logger.info('Rate limiter using Redis backend')
            } catch (error) {
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
                this.limiters.set(limiterKey, new RateLimiterRedis({
                    ...limiterOptions,
                    storeClient: this.redis,
                }))
            } else {
                this.limiters.set(limiterKey, new RateLimiterMemory(limiterOptions))
            }
        }

        return this.limiters.get(limiterKey)!
    }

    /**
     * Consumes points for a specific key and identifier
     */
    async consume(
        key: string, 
        identifier: string, 
        options: RateLimiterOptions,
        points: number = 1
    ): Promise<void> {
        const limiter = this.getRateLimiter(key, options)
        
        try {
            await limiter.consume(identifier, points)
        } catch (error) {
            if (error instanceof RateLimiterRes) {
                const retryAfter = Math.round(error.msBeforeNext / 1000) || 60
                throw new RateLimitError(
                    `Too many requests. Please retry after ${retryAfter} seconds`,
                    retryAfter
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
            if (limiterKey.startsWith(key + ':')) {
                try {
                    await limiter.delete(identifier)
                } catch (error) {
                    logger.error('Failed to reset rate limit', { key, identifier, error })
                }
            }
        }
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