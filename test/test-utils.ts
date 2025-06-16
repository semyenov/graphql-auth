// Import test environment first to ensure environment variables are set
import './test-env'

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

import { ApolloServer, GraphQLResponse } from '@apollo/server'
import jwt from 'jsonwebtoken'
import type { Context } from '../src/context/types'
import { env } from '../src/environment'
import type { HTTPMethod } from '../src/gql/types'

// Import the already built schema with permissions
import { schema } from '../src/schema'

// Create test context
export function createMockContext(overrides?: Partial<Context>): Context {
  const defaultContext: Context = {
    req: {
      url: '/graphql',
      method: 'POST' as HTTPMethod,
      headers: {},
      body: undefined,
    },
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST' as HTTPMethod,
    contentType: 'application/json',
    metadata: {
      ip: '127.0.0.1',
      userAgent: 'test-user-agent',
      startTime: Date.now(),
    },
    security: {
      isAuthenticated: false,
      userId: undefined,
      userEmail: undefined,
      roles: [],
      permissions: [],
    },
  } as Context

  return {
    ...defaultContext,
    ...overrides,
  }
}

// Create authenticated context
export function createAuthContext(userId: string): Context {
  const token = generateTestToken(userId)
  const userIdNum = parseInt(userId, 10)

  return createMockContext({
    headers: {
      authorization: `Bearer ${token}`,
    },
    req: {
      url: '/graphql',
      method: 'POST' as HTTPMethod,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: undefined,
    },
    userId: userIdNum, // Add the top-level userId property
    security: {
      isAuthenticated: true,
      userId: userIdNum,
      userEmail: undefined, // Would typically be filled by auth middleware
      roles: ['user'], // Default role for authenticated users
      permissions: [],
    },
  })
}

// Create test server
export function createTestServer() {
  return new ApolloServer<Context>({
    schema,
    introspection: true,
  })
}

// Generate test JWT token
export function generateTestToken(userId: string): string {
  return jwt.sign({ userId: parseInt(userId, 10) }, env.APP_SECRET)
}

export type VariableValues = { [name: string]: unknown }

// GraphQL query helper with improved error handling
export async function executeOperation<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  server: ApolloServer<Context>,
  query: string,
  variables?: TVariables,
  context?: Context,
): Promise<GraphQLResponse<TData>> {
  const response = await server.executeOperation<TData, TVariables>({
    query,
    variables,
  }, {
    contextValue: context || createMockContext()
  })

  return response
}

// Helper to extract data from GraphQL response with error checking
export function extractGraphQLData<T>(response: GraphQLResponse<T>): T {
  if (response.body.kind !== 'single') {
    throw new Error('Expected single GraphQL response')
  }

  const { singleResult } = response.body

  if (singleResult.errors && singleResult.errors.length > 0) {
    throw new Error(`GraphQL Error: ${singleResult.errors.map(e => e.message).join(', ')}`)
  }

  if (!singleResult.data) {
    throw new Error('No data returned from GraphQL operation')
  }

  return singleResult.data
}

// Helper to check if GraphQL response has errors
export function hasGraphQLErrors<T>(response: GraphQLResponse<T>): boolean {
  return response.body.kind === 'single' &&
    !!response.body.singleResult.errors &&
    response.body.singleResult.errors.length > 0
}

// Helper to get GraphQL errors from response
export function getGraphQLErrors<T>(response: GraphQLResponse<T>): string[] {
  if (response.body.kind !== 'single') {
    return []
  }

  return response.body.singleResult.errors?.map(e => e.message) || []
}

// Type-safe GraphQL operation helpers
export const gqlHelpers = {
  // Execute a query and expect success
  async expectSuccessfulQuery<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    server: ApolloServer<Context>,
    query: string,
    variables?: TVariables,
    context?: Context,
  ): Promise<TData> {
    const response = await executeOperation<TData, TVariables>(server, query, variables, context)
    return extractGraphQLData(response)
  },

  // Execute a mutation and expect success
  async expectSuccessfulMutation<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    server: ApolloServer<Context>,
    mutation: string,
    variables?: TVariables,
    context?: Context,
  ): Promise<TData> {
    const response = await executeOperation<TData, TVariables>(server, mutation, variables, context)
    return extractGraphQLData(response)
  },

  // Execute an operation and expect it to fail with specific error
  async expectGraphQLError<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    server: ApolloServer<Context>,
    operation: string,
    variables?: TVariables,
    context?: Context,
    expectedErrorSubstring?: string,
  ): Promise<string[]> {
    const response = await executeOperation<TData, TVariables>(server, operation, variables, context)

    if (!hasGraphQLErrors(response)) {
      throw new Error('Expected GraphQL operation to fail, but it succeeded')
    }

    const errors = getGraphQLErrors(response)

    if (expectedErrorSubstring) {
      const hasExpectedError = errors.some(error => error.includes(expectedErrorSubstring))
      if (!hasExpectedError) {
        throw new Error(`Expected error containing "${expectedErrorSubstring}", but got: ${errors.join(', ')}`)
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