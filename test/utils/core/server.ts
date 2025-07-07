/**
 * Test server creation utilities
 */

import { ApolloServer } from '@apollo/server'
import { createYoga } from 'graphql-yoga'
import type { DefaultContext } from '../../../src/graphql/context/context.types'
import { getCachedSchema } from '../graphql/schema-cache'

// Cache server instances per worker to avoid rebuilding
let cachedApolloServer: ApolloServer<DefaultContext> | null = null
let cachedYogaServer: ReturnType<typeof createYoga<DefaultContext>> | null =
  null

/**
 * Create a test Apollo Server instance
 * Uses cached schema and server instance for performance
 */
export function createTestServer(): ApolloServer<DefaultContext> {
  if (!cachedApolloServer) {
    cachedApolloServer = new ApolloServer<DefaultContext>({
      schema: getCachedSchema(),
      introspection: true,
      includeStacktraceInErrorResponses: true,
    })
  }
  return cachedApolloServer
}

/**
 * Create a test Yoga server instance for advanced GraphQL testing
 * Uses cached schema and server instance for performance
 */
export function createYogaTestServer() {
  if (!cachedYogaServer) {
    cachedYogaServer = createYoga<DefaultContext>({
      schema: getCachedSchema(),
      logging: false,
      maskedErrors: false,
    })
  }
  return cachedYogaServer
}
