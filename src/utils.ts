import { compare, hash } from 'bcryptjs'
import { sign, verify, type JwtPayload } from 'jsonwebtoken'
import type { Context } from './context'
import { env } from './environment'
import type { AppError, JWTPayload, Result, User } from './types'
import { ErrorCode } from './types'
import { createAppError } from './validation'

// Security constants
export const SALT_ROUNDS = 12
export const TOKEN_EXPIRY = '7d'
export const REFRESH_TOKEN_EXPIRY = '30d'

// JWT token management with proper error handling
export async function generateTokens(
  userId: number,
  email: string,
): Promise<{
  accessToken: string
  refreshToken: string
}> {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: userId.toString(),
    email,
  }

  const accessToken = sign(payload, env.APP_SECRET, {
    expiresIn: TOKEN_EXPIRY,
    issuer: 'graphql-auth',
    audience: 'graphql-api',
  })

  const refreshToken = sign(payload, env.APP_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'graphql-auth',
    audience: 'graphql-refresh',
  })

  return { accessToken, refreshToken }
}

export function getUserId(context: Context): number | null {
  try {
    if (!context.req.headers.authorization) {
      return null
    }

    const authHeader = context.req.headers.authorization
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) {
      return null
    }

    const verifiedToken = verify(token, env.APP_SECRET, {
      issuer: 'graphql-auth',
      audience: 'graphql-api',
    }) as JwtPayload & JWTPayload

    if (!verifiedToken || !verifiedToken.userId) {
      return null
    }

    const userId = parseInt(verifiedToken.userId, 10)
    return isNaN(userId) ? null : userId
  } catch (error) {
    // Log the error for debugging but don't expose it
    console.error(
      'Token verification failed:',
      error instanceof Error ? error.message : 'Unknown error',
    )
    return null
  }
}

// Enhanced user authentication with proper error handling
export async function authenticateUser(
  email: string,
  password: string,
  getUserByEmail: (
    email: string,
  ) => Promise<(User & { password: string }) | null>,
): Promise<
  Result<
    { user: User; tokens: { accessToken: string; refreshToken: string } },
    AppError
  >
> {
  try {
    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: createAppError(
          ErrorCode.VALIDATION_ERROR,
          'Email and password are required',
        ),
      }
    }

    // Get user from database
    const userWithPassword = await getUserByEmail(email.toLowerCase().trim())
    if (!userWithPassword) {
      return {
        success: false,
        error: createAppError(
          ErrorCode.AUTHENTICATION_ERROR,
          'Invalid credentials',
        ),
      }
    }

    // Verify password
    const isValidPassword = await compare(password, userWithPassword.password)
    if (!isValidPassword) {
      return {
        success: false,
        error: createAppError(
          ErrorCode.AUTHENTICATION_ERROR,
          'Invalid credentials',
        ),
      }
    }

    // Remove password from user object
    const { password: _, ...user } = userWithPassword

    // Generate tokens
    const tokens = await generateTokens(user.id, user.email)

    return {
      success: true,
      data: { user, tokens },
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: createAppError(ErrorCode.INTERNAL_ERROR, 'Authentication failed'),
    }
  }
}

// Enhanced password hashing with proper error handling
export async function hashPassword(
  password: string,
): Promise<Result<string, AppError>> {
  try {
    if (!password || password.length < 8) {
      return {
        success: false,
        error: createAppError(
          ErrorCode.VALIDATION_ERROR,
          'Password must be at least 8 characters',
        ),
      }
    }

    const hashedPassword = await hash(password, SALT_ROUNDS)
    return { success: true, data: hashedPassword }
  } catch (error) {
    console.error('Password hashing error:', error)
    return {
      success: false,
      error: createAppError(
        ErrorCode.INTERNAL_ERROR,
        'Password hashing failed',
      ),
    }
  }
}

// Enhanced authorization helpers
export function requireAuth(context: Context): Result<number, AppError> {
  const userId = getUserId(context)

  if (!userId) {
    return {
      success: false,
      error: createAppError(
        ErrorCode.AUTHENTICATION_ERROR,
        'Authentication required',
      ),
    }
  }

  return { success: true, data: userId }
}

export function requireOwnership(
  context: Context,
  resourceUserId: number | null | undefined,
): Result<number, AppError> {
  const authResult = requireAuth(context)
  if (!authResult.success) {
    return authResult
  }

  if (!resourceUserId || authResult.data !== resourceUserId) {
    return {
      success: false,
      error: createAppError(ErrorCode.AUTHORIZATION_ERROR, 'Access denied'),
    }
  }

  return authResult
}

// Utility functions for data validation and sanitization
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function sanitizeString(input: string, maxLength = 1000): string {
  return input.trim().substring(0, maxLength)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Request metadata helpers
export function extractRequestMetadata(context: Context): {
  ip?: string
  userAgent?: string
  contentType?: string
} {
  const headers = context.req.headers

  return {
    ip: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
    userAgent: headers['user-agent'] || 'unknown',
    contentType: headers['content-type'] || 'unknown',
  }
}

// Error formatting for GraphQL
export function formatGraphQLError(error: AppError): {
  message: string
  code: string
  field?: string
  timestamp: string
} {
  return {
    message: error.message,
    code: error.code,
    field: error.field,
    timestamp: new Date().toISOString(),
  }
}

// Rate limiting helpers (placeholder for future implementation)
export function createRateLimitKey(
  context: Context,
  operation: string,
): string {
  const userId = getUserId(context)
  const metadata = extractRequestMetadata(context)

  return userId
    ? `user:${userId}:${operation}`
    : `ip:${metadata.ip}:${operation}`
}

// Logging helpers
export function createLogContext(
  context: Context,
  operation?: string,
): {
  userId?: number
  operation?: string
  ip?: string
  userAgent?: string
  timestamp: string
} {
  const userId = getUserId(context)
  const metadata = extractRequestMetadata(context)

  return {
    userId: userId || undefined,
    operation,
    ip: metadata.ip,
    userAgent: metadata.userAgent,
    timestamp: new Date().toISOString(),
  }
}
