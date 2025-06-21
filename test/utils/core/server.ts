/**
 * Test server creation utilities
 */

import { ApolloServer } from '@apollo/server'
import { createYoga } from 'graphql-yoga'
import { buildSchema } from '../../../src/graphql/schema'
import type { Context } from '../../../src/graphql/context/context.types'

/**
 * Create a test Apollo Server instance
 */
export function createTestServer(): ApolloServer<Context> {
  return new ApolloServer<Context>({
    schema: buildSchema(),
    introspection: true,
    includeStacktraceInErrorResponses: true,
  })
}

/**
 * Create a test Yoga server instance for advanced GraphQL testing
 */
export function createYogaTestServer() {
  return createYoga<Context>({
    schema: buildSchema(),
    logging: false,
    maskedErrors: false,
  })
}