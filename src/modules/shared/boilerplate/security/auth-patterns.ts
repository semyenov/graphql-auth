/**
 * Security Pattern Boilerplate
 *
 * ⚠️ DO NOT IMPORT THIS FILE DIRECTLY
 * Copy the patterns you need into your module's utils directory
 *
 * Source: shared/boilerplate/security/auth-patterns.ts
 * Version: 1.0.0
 * Last Updated: 2025-01-16
 */

import * as crypto from 'crypto'

/**
 * Generate cryptographically secure random token
 *
 * @example
 * // Copy this function to: modules/auth/utils/tokens.ts
 * export function generateSecureToken(length: number = 32): string {
 *   return crypto.randomBytes(length).toString('hex')
 * }
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate UUID v4
 *
 * @example
 * // Copy this function to: modules/auth/utils/tokens.ts
 * export function generateUUID(): string {
 *   return crypto.randomUUID()
 * }
 */
export function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * Rate limiting key generation
 *
 * @example
 * // Copy this function to: modules/auth/utils/rate-limiting.ts
 * export function createRateLimitKey(identifier: string, action: string): string {
 *   return `rate_limit:${action}:${identifier}`
 * }
 */
export function createRateLimitKey(identifier: string, action: string): string {
  if (!(identifier && action)) {
    throw new Error(
      'Both identifier and action are required for rate limit key',
    )
  }
  return `rate_limit:${action}:${identifier.toLowerCase()}`
}

/**
 * Hash sensitive data for comparison
 *
 * @example
 * // Copy this function to: modules/auth/utils/hashing.ts
 * export function hashForComparison(data: string, salt?: string): string {
 *   const actualSalt = salt || crypto.randomBytes(16).toString('hex')
 *   const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512')
 *   return `${actualSalt}:${hash.toString('hex')}`
 * }
 */
export function hashForComparison(data: string, salt?: string): string {
  if (!data || typeof data !== 'string') {
    throw new Error('Data must be a non-empty string')
  }

  const actualSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512')
  return `${actualSalt}:${hash.toString('hex')}`
}

/**
 * Verify hashed data
 *
 * @example
 * // Copy this function to: modules/auth/utils/hashing.ts
 * export function verifyHash(data: string, hashedData: string): boolean {
 *   const [salt, hash] = hashedData.split(':')
 *   const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512')
 *   return hash === verifyHash.toString('hex')
 * }
 */
export function verifyHash(data: string, hashedData: string): boolean {
  if (
    !(data && hashedData) ||
    typeof data !== 'string' ||
    typeof hashedData !== 'string'
  ) {
    return false
  }

  try {
    const [salt, hash] = hashedData.split(':')
    if (!(salt && hash)) return false

    const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512')
    return hash === verifyHash.toString('hex')
  } catch {
    return false
  }
}

/**
 * Base64 URL-safe encoding/decoding
 *
 * @example
 * // Copy these functions to: modules/auth/utils/encoding.ts
 * export function base64UrlEncode(data: string): string {
 *   return Buffer.from(data, 'utf-8')
 *     .toString('base64')
 *     .replace(/\+/g, '-')
 *     .replace(/\//g, '_')
 *     .replace(/=/g, '')
 * }
 */
export function base64UrlEncode(data: string): string {
  if (!data || typeof data !== 'string') {
    throw new Error('Data must be a non-empty string')
  }

  return Buffer.from(data, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function base64UrlDecode(encoded: string): string {
  if (!encoded || typeof encoded !== 'string') {
    throw new Error('Encoded data must be a non-empty string')
  }

  try {
    // Add padding if needed
    let padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
    while (padded.length % 4) {
      padded += '='
    }

    return Buffer.from(padded, 'base64').toString('utf-8')
  } catch (error) {
    throw new Error('Invalid base64 URL-safe string')
  }
}

/**
 * Generate CSRF token
 *
 * @example
 * // Copy this function to: modules/auth/utils/csrf.ts
 * export function generateCSRFToken(): string {
 *   return crypto.randomBytes(32).toString('hex')
 * }
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create secure session ID
 *
 * @example
 * // Copy this function to: modules/auth/utils/sessions.ts
 * export function createSessionId(): string {
 *   const timestamp = Date.now().toString(36)
 *   const randomPart = crypto.randomBytes(16).toString('hex')
 *   return `${timestamp}.${randomPart}`
 * }
 */
export function createSessionId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = crypto.randomBytes(16).toString('hex')
  return `${timestamp}.${randomPart}`
}

/**
 * Timing-safe string comparison
 *
 * @example
 * // Copy this function to: modules/auth/utils/comparison.ts
 * export function timingSafeEqual(a: string, b: string): boolean {
 *   if (a.length !== b.length) return false
 *   return crypto.timingSafeEqual(
 *     Buffer.from(a, 'utf-8'),
 *     Buffer.from(b, 'utf-8')
 *   )
 * }
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (!(a && b) || typeof a !== 'string' || typeof b !== 'string') {
    return false
  }

  if (a.length !== b.length) {
    return false
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(a, 'utf-8'),
      Buffer.from(b, 'utf-8'),
    )
  } catch {
    return false
  }
}

/**
 * Generate API key with prefix
 *
 * @example
 * // Copy this function to: modules/auth/utils/api-keys.ts
 * export function generateAPIKey(prefix: string = 'api'): string {
 *   const randomPart = crypto.randomBytes(32).toString('hex')
 *   return `${prefix}_${randomPart}`
 * }
 */
export function generateAPIKey(prefix: string = 'api'): string {
  if (!prefix || typeof prefix !== 'string') {
    throw new Error('Prefix must be a non-empty string')
  }

  const randomPart = crypto.randomBytes(32).toString('hex')
  return `${prefix}_${randomPart}`
}

/**
 * Mask sensitive data for logging
 *
 * @example
 * // Copy this function to: modules/auth/utils/masking.ts
 * export function maskSensitiveData(data: string, visibleChars: number = 4): string {
 *   if (!data || data.length <= visibleChars * 2) return '***'
 *   return data.slice(0, visibleChars) + '***' + data.slice(-visibleChars)
 * }
 */
export function maskSensitiveData(
  data: string,
  visibleChars: number = 4,
): string {
  if (!data || typeof data !== 'string') {
    return '***'
  }

  if (data.length <= visibleChars * 2) {
    return '***'
  }

  return `${data.slice(0, visibleChars)}***${data.slice(-visibleChars)}`
}

/**
 * Generate OTP (One-Time Password)
 *
 * @example
 * // Copy this function to: modules/auth/utils/otp.ts
 * export function generateOTP(length: number = 6): string {
 *   const digits = '0123456789'
 *   let otp = ''
 *   for (let i = 0; i < length; i++) {
 *     otp += digits[crypto.randomInt(0, digits.length)]
 *   }
 *   return otp
 * }
 */
export function generateOTP(length: number = 6): string {
  if (length < 4 || length > 10) {
    throw new Error('OTP length must be between 4 and 10 digits')
  }

  const digits = '0123456789'
  let otp = ''

  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)]
  }

  return otp
}

/**
 * Password strength checker
 *
 * @example
 * // Copy this function to: modules/auth/utils/password-strength.ts
 * export function calculatePasswordStrength(password: string): { score: number; feedback: string[] } {
 *   const feedback: string[] = []
 *   let score = 0
 *
 *   if (password.length >= 8) score += 1
 *   else feedback.push('Use at least 8 characters')
 *
 *   // ... rest of scoring logic
 *
 *   return { score, feedback }
 * }
 */
export function calculatePasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (!password || typeof password !== 'string') {
    return { score: 0, feedback: ['Password is required'] }
  }

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Use at least 8 characters')
  }

  if (password.length >= 12) {
    score += 1
  } else if (password.length >= 8) {
    feedback.push('Consider using 12+ characters for better security')
  }

  // Character variety
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include lowercase letters')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include uppercase letters')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Include numbers')
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Include special characters')
  }

  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push('Avoid repeating characters')
  }

  if (/123|abc|qwe/i.test(password)) {
    score -= 1
    feedback.push('Avoid common sequences')
  }

  return { score: Math.max(0, score), feedback }
}
