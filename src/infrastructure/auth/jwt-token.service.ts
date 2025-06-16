/**
 * JWT Token Service Implementation
 * 
 * Implements JWT token generation and verification.
 */

import * as jwt from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { ITokenService, TokenPayload } from '../../core/services/token.service.interface'
import { UserId } from '../../core/value-objects/user-id.vo'
import type { AuthConfig } from './jwt-auth.service'

@injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    @inject('AuthConfig') private config: AuthConfig
  ) { }

  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresIn,
      algorithm: 'HS256',
      issuer: 'blog-api',
      audience: 'blog-api',
    })
  }

  async verifyToken(token: string): Promise<UserId | null> {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as TokenPayload
      return UserId.create(decoded.userId)
    } catch {
      return null
    }
  }
}