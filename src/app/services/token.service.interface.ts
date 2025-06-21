/**
 * Token Service Interface
 *
 * Defines the contract for JWT token generation and verification.
 */

import type { UserId } from '../../value-objects/user-id.vo'

export interface TokenPayload {
  userId: number
  email: string
  type?: 'access' | 'refresh'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface TokenConfig {
  accessTokenSecret: string
  refreshTokenSecret: string
  accessTokenExpiresIn: string // e.g., '15m'
  refreshTokenExpiresIn: string // e.g., '7d'
}

export interface ITokenService {
  /**
   * Generate both access and refresh tokens for a user.
   *
   * @param payload - The token payload containing user information
   * @returns The generated access and refresh tokens
   */
  generateTokens(user: { id: number; email: string }): Promise<AuthTokens>

  /**
   * Verify an access token and extract the user ID.
   *
   * @param token - The access token to verify
   * @returns The user ID if the token is valid, null otherwise
   */
  verifyAccessToken(token: string): Promise<UserId | null>

  /**
   * Refresh an access token using a refresh token.
   *
   * @param refreshToken - The refresh token to use for refresh
   * @returns The new access token
   */
  refreshTokens(refreshToken: string): Promise<AuthTokens>

  /**
   * Revoke all tokens for a user.
   *
   * @param userId - The user ID to revoke tokens for
   */
  revokeAllTokens(userId: number): Promise<void>
}
