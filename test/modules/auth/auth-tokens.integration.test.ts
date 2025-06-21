/**
 * Refresh Token Tests
 *
 * Tests for refresh token functionality
 */

import * as argon2 from 'argon2'
import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
// Import direct mutations
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import {
  LoginWithTokensMutation,
  LogoutMutation,
  RefreshTokenMutation,
} from '../../../src/gql/mutations-auth-tokens'
import { prisma } from '../../../src/prisma'
import {
  createMockContext,
  gqlHelpers,
} from '../../utils/helpers/database.helpers'
import { createTestServer } from '../../test-utils'

describe('Refresh Token', () => {
  const server = createTestServer()

  beforeEach(async () => {
    // Create a test user
    await prisma.user.deleteMany()
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: await argon2.hash('password123'),
        name: 'Test User',
      },
    })
  })

  describe('loginWithTokens mutation', () => {
    it('should return both access and refresh tokens on successful login', async () => {
      const variables = {
        email: 'test@example.com',
        password: 'password123',
      }

      const data = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof LoginWithTokensMutation>,
        VariablesOf<typeof LoginWithTokensMutation>
      >(server, print(LoginWithTokensMutation), variables, createMockContext())

      expect(data.loginWithTokens).toBeDefined()
      expect(data.loginWithTokens?.accessToken).toBeDefined()
      expect(data.loginWithTokens?.refreshToken).toBeDefined()
      expect(typeof data.loginWithTokens?.accessToken).toBe('string')
      expect(typeof data.loginWithTokens?.refreshToken).toBe('string')
    })

    it('should fail with invalid credentials', async () => {
      const variables = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof LoginWithTokensMutation>,
        VariablesOf<typeof LoginWithTokensMutation>
      >(
        server,
        print(LoginWithTokensMutation),
        variables,
        createMockContext(),
        'Invalid email or password',
      )
    })
  })

  describe('refreshToken mutation', () => {
    it('should return new tokens with valid refresh token', async () => {
      // First login to get tokens
      const loginData = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof LoginWithTokensMutation>,
        VariablesOf<typeof LoginWithTokensMutation>
      >(
        server,
        print(LoginWithTokensMutation),
        { email: 'test@example.com', password: 'password123' },
        createMockContext(),
      )

      const refreshToken = loginData.loginWithTokens?.refreshToken ?? ''

      // Use refresh token to get new tokens
      const refreshData = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof RefreshTokenMutation>,
        VariablesOf<typeof RefreshTokenMutation>
      >(
        server,
        print(RefreshTokenMutation),
        { refreshToken },
        createMockContext(),
      )

      expect(refreshData.refreshToken).toBeDefined()
      expect(refreshData.refreshToken?.accessToken).toBeDefined()
      expect(refreshData.refreshToken?.refreshToken).toBeDefined()

      // New tokens should be different from old ones
      expect(refreshData.refreshToken?.accessToken).not.toBe(
        loginData.loginWithTokens?.accessToken,
      )
      expect(refreshData.refreshToken?.refreshToken).not.toBe(
        loginData.loginWithTokens?.refreshToken,
      )
    })

    it('should fail with invalid refresh token', async () => {
      await gqlHelpers.expectGraphQLError(
        server,
        print(RefreshTokenMutation),
        { refreshToken: 'invalid-token' },
        createMockContext(),
        'Invalid refresh token',
      )
    })

    it('should fail when using same refresh token twice (rotation)', async () => {
      // First login to get tokens
      const loginData = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof LoginWithTokensMutation>,
        VariablesOf<typeof LoginWithTokensMutation>
      >(
        server,
        print(LoginWithTokensMutation),
        { email: 'test@example.com', password: 'password123' },
        createMockContext(),
      )

      const refreshToken = loginData.loginWithTokens?.refreshToken ?? ''

      // Use refresh token once
      await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof RefreshTokenMutation>,
        VariablesOf<typeof RefreshTokenMutation>
      >(
        server,
        print(RefreshTokenMutation),
        { refreshToken },
        createMockContext(),
      )

      // Try to use the same refresh token again
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof RefreshTokenMutation>,
        VariablesOf<typeof RefreshTokenMutation>
      >(
        server,
        print(RefreshTokenMutation),
        { refreshToken },
        createMockContext(),
        'Invalid refresh token',
      )
    })
  })

  describe('logout mutation', () => {
    it('should revoke all refresh tokens for the user', async () => {
      // First login to get tokens
      const loginData = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof LoginWithTokensMutation>,
        VariablesOf<typeof LoginWithTokensMutation>
      >(
        server,
        print(LoginWithTokensMutation),
        { email: 'test@example.com', password: 'password123' },
        createMockContext(),
      )

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      })

      const userId = user?.id ?? 0

      expect(user).toBeDefined()
      expect(userId).toBeDefined()
      expect(userId).toBeGreaterThan(0)

      // Create authenticated context
      const authContext = {
        ...createMockContext(),
        userId: UserId.create(userId),
        security: {
          isAuthenticated: true,
          userId: user?.id,
          roles: [],
          permissions: [],
        },
      }

      // Logout
      const logoutResult = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof LogoutMutation>,
        VariablesOf<typeof LogoutMutation>
      >(server, print(LogoutMutation), {}, authContext)

      expect(logoutResult.logout).toBe(true)

      // Try to use refresh token after logout
      await gqlHelpers.expectGraphQLError(
        server,
        print(RefreshTokenMutation),
        { refreshToken: loginData.loginWithTokens?.refreshToken ?? '' },
        createMockContext(),
        'Invalid refresh token',
      )
    })

    it('should require authentication', async () => {
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof LogoutMutation>,
        VariablesOf<typeof LogoutMutation>
      >(
        server,
        print(LogoutMutation),
        {},
        createMockContext(),
        'You must be logged in to perform this action. Please authenticate and try again.',
      )
    })
  })
})
