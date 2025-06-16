/**
 * Refresh Token Tests
 * 
 * Tests for refresh token functionality
 */

import bcrypt from 'bcryptjs'
import { graphql, ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from './setup'
import { createMockContext, createTestServer, gqlHelpers } from './test-utils'

// Import direct mutations
import { 
  LoginWithTokensDirectMutation, 
  RefreshTokenDirectMutation, 
  LogoutDirectMutation 
} from '../src/gql/mutations-auth-tokens-direct'

describe('Refresh Token', () => {
    const server = createTestServer()

    beforeEach(async () => {
        // Create a test user
        await prisma.user.deleteMany()
        await prisma.user.create({
            data: {
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
                name: 'Test User',
            },
        })
    })

    describe('loginWithTokensDirect mutation', () => {
        it('should return both access and refresh tokens on successful login', async () => {
            const variables = {
                email: 'test@example.com',
                password: 'password123',
            }

            const data = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof LoginWithTokensDirectMutation>, VariablesOf<typeof LoginWithTokensDirectMutation>>(
                server,
                print(LoginWithTokensDirectMutation),
                variables,
                createMockContext()
            )

            expect(data.loginWithTokensDirect).toBeDefined()
            expect(data.loginWithTokensDirect?.accessToken).toBeDefined()
            expect(data.loginWithTokensDirect?.refreshToken).toBeDefined()
            expect(typeof data.loginWithTokensDirect?.accessToken).toBe('string')
            expect(typeof data.loginWithTokensDirect?.refreshToken).toBe('string')
        })

        it('should fail with invalid credentials', async () => {
            const variables = {
                email: 'test@example.com',
                password: 'wrongpassword',
            }

            await gqlHelpers.expectGraphQLError<ResultOf<typeof LoginWithTokensDirectMutation>, VariablesOf<typeof LoginWithTokensDirectMutation>>(
                server,
                print(LoginWithTokensDirectMutation),
                variables,
                createMockContext(),
                'Invalid email or password'
            )
        })
    })

    describe('refreshTokenDirect mutation', () => {
        it('should return new tokens with valid refresh token', async () => {
            // First login to get tokens
            const loginData = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof LoginWithTokensDirectMutation>, VariablesOf<typeof LoginWithTokensDirectMutation>>(
                server,
                print(LoginWithTokensDirectMutation),
                { email: 'test@example.com', password: 'password123' },
                createMockContext()
            )

            const refreshToken = loginData.loginWithTokensDirect?.refreshToken ?? ''

            // Use refresh token to get new tokens
            const refreshData = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof RefreshTokenDirectMutation>, VariablesOf<typeof RefreshTokenDirectMutation>>(
                server,
                print(RefreshTokenDirectMutation),
                { refreshToken },
                createMockContext()
            )

            expect(refreshData.refreshTokenDirect).toBeDefined()
            expect(refreshData.refreshTokenDirect?.accessToken).toBeDefined()
            expect(refreshData.refreshTokenDirect?.refreshToken).toBeDefined()

            // New tokens should be different from old ones
            expect(refreshData.refreshTokenDirect?.accessToken).not.toBe(loginData.loginWithTokensDirect?.accessToken)
            expect(refreshData.refreshTokenDirect?.refreshToken).not.toBe(loginData.loginWithTokensDirect?.refreshToken)
        })

        it('should fail with invalid refresh token', async () => {
            await gqlHelpers.expectGraphQLError(
                server,
                print(RefreshTokenDirectMutation),
                { refreshToken: 'invalid-token' },
                createMockContext(),
                'Invalid refresh token'
            )
        })

        it('should fail when using same refresh token twice (rotation)', async () => {
            // First login to get tokens
            const loginData = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof LoginWithTokensDirectMutation>, VariablesOf<typeof LoginWithTokensDirectMutation>>(
                server,
                print(LoginWithTokensDirectMutation),
                { email: 'test@example.com', password: 'password123' },
                createMockContext()
            )

            const refreshToken = loginData.loginWithTokensDirect?.refreshToken ?? ''

            // Use refresh token once
            await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof RefreshTokenDirectMutation>, VariablesOf<typeof RefreshTokenDirectMutation>>(
                server,
                print(RefreshTokenDirectMutation),
                { refreshToken },
                createMockContext()
            )

            // Try to use the same refresh token again
            await gqlHelpers.expectGraphQLError<ResultOf<typeof RefreshTokenDirectMutation>, VariablesOf<typeof RefreshTokenDirectMutation>>(
                server,
                print(RefreshTokenDirectMutation),
                { refreshToken },
                createMockContext(),
                'Invalid refresh token'
            )
        })
    })

    describe('logoutDirect mutation', () => {
        it('should revoke all refresh tokens for the user', async () => {
            // First login to get tokens
            const loginData = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof LoginWithTokensDirectMutation>, VariablesOf<typeof LoginWithTokensDirectMutation>>(
                server,
                print(LoginWithTokensDirectMutation),
                { email: 'test@example.com', password: 'password123' },
                createMockContext()
            )

            // Get user from database
            const user = await prisma.user.findUnique({
                where: { email: 'test@example.com' }
            })

            // Create authenticated context
            const authContext = {
                ...createMockContext(),
                userId: { value: user!.id } as any,
                security: { isAuthenticated: true, userId: user!.id, roles: [], permissions: [] }
            }

            // Logout
            const logoutResult = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof LogoutDirectMutation>, VariablesOf<typeof LogoutDirectMutation>>(
                server,
                print(LogoutDirectMutation),
                {},
                authContext
            )

            expect(logoutResult.logoutDirect).toBe(true)

            // Try to use refresh token after logout
            await gqlHelpers.expectGraphQLError(
                server,
                print(RefreshTokenDirectMutation),
                { refreshToken: loginData.loginWithTokensDirect?.refreshToken ?? '' },
                createMockContext(),
                'Invalid refresh token'
            )
        })

        it('should require authentication', async () => {
            await gqlHelpers.expectGraphQLError<ResultOf<typeof LogoutDirectMutation>, VariablesOf<typeof LogoutDirectMutation>>(
                server,
                print(LogoutDirectMutation),
                {},
                createMockContext(),
                'Authentication required'
            )
        })
    })
})