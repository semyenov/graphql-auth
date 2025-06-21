/**
 * Test server creation utilities
 */

import { ApolloServer } from '@apollo/server'
import { createYoga } from 'graphql-yoga'
import type { DefaultContext } from '../../../src/graphql/context/context.types'
import { buildSchema } from '../../../src/graphql/schema'

/**
 * Create a test Apollo Server instance
 */
export function createTestServer(): ApolloServer<DefaultContext> {
  return new ApolloServer<DefaultContext>({
    schema: buildSchema(),
    introspection: true,
    includeStacktraceInErrorResponses: true,
  })
}

/**
 * Create a test Yoga server instance for advanced GraphQL testing
 */
export function createYogaTestServer() {
  return createYoga<DefaultContext>({
    schema: buildSchema(),
    logging: false,
    maskedErrors: false,
  })
}
