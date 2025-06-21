/**
 * Login Attempt Service
 *
 * Tracks login attempts and implements account lockout functionality
 */

import type { LoginAttempt } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import { AuthenticationError } from '../../../app/errors/types'
import type { ILogger } from '../../../app/services/logger.interface'
import { prisma } from '../../../prisma'

export interface LoginAttemptOptions {
  email: string
  ipAddress: string
  success: boolean
}

export interface AccountLockoutConfig {
  maxAttempts: number
  lockoutDurationMinutes: number
  checkWindowMinutes: number
}

@injectable()
export class LoginAttemptService {
  private readonly defaultConfig: AccountLockoutConfig = {
    maxAttempts: 5,
    lockoutDurationMinutes: 30,
    checkWindowMinutes: 15,
  }

  constructor(@inject('ILogger') private logger: ILogger) {}

  /**
   * Record a login attempt
   */
  async recordAttempt(options: LoginAttemptOptions): Promise<LoginAttempt> {
    const attempt = await prisma.loginAttempt.create({
      data: {
        email: options.email.toLowerCase(),
        ipAddress: options.ipAddress,
        success: options.success,
      },
    })

    this.logger.info('Login attempt recorded', {
      email: options.email,
      success: options.success,
      ipAddress: options.ipAddress,
    })

    return attempt
  }

  /**
   * Check if an account is locked out
   */
  async isAccountLocked(
    email: string,
    config: Partial<AccountLockoutConfig> = {},
  ): Promise<{ locked: boolean; remainingMinutes?: number }> {
    const { maxAttempts, lockoutDurationMinutes, checkWindowMinutes } = {
      ...this.defaultConfig,
      ...config,
    }

    const normalizedEmail = email.toLowerCase()
    const checkWindowStart = new Date(
      Date.now() - checkWindowMinutes * 60 * 1000,
    )

    // Get recent failed attempts
    const recentAttempts = await prisma.loginAttempt.findMany({
      where: {
        email: normalizedEmail,
        createdAt: { gte: checkWindowStart },
        success: false,
      },
      orderBy: { createdAt: 'desc' },
      take: maxAttempts,
    })

    // Not enough failed attempts to trigger lockout
    if (recentAttempts.length < maxAttempts) {
      return { locked: false }
    }

    // Check if the oldest relevant attempt is within the lockout window
    const oldestRelevantAttempt = recentAttempts[maxAttempts - 1]
    const lockoutEndTime = new Date(
      oldestRelevantAttempt.createdAt.getTime() +
        lockoutDurationMinutes * 60 * 1000,
    )

    if (lockoutEndTime > new Date()) {
      const remainingMinutes = Math.ceil(
        (lockoutEndTime.getTime() - Date.now()) / (60 * 1000),
      )

      this.logger.warn('Account locked', {
        email: normalizedEmail,
        remainingMinutes,
        failedAttempts: recentAttempts.length,
      })

      return { locked: true, remainingMinutes }
    }

    return { locked: false }
  }

  /**
   * Check account lockout and throw error if locked
   */
  async checkAccountLockout(
    email: string,
    config?: Partial<AccountLockoutConfig>,
  ): Promise<void> {
    const lockoutStatus = await this.isAccountLocked(email, config)

    if (lockoutStatus.locked) {
      throw new AuthenticationError(
        `Account is locked due to too many failed login attempts. ` +
          `Please try again in ${lockoutStatus.remainingMinutes} minutes.`,
      )
    }
  }

  /**
   * Get recent login attempts for a user
   */
  async getRecentAttempts(
    email: string,
    limit: number = 10,
  ): Promise<LoginAttempt[]> {
    return prisma.loginAttempt.findMany({
      where: { email: email.toLowerCase() },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Clear old login attempts (for maintenance)
   */
  async clearOldAttempts(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

    const result = await prisma.loginAttempt.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    })

    if (result.count > 0) {
      this.logger.info('Cleared old login attempts', { count: result.count })
    }

    return result.count
  }

  /**
   * Get failed attempt count for an email
   */
  async getFailedAttemptCount(
    email: string,
    windowMinutes: number = 15,
  ): Promise<number> {
    const checkWindowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

    const count = await prisma.loginAttempt.count({
      where: {
        email: email.toLowerCase(),
        createdAt: { gte: checkWindowStart },
        success: false,
      },
    })

    return count
  }

  /**
   * Clear failed attempts for an email (e.g., after successful login)
   */
  async clearFailedAttempts(email: string): Promise<number> {
    const result = await prisma.loginAttempt.deleteMany({
      where: {
        email: email.toLowerCase(),
        success: false,
      },
    })

    if (result.count > 0) {
      this.logger.info('Cleared failed attempts', {
        email,
        count: result.count,
      })
    }

    return result.count
  }
}
