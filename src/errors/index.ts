/**
 * Custom error classes for better error handling and type safety
 */

/**
 * Base error class for all application errors
 * 
 * @example
 * ```typescript
 * throw new BaseError('Something went wrong', 'INTERNAL_ERROR', 500)
 * ```
 */
export class BaseError extends Error {
  /**
   * Creates a new BaseError instance
   * 
   * @param message - Human-readable error message
   * @param code - Machine-readable error code (e.g., 'UNAUTHENTICATED')
   * @param statusCode - HTTP status code (defaults to 400)
   */
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Serializes the error to a JSON-friendly format
   * 
   * @returns Object with error details
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    }
  }
}

/**
 * Thrown when authentication is required but not provided
 */
export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHENTICATED', 401)
  }
}

/**
 * Thrown when user lacks permissions for an operation
 */
export class AuthorizationError extends BaseError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'FORBIDDEN', 403)
  }
}

/**
 * Thrown when input validation fails
 */
export class ValidationError extends BaseError {
  constructor(
    public readonly errors: Record<string, string[]> | string[],
    message?: string,
  ) {
    const errorMessage =
      message ||
      (Array.isArray(errors)
        ? errors.join(', ')
        : Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; '))

    super(errorMessage, 'VALIDATION_ERROR', 400)
  }
}

/**
 * Thrown when requested resource is not found
 */
export class NotFoundError extends BaseError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`
    super(message, 'NOT_FOUND', 404)
  }
}

/**
 * Thrown when an operation conflicts with existing data
 */
export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}

/**
 * Thrown when rate limit is exceeded
 */
export class RateLimitError extends BaseError {
  constructor(
    message = 'Too many requests',
    public readonly retryAfter?: number,
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429)
  }
}

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
    // Check for Prisma errors
    if (hasErrorCode(error)) {
      switch (error.code) {
        case 'P2002':
          return new ConflictError(
            'A record with this value already exists',
          )
        case 'P2025':
          return new NotFoundError('Record')
        default:
          return new BaseError(error.message, error.code)
      }
    }

    return new BaseError(error.message, 'INTERNAL_ERROR', 500)
  }

  return new BaseError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500,
  )
}