/**
 * Authentication Module Integration Tests
 *
 * Comprehensive test suite covering all authentication features:
 * - Basic authentication (signup/login)
 * - Token management (refresh tokens, logout)
 */

import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  LoginMutation,
  LoginWithTokensMutation,
  LogoutMutation,
  RefreshTokenMutation,
  SignupMutation,
} from '../../../src/gql/mutations'
import { MeQuery } from '../../../src/gql/queries'
import { prisma } from '../../../src/prisma'
import {
  createAuthenticatedContext,
  createMockContext,
  createTestServer,
  createTestUser,
  gqlHelpers,
} from '../../utils'

describe('Authentication Integration Tests', () => {
  const server = createTestServer()

  beforeEach(async () => {
    // Clean database before each test
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('Basic Authentication', () => {
    describe('Signup', () => {
      it('should create a new user', async () => {
        const variables = {
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        }

        const data = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof SignupMutation>,
          VariablesOf<typeof SignupMutation>
        >(server, print(SignupMutation), variables, createMockContext())

        expect(data.signup).toBeDefined()
        expect(typeof data.signup).toBe('string')

        // Verify user was created
        const user = await prisma.user.findUnique({
          where: { email: variables.email },
        })
        expect(user).toBeDefined()
        expect(user?.name).toBe(variables.name)
      })

      it('should fail with duplicate email', async () => {
        // Create existing user
        await createTestUser({ email: 'existing@example.com' })

        const variables = {
          email: 'existing@example.com',
          password: 'password123',
          name: 'Another User',
        }

        await gqlHelpers.expectGraphQLError<
          ResultOf<typeof SignupMutation>,
          VariablesOf<typeof SignupMutation>
        >(
          server,
          print(SignupMutation),
          variables,
          createMockContext(),
          'An account with this email already exists',
        )
      })
    })

    describe('Login', () => {
      it('should login with valid credentials', async () => {
        await createTestUser({
          email: 'test@example.com',
          password: 'password123',
        })

        const variables = {
          email: 'test@example.com',
          password: 'password123',
        }

        const data = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(server, print(LoginMutation), variables, createMockContext())

        expect(data.login).toBeDefined()
        expect(typeof data.login).toBe('string')
      })

      it('should fail with invalid password', async () => {
        await createTestUser({
          email: 'test@example.com',
          password: 'password123',
        })

        const variables = {
          email: 'test@example.com',
          password: 'wrongpassword',
        }

        await gqlHelpers.expectGraphQLError<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(
          server,
          print(LoginMutation),
          variables,
          createMockContext(),
          'Invalid email or password',
        )
      })

      it('should fail with non-existent user', async () => {
        const variables = {
          email: 'nonexistent@example.com',
          password: 'password123',
        }

        await gqlHelpers.expectGraphQLError<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(
          server,
          print(LoginMutation),
          variables,
          createMockContext(),
          'Invalid email or password',
        )
      })
    })
  })

  describe('Token Management', () => {
    describe('Login with Tokens', () => {
      it('should return both access and refresh tokens', async () => {
        await createTestUser({
          email: 'test@example.com',
          password: 'password123',
        })

        const data = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof LoginWithTokensMutation>,
          VariablesOf<typeof LoginWithTokensMutation>
        >(
          server,
          print(LoginWithTokensMutation),
          { email: 'test@example.com', password: 'password123' },
          createMockContext(),
        )

        expect(data.loginWithTokens).toBeDefined()
        expect(data.loginWithTokens?.accessToken).toBeDefined()
        expect(data.loginWithTokens?.refreshToken).toBeDefined()
        expect(typeof data.loginWithTokens?.accessToken).toBe('string')
        expect(typeof data.loginWithTokens?.refreshToken).toBe('string')
      })

      it('should fail with invalid credentials', async () => {
        await gqlHelpers.expectGraphQLError<
          ResultOf<typeof LoginWithTokensMutation>,
          VariablesOf<typeof LoginWithTokensMutation>
        >(
          server,
          print(LoginWithTokensMutation),
          { email: 'test@example.com', password: 'wrongpassword' },
          createMockContext(),
          'Invalid email or password',
        )
      })
    })

    describe('Refresh Token', () => {
      it('should refresh tokens with valid refresh token', async () => {
        const user = await createTestUser({
          email: 'test@example.com',
          password: 'password123',
        })

        // Login to get initial tokens
        const loginData = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof LoginWithTokensMutation>,
          VariablesOf<typeof LoginWithTokensMutation>
        >(
          server,
          print(LoginWithTokensMutation),
          { email: 'test@example.com', password: 'password123' },
          createMockContext(),
        )

        const refreshToken = loginData.loginWithTokens?.refreshToken
        expect(refreshToken).toBeDefined()

        if (!refreshToken) {
          throw new Error('No refresh token received')
        }

        // Refresh tokens
        const data = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof RefreshTokenMutation>,
          VariablesOf<typeof RefreshTokenMutation>
        >(
          server,
          print(RefreshTokenMutation),
          { refreshToken },
          createMockContext(),
        )

        expect(data.refreshToken).toBeDefined()
        expect(data.refreshToken?.accessToken).toBeDefined()
        expect(data.refreshToken?.refreshToken).toBeDefined()
        expect(data.refreshToken?.refreshToken).not.toBe(refreshToken)
      })

      it('should fail with invalid refresh token', async () => {
        await gqlHelpers.expectGraphQLError<
          ResultOf<typeof RefreshTokenMutation>,
          VariablesOf<typeof RefreshTokenMutation>
        >(
          server,
          print(RefreshTokenMutation),
          { refreshToken: 'invalid-token' },
          createMockContext(),
          'Invalid refresh token',
        )
      })

      it('should enforce single-use refresh tokens', async () => {
        await createTestUser({
          email: 'test@example.com',
          password: 'password123',
        })

        // Login to get tokens
        const loginData = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof LoginWithTokensMutation>,
          VariablesOf<typeof LoginWithTokensMutation>
        >(
          server,
          print(LoginWithTokensMutation),
          { email: 'test@example.com', password: 'password123' },
          createMockContext(),
        )

        const refreshToken = loginData.loginWithTokens?.refreshToken
        if (!refreshToken) {
          throw new Error('No refresh token received')
        }

        // First refresh should succeed
        await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof RefreshTokenMutation>,
          VariablesOf<typeof RefreshTokenMutation>
        >(
          server,
          print(RefreshTokenMutation),
          { refreshToken },
          createMockContext(),
        )

        // Second refresh with same token should fail
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

    describe('Logout', () => {
      it('should revoke all refresh tokens', async () => {
        const { user, token, context } = await createAuthenticatedContext()

        // Create some refresh tokens
        await prisma.refreshToken.createMany({
          data: [
            {
              token: 'token1',
              userId: user.id,
              expiresAt: new Date(Date.now() + 86400000),
            },
            {
              token: 'token2',
              userId: user.id,
              expiresAt: new Date(Date.now() + 86400000),
            },
          ],
        })

        const data = await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof LogoutMutation>,
          VariablesOf<typeof LogoutMutation>
        >(server, print(LogoutMutation), {}, context)

        expect(data.logout).toBe(true)

        // Verify all tokens are revoked
        const activeTokens = await prisma.refreshToken.findMany({
          where: {
            userId: user.id,
            revoked: false,
          },
        })
        expect(activeTokens).toHaveLength(0)
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
          'Not authorized',
        )
      })
    })
  })

  describe('Me Query', () => {
    it('should return current user when authenticated', async () => {
      const { user, context } = await createAuthenticatedContext()

      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof MeQuery>
      >(server, print(MeQuery), {}, context)

      expect(data.me).toBeDefined()
      expect(data.me?.id).toBeDefined()
      expect(data.me?.email).toBe(user.email)
      expect(data.me?.name).toBe(user.name)
    })

    it('should return null when not authenticated', async () => {
      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof MeQuery>
      >(server, print(MeQuery), {}, createMockContext())

      expect(data.me).toBeNull()
    })
  })
})
