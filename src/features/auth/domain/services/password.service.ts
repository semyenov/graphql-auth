import bcrypt from 'bcryptjs'
import { AUTH } from '../../../../constants'
import { WeakPasswordError } from '../types'

/**
 * Domain service for password management
 * Encapsulates password validation and hashing logic
 */
export class PasswordService {
  /**
   * Validates password strength according to business rules
   */
  static validateStrength(password: string): void {
    if (password.length < AUTH.MIN_PASSWORD_LENGTH) {
      throw new WeakPasswordError(
        `Password must be at least ${AUTH.MIN_PASSWORD_LENGTH} characters long`
      )
    }

    if (password.length > AUTH.MAX_PASSWORD_LENGTH) {
      throw new WeakPasswordError(
        `Password must not exceed ${AUTH.MAX_PASSWORD_LENGTH} characters`
      )
    }

    // Additional strength checks could be added here
    if (!/\d/.test(password)) {
      throw new WeakPasswordError('Password must contain at least one number')
    }

    if (!/[a-zA-Z]/.test(password)) {
      throw new WeakPasswordError('Password must contain at least one letter')
    }
  }

  /**
   * Hashes a password using bcrypt
   */
  static async hash(password: string): Promise<string> {
    this.validateStrength(password)
    return bcrypt.hash(password, AUTH.BCRYPT_ROUNDS)
  }

  /**
   * Verifies a password against a hash
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}