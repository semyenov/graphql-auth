/**
 * Token utilities for context creation
 *
 * Uses the new TokenService for access token verification
 */

import { container } from 'tsyringe'
import { TokenService } from '../../modules/auth/services/token.service'
import type { UserId } from '../value-objects/user-id.vo'

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
