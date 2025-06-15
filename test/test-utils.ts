// Import test environment first to ensure environment variables are set
import './test-env'

import { ApolloServer, GraphQLResponse } from '@apollo/server'
import jwt from 'jsonwebtoken'
import { Context, HTTPMethod } from '../src/context'
import { env } from '../src/environment'

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
    headers: {},
    method: 'POST' as HTTPMethod,
    contentType: 'application/json',
    metadata: {
      ip: 'test-ip',
      userAgent: 'test-agent',
      operationName: undefined,
      query: undefined,
      variables: undefined,
      startTime: Date.now(),
    },
    security: {
      isAuthenticated: false,
      userId: undefined,
      userEmail: undefined,
      roles: [],
      permissions: [],
    },
  }

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
    security: {
      isAuthenticated: true,
      userId: userIdNum,
      userEmail: undefined,
      roles: [],
      permissions: [],
    },
    userId: userIdNum,
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
  const payload = {
    userId,
    email: `test-user-${userId}@example.com`, // Add email to match production format
  }

  return jwt.sign(payload, env.APP_SECRET, {
    expiresIn: '1h', // Shorter expiry for tests
    issuer: 'graphql-auth', // Must match production
    audience: 'graphql-api', // Must match production
  })
}

// GraphQL query helper
export async function executeOperation<TData = unknown>(
  server: ApolloServer<Context>,
  query: string,
  variables?: any,
  context?: Context,
): Promise<GraphQLResponse<TData>> {
  const response = await server.executeOperation<TData>(
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