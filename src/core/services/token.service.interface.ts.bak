/**
 * Token Service Interface
 * 
 * Defines the contract for JWT token generation and verification.
 */

import { UserId } from '../value-objects/user-id.vo'

export interface TokenPayload {
  userId: number
  email: string
}

export interface ITokenService {
  /**
   * Generate a JWT token for a user.
   * 
   * @param payload - The token payload containing user information
   * @returns The generated JWT token
   */
  generateToken(payload: TokenPayload): Promise<string>

  /**
   * Verify a JWT token and extract the user ID.
   * 
   * @param token - The JWT token to verify
   * @returns The user ID if the token is valid, null otherwise
   */
  verifyToken(token: string): Promise<UserId | null>
}