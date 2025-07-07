/**
 * Login Attempt Service Interface
 *
 * Defines the contract for tracking login attempts and account lockout
 */

import type { LoginAttempt } from '@prisma/client'

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

export interface ILoginAttemptService {
  /**
   * Record a login attempt
   */
  recordAttempt(options: LoginAttemptOptions): Promise<LoginAttempt>

  /**
   * Check if an account is locked out
   */
  isAccountLocked(
    email: string,
    config?: Partial<AccountLockoutConfig>,
  ): Promise<{ locked: boolean; remainingMinutes?: number }>

  /**
   * Check account lockout and throw error if locked
   */
  checkAccountLockout(
    email: string,
    config?: Partial<AccountLockoutConfig>,
  ): Promise<void>

  /**
   * Get recent login attempts for a user
   */
  getRecentAttempts(email: string, limit?: number): Promise<LoginAttempt[]>

  /**
   * Clear old login attempts (for maintenance)
   */
  clearOldAttempts(daysToKeep?: number): Promise<number>

  /**
   * Get failed attempt count for an email
   */
  getFailedAttemptCount(email: string, windowMinutes?: number): Promise<number>

  /**
   * Clear failed attempts for an email (e.g., after successful login)
   */
  clearFailedAttempts(email: string): Promise<number>
}
