/**
 * Verification Token Service Interface
 *
 * Defines the contract for email verification and password reset tokens
 */

export interface VerificationResult {
  userId: number
  email: string
}

export interface IVerificationTokenService {
  /**
   * Create an email verification token
   */
  createEmailVerificationToken(userId: number): Promise<string>

  /**
   * Verify an email verification token
   */
  verifyEmailToken(token: string): Promise<VerificationResult>

  /**
   * Create a password reset token
   */
  createPasswordResetToken(email: string): Promise<string>

  /**
   * Verify a password reset token
   */
  verifyPasswordResetToken(token: string): Promise<VerificationResult>

  /**
   * Invalidate a token (optional method for explicit revocation)
   */
  invalidateToken?(token: string): Promise<void>

  /**
   * Clean up expired tokens (maintenance method)
   */
  cleanupExpiredTokens?(): Promise<number>
}
