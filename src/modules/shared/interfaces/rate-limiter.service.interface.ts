/**
 * Rate Limiter Service Interface
 *
 * Defines the contract for rate limiting functionality
 */

export interface RateLimiterOptions {
  points: number // Number of requests allowed
  duration: number // Time window in seconds
  blockDuration?: number // Block duration in seconds after limit exceeded
}

export interface IRateLimiterService {
  /**
   * Consume points for a specific key and identifier
   * @throws RateLimitError if limit is exceeded
   */
  consume(
    key: string,
    identifier: string,
    options: RateLimiterOptions,
    points?: number,
  ): Promise<void>

  /**
   * Get remaining points for a specific key and identifier
   */
  getPoints(key: string, identifier: string): Promise<number | null>

  /**
   * Reset points for a specific key and identifier
   */
  reset(key: string, identifier: string): Promise<void>

  /**
   * Reset all rate limiters (mainly for testing)
   */
  resetAll(): Promise<void>

  /**
   * Cleanup resources (for graceful shutdown)
   */
  cleanup?(): Promise<void>
}
