/**
 * Password Service Interface
 *
 * Defines the contract for password hashing and verification.
 */

export interface IPasswordService {
  /**
   * Hash a plain text password.
   *
   * @param password - The plain text password to hash
   * @returns The hashed password
   */
  hash(password: string): Promise<string>

  /**
   * Verify a plain text password against a hashed password.
   *
   * @param password - The plain text password to verify
   * @param hash - The hashed password to compare against
   * @returns True if the password matches the hash, false otherwise
   */
  verify(password: string, hash: string): Promise<boolean>

  /**
   * Check if a password hash needs to be rehashed.
   * This is useful for upgrading legacy hashes or when security parameters change.
   *
   * @param hash - The hashed password to check
   * @returns True if the hash should be rehashed, false otherwise
   */
  needsRehash?(hash: string): Promise<boolean>
}
