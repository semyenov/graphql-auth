/**
 * Enhanced Token Service
 *
 * Handles both access and refresh tokens
 */

import { randomBytes } from 'crypto'
import * as jwt from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { AuthenticationError } from '../../../app/errors/types'
import type {
  AuthTokens,
  ITokenConfig,
  ITokenService,
  TokenPayload,
} from '../../../app/services/token.service.interface'
import { RefreshToken } from '../entities/refresh-token.entity'
import type { IRefreshTokenRepository } from '../interfaces/refresh-token.repository.interface'

@injectable()
export class TokenService implements ITokenService {
  constructor(
    @inject('ITokenConfig') private config: ITokenConfig,
    @inject('IRefreshTokenRepository')
    private refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  /**
   * Generate both access   and refresh tokens
   */
  async generateTokens(user: {
    id: number
    email: string
  }): Promise<AuthTokens> {
    const payload: TokenPayload = {
      userId: Number(user.id),
      email: user.email,
    }

    // Generate access token with unique identifier
    const accessToken = jwt.sign(
      { ...payload, type: 'access', jti: this.generateSecureToken() },
      this.config.accessTokenSecret,
      { expiresIn: this.parseExpiration(this.config.accessTokenExpiresIn) },
    )

    // Generate refresh token
    const refreshTokenValue = this.generateSecureToken()
    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh', jti: refreshTokenValue },
      this.config.refreshTokenSecret,
      { expiresIn: this.parseExpiration(this.config.refreshTokenExpiresIn) },
    )

    // Calculate expiration date
    const expiresAt = new Date()
    const expiresInMs = this.parseExpiration(this.config.refreshTokenExpiresIn)
    expiresAt.setTime(expiresAt.getTime() + expiresInMs)

    const refreshTokenEntity = RefreshToken.create({
      token: refreshTokenValue,
      userId: Number(user.id),
      expiresAt,
      family: refreshTokenValue,
    })

    // Store refresh token in database
    await this.refreshTokenRepo.save(refreshTokenEntity)

    return {
      accessToken,
      refreshToken, // Return the JWT, not the raw token
    }
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(token: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(
        token,
        this.config.accessTokenSecret,
      ) as TokenPayload

      if (decoded.type !== 'access') {
        return null
      }

      return decoded.userId.toString()
    } catch {
      return null
    }
  }

  /**
   * Refresh tokens using a refresh token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token JWT
      const decoded = jwt.verify(
        refreshToken,
        this.config.refreshTokenSecret,
      ) as TokenPayload & { jti: string }

      if (decoded.type !== 'refresh') {
        throw new AuthenticationError('Invalid token type')
      }

      // Check if refresh token exists in database
      const storedToken = await this.refreshTokenRepo.findByToken(decoded.jti)

      if (!storedToken) {
        throw new AuthenticationError('Invalid refresh token')
      }

      // Check if token is revoked
      if (storedToken.revoked) {
        throw new AuthenticationError('Invalid refresh token')
      }

      // Check if token is expired
      if (new Date() > storedToken.expiresAt) {
        await this.refreshTokenRepo.delete(storedToken.id)
        throw new AuthenticationError('Refresh token expired')
      }

      // Delete old refresh token (rotation)
      await this.refreshTokenRepo.delete(storedToken.id)

      // Generate new tokens
      return this.generateTokens({
        id: decoded.userId,
        email: decoded.email,
      })
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error
      }
      throw new AuthenticationError('Invalid refresh token')
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllTokens(userId: number): Promise<void> {
    await this.refreshTokenRepo.revokeAllByUserId(userId)
  }

  /**
   * Generate a secure random token
   */
  private generateSecureToken(): string {
    return randomBytes(32).toString('hex')
  }

  /**
   * Parse expiration string to milliseconds
   */
  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/)
    if (!match) {
      throw new Error(`Invalid expiration format: ${expiration}`)
    }

    const [, value, unit] = match
    if (!(value && unit)) {
      throw new Error(`Invalid expiration format: ${expiration}`)
    }
    const numValue = Number.parseInt(value, 10)

    switch (unit) {
      case 's':
        return numValue * 1000
      case 'm':
        return numValue * 60 * 1000
      case 'h':
        return numValue * 60 * 60 * 1000
      case 'd':
        return numValue * 24 * 60 * 60 * 1000
      default:
        throw new Error(`Invalid time unit: ${unit}`)
    }
  }
}
