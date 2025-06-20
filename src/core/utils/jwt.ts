import jwt, { type JwtPayload } from 'jsonwebtoken'
import { AUTH, ERROR_MESSAGES } from '../../constants'
import { AuthenticationError } from '../../core/errors/types'

/**
 * JWT payload interface
 */
export interface JWTPayload extends JwtPayload {
  userId: number
  email?: string
}

/**
 * Get JWT secret from environment configuration
 */
function getJwtSecret(): string {
  // Use environment variable directly to avoid circular dependencies
  return process.env.JWT_SECRET || process.env.APP_SECRET || 'your-secret-123'
}

/**
 * Sign a JWT token with user data
 */
export function signToken(payload: { userId: number; email?: string }): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: AUTH.TOKEN_EXPIRY,
    algorithm: AUTH.TOKEN_ALGORITHM,
  })
}

/**
 * Verify and decode a JWT token
 * @throws {AuthenticationError} if token is invalid or expired
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: [AUTH.TOKEN_ALGORITHM],
    }) as JWTPayload

    if (!decoded.userId) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN)
    }

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError(ERROR_MESSAGES.TOKEN_EXPIRED)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN)
    }
    throw error
  }
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1] || null
}

/**
 * Decode token without verification (for debugging)
 * WARNING: Do not use for authentication
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) {
    return true
  }

  return decoded.exp * 1000 < Date.now()
}

/**
 * Get user ID from authorization header
 */
export function getUserIdFromAuthHeader(authHeader: string | undefined): number | null {
  const token = extractBearerToken(authHeader)
  if (!token) {
    return null
  }

  try {
    const payload = verifyToken(token)
    return payload.userId
  } catch {
    return null
  }
}