/**
 * Core Error Handlers
 *
 * Error handling utilities and error conversion functions following the
 * IMPROVED-FILE-STRUCTURE.md specification.
 */

import {
  AuthorizationError,
  BaseError,
  ConflictError,
  NotFoundError,
} from './types'

/**
 * Type guard to check if error is a BaseError
 */
export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError
}

/**
 * Type guard to check if error has a code property
 */
export function hasErrorCode(
  error: unknown,
): error is { code: string; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  )
}

/**
 * Convert unknown errors to BaseError instances
 */
export function normalizeError(error: unknown): BaseError {
  if (isBaseError(error)) {
    return error
  }

  if (error instanceof Error) {
    // Check for domain-specific errors
    if (error.name === 'UnauthorizedPostAccessError') {
      return new AuthorizationError(error.message)
    }

    if (error.name === 'PostNotFoundError') {
      return new NotFoundError('Post', error.message)
    }

    // Check for Prisma errors
    if (hasErrorCode(error)) {
      switch (error.code) {
        case 'P2002':
          return new ConflictError('A record with this value already exists')
        case 'P2025':
          return new NotFoundError('Record')
        default:
          return new BaseError(error.message, error.code)
      }
    }

    return new BaseError(error.message, 'INTERNAL_ERROR', 500)
  }

  return new BaseError('An unexpected error occurred', 'UNKNOWN_ERROR', 500)
}

/**
 * Handle GraphQL errors and convert them to appropriate types
 */
export function handleGraphQLError(error: unknown): BaseError {
  const normalized = normalizeError(error)

  // Add GraphQL-specific error handling
  if (error instanceof Error) {
    if (error.message.includes('ValidationError')) {
      // Handle validation errors from GraphQL
      return normalized
    }

    if (error.message.includes('syntax error')) {
      return new BaseError(
        'Invalid GraphQL syntax',
        'GRAPHQL_SYNTAX_ERROR',
        400,
      )
    }
  }

  return normalized
}

/**
 * Handle authentication errors specifically
 */
export function handleAuthError(error: unknown): BaseError {
  const normalized = normalizeError(error)

  if (error instanceof Error) {
    // JWT-specific errors
    if (error.message.includes('jwt expired')) {
      return new BaseError('Token has expired', 'TOKEN_EXPIRED', 401)
    }

    if (error.message.includes('jwt malformed')) {
      return new BaseError('Invalid token format', 'TOKEN_MALFORMED', 401)
    }

    if (error.message.includes('invalid signature')) {
      return new BaseError(
        'Token signature is invalid',
        'TOKEN_INVALID_SIGNATURE',
        401,
      )
    }
  }

  return normalized
}

/**
 * Handle database errors and convert them to appropriate types
 */
export function handleDatabaseError(error: unknown): BaseError {
  if (hasErrorCode(error)) {
    switch (error.code) {
      case 'P2000':
        return new BaseError(
          'The provided value is too long',
          'VALUE_TOO_LONG',
          400,
        )
      case 'P2001':
        return new NotFoundError('Record')
      case 'P2002':
        return new ConflictError('Unique constraint violation')
      case 'P2003':
        return new BaseError(
          'Foreign key constraint violation',
          'FOREIGN_KEY_VIOLATION',
          400,
        )
      case 'P2004':
        return new BaseError(
          'Database constraint violation',
          'CONSTRAINT_VIOLATION',
          400,
        )
      case 'P2025':
        return new NotFoundError('Record')
      default:
        return new BaseError(
          `Database error: ${error.message}`,
          `DB_${error.code}`,
          500,
        )
    }
  }

  return normalizeError(error)
}

/**
 * Handle rate limiting errors
 */
export function handleRateLimitError(
  error: unknown,
  retryAfter?: number,
): BaseError {
  if (error instanceof Error) {
    const rateLimitError = new BaseError(
      error.message,
      'RATE_LIMIT_EXCEEDED',
      429,
    )
    if (retryAfter) {
      // Add retryAfter to the error object
      Object.defineProperty(rateLimitError, 'retryAfter', {
        value: retryAfter,
        enumerable: true,
      })
    }
    return rateLimitError
  }

  return normalizeError(error)
}

/**
 * Create error response for GraphQL
 */
export function createErrorResponse(error: BaseError) {
  return {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    extensions: {
      code: error.code,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    },
  }
}

/**
 * Log error with context information
 */
export function logError(error: BaseError, context?: Record<string, unknown>) {
  const errorInfo = {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  }

  // In a real implementation, you would use your logger service here
  console.error('Application Error:', errorInfo)
}

/**
 * Check if error should be reported to external monitoring
 */
export function shouldReportError(error: BaseError): boolean {
  // Don't report validation errors and user errors
  const ignoredCodes = [
    'VALIDATION_ERROR',
    'UNAUTHENTICATED',
    'FORBIDDEN',
    'NOT_FOUND',
    'CONFLICT',
    'RATE_LIMIT_EXCEEDED',
  ]

  return !ignoredCodes.includes(error.code)
}
