/**
 * BCrypt Password Service Implementation
 *
 * Implements password hashing and verification using bcryptjs.
 */

import * as bcrypt from 'bcryptjs'
import { injectable } from 'tsyringe'
import type { IPasswordService } from '../../../core/services/password.service.interface'

@injectable()
export class BcryptPasswordService implements IPasswordService {
  private readonly saltRounds: number

  constructor() {
    // Default to 10 rounds, can be configured via environment
    this.saltRounds = 10
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Check if a hash needs to be rehashed.
   * For bcrypt, this could check if the cost factor has changed.
   */
  async needsRehash(hash: string): Promise<boolean> {
    try {
      const rounds = bcrypt.getRounds(hash)
      return rounds !== this.saltRounds
    } catch {
      // If we can't get rounds, assume it needs rehashing
      return true
    }
  }
}
