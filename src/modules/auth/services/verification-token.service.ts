/**
 * Verification Token Service
 *
 * Manages email verification and password reset tokens
 */

import { randomBytes } from 'node:crypto'
import type { VerificationToken } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import { ValidationError } from '@/app/errors/types'
import type {
  IVerificationTokenService,
  VerificationResult,
} from '@/modules/auth/interfaces/verification-token.service.interface'
import { prisma } from '@/modules/shared/database'
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'

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
export class VerificationTokenService implements IVerificationTokenService {
  constructor(@inject('ILogger') private logger: ILogger) {}

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
  async createPasswordResetToken(email: string): Promise<string> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if email exists
      throw new ValidationError(['Invalid request'])
    }

    return this.createToken({
      userId: user.id,
      type: 'password_reset',
      expiresInHours: 1, // Password reset tokens expire in 1 hour
    })
  }

  /**
   * Verify email verification token
   */
  async verifyEmailToken(token: string): Promise<VerificationResult> {
    const result = await this.verifyToken(token, 'email_verification')

    if (!(result.valid && result.userId && result.token)) {
      throw new ValidationError([result.error || 'Invalid token'])
    }

    // Mark token as used
    await this.useToken(token)

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, email: true },
    })

    if (!user) {
      throw new ValidationError(['User not found'])
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { id: result.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    })

    this.logger.info('Email verified', { userId: result.userId })

    return { userId: user.id, email: user.email }
  }

  /**
   * Verify password reset token
   */
  async verifyPasswordResetToken(token: string): Promise<VerificationResult> {
    const result = await this.verifyToken(token, 'password_reset')

    if (!(result.valid && result.userId && result.token)) {
      throw new ValidationError([result.error || 'Invalid token'])
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: { id: true, email: true },
    })

    if (!user) {
      throw new ValidationError(['User not found'])
    }

    return { userId: user.id, email: user.email }
  }

  /**
   * Complete password reset
   */
  async completePasswordReset(token: string): Promise<void> {
    await this.useToken(token)
  }
}
