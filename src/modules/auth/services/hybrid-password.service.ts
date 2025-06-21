/**
 * Hybrid Password Service Implementation
 *
 * Supports both bcrypt and argon2 for seamless migration.
 * Can verify passwords hashed with either algorithm and
 * automatically upgrades bcrypt hashes to argon2.
 */

import * as argon2 from 'argon2'
import * as bcrypt from 'bcryptjs'
import { injectable } from 'tsyringe'
import type { IPasswordService } from '../../../core/services/password.service.interface'

@injectable()
export class HybridPasswordService implements IPasswordService {
  private readonly argon2Options: argon2.Options & { raw?: false }

  constructor() {
    // Configure Argon2 options
    this.argon2Options = {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
      hashLength: 32,
    }

    // Bcrypt rounds are set to 10 by default
  }

  /**
   * Hash a password using Argon2 (for new passwords)
   */
  async hash(password: string): Promise<string> {
    return await argon2.hash(password, this.argon2Options)
  }

  /**
   * Verify a password against either bcrypt or argon2 hash
   */
  async verify(password: string, hashedPassword: string): Promise<boolean> {
    // Check if it's an argon2 hash (starts with $argon2)
    if (hashedPassword.startsWith('$argon2')) {
      try {
        return await argon2.verify(hashedPassword, password, this.argon2Options)
      } catch {
        return false
      }
    }

    // Otherwise, try bcrypt (starts with $2a, $2b, or $2y)
    if (hashedPassword.startsWith('$2')) {
      try {
        return await bcrypt.compare(password, hashedPassword)
      } catch {
        return false
      }
    }

    // Unknown hash format
    return false
  }

  /**
   * Check if a hash needs to be rehashed
   * Returns true for bcrypt hashes (to upgrade to argon2)
   * or argon2 hashes with outdated parameters
   */
  async needsRehash(hash: string): Promise<boolean> {
    // Bcrypt hashes always need rehashing to argon2
    if (hash.startsWith('$2')) {
      return true
    }

    // Check if argon2 hash needs updated parameters
    if (hash.startsWith('$argon2')) {
      try {
        return argon2.needsRehash(hash, this.argon2Options)
      } catch {
        return true
      }
    }

    // Unknown format - needs rehashing
    return true
  }
}
