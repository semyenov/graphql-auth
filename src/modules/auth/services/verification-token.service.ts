/**
 * Verification Token Service
 *
 * Manages email verification and password reset tokens
 */

import type { VerificationToken } from '@prisma/client'
import { randomBytes } from 'node:crypto'
import { inject, injectable } from 'tsyringe'
import { ValidationError } from '../../../app/errors/types'
import type { ILogger } from '../../../app/services/logger.interface'
import { prisma } from '../../../prisma'

export type TokenType = 'email_verification' | 'password_reset'

export interface CreateTokenOptions {
  userId: number
  type: TokenType
  expiresInHours?: number
}

export interface VerifyTokenResult {
  valid: boolean
  userId?: number
  token?: VerificationToken
  error?: string
}

@injectable()
export class VerificationTokenService {
  constructor(@inject('ILogger') private logger: ILogger) { }

  /**
   * Generate a secure random token
   */
  private generateToken(): string {
    return randomBytes(32).toString('hex')
  }

  /**
   * Create a new verification token
   */
  async createToken(options: CreateTokenOptions): Promise<string> {
    const { userId, type, expiresInHours = 24 } = options

    // Invalidate any existing tokens of the same type for this user
    await this.invalidateUserTokens(userId, type)

    // Generate new token
    const token = this.generateToken()
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        token,
        type,
        userId,
        expiresAt,
      },
    })

    this.logger.info('Verification token created', {
      userId,
      type,
      expiresInHours,
    })

    return token
  }

  /**
   * Verify a token and return the associated user ID
   */
  async verifyToken(
    token: string,
    type: TokenType,
  ): Promise<VerifyTokenResult> {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    // Token not found
    if (!verificationToken) {
      return {
        valid: false,
        error: 'Invalid or expired token',
      }
    }

    // Wrong token type
    if (verificationToken.type !== type) {
      return {
        valid: false,
        error: 'Invalid token type',
      }
    }

    // Token already used
    if (verificationToken.usedAt) {
      return {
        valid: false,
        error: 'Token has already been used',
      }
    }

    // Token expired
    if (verificationToken.expiresAt < new Date()) {
      return {
        valid: false,
        error: 'Token has expired',
      }
    }

    return {
      valid: true,
      userId: verificationToken.userId,
      token: verificationToken,
    }
  }

  /**
   * Mark a token as used
   */
  async useToken(token: string): Promise<void> {
    await prisma.verificationToken.update({
      where: { token },
      data: { usedAt: new Date() },
    })
  }

  /**
   * Invalidate all tokens of a specific type for a user
   */
  async invalidateUserTokens(userId: number, type: TokenType): Promise<number> {
    const result = await prisma.verificationToken.updateMany({
      where: {
        userId,
        type,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    })

    if (result.count > 0) {
      this.logger.info('Invalidated user tokens', {
        userId,
        type,
        count: result.count,
      })
    }

    return result.count
  }

  /**
   * Clean up expired tokens (for maintenance)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await prisma.verificationToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
      },
    })

    if (result.count > 0) {
      this.logger.info('Cleaned up expired tokens', { count: result.count })
    }

    return result.count
  }

  /**
   * Create and return email verification token
   */
  async createEmailVerificationToken(userId: number): Promise<string> {
    return this.createToken({
      userId,
      type: 'email_verification',
      expiresInHours: 24,
    })
  }

  /**
   * Create and return password reset token
   */
  async createPasswordResetToken(userId: number): Promise<string> {
    return this.createToken({
      userId,
      type: 'password_reset',
      expiresInHours: 1, // Password reset tokens expire in 1 hour
    })
  }

  /**
   * Verify email with token
   */
  async verifyEmailWithToken(token: string): Promise<number> {
    const result = await this.verifyToken(token, 'email_verification')

    if (!(result.valid && result.userId)) {
      throw new ValidationError(result.error || 'Invalid token')
    }

    // Mark token as used
    await this.useToken(token)

    // Update user's email verification status
    await prisma.user.update({
      where: { id: result.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    })

    this.logger.info('Email verified', { userId: result.userId })

    return result.userId
  }

  /**
   * Get user ID from password reset token
   */
  async verifyPasswordResetToken(token: string): Promise<number> {
    const result = await this.verifyToken(token, 'password_reset')

    if (!(result.valid && result.userId)) {
      throw new ValidationError(result.error || 'Invalid token')
    }

    return result.userId
  }

  /**
   * Complete password reset
   */
  async completePasswordReset(token: string): Promise<void> {
    await this.useToken(token)
  }
}
