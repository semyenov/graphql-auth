/**
 * Argon2 Password Service Tests
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { Argon2PasswordService } from './argon2-password.service'

describe('Argon2PasswordService', () => {
  let passwordService: Argon2PasswordService

  beforeEach(() => {
    passwordService = new Argon2PasswordService()
  })

  describe('hash', () => {
    it('should hash a password successfully', async () => {
      const password = 'test-password'

      const result = await passwordService.hash(password)

      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result).not.toBe(password)
      // Argon2 hashes should start with $argon2
      expect(result).toMatch(/^\$argon2/)
    })

    it('should hash different passwords to different hashes', async () => {
      const password1 = 'test-password-1'
      const password2 = 'test-password-2'

      const hash1 = await passwordService.hash(password1)
      const hash2 = await passwordService.hash(password2)

      expect(hash1).not.toBe(hash2)
    })

    it('should produce different hashes for same password', async () => {
      const password = 'test-password'

      const hash1 = await passwordService.hash(password)
      const hash2 = await passwordService.hash(password)

      // Due to salt, same password should produce different hashes
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verify', () => {
    it('should return true for matching password', async () => {
      const password = 'test-password'
      const hash = await passwordService.hash(password)

      const result = await passwordService.verify(password, hash)

      expect(result).toBe(true)
    })

    it('should return false for non-matching password', async () => {
      const password = 'test-password'
      const wrongPassword = 'wrong-password'
      const hash = await passwordService.hash(password)

      const result = await passwordService.verify(wrongPassword, hash)

      expect(result).toBe(false)
    })

    it('should return false for invalid hash format', async () => {
      const password = 'test-password'
      const invalidHash = 'not-a-valid-hash'

      const result = await passwordService.verify(password, invalidHash)

      expect(result).toBe(false)
    })

    it('should handle empty password', async () => {
      const password = ''
      const hash = await passwordService.hash('some-password')

      const result = await passwordService.verify(password, hash)

      expect(result).toBe(false)
    })
  })

  describe('needsRehash', () => {
    it('should return false for recently hashed passwords', async () => {
      const password = 'test-password'
      const hash = await passwordService.hash(password)

      const result = await passwordService.needsRehash(hash)

      expect(result).toBe(false)
    })

    it('should handle invalid hash format gracefully', async () => {
      const invalidHash = 'not-a-valid-argon2-hash'

      // Should not throw, just return true indicating it needs rehashing
      const result = await passwordService.needsRehash(invalidHash)

      expect(result).toBe(true)
    })

    it('should detect old bcrypt hashes as needing rehash', async () => {
      // Example bcrypt hash
      const bcryptHash =
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

      const result = await passwordService.needsRehash(bcryptHash)

      expect(result).toBe(true)
    })
  })
})
