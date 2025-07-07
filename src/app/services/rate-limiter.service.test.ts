/**
 * Rate Limiter Service Tests
 */

import { RateLimiterRes } from 'rate-limiter-flexible'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RateLimitError } from '../errors/types'
import {
  type RateLimiterOptions,
  RateLimiterService,
  RateLimitPresets,
} from './rate-limiter.service'

describe('RateLimiterService', () => {
  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = RateLimiterService.getInstance()
      const instance2 = RateLimiterService.getInstance()
      expect(instance1).toBe(instance2)
    })

    it('should use memory backend when REDIS_URL is not set', () => {
      delete process.env.REDIS_URL
      const instance = RateLimiterService.getInstance()
      expect(instance).toBeDefined()
    })

    it('should attempt to use Redis when REDIS_URL is set', () => {
      process.env.REDIS_URL = 'redis://localhost:6379'
      const instance = RateLimiterService.getInstance()
      expect(instance).toBeDefined()
    })
  })

  describe('consume', () => {
    let service: RateLimiterService
    const options: RateLimiterOptions = {
      points: 5,
      duration: 60,
      blockDuration: 300,
    }

    beforeEach(() => {
      delete process.env.REDIS_URL
      service = RateLimiterService.getInstance()
    })

    it('should consume points successfully', async () => {
      process.env.TEST_RATE_LIMITING = 'true'
      await expect(
        service.consume('test-key', 'user-1', options),
      ).resolves.toBeUndefined()
    })

    it('should skip rate limiting in test environment without TEST_RATE_LIMITING', async () => {
      process.env.NODE_ENV = 'test'
      delete process.env.TEST_RATE_LIMITING
      await expect(
        service.consume('test-key', 'user-1', options),
      ).resolves.toBeUndefined()
    })

    it('should throw RateLimitError when limit exceeded', async () => {
      process.env.TEST_RATE_LIMITING = 'true'
      // @ts-expect-error - accessing private method for testing
      const limiter = service.getRateLimiter('test-key', options)
      limiter.consume = vi.fn().mockRejectedValue(new RateLimiterRes(120000, 0))

      await expect(
        service.consume('test-key', 'user-1', options),
      ).rejects.toThrow(RateLimitError)

      try {
        await service.consume('test-key', 'user-1', options)
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError)
        expect((error as RateLimitError).retryAfter).toBe(60)
        expect((error as RateLimitError).message).toContain(
          'Too many requests. Please retry after 60 seconds',
        )
      }
    })

    it('should handle zero msBeforeNext gracefully', async () => {
      process.env.TEST_RATE_LIMITING = 'true'
      // @ts-expect-error - accessing private method for testing
      const limiter = service.getRateLimiter('test-key', options)
      limiter.consume = vi.fn().mockRejectedValue(new RateLimiterRes(0, 0))

      await expect(
        service.consume('test-key', 'user-1', options),
      ).rejects.toThrow('Too many requests. Please retry after 60 seconds')
    })

    it('should consume custom points', async () => {
      process.env.TEST_RATE_LIMITING = 'true'
      await expect(
        service.consume('test-key', 'user-1', options, 3),
      ).resolves.toBeUndefined()
    })

    it('should rethrow non-RateLimiterRes errors', async () => {
      process.env.TEST_RATE_LIMITING = 'true'
      // @ts-expect-error - accessing private method for testing
      const limiter = service.getRateLimiter('test-key', options)
      const customError = new Error('Custom error')
      limiter.consume = vi.fn().mockRejectedValue(customError)

      await expect(
        service.consume('test-key', 'user-1', options),
      ).rejects.toThrow(customError)
    })
  })

  describe('getPoints', () => {
    let service: RateLimiterService

    beforeEach(() => {
      delete process.env.REDIS_URL
      service = RateLimiterService.getInstance()
    })

    it('should get remaining points', async () => {
      const options: RateLimiterOptions = { points: 5, duration: 60 }
      // Create limiter first
      await service.consume('test-key', 'user-1', options)

      const points = await service.getPoints('test-key', 'user-1')
      expect(points).toBe(4) // 5 - 1 consumed = 4 remaining
    })

    it('should return null for non-existent limiter', async () => {
      const points = await service.getPoints('non-existent', 'user-1')
      expect(points).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const options: RateLimiterOptions = { points: 5, duration: 60 }
      await service.consume('test-key', 'user-1', options)

      // @ts-expect-error - accessing private property for testing
      const limiter = service.limiters.values().next().value
      if (limiter) {
        limiter.get = vi.fn().mockRejectedValue(new Error('Get failed'))
      }
      const points = await service.getPoints('test-key', 'user-1')
      expect(points).toBeNull()
    })
  })

  describe('reset', () => {
    let service: RateLimiterService

    beforeEach(() => {
      delete process.env.REDIS_URL
      service = RateLimiterService.getInstance()
    })

    it('should reset points for identifier', async () => {
      const options1: RateLimiterOptions = { points: 5, duration: 60 }
      const options2: RateLimiterOptions = {
        points: 10,
        duration: 120,
        blockDuration: 300,
      }

      // Create multiple limiters with same key prefix
      await service.consume('auth', 'user-1', options1)
      await service.consume('auth', 'user-1', options2)

      const deleteMock = vi.fn()
      // @ts-expect-error - accessing private property for testing
      service.limiters.forEach((limiter) => {
        limiter.delete = deleteMock
      })

      await service.reset('auth', 'user-1')

      expect(deleteMock).toHaveBeenCalledTimes(2)
      expect(deleteMock).toHaveBeenCalledWith('user-1')
    })

    it('should handle delete errors gracefully', async () => {
      const options: RateLimiterOptions = { points: 5, duration: 60 }
      await service.consume('test-key', 'user-1', options)

      // @ts-expect-error - accessing private property for testing
      const limiter = service.limiters.values().next().value
      if (limiter) {
        limiter.delete = vi.fn().mockRejectedValue(new Error('Delete failed'))
      }

      await expect(service.reset('test-key', 'user-1')).resolves.toBeUndefined()
    })
  })

  describe('resetAll', () => {
    let service: RateLimiterService

    beforeEach(() => {
      delete process.env.REDIS_URL
      service = RateLimiterService.getInstance()
    })

    it('should clear all limiters in memory mode', async () => {
      const options: RateLimiterOptions = { points: 5, duration: 60 }
      await service.consume('test1', 'user-1', options)
      await service.consume('test2', 'user-2', options)

      // @ts-expect-error - accessing private property for testing
      expect(service.limiters.size).toBeGreaterThan(0)

      await service.resetAll()

      // @ts-expect-error - accessing private property for testing
      expect(service.limiters.size).toBe(0)
    })
  })

  describe('cleanup', () => {
    it('should cleanup resources', async () => {
      const service = RateLimiterService.getInstance()
      await expect(service.cleanup()).resolves.toBeUndefined()
    })
  })

  describe('getRateLimiter', () => {
    let service: RateLimiterService

    beforeEach(() => {
      delete process.env.REDIS_URL
      service = RateLimiterService.getInstance()
    })

    it('should create unique limiters for different options', () => {
      const options1: RateLimiterOptions = { points: 5, duration: 60 }
      const options2: RateLimiterOptions = {
        points: 10,
        duration: 60,
        blockDuration: 300,
      }

      // @ts-expect-error - accessing private method for testing
      const limiter1 = service.getRateLimiter('test', options1)
      // @ts-expect-error - accessing private method for testing
      const limiter2 = service.getRateLimiter('test', options2)

      expect(limiter1).not.toBe(limiter2)
      // @ts-expect-error - accessing private property for testing
      expect(service.limiters.size).toBe(2)
    })

    it('should reuse existing limiter for same options', () => {
      const options: RateLimiterOptions = { points: 5, duration: 60 }

      // @ts-expect-error - accessing private method for testing
      const limiter1 = service.getRateLimiter('test', options)
      // @ts-expect-error - accessing private method for testing
      const limiter2 = service.getRateLimiter('test', options)

      expect(limiter1).toBe(limiter2)
      // @ts-expect-error - accessing private property for testing
      expect(service.limiters.size).toBe(1)
    })
  })

  describe('RateLimitPresets', () => {
    it('should have correct login preset', () => {
      expect(RateLimitPresets.login).toEqual({
        points: 5,
        duration: 900,
        blockDuration: 900,
      })
    })

    it('should have correct signup preset', () => {
      expect(RateLimitPresets.signup).toEqual({
        points: 3,
        duration: 3600,
        blockDuration: 3600,
      })
    })

    it('should have correct generalApi preset', () => {
      expect(RateLimitPresets.generalApi).toEqual({
        points: 100,
        duration: 60,
      })
    })
  })
})
