/**
 * Authentication utilities for testing
 */

import jwt from 'jsonwebtoken'

/**
 * Generate a test JWT token
 */
export function generateTestToken(userId = 1): string {
  const payload = {
    userId,
    email: `user${userId}@example.com`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  }

  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret')
}