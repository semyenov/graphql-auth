/**
 * GraphQL Context Authentication Helpers
 *
 * Authentication-related utilities for GraphQL context creation following the
 * IMPROVED-FILE-STRUCTURE.md specification.
 */

import { container } from 'tsyringe'
import { ERROR_MESSAGES } from '../../app/constants'
import { AuthenticationError } from '../../app/errors/types'
import { TokenService } from '../../modules/auth/services/token.service'
import type { UserId } from '../../value-objects/user-id.vo'

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(
  authHeader: string | undefined,
): string | null {
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
 * Get user ID from authorization header using TokenService
 */
export async function getUserIdFromAuthHeaderAsync(
  authHeader: string | undefined,
): Promise<UserId | null> {
  const token = extractBearerToken(authHeader)
  if (!token) {
    return null
  }

  try {
    const tokenService = container.resolve(TokenService)
    return await tokenService.verifyAccessToken(token)
  } catch {
    return null
  }
}

/**
 * Check if the current user is authenticated
 */
export function isAuthenticated(userId?: UserId): boolean {
  return Boolean(userId)
}

/**
 * Require authentication and throw error if not authenticated
 */
export function requireAuthentication(userId?: UserId): UserId {
  if (!userId) {
    throw new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED)
  }
  return userId
}

/**
 * Get user role from context (placeholder for future role-based auth)
 */
export function getUserRole(userId?: UserId): string {
  // Placeholder - in a real implementation, you would fetch the user's role
  // from the database or decode it from the JWT token
  return userId ? 'user' : 'anonymous'
}

/**
 * Check if user has specific permission (placeholder for future RBAC)
 */
export function hasPermission(userId?: UserId, permission?: string): boolean {
  // Placeholder - in a real implementation, you would check user permissions
  // against a permission system
  if (!(userId && permission)) {
    return false
  }

  // For now, authenticated users have basic permissions
  const basicPermissions = [
    'read:posts',
    'create:posts',
    'update:own_posts',
    'delete:own_posts',
  ]
  return basicPermissions.includes(permission)
}

/**
 * Create authentication metadata for logging and monitoring
 */
export function createAuthMetadata(userId?: UserId) {
  return {
    isAuthenticated: Boolean(userId),
    userId: userId?.value,
    userRole: getUserRole(userId),
    timestamp: new Date().toISOString(),
  }
}
