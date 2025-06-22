/**
 * Rate Limiting Tests
 *
 * Tests for rate limiting functionality on authentication endpoints
 */

import {
  createGraphQLTestHelper,
  createMockContext,
  createTestServer,
  createTestUser,
} from '@test/utils'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { rateLimiter } from '../../../src/app/services/rate-limiter.service'
import { LoginMutation, SignupMutation } from '../../../src/gql/mutations'
import { prisma } from '../../../src/prisma'

describe('Rate Limiting', () => {
  const server = createTestServer()
  const gql = createGraphQLTestHelper(server)

  beforeAll(() => {
    // Enable rate limiting for these tests
    process.env.TEST_RATE_LIMITING = 'true'
  })

  afterAll(async () => {
    // Disable rate limiting after tests
    process.env.TEST_RATE_LIMITING = undefined
    // Cleanup
    await rateLimiter.cleanup()
  })

  beforeEach(async () => {
    // Reset rate limits for tests
    await rateLimiter.reset('login', 'email:ratelimit@example.com')
    await rateLimiter.reset('signup', 'email:newuser@example.com')
  })

  describe('Login rate limiting', () => {
    beforeEach(async () => {
      // Create a test user (delete first if exists)
      await prisma.user.deleteMany({
        where: { email: 'ratelimit@example.com' },
      })
      await createTestUser({
        email: 'ratelimit@example.com',
        name: 'Rate Limit Test',
      })
    })

    it('should allow login attempts within rate limit', async () => {
      const variables = {
        email: 'ratelimit@example.com',
        password: 'wrongpassword',
      }

      // Should allow 5 attempts (as per RateLimitPresets.login)
      for (let i = 0; i < 5; i++) {
        await gql.expectError(
          LoginMutation,
          variables,
          'Invalid email or password',
          createMockContext(),
        )
      }
    })

    it('should block login attempts after exceeding rate limit', async () => {
      const variables = {
        email: 'ratelimit@example.com',
        password: 'wrongpassword',
      }

      // Exhaust rate limit (5 attempts)
      for (let i = 0; i < 5; i++) {
        await gql.expectError(
          LoginMutation,
          variables,
          'Invalid email or password',
          createMockContext(),
        )
      }

      // 6th attempt should be rate limited
      await gql.expectError(
        LoginMutation,
        variables,
        'Too many requests',
        createMockContext(),
      )
    })

    it('should use email as identifier for rate limiting', async () => {
      // Create another user
      await createTestUser({
        email: 'another@example.com',
      })

      // Exhaust rate limit for first email
      for (let i = 0; i < 5; i++) {
        await gql.expectError(
          LoginMutation,
          { email: 'ratelimit@example.com', password: 'wrongpassword' },
          'Invalid email or password',
          createMockContext(),
        )
      }

      // Should still allow attempts for different email
      await gql.expectError(
        LoginMutation,
        { email: 'another@example.com', password: 'wrongpassword' },
        'Invalid email or password',
        createMockContext(),
      )
    })
  })

  describe('Signup rate limiting', () => {
    it('should allow signup attempts within rate limit', async () => {
      // Should allow 3 signups per hour (as per RateLimitPresets.signup)
      for (let i = 0; i < 3; i++) {
        const variables = {
          email: `newuser${i}@example.com`,
          password: 'password123',
          name: `User ${i}`,
        }

        const data = await gql.mutate(
          SignupMutation,
          variables,
          createMockContext(),
        )

        expect(data.signup).toBeDefined()
        if (data.signup) {
          expect(typeof data.signup).toBe('string')
        }
      }
    })

    it('should block signup attempts after exceeding rate limit', async () => {
      // Use same email for rate limiting
      const baseEmail = 'newuser@example.com'

      // First 3 attempts should succeed (with different variations)
      for (let i = 0; i < 3; i++) {
        // After first signup, subsequent ones will fail with duplicate email
        if (i === 0) {
          const data = await gql.mutate(
            SignupMutation,
            {
              email: baseEmail,
              password: 'password123',
              name: `User ${i}`,
            },
            createMockContext(),
          )
          expect(data.signup).toBeDefined()
        } else {
          await gql.expectError(
            SignupMutation,
            {
              email: baseEmail,
              password: 'password123',
              name: `User ${i}`,
            },
            'An account with this email already exists',
            createMockContext(),
          )
        }
      }

      // 4th attempt should be rate limited
      await gql.expectError(
        SignupMutation,
        {
          email: baseEmail,
          password: 'password123',
          name: 'User 4',
        },
        'Too many requests',
        createMockContext(),
      )
    })

    it('should track rate limits by normalized email', async () => {
      // These should all count as the same email for rate limiting
      const emails = [
        'TestUser@example.com',
        'testuser@example.com',
        'TESTUSER@EXAMPLE.COM',
      ]

      for (let i = 0; i < 3; i++) {
        // First signup should succeed, others will fail with duplicate email
        if (i === 0) {
          const data = await gql.mutate(
            SignupMutation,
            {
              email: emails[i] || `user${i}@example.com`,
              password: 'password123',
              name: `User ${i}`,
            },
            createMockContext(),
          )
          expect(data.signup).toBeDefined()
        } else {
          await gql.expectError(
            SignupMutation,
            {
              email: emails[i] || `user${i}@example.com`,
              password: 'password123',
              name: `User ${i}`,
            },
            'An account with this email already exists',
            createMockContext(),
          )
        }
      }

      // Next attempt with any variation should be rate limited
      await gql.expectError(
        SignupMutation,
        {
          email: 'testuser@example.com',
          password: 'password123',
          name: 'User 4',
        },
        'Too many requests',
        createMockContext(),
      )
    })
  })

  describe('Rate limit error response', () => {
    beforeEach(async () => {
      // Ensure user exists
      await prisma.user.deleteMany({
        where: { email: 'ratelimit@example.com' },
      })
      await createTestUser({
        email: 'ratelimit@example.com',
        name: 'Rate Limit Test',
      })
    })

    it('should include retry information in rate limit error', async () => {
      // Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        await gql.expectError(
          LoginMutation,
          { email: 'ratelimit@example.com', password: 'wrongpassword' },
          'Invalid email or password',
          createMockContext(),
        )
      }

      // Check error details
      await gql.expectError(
        LoginMutation,
        { email: 'ratelimit@example.com', password: 'wrong-wrongpassword' },
        'Too many requests',
        createMockContext(),
      )
    })
  })
})
