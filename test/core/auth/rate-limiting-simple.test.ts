/**
 * Simple Rate Limiting Tests
 *
 * Basic tests for rate limiting functionality
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  RateLimitPresets,
  rateLimiter,
} from '../../../src/app/services/rate-limiter.service'

describe('Rate Limiter Service', () => {
  beforeAll(() => {
    // Enable rate limiting for these tests
    process.env.TEST_RATE_LIMITING = 'true'
  })

  afterAll(async () => {
    // Disable rate limiting after tests
    delete process.env.TEST_RATE_LIMITING
    await rateLimiter.cleanup()
  })

  beforeEach(async () => {
    // Reset rate limits
    await rateLimiter.reset('test-key', 'test-id')
  })

  it('should allow requests within rate limit', async () => {
    const options = { points: 3, duration: 60 }

    // Should allow 3 requests
    await rateLimiter.consume('test-key', 'test-id', options)
    await rateLimiter.consume('test-key', 'test-id', options)
    await rateLimiter.consume('test-key', 'test-id', options)

    // All should succeed
    expect(true).toBe(true)
  })

  it('should block requests exceeding rate limit', async () => {
    const options = { points: 2, duration: 60 }

    // Use up the limit
    await rateLimiter.consume('test-key', 'test-id', options)
    await rateLimiter.consume('test-key', 'test-id', options)

    // Third request should fail
    await expect(
      rateLimiter.consume('test-key', 'test-id', options),
    ).rejects.toThrow('Too many requests')
  })

  it('should track different identifiers separately', async () => {
    const options = { points: 1, duration: 60 }

    // Use up limit for first identifier
    await rateLimiter.consume('test-key', 'id-1', options)

    // Should still allow for second identifier
    await rateLimiter.consume('test-key', 'id-2', options)

    // Both should now be blocked
    await expect(
      rateLimiter.consume('test-key', 'id-1', options),
    ).rejects.toThrow('Too many requests')

    await expect(
      rateLimiter.consume('test-key', 'id-2', options),
    ).rejects.toThrow('Too many requests')
  })

  it('should use correct presets for login', () => {
    expect(RateLimitPresets.login).toEqual({
      points: 5,
      duration: 15 * 60,
      blockDuration: 15 * 60,
    })
  })

  it('should use correct presets for signup', () => {
    expect(RateLimitPresets.signup).toEqual({
      points: 3,
      duration: 60 * 60,
      blockDuration: 60 * 60,
    })
  })

  it('should reset rate limits', async () => {
    const options = { points: 1, duration: 60 }

    // Use up limit
    await rateLimiter.consume('test-key', 'test-id', options)

    // Should be blocked
    await expect(
      rateLimiter.consume('test-key', 'test-id', options),
    ).rejects.toThrow()

    // Reset
    await rateLimiter.reset('test-key', 'test-id')

    // Should allow again
    await rateLimiter.consume('test-key', 'test-id', options)
  })
})
