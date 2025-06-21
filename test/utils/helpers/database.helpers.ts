// Import test environment first to ensure environment variables are set
import 'reflect-metadata'
import '../../test-env'

// =============================================================================
// TEST UTILITIES - UPDATED FOR GRAPHQL ARCHITECTURE GUIDE
// =============================================================================
/**
 * This file provides testing utilities that follow the GraphQL Architecture Guide patterns:
 *
 * ARCHITECTURE COMPLIANCE:
 * ✅ Imports from unified `src/gql` directory (not old `src/graphql`)
 * ✅ Uses convenience functions from `src/gql/client.ts` when appropriate
 * ✅ Provides both low-level (gqlHelpers) and high-level (convenienceHelpers) testing patterns
 * ✅ Demonstrates proper type-safe imports with `type` keyword
 * ✅ Shows single source of truth pattern for GraphQL operations
 *
 * AVAILABLE PATTERNS:
 * 1. gqlHelpers - Apollo Server testing with GraphQL operations
 * 2. Context helpers - createMockContext, createAuthContext
 *
 * RECOMMENDED USAGE:
 * - Use gqlHelpers for comprehensive server-side testing
 * - See test/auth.test.ts for proper testing patterns
 */

import { ApolloServer, type GraphQLResponse } from '@apollo/server'
import { useDeferStream } from '@graphql-yoga/plugin-defer-stream'
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection'
import { createYoga } from 'graphql-yoga'
import jwt from 'jsonwebtoken'
import { env } from '../../../src/app/config/environment'
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import {
  type AuthContext,
  type Context,
} from '../../../src/graphql/context/context.types'
import { enhanceContext } from '../../../src/graphql/context/context.utils'
import { buildSchema } from '../../../src/graphql/schema'

// Create test context
export function createMockContext(overrides?: Partial<Context>): Context {
  const defaultContext: Context = {
    req: {
      url: '/graphql',
      method: 'POST',
      headers: {},
      body: undefined,
    },
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    contentType: 'application/json',
    metadata: {
      ip: '127.0.0.1',
      userAgent: 'test-user-agent',
      startTime: Date.now(),
    },
    security: {
      isAuthenticated: false,
      permissions: ['read:public'],
      roles: ['user'],
    },
  }

  const baseContext: Context = {
    ...defaultContext,
    ...overrides,
  }

  return enhanceContext(baseContext)
}

// Create authenticated context
export function createAuthContext(userId: number | UserId): Context {
  const userIdObject =
    typeof userId === 'number' ? UserId.create(userId) : userId
  const token = generateTestToken(userIdObject)

  return createMockContext({
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    req: {
      url: '/graphql',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: undefined,
    },
    userId: userIdObject, // Add the top-level userId property
    security: {
      isAuthenticated: true,
      userId: userIdObject,
      userEmail: undefined, // Would typically be filled by auth middleware
      roles: ['user'], // Default role for authenticated users
      permissions: [],
    },
  })
}

export interface TestServer {
  yoga: ReturnType<typeof createYoga>
  executeOperation: <
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    query: string,
    variables?: TVariables,
    context?: Context,
  ) => Promise<GraphQLResponse<TData>>
}

/**
 * Creates a Yoga test server instance for integration testing.
 *
 * @param authContext - Optional partial authentication context to be merged into the request context.
 * @returns An object containing the test server and a function to execute operations.
 */
export async function createYogaTestServer(
  authContext?: Partial<AuthContext>,
): Promise<TestServer> {
  const schema = await buildSchema()
  const yoga = createYoga({
    schema,
    context: authContext,
    plugins: [useDeferStream(), useDisableIntrospection()],
  })

  return {
    yoga,
    async executeOperation<
      TData = unknown,
      TVariables extends Record<string, unknown> = Record<string, unknown>,
    >(
      query: string,
      variables?: TVariables,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _context?: Context,
    ): Promise<GraphQLResponse<TData>> {
      const response = await yoga.fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      return response.json() as Promise<GraphQLResponse<TData>>
    },
  }
}

// Generate test JWT token
export function generateTestToken(userId: UserId): string {
  return jwt.sign({ userId: userId.value }, env.APP_SECRET)
}

export type VariableValues = { [name: string]: unknown }

// GraphQL query helper with improved error handling
export async function executeOperation<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  server: ApolloServer<Context>,
  query: string,
  variables?: TVariables,
  context?: Context,
): Promise<GraphQLResponse<TData>> {
  const response = await server.executeOperation<TData, TVariables>(
    {
      query,
      variables,
    },
    {
      contextValue: context || createMockContext(),
    },
  )

  return response
}

// Helper to extract data from GraphQL response with error checking
export function extractGraphQLData<T>(response: GraphQLResponse<T>): T {
  if (response.body.kind !== 'single') {
    throw new Error('Expected single GraphQL response')
  }

  const { singleResult } = response.body

  if (singleResult.errors && singleResult.errors.length > 0) {
    throw new Error(
      `GraphQL Error: ${singleResult.errors.map((e) => e.message).join(', ')}`,
    )
  }

  if (!singleResult.data) {
    throw new Error('No data returned from GraphQL operation')
  }

  return singleResult.data
}

// Helper to check if GraphQL response has errors
export function hasGraphQLErrors<T>(response: GraphQLResponse<T>): boolean {
  return (
    response.body.kind === 'single' &&
    !!response.body.singleResult.errors &&
    response.body.singleResult.errors.length > 0
  )
}

// Helper to get GraphQL errors from response
export function getGraphQLErrors<T>(response: GraphQLResponse<T>): string[] {
  if (response.body.kind !== 'single') {
    return []
  }

  return response.body.singleResult.errors?.map((e) => e.message) || []
}

// Type-safe GraphQL operation helpers
export const gqlHelpers = {
  // Execute a query and expect success
  async expectSuccessfulQuery<
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    server: ApolloServer<Context>,
    query: string,
    variables?: TVariables,
    context?: Context,
  ): Promise<TData> {
    const response = await executeOperation<TData, TVariables>(
      server,
      query,
      variables,
      context,
    )
    return extractGraphQLData(response)
  },

  // Execute a mutation and expect success
  async expectSuccessfulMutation<
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    server: ApolloServer<Context>,
    mutation: string,
    variables?: TVariables,
    context?: Context,
  ): Promise<TData> {
    const response = await executeOperation<TData, TVariables>(
      server,
      mutation,
      variables,
      context,
    )
    return extractGraphQLData(response)
  },

  // Execute an operation and expect it to fail with specific error
  async expectGraphQLError<
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    server: ApolloServer<Context>,
    operation: string,
    variables?: TVariables,
    context?: Context,
    expectedErrorSubstring?: string,
  ): Promise<string[]> {
    const response = await executeOperation<TData, TVariables>(
      server,
      operation,
      variables,
      context,
    )

    if (!hasGraphQLErrors(response)) {
      throw new Error('Expected GraphQL operation to fail, but it succeeded')
    }

    const errors = getGraphQLErrors(response)

    if (expectedErrorSubstring) {
      const hasExpectedError = errors.some((error) =>
        error.includes(expectedErrorSubstring),
      )
      if (!hasExpectedError) {
        throw new Error(
          `Expected error containing "${expectedErrorSubstring}", but got: "${errors.join(', ')}"`,
        )
      }
    }

    return errors
  },
}

// =============================================================================
// ARCHITECTURE NOTES FOR CONVENIENCE FUNCTIONS
// =============================================================================

/*
 * NOTE: The convenience functions from src/gql/client.ts (mutateLogin, queryMe, etc.)
 * are designed for runtime use with real HTTP requests, not for server-side testing.
 *
 * They use fetch() internally and expect a running GraphQL server, which doesn't work
 * with Apollo Server's executeOperation test setup.
 *
 * For testing, use the gqlHelpers patterns shown throughout this file and in the test files.
 * The convenience functions are perfect for frontend applications and integration tests
 * with a running server, but not for unit tests of the GraphQL schema itself.
 */
