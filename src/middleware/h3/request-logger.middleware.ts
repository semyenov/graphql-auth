/**
 * H3 Request Logger Middleware
 *
 * Logs HTTP requests with timing and status information
 */

import { defineEventHandler, getHeaders, getRequestIP, readBody } from 'h3'
import { container } from '../../app/config/container'
import type { ILogger } from '../../app/services/logger.interface'

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

/**
 * Create request logger middleware
 */
export function createRequestLoggerMiddleware() {
  return defineEventHandler(async (event) => {
    const startTime = Date.now()
    const logger = container.resolve<ILogger>('ILogger')

    // Skip logging for health checks
    if (event.path === '/health') {
      return
    }

    // Capture request info
    const method = event.method
    const path = event.path
    const ip = getRequestIP(event) || 'unknown'
    const userAgent = getHeaders(event)['user-agent'] || 'unknown'
    const requestId = getHeaders(event)['x-request-id'] || `req_${Date.now()}`

    // Log request start
    logger.info('Incoming request', {
      requestId,
      method,
      path,
      ip,
      userAgent,
    })

    // Hook into response to log completion
    const originalEnd = event.node.res.end
    event.node.res.end = function (...args: unknown[]) {
      const duration = Date.now() - startTime
      const statusCode = event.node.res.statusCode
      const contentLength = event.node.res.getHeader('content-length')

      // Determine log level based on status code
      const logData = {
        requestId,
        method,
        path,
        statusCode,
        duration: `${duration}ms`,
        ip,
        ...(contentLength && { size: formatBytes(Number(contentLength)) }),
      }

      if (statusCode >= 500) {
        logger.error('Request failed', undefined, logData)
      } else if (statusCode >= 400) {
        logger.warn('Client error', logData)
      } else {
        logger.info('Request completed', logData)
      }

      // Call original end method
      // @ts-ignore - args spread is valid
      return originalEnd.apply(this, args)
    }

    // Add request ID to response headers for tracing
    event.node.res.setHeader('X-Request-ID', requestId)
  })
}

/**
 * Create GraphQL-specific request logger
 */
export function createGraphQLLoggerMiddleware() {
  return defineEventHandler(async (event) => {
    // Only log GraphQL requests
    if (!event.path.includes('/graphql')) {
      return
    }

    const logger = container.resolve<ILogger>('ILogger')
    const startTime = Date.now()

    // Try to extract operation info from request
    if (event.method === 'POST') {
      try {
        const body = await readBody(event).catch(() => null)
        if (body?.operationName || body?.query) {
          const requestId =
            getHeaders(event)['x-request-id'] || `gql_${Date.now()}`

          logger.info('GraphQL operation', {
            requestId,
            operationName: body.operationName || 'anonymous',
            variables: body.variables ? Object.keys(body.variables) : [],
            hasQuery: !!body.query,
          })

          // Log completion
          const originalEnd = event.node.res.end
          event.node.res.end = function (...args: unknown[]) {
            const duration = Date.now() - startTime

            logger.info('GraphQL operation completed', {
              requestId,
              operationName: body.operationName || 'anonymous',
              duration: `${duration}ms`,
            })

            // @ts-ignore - args spread is valid
            return originalEnd.apply(this, args)
          }
        }
      } catch (_error) {
        // Ignore parsing errors
      }
    }
  })
}
