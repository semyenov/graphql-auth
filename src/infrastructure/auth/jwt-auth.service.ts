/**
 * JWT Authentication Service
 * 
 * Implements authentication using JWT tokens and bcrypt.
 */

import bcrypt from 'bcryptjs'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { IAuthService } from '../../core/services/auth.service.interface'
import { UserId } from '../../core/value-objects/user-id.vo'

export interface AuthConfig {
  jwtSecret: Secret
  jwtExpiresIn: string
  bcryptRounds: number
}

@injectable()
export class JwtAuthService implements IAuthService {
  constructor(
    @inject('AuthConfig') private config: AuthConfig,
  ) { }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.bcryptRounds)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  async generateToken(userId: UserId): Promise<string> {
    const payload = {
      userId: userId.value,
      iat: Date.now(),
    }

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresIn,
    })
  }

  async verifyToken(token: string): Promise<UserId | null> {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as JwtPayload

      if (decoded.userId) {
        return UserId.create(decoded.userId)
      }

      return null
    } catch (error) {
      return null
    }
  }
}