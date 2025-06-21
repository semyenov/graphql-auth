import { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { LoginMutation, SignupMutation } from '../../../src/gql/mutations'
import { prisma } from '../../../src/prisma'
import {
  cleanDatabase,
  createMockContext,
  createTestServer,
  createTestUser,
  gqlHelpers,
} from '../../utils'

describe('Authentication', () => {
  const server = createTestServer()

  beforeEach(async () => {
    await cleanDatabase()
  })

  describe('signup', () => {
    it('should create a new user with valid data', async () => {
      const variables = {
        email: 'newsignup@example.com',
        password: 'securePassword123',
        name: 'New Signup User',
      }

      // Using the new helper for cleaner test code
      const data =
        await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof SignupMutation>,
          VariablesOf<typeof SignupMutation>
        >(
          server,
          print(SignupMutation),
          variables,
          createMockContext(),
        )

      expect(data.signup).toBeDefined()
      expect(data.signup).toMatch(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      )

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
      await createTestUser({
        email: 'existing@example.com',
        name: 'Existing User',
      })

      const variables = {
        email: 'existing@example.com',
        password: 'newPassword123',
        name: 'Another User',
      }

      // Using the new helper to expect and verify errors
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

  describe('login', () => {
    it('should login with valid credentials', async () => {
      // Create user
      const password = 'myPassword123'
      const email = 'testuser@example.com'

      await createTestUser({
        email,
        password,
        name: 'Test User',
      })

      const variables = {
        email,
        password,
      }

      // Using the new helper for cleaner success case
      const data =
        await gqlHelpers.expectSuccessfulMutation<
          ResultOf<typeof LoginMutation>,
          VariablesOf<typeof LoginMutation>
        >(
          server,
          print(LoginMutation),
          variables,
          createMockContext(),
        )

      expect(data.login).toMatch(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
      )
    })

    it('should fail with invalid password', async () => {
      // Create user
      const email = 'testuser2@example.com'
      const correctPassword = 'correctPassword'
      const wrongPassword = 'wrongPassword'

      await createTestUser({
        email,
        password: correctPassword,
        name: 'Test User',
      })

      const variables = {
        email,
        password: wrongPassword,
      }

      // Using the new helper to expect specific error
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
      const email = 'nonexistent@example.com'
      const password = 'anyPassword'

      const variables = {
        email,
        password,
      }

      // Using the new helper to expect specific error
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

  // =============================================================================
  // ARCHITECTURE NOTES
  // =============================================================================

  /*
   * NOTE: Convenience functions (mutateLogin, mutateSignup, etc.) from src/gql/client.ts
   * are designed for runtime use with real HTTP requests, not for server-side testing.
   *
   * For testing GraphQL operations:
   * ✅ Use gqlHelpers with Apollo Server's executeOperation (as shown above)
   * ❌ Don't use convenience functions that make fetch() requests in tests
   *
   * The convenience functions are perfect for:
   * - Frontend applications making real API calls
   * - Integration tests with a running server
   * - Development scripts and tools
   *
   * But for unit/integration tests of the GraphQL schema itself,
   * use the Apollo Server test patterns shown in this file.
   */
})
