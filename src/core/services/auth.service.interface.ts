/**
 * Authentication Service Interface
 * 
 * Defines authentication-related operations.
 */

import { UserId } from '../value-objects/user-id.vo'

export interface IAuthService {
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hash: string): Promise<boolean>
  generateToken(userId: UserId): Promise<string>
  verifyToken(token: string): Promise<UserId | null>
}