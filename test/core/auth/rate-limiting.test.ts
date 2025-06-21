/**
 * Rate Limiting Tests
 *
 * Tests for rate limiting functionality on authentication endpoints
 */

import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { rateLimiter } from '../../../src/app/services/rate-limiter.service'
import { LoginMutation, SignupMutation } from '../../../src/gql/mutations'
import { prisma } from '../../../src/prisma'
import {
  createMockContext,
  createTestServer,
  createTestUser,
  executeOperation,
  gqlHelpers,
} from '../../utils'

describe('Rate Limiting', () => {
  const server = createTestServer()

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
        const response = await executeOperation<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(server, print(LoginMutation), variables, createMockContext())

        if (
          response.body.kind === 'single' &&
          response.body.singleResult.errors
        ) {
          // Login failure is expected, but not rate limit error
          expect(
            response.body.kind === 'single' &&
              response.body.singleResult.errors?.[0]?.message,
          ).toContain('Invalid email or password')
        }
      }
    })

    it('should block login attempts after exceeding rate limit', async () => {
      const variables = {
        email: 'ratelimit@example.com',
        password: 'wrongpassword',
      }

      // Exhaust rate limit (5 attempts)
      for (let i = 0; i < 5; i++) {
        await executeOperation<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(server, print(LoginMutation), variables, createMockContext())
      }

      // 6th attempt should be rate limited
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof LoginMutation>,
        VariablesOf<typeof LoginMutation>
      >(
        server,
        print(LoginMutation),
        variables,
        createMockContext(),
        'Too many requests',
      )
    })

    it('should use email as identifier for rate limiting', async () => {
      // Create another user
      await createTestUser({
        email: 'another@example.com',
      })

      // Exhaust rate limit for first email
      for (let i = 0; i < 5; i++) {
        await executeOperation<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(
          server,
          print(LoginMutation),
          { email: 'ratelimit@example.com', password: 'wrong' },
          createMockContext(),
        )
      }

      // Should still allow attempts for different email
      const response = await executeOperation<
        ResultOf<typeof LoginMutation>,
        VariablesOf<typeof LoginMutation>
      >(
        server,
        print(LoginMutation),
        { email: 'another@example.com', password: 'wrong' },
        createMockContext(),
      )

      // Should be login error, not rate limit
      expect(
        response.body.kind === 'single' && response.body.singleResult.errors,
      ).toBeDefined()
      expect(
        response.body.kind === 'single' &&
          response.body.singleResult.errors?.[0]?.message,
      ).toContain('Invalid email or password')
      expect(
        response.body.kind === 'single' &&
          response.body.singleResult.errors?.[0]?.message,
      ).not.toContain('Too many requests')
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

        const data = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof SignupMutation>,
          VariablesOf<typeof SignupMutation>
        >(server, print(SignupMutation), variables, createMockContext())

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
        await executeOperation<
          ResultOf<typeof SignupMutation>,
          VariablesOf<typeof SignupMutation>
        >(
          server,
          print(SignupMutation),
          {
            email: baseEmail,
            password: 'password123',
            name: `User ${i}`,
          },
          createMockContext(),
        )
      }

      // 4th attempt should be rate limited
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof SignupMutation>,
        VariablesOf<typeof SignupMutation>
      >(
        server,
        print(SignupMutation),
        {
          email: baseEmail,
          password: 'password123',
          name: 'User 4',
        },
        createMockContext(),
        'Too many requests',
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
        await executeOperation<
          ResultOf<typeof SignupMutation>,
          VariablesOf<typeof SignupMutation>
        >(
          server,
          print(SignupMutation),
          {
            email: emails[i] || `user${i}@example.com`,
            password: 'password123',
            name: `User ${i}`,
          },
          createMockContext(),
        )
      }

      // Next attempt with any variation should be rate limited
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof SignupMutation>,
        VariablesOf<typeof SignupMutation>
      >(
        server,
        print(SignupMutation),
        {
          email: 'testuser@example.com',
          password: 'password123',
          name: 'User 4',
        },
        createMockContext(),
        'Too many requests',
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
        await executeOperation<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(
          server,
          print(LoginMutation),
          { email: 'ratelimit@example.com', password: 'wrong' },
          createMockContext(),
        )
      }

      // Check error details
      const response = await executeOperation<
        ResultOf<typeof LoginMutation>,
        VariablesOf<typeof LoginMutation>
      >(
        server,
        print(LoginMutation),
        { email: 'ratelimit@example.com', password: 'wrong' },
        createMockContext(),
      )

      expect(
        response.body.kind === 'single' && response.body.singleResult.errors,
      ).toBeDefined()
      const error =
        response.body.kind === 'single' &&
        response.body.singleResult.errors?.[0]
      if (error) {
        expect(error.message).toContain('Too many requests')
        expect(error.message).toMatch(/retry after \d+ seconds/)
      }
    })
  })
})
