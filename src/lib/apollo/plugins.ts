/**
 * Apollo Server Plugins
 *
 * Custom plugins for Apollo Server
 */

import type { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server'
import type { Context } from '../../graphql/context/context.types'

/**
 * Logging plugin
 */
export const loggingPlugin: ApolloServerPlugin<Context> = {
  async requestDidStart() {
    const startTime = Date.now()

    return {
      async willSendResponse(requestContext) {
        const duration = Date.now() - startTime
        const { operationName, query } = requestContext.request

        console.log({
          type: 'graphql-request',
          operationName,
          duration: `${duration}ms`,
          userId: requestContext.contextValue.userId,
          // Don't log full query in production
          query: process.env.NODE_ENV === 'development' ? query : undefined,
        })
      },

      async didEncounterErrors(requestContext) {
        console.error('GraphQL errors:', {
          operationName: requestContext.request.operationName,
          errors: requestContext.errors,
          userId: requestContext.contextValue.userId,
        })
      },
    } as GraphQLRequestListener<Context>
  },
}

/**
 * Performance monitoring plugin
 */
export const performancePlugin: ApolloServerPlugin<Context> = {
  async requestDidStart() {
    const fieldTimings = new Map<string, number>()

    return {
      async executionDidStart() {
        return {
          willResolveField({ info }) {
            const start = Date.now()
            const fieldName = `${info.parentType.name}.${info.fieldName}`

            return () => {
              const duration = Date.now() - start
              fieldTimings.set(fieldName, duration)

              // Warn about slow fields
              if (duration > 100) {
                console.warn(
                  `Slow field detected: ${fieldName} took ${duration}ms`,
                )
              }
            }
          },
        }
      },

      async willSendResponse() {
        // Log slowest fields
        if (fieldTimings.size > 0) {
          const slowestFields = Array.from(fieldTimings.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)

          if (slowestFields.some(([, duration]) => duration > 50)) {
            console.log('Slowest fields:', Object.fromEntries(slowestFields))
          }
        }
      },
    } as GraphQLRequestListener<Context>
  },
}

/**
 * Complexity analysis plugin
 */
export const complexityPlugin: ApolloServerPlugin<Context> = {
  async requestDidStart() {
    return {
      async didResolveOperation(requestContext) {
        const { document, operationName } = requestContext

        // Simple complexity estimation based on selection set depth
        const complexity = estimateComplexity(document)

        if (complexity > 100) {
          console.warn(
            `High complexity query detected: ${operationName} (complexity: ${complexity})`,
          )
        }

        // Could throw error if complexity is too high
        if (complexity > 1000) {
          throw new Error('Query too complex')
        }
      },
    } as GraphQLRequestListener<Context>
  },
}

/**
 * Caching hints plugin
 */
export const cachingPlugin: ApolloServerPlugin<Context> = {
  async requestDidStart() {
    return {
      async willSendResponse(requestContext) {
        const { response } = requestContext

        // Add cache control headers based on operation
        if (requestContext.request.operationName?.startsWith('Get')) {
          response.http.headers.set('Cache-Control', 'public, max-age=60')
        } else {
          response.http.headers.set('Cache-Control', 'no-store')
        }
      },
    } as GraphQLRequestListener<Context>
  },
}

/**
 * Error formatting plugin
 */
export const errorFormattingPlugin: ApolloServerPlugin<Context> = {
  async requestDidStart() {
    return {
      async willSendResponse(requestContext) {
        if (requestContext.errors) {
          // Add request ID to errors
          requestContext.errors.forEach((error) => {
            error.extensions.requestId =
              requestContext.request.http?.headers.get('x-request-id')
            error.extensions.timestamp = new Date().toISOString()
          })
        }
      },
    } as GraphQLRequestListener<Context>
  },
}

/**
 * Simple complexity estimation
 */
function estimateComplexity(document: any): number {
  let complexity = 0

  const visit = (node: any, depth = 0) => {
    if (node.selectionSet) {
      complexity += depth * node.selectionSet.selections.length
      node.selectionSet.selections.forEach((selection: any) => {
        visit(selection, depth + 1)
      })
    }
  }

  document.definitions.forEach((def: any) => {
    if (def.selectionSet) {
      visit(def, 1)
    }
  })

  return complexity
}

/**
 * All plugins combined
 */
export const allPlugins: ApolloServerPlugin<Context>[] = [
  loggingPlugin,
  performancePlugin,
  complexityPlugin,
  cachingPlugin,
  errorFormattingPlugin,
]
