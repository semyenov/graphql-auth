/**
 * Apollo Server Formatters
 *
 * Response and error formatters for Apollo Server
 */

import type { GraphQLError, GraphQLFormattedError } from 'graphql'
import { BaseError } from '../../core/errors/types'

/**
 * Format GraphQL errors for response
 */
export function formatError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  // Get the original error
  const originalError = (error as GraphQLError).originalError || error

  // Handle our custom errors
  if (originalError instanceof BaseError) {
    return {
      message: originalError.message,
      extensions: {
        code: originalError.code,
        statusCode: originalError.statusCode,
      },
      path: formattedError.path,
      locations: formattedError.locations,
    }
  }

  // Handle Prisma errors
  if (
    originalError &&
    typeof originalError === 'object' &&
    'code' in originalError
  ) {
    const prismaError = originalError as {
      code: string
      meta?: { target?: string }
    }

    if (prismaError.code === 'P2002') {
      return {
        message: 'A record with this value already exists',
        extensions: {
          code: 'DUPLICATE_ERROR',
          statusCode: 409,
          field: prismaError.meta?.target,
        },
        path: formattedError.path,
        locations: formattedError.locations,
      }
    }

    if (prismaError.code === 'P2025') {
      return {
        message: 'Record not found',
        extensions: {
          code: 'NOT_FOUND',
          statusCode: 404,
        },
        path: formattedError.path,
        locations: formattedError.locations,
      }
    }
  }

  // Default formatting
  return {
    message: formattedError.message || 'Internal server error',
    extensions: {
      code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      ...(process.env.NODE_ENV === 'development' && {
        stacktrace: formattedError.extensions?.stacktrace,
      }),
    },
    path: formattedError.path,
    locations: formattedError.locations,
  }
}

/**
 * Format successful response
 */
export function formatResponse(response: unknown): unknown {
  if (typeof response !== 'object' || response === null) {
    return response
  }

  // Add metadata to response
  return {
    ...response,
    extensions: {
      ...(response as { extensions?: Record<string, unknown> }).extensions,
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0.0',
    },
  }
}

/**
 * Sanitize error messages for production
 */
export function sanitizeErrorMessage(message: string): string {
  // Don't expose internal details in production
  if (process.env.NODE_ENV === 'production') {
    // Replace sensitive patterns
    const patterns = [
      /at \S+:\d+:\d+/g, // Stack trace locations
      /\/[\w/\-.]+/g, // File paths
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
    ]

    let sanitized = message
    patterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '[REDACTED]')
    })

    return sanitized
  }

  return message
}

/**
 * Create user-friendly error messages
 */
export function createUserFriendlyMessage(error: GraphQLError): string {
  const code = error.extensions?.code

  switch (code) {
    case 'UNAUTHENTICATED':
      return 'You need to be logged in to perform this action'

    case 'FORBIDDEN':
      return 'You do not have permission to perform this action'

    case 'BAD_USER_INPUT':
      return 'The information you provided is invalid. Please check and try again'

    case 'NOT_FOUND':
      return 'The requested resource could not be found'

    case 'INTERNAL_SERVER_ERROR':
      return 'Something went wrong on our end. Please try again later'

    case 'RATE_LIMITED':
      return 'You are making too many requests. Please slow down and try again'

    default:
      return error.message || 'An unexpected error occurred'
  }
}

/**
 * Extract validation errors from GraphQL error
 */
export function extractValidationErrors(
  error: GraphQLError,
): Record<string, string[]> | null {
  if (error.extensions?.code !== 'BAD_USER_INPUT') {
    return null
  }

  const validationErrors = error.extensions.validationErrors as Record<
    string,
    string[]
  > | null
  if (!validationErrors) {
    return null
  }

  // Transform to field -> errors map
  const fieldErrors: Record<string, string[]> = {}

  if (Array.isArray(validationErrors)) {
    validationErrors.forEach((err: { field: string; message: string }) => {
      const field = err.field || 'general'
      if (!fieldErrors[field]) {
        fieldErrors[field] = []
      }
      fieldErrors[field].push(err.message)
    })
  }

  return fieldErrors
}
