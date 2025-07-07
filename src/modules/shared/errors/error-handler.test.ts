/**
 * Error Handler Tests
 */

import { describe, expect, it } from 'vitest'
import {
  createErrorResponse,
  handleAuthError,
  handleDatabaseError,
  handleGraphQLError,
  hasErrorCode,
  isBaseError,
  normalizeError,
  shouldReportError,
} from '@/app/errors/handlers'
import {
  AuthenticationError,
  AuthorizationError,
  BaseError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/app/errors/types'

describe('Error Handlers', () => {
  describe('isBaseError', () => {
    it('should return true for BaseError instances', () => {
      const error = new BaseError('Test error', 'TEST_CODE')
      expect(isBaseError(error)).toBe(true)
    })

    it('should return false for non-BaseError instances', () => {
      expect(isBaseError(new Error('Regular error'))).toBe(false)
      expect(isBaseError({ message: 'Not an error' })).toBe(false)
      expect(isBaseError(null)).toBe(false)
    })
  })

  describe('hasErrorCode', () => {
    it('should return true for objects with code and message', () => {
      expect(hasErrorCode({ code: 'P2002', message: 'Error' })).toBe(true)
    })

    it('should return false for objects without required properties', () => {
      expect(hasErrorCode({ message: 'No code' })).toBe(false)
      expect(hasErrorCode({ code: 'No message' })).toBe(false)
      expect(hasErrorCode(null)).toBe(false)
      expect(hasErrorCode('string')).toBe(false)
    })
  })

  describe('normalizeError', () => {
    it('should return BaseError instances as-is', () => {
      const error = new AuthenticationError('Test')
      expect(normalizeError(error)).toBe(error)
    })

    it('should convert Prisma P2002 error to ConflictError', () => {
      const error = Object.assign(new Error('Unique constraint'), {
        code: 'P2002',
      })
      const result = normalizeError(error)
      expect(result).toBeInstanceOf(ConflictError)
      expect(result.message).toBe('A record with this value already exists')
    })

    it('should convert Prisma P2025 error to NotFoundError', () => {
      const error = Object.assign(new Error('Record not found'), {
        code: 'P2025',
      })
      const result = normalizeError(error)
      expect(result).toBeInstanceOf(NotFoundError)
      expect(result.message).toBe('Record not found')
    })

    it('should handle domain-specific errors', () => {
      const error = new Error('Access denied')
      error.name = 'UnauthorizedPostAccessError'
      const result = normalizeError(error)
      expect(result).toBeInstanceOf(AuthorizationError)
    })

    it('should convert unknown objects to BaseError', () => {
      const result = normalizeError({ weird: 'object' })
      expect(result).toBeInstanceOf(BaseError)
      expect(result.message).toBe('An unexpected error occurred')
      expect(result.code).toBe('UNKNOWN_ERROR')
    })
  })

  describe('handleGraphQLError', () => {
    it('should handle syntax errors', () => {
      const error = new Error('GraphQL syntax error at line 1')
      const result = handleGraphQLError(error)
      expect(result).toBeInstanceOf(BaseError)
      expect(result.message).toBe('Invalid GraphQL syntax')
      expect(result.code).toBe('GRAPHQL_SYNTAX_ERROR')
    })

    it('should handle validation errors', () => {
      const error = new Error('ValidationError: Field required')
      const result = handleGraphQLError(error)
      expect(result).toBeInstanceOf(BaseError)
    })

    it('should normalize other errors', () => {
      const error = new Error('Some error')
      const result = handleGraphQLError(error)
      expect(result).toBeInstanceOf(BaseError)
      expect(result.message).toBe('Some error')
    })
  })

  describe('handleAuthError', () => {
    it('should handle JWT expired errors', () => {
      const error = new Error('jwt expired')
      const result = handleAuthError(error)
      expect(result.message).toBe('Token has expired')
      expect(result.code).toBe('TOKEN_EXPIRED')
    })

    it('should handle JWT malformed errors', () => {
      const error = new Error('jwt malformed')
      const result = handleAuthError(error)
      expect(result.message).toBe('Invalid token format')
      expect(result.code).toBe('TOKEN_MALFORMED')
    })

    it('should handle invalid signature errors', () => {
      const error = new Error('invalid signature')
      const result = handleAuthError(error)
      expect(result.message).toBe('Token signature is invalid')
      expect(result.code).toBe('TOKEN_INVALID_SIGNATURE')
    })
  })

  describe('handleDatabaseError', () => {
    it('should handle P2000 value too long', () => {
      const error = Object.assign(new Error('Value too long'), {
        code: 'P2000',
      })
      const result = handleDatabaseError(error)
      expect(result.message).toBe('The provided value is too long')
      expect(result.code).toBe('VALUE_TOO_LONG')
    })

    it('should handle P2003 foreign key violation', () => {
      const error = Object.assign(new Error('FK violation'), {
        code: 'P2003',
      })
      const result = handleDatabaseError(error)
      expect(result.message).toBe('Foreign key constraint violation')
      expect(result.code).toBe('FOREIGN_KEY_VIOLATION')
    })

    it('should handle unknown database errors', () => {
      const error = Object.assign(new Error('DB error'), {
        code: 'P9999',
      })
      const result = handleDatabaseError(error)
      expect(result.message).toBe('Database error: DB error')
      expect(result.code).toBe('DB_P9999')
    })
  })

  describe('createErrorResponse', () => {
    it('should create formatted error response', () => {
      const error = new BaseError('Test error', 'TEST_CODE', 400)
      const response = createErrorResponse(error)

      expect(response.message).toBe('Test error')
      expect(response.code).toBe('TEST_CODE')
      expect(response.statusCode).toBe(400)
      expect(response.extensions).toMatchObject({
        code: 'TEST_CODE',
        statusCode: 400,
      })
      expect(response.extensions.timestamp).toBeDefined()
    })
  })

  describe('shouldReportError', () => {
    it('should not report user errors', () => {
      expect(shouldReportError(new ValidationError(['Invalid input']))).toBe(
        false,
      )
      expect(shouldReportError(new AuthenticationError('Unauth'))).toBe(false)
      expect(shouldReportError(new ForbiddenError('Forbidden'))).toBe(false)
      expect(shouldReportError(new NotFoundError('Post'))).toBe(false)
    })

    it('should report internal errors', () => {
      const error = new BaseError('Internal error', 'INTERNAL_ERROR', 500)
      expect(shouldReportError(error)).toBe(true)
    })
  })
})
