/**
 * Cryptographic Utilities
 *
 * Common cryptographic helper functions
 */

import crypto from 'crypto'

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url')
}

/**
 * Hash a string using SHA256
 */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Hash a string using SHA512
 */
export function sha512(data: string): string {
  return crypto.createHash('sha512').update(data).digest('hex')
}

/**
 * Create HMAC signature
 */
export function createHmac(
  data: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256',
): string {
  return crypto.createHmac(algorithm, secret).update(data).digest('hex')
}

/**
 * Verify HMAC signature
 */
export function verifyHmac(
  data: string,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256',
): boolean {
  const expectedSignature = createHmac(data, secret, algorithm)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  )
}

/**
 * Generate a UUID v4
 */
export function generateUuid(): string {
  return crypto.randomUUID()
}

/**
 * Encode data to base64
 */
export function toBase64(data: string): string {
  return Buffer.from(data).toString('base64')
}

/**
 * Decode data from base64
 */
export function fromBase64(data: string): string {
  return Buffer.from(data, 'base64').toString('utf-8')
}

/**
 * Constant time string comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
