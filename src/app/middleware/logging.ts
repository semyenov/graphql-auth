/**
 * Logging middleware
 * Provides request/response logging for HTTP and GraphQL operations
 */

import type { ApolloServerPlugin } from '@apollo/server'
import { createLogger } from '../../core/logging'
import type { Context } from '../../graphql/context/context.types'

const logger = createLogger('middleware')

/**
 * HTTP request logging middleware
 */
export function createHttpLoggingMiddleware() {
  return async (req: any, res: any, next: () => Promise<void>) => {
    const start = Date.now()
    const method = req.method
    const url = req.url

    // Log request
    logger.info('HTTP Request', {
      method,
      url,
      headers: req.headers,
      ip: req.ip || req.connection?.remoteAddress,
    })

    // Intercept response
    const originalSend = res.send
    res.send = function (data: any) {
      const duration = Date.now() - start

      // Log response
      logger.info('HTTP Response', {
        method,
        url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      })

      return originalSend.call(this, data)
    }

    await next()
  }
}

/**
 * GraphQL operation logging plugin
 */
export function createGraphQLLoggingPlugin(): ApolloServerPlugin<Context> {
  return {
    async requestDidStart() {
      return {
        async willSendResponse(requestContext) {
          const { request, response, contextValue } = requestContext
          const duration = Date.now() - (contextValue.metadata?.startTime || 0)

          // Log GraphQL operation
          logger.info('GraphQL Operation', {
            operationName: request.operationName,
            query: request.query,
            variables: request.variables,
            duration: `${duration}ms`,
            errors: response.body.kind === 'single' ? response.body.singleResult.errors : undefined,
            userId: contextValue.userId?.value,
          })
        },

        async didEncounterErrors(requestContext) {
          const { errors, contextValue } = requestContext

          // Log GraphQL errors
          logger.error('GraphQL Errors', errors[0], {
            allErrors: errors.map(err => ({
              message: err.message,
              path: err.path,
              extensions: err.extensions,
            })),
            userId: contextValue.userId?.value,
          })
        },
      }
    },
  }
}

/**
 * Performance logging middleware
 */
export function createPerformanceLoggingMiddleware() {
  return async (req: any, res: any, next: () => Promise<void>) => {
    const start = process.hrtime()

    // Add performance tracking
    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(start)
      const duration = seconds * 1000 + nanoseconds / 1000000

      if (duration > 1000) {
        logger.warn('Slow Request', {
          method: req.method,
          url: req.url,
          duration: `${duration.toFixed(2)}ms`,
        })
      }
    })

    await next()
  }
}