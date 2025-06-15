import bcrypt from 'bcryptjs'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import type { LoginVariables, SignupVariables } from '../src/gql'
import { LoginMutation, SignupMutation } from '../src/gql'
import { prisma } from './setup'
import { createMockContext, createTestServer, gqlHelpers, testData } from './test-utils'

interface AuthMutationResponse {
  signup?: string
  login?: string
}

describe('Authentication', () => {
  const server = createTestServer()

  beforeEach(async () => {
    // Clean database is handled by setup.ts
  })

  describe('signup', () => {
    it('should create a new user with valid data', async () => {
      const variables: SignupVariables = testData.user({
        password: 'securePassword123',
      })

      // Using the new helper for cleaner test code
      const data = await gqlHelpers.expectSuccessfulMutation<AuthMutationResponse, SignupVariables>(
        server,
        print(SignupMutation),
        variables,
        createMockContext()
      )

      expect(data.signup).toBeDefined()
      expect(data.signup).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: variables.email },
      })
      expect(user).toBeDefined()
      expect(user?.email).toEqual(variables.email)
      expect(user?.name).toEqual(variables.name)
    })

    it('should fail with duplicate email', async () => {
      // Create existing user
      const existingUser = await testData.createUser({
        email: 'existing@example.com',
      })

      const variables: SignupVariables = {
        email: 'existing@example.com',
        password: 'newPassword123',
        name: 'Another User',
      }

      // Using the new helper to expect and verify errors
      const errors = await gqlHelpers.expectGraphQLError<AuthMutationResponse, SignupVariables>(
        server,
        print(SignupMutation),
        variables,
        createMockContext(),
        'Unique constraint failed'
      )

      expect(errors.some(error => error.includes('email'))).toBe(true)
    })
  })

  describe('login', () => {
    it('should login with valid credentials', async () => {
      // Create user
      const password = 'myPassword123'
      const user = await testData.createUser({
        email: 'testuser@example.com',
        password,
      })

      const variables: LoginVariables = {
        email: 'testuser@example.com',
        password,
      }

      // Using the new helper for cleaner success case
      const data = await gqlHelpers.expectSuccessfulMutation<AuthMutationResponse, LoginVariables>(
        server,
        print(LoginMutation),
        variables,
        createMockContext()
      )

      expect(data.login).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)
    })

    it('should fail with invalid password', async () => {
      // Create user
      await prisma.user.create({
        data: {
          email: 'testuser2@example.com',
          password: await bcrypt.hash('correctPassword', 10),
          name: 'Test User 2',
        },
      })

      const variables: LoginVariables = {
        email: 'testuser2@example.com',
        password: 'wrongPassword',
      }

      // Using the new helper to expect specific error
      await gqlHelpers.expectGraphQLError<AuthMutationResponse, LoginVariables>(
        server,
        print(LoginMutation),
        variables,
        createMockContext(),
        'Invalid password'
      )
    })

    it('should fail with non-existent user', async () => {
      const variables: LoginVariables = {
        email: 'nonexistent@example.com',
        password: 'anyPassword',
      }

      // Using the new helper to expect specific error
      await gqlHelpers.expectGraphQLError<AuthMutationResponse, LoginVariables>(
        server,
        print(LoginMutation),
        variables,
        createMockContext(),
        'No user found'
      )
    })
  })
})