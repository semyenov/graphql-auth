/**
 * JWT Utilities Tests
 */

import jwt from 'jsonwebtoken'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AUTH, ERROR_MESSAGES } from '../app/constants'
import { AuthenticationError } from '../app/errors/types'
import {
  decodeToken,
  extractBearerToken,
  getUserIdFromAuthHeader,
  isTokenExpired,
  signToken,
  verifyToken,
} from './jwt'

describe('JWT Utilities', () => {
  const originalEnv = process.env
  const mockSecret = 'test-secret-key'

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, JWT_SECRET: mockSecret }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('signToken', () => {
    it('should sign a token with userId', () => {
      const payload = { userId: 123 }
      const token = signToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')

      // Verify the token contains correct data
      const decoded = jwt.verify(token, mockSecret) as jwt.JwtPayload
      expect(decoded.userId).toBe(123)
    })

    it('should sign a token with userId and email', () => {
      const payload = { userId: 456, email: 'test@example.com' }
      const token = signToken(payload)

      const decoded = jwt.verify(token, mockSecret) as jwt.JwtPayload
      expect(decoded.userId).toBe(456)
      expect(decoded.email).toBe('test@example.com')
    })

    it('should use correct algorithm and expiry', () => {
      const payload = { userId: 789 }
      const token = signToken(payload)

      const decoded = jwt.decode(token, { complete: true }) as jwt.Jwt
      expect(decoded.header.alg).toBe(AUTH.TOKEN_ALGORITHM)

      // Check expiry is set
      const decodedPayload = decoded.payload
      if (typeof decodedPayload === 'object' && decodedPayload !== null) {
        expect(decodedPayload.exp).toBeDefined()
        expect(decodedPayload.iat).toBeDefined()
      }
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { userId: 123, email: 'test@example.com' }
      const token = jwt.sign(payload, mockSecret, {
        algorithm: AUTH.TOKEN_ALGORITHM,
      })

      const result = verifyToken(token)

      expect(result.userId).toBe(123)
      expect(result.email).toBe('test@example.com')
    })

    it('should throw AuthenticationError for expired token', () => {
      const payload = { userId: 123 }
      const token = jwt.sign(payload, mockSecret, {
        algorithm: AUTH.TOKEN_ALGORITHM,
        expiresIn: '-1s',
      })

      expect(() => verifyToken(token)).toThrow(AuthenticationError)
      expect(() => verifyToken(token)).toThrow(ERROR_MESSAGES.TOKEN_EXPIRED)
    })

    it('should throw AuthenticationError for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow(AuthenticationError)
      expect(() => verifyToken('invalid-token')).toThrow(
        ERROR_MESSAGES.INVALID_TOKEN,
      )
    })

    it('should throw AuthenticationError for token without userId', () => {
      const token = jwt.sign({ email: 'test@example.com' }, mockSecret, {
        algorithm: AUTH.TOKEN_ALGORITHM,
      })

      expect(() => verifyToken(token)).toThrow(AuthenticationError)
      expect(() => verifyToken(token)).toThrow(ERROR_MESSAGES.INVALID_TOKEN)
    })

    it('should throw AuthenticationError for wrong algorithm', () => {
      const token = jwt.sign({ userId: 123 }, mockSecret, {
        algorithm: 'HS512' as jwt.Algorithm, // Different algorithm
      })

      expect(() => verifyToken(token)).toThrow(AuthenticationError)
      expect(() => verifyToken(token)).toThrow(ERROR_MESSAGES.INVALID_TOKEN)
    })

    it('should re-throw non-JWT errors', () => {
      // Mock jwt.verify to throw a different error
      const originalVerify = jwt.verify
      const customError = new Error('Custom error')
      jwt.verify = vi.fn().mockImplementation(() => {
        throw customError
      })

      expect(() => verifyToken('some-token')).toThrow(customError)

      jwt.verify = originalVerify
    })
  })

  describe('extractBearerToken', () => {
    it('should extract token from valid Bearer header', () => {
      const token = extractBearerToken('Bearer abc123')
      expect(token).toBe('abc123')
    })

    it('should return null for missing header', () => {
      expect(extractBearerToken(undefined)).toBeNull()
    })

    it('should return null for empty header', () => {
      expect(extractBearerToken('')).toBeNull()
    })

    it('should return null for non-Bearer header', () => {
      expect(extractBearerToken('Basic abc123')).toBeNull()
    })

    it('should return null for malformed header', () => {
      expect(extractBearerToken('Bearer')).toBeNull()
      expect(extractBearerToken('Bearer ')).toBeNull()
      expect(extractBearerToken('Bearer  ')).toBeNull()
    })

    it('should handle headers with extra spaces', () => {
      expect(extractBearerToken('Bearer  abc123')).toBeNull() // Too many parts
    })
  })

  describe('decodeToken', () => {
    it('should decode valid token without verification', () => {
      const payload = { userId: 123, email: 'test@example.com' }
      const token = jwt.sign(payload, 'any-secret')

      const decoded = decodeToken(token)

      expect(decoded?.userId).toBe(123)
      expect(decoded?.email).toBe('test@example.com')
    })

    it('should return null for invalid token', () => {
      expect(decodeToken('invalid-token')).toBeNull()
    })

    it('should return null for empty string', () => {
      expect(decodeToken('')).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false for valid unexpired token', () => {
      const token = jwt.sign({ userId: 123 }, mockSecret, { expiresIn: '1h' })
      expect(isTokenExpired(token)).toBe(false)
    })

    it('should return true for expired token', () => {
      const token = jwt.sign({ userId: 123 }, mockSecret, {
        expiresIn: '-1s',
      })
      expect(isTokenExpired(token)).toBe(true)
    })

    it('should return true for token without exp claim', () => {
      const token = jwt.sign({ userId: 123 }, mockSecret, { noTimestamp: true })
      expect(isTokenExpired(token)).toBe(true)
    })

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true)
    })

    it('should handle tokens with exp in the future correctly', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      const token = jwt.sign({ userId: 123, exp: futureExp }, mockSecret, {
        noTimestamp: true,
      })
      expect(isTokenExpired(token)).toBe(false)
    })
  })

  describe('getUserIdFromAuthHeader', () => {
    it('should extract userId from valid auth header', () => {
      const token = jwt.sign({ userId: 789 }, mockSecret, {
        algorithm: AUTH.TOKEN_ALGORITHM,
      })
      const authHeader = `Bearer ${token}`

      const userId = getUserIdFromAuthHeader(authHeader)

      expect(userId).toBe(789)
    })

    it('should return null for missing header', () => {
      expect(getUserIdFromAuthHeader(undefined)).toBeNull()
    })

    it('should return null for invalid Bearer format', () => {
      expect(getUserIdFromAuthHeader('InvalidFormat')).toBeNull()
    })

    it('should return null for invalid token', () => {
      expect(getUserIdFromAuthHeader('Bearer invalid-token')).toBeNull()
    })

    it('should return null for expired token', () => {
      const token = jwt.sign({ userId: 123 }, mockSecret, {
        algorithm: AUTH.TOKEN_ALGORITHM,
        expiresIn: '-1s',
      })
      const authHeader = `Bearer ${token}`

      expect(getUserIdFromAuthHeader(authHeader)).toBeNull()
    })
  })

  describe('JWT secret fallback', () => {
    it('should use JWT_SECRET when available', () => {
      process.env.JWT_SECRET = 'jwt-secret'
      const token = signToken({ userId: 123 })
      const decoded = jwt.verify(token, 'jwt-secret') as jwt.JwtPayload
      expect(decoded.userId).toBe(123)
    })

    it('should fall back to APP_SECRET when JWT_SECRET is not set', () => {
      process.env.JWT_SECRET = undefined
      process.env.APP_SECRET = 'app-secret'
      const token = signToken({ userId: 456 })
      const decoded = jwt.verify(token, 'app-secret') as jwt.JwtPayload
      expect(decoded.userId).toBe(456)
    })

    it('should use default secret when neither is set', () => {
      process.env.JWT_SECRET = undefined
      process.env.APP_SECRET = undefined
      const token = signToken({ userId: 789 })
      const decoded = jwt.verify(token, 'your-secret-123') as jwt.JwtPayload
      expect(decoded.userId).toBe(789)
    })
  })
})
