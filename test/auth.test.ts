import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from './setup'
import { createMockContext, createTestServer, executeOperation, testData } from './test-utils'

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
      const signupMutation = `
        mutation Signup($email: String!, $password: String!, $name: String) {
          signup(email: $email, password: $password, name: $name)
        }
      `

      const variables = testData.user({
        password: 'securePassword123',
      })

      const result = await executeOperation(
        server,
        signupMutation,
        variables,
        createMockContext()
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        // Check for errors first
        if (result.body.singleResult.errors) {
          console.error('Signup errors:', result.body.singleResult.errors)
          throw new Error('Signup failed: ' + result.body.singleResult.errors[0]!.message)
        }

        expect(result.body.singleResult.data).toBeDefined()
        const data = result.body.singleResult.data as AuthMutationResponse
        expect(data?.signup).toBeDefined()
        expect(data?.signup).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)
      }

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

      const signupMutation = `
        mutation Signup($email: String!, $password: String!, $name: String) {
          signup(email: $email, password: $password, name: $name)
        }
      `

      const variables = {
        email: 'existing@example.com',
        password: 'newPassword123',
        name: 'Another User',
      }

      const result = await executeOperation(
        server,
        signupMutation,
        variables,
        createMockContext()
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('Unique constraint failed')
        expect(result.body.singleResult.errors![0]!.message).toContain('email')
        const data = result.body.singleResult.data as AuthMutationResponse
        expect(data?.signup).toBeNull()
      }
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

      const loginMutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `

      const variables = {
        email: 'testuser@example.com',
        password,
      }

      const result = await executeOperation(
        server,
        loginMutation,
        variables,
        createMockContext()
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data).toBeDefined()
        const data = result.body.singleResult.data as AuthMutationResponse
        expect(data?.login).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)
      }
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

      const loginMutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `

      const variables = {
        email: 'testuser2@example.com',
        password: 'wrongPassword',
      }

      const result = await executeOperation(
        server,
        loginMutation,
        variables,
        createMockContext()
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('Invalid password')
      }
    })

    it('should fail with non-existent user', async () => {
      const loginMutation = `
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `

      const variables = {
        email: 'nonexistent@example.com',
        password: 'anyPassword',
      }

      const result = await executeOperation(
        server,
        loginMutation,
        variables,
        createMockContext()
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('No user found')
      }
    })
  })
})