// Import test environment first to ensure environment variables are set
import './test-env'

import { ApolloServer, GraphQLResponse } from '@apollo/server'
import jwt from 'jsonwebtoken'
import type { Context } from '../src/context/types'
import { env } from '../src/environment'
import type { HTTPMethod } from '../src/graphql/types'

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
      roles: [],
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
  return jwt.sign({ userId }, env.APP_SECRET)
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

// Test data factories
let userCounter = 0
let postCounter = 0

export const testData: {
  user: (overrides?: Partial<{ email: string; name: string; password: string }>) => { email: string; name: string; password: string }
  post: (overrides?: Partial<{ title: string; content: string; published: boolean; viewCount: number }>) => { title: string; content: string; published: boolean; viewCount: number }
  createUser: (overrides?: Partial<{ email: string; name: string; password: string }>) => Promise<any>
  createPost: (authorId: number, overrides?: Partial<{ title: string; content: string; published: boolean; viewCount: number }>) => Promise<any>
  createAuthenticatedUser: (overrides?: Partial<{ email: string; name: string; password: string }>) => Promise<{ user: any; context: Context }>
  resetCounters: () => void
} = {
  user: (overrides?: Partial<{ email: string; name: string; password: string }>) => {
    userCounter++
    return {
      email: `test-user-${userCounter}-${Date.now()}@example.com`,
      name: `Test User ${userCounter}`,
      password: 'password123',
      ...overrides,
    }
  },

  post: (overrides?: Partial<{ title: string; content: string; published: boolean; viewCount: number }>) => {
    postCounter++
    return {
      title: `Test Post ${postCounter}`,
      content: `Test content for post ${postCounter}`,
      published: false,
      viewCount: 0,
      ...overrides,
    }
  },

  // Helper to create a user in the database
  async createUser(overrides?: Parameters<typeof testData.user>[0]) {
    const bcrypt = await import('bcryptjs')
    const { prisma } = await import('./setup')
    const userData = testData.user(overrides)
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    })
  },

  // Helper to create a post in the database
  async createPost(authorId: number, overrides?: Parameters<typeof testData.post>[0]) {
    const { prisma } = await import('./setup')
    const postData = testData.post(overrides)

    return prisma.post.create({
      data: {
        ...postData,
        authorId,
      },
    })
  },

  // Helper to create an authenticated user and return context
  async createAuthenticatedUser(overrides?: Parameters<typeof testData.user>[0]) {
    const user = await this.createUser(overrides)
    const context = createAuthContext(user.id.toString())
    return { user, context }
  },

  // Reset counters (useful for test isolation)
  resetCounters() {
    userCounter = 0
    postCounter = 0
  },
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