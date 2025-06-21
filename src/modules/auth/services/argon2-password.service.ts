/**
 * Argon2 Password Service Implementation
 *
 * Implements password hashing and verification using argon2.
 * Argon2 is the winner of the Password Hashing Competition and is
 * recommended over bcrypt for new applications.
 */

import * as argon2 from 'argon2'
import { injectable } from 'tsyringe'
import type { IPasswordService } from '../../../core/services/password.service.interface'

@injectable()
export class Argon2PasswordService implements IPasswordService {
  private readonly options: argon2.Options & { raw?: false }

  constructor() {
    // Configure Argon2 options for optimal security/performance balance
    this.options = {
      type: argon2.argon2id, // Use Argon2id variant (recommended)
      memoryCost: 65536, // 64 MB memory cost
      timeCost: 3, // Number of iterations
      parallelism: 4, // Number of parallel threads
      hashLength: 32, // Length of the hash in bytes
    }
  }

  /**
   * Hash a plain text password using Argon2
   */
  async hash(password: string): Promise<string> {
    try {
      return await argon2.hash(password, this.options)
    } catch (error) {
      throw new Error(
        `Failed to hash password: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Verify a password against an Argon2 hash
   */
  async verify(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password, this.options)
    } catch (_error) {
      // Return false for any verification errors (invalid hash format, etc.)
      return false
    }
  }

  /**
   * Check if a hash needs to be rehashed with updated parameters
   */
  async needsRehash(hash: string): Promise<boolean> {
    try {
      return argon2.needsRehash(hash, this.options)
    } catch {
      // If we can't check, assume it needs rehashing
      return true
    }
  }
}
