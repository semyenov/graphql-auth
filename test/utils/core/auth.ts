/**
 * Authentication utilities for testing
 */

import type { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { UserId } from '../../../src/types/value-objects'
import { createTestUser } from '../factories'
import { createAuthContext } from './context'

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

/**
 * Create an authenticated context with a test user
 */
export async function createAuthenticatedContext(): Promise<{
  user: User
  token: string
  context: ReturnType<typeof createAuthContext>
}> {
  const user = await createTestUser({
    email: 'test@example.com',
    password: 'password123',
  })

  const token = generateTestToken(user.id)
  const context = createAuthContext(UserId.create(user.id))

  return { user, token, context }
}
