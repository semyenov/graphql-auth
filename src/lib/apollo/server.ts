/**
 * Apollo Server Configuration
 *
 * Setup and configuration for Apollo GraphQL Server
 */

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import type { GraphQLSchema } from 'graphql'
import type { Server } from 'http'
import type { Context } from '../../graphql/context/context.types'

/**
 * Apollo Server configuration options
 */
export interface ApolloServerConfig {
  schema: GraphQLSchema
  httpServer?: Server
  isDevelopment?: boolean
  introspection?: boolean
  includeStacktraceInErrorResponses?: boolean
}

/**
 * Create configured Apollo Server instance
 */
export function createApolloServer(
  config: ApolloServerConfig,
): ApolloServer<Context> {
  const {
    schema,
    httpServer,
    isDevelopment = process.env.NODE_ENV !== 'production',
    introspection = isDevelopment,
    includeStacktraceInErrorResponses = isDevelopment,
  } = config

  const plugins = []

  // Add HTTP server drain plugin if provided
  if (httpServer) {
    plugins.push(ApolloServerPluginDrainHttpServer({ httpServer }))
  }

  // Add landing page in development
  if (isDevelopment) {
    plugins.push(
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    )
  }

  return new ApolloServer<Context>({
    schema,
    plugins,
    introspection,
    includeStacktraceInErrorResponses,
    formatError: (formattedError, error) => {
      // Log error details in development
      if (isDevelopment) {
        console.error('GraphQL Error:', error)
      }

      // Remove stack trace in production
      if (!isDevelopment && formattedError.extensions?.stacktrace) {
        formattedError.extensions.stacktrace = undefined
      }

      return formattedError
    },
  })
}

/**
 * Default Apollo Server configuration
 */
export const defaultApolloConfig = {
  introspection: process.env.NODE_ENV !== 'production',
  includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
  csrfPrevention: true,
  cache: 'bounded' as const,
}
