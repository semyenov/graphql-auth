/**
 * User factory functions for creating test users
 */

import type { User } from '@prisma/client'
import * as argon2 from 'argon2'
import { prisma } from '../database/prisma'

/**
 * Create a test user with hashed password
 */
export async function createTestUser(data?: {
  email?: string
  password?: string
  name?: string
}): Promise<User> {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substr(2, 9)

  return prisma.user.create({
    data: {
      email: data?.email || `test-${timestamp}-${randomId}@example.com`,
      password: await argon2.hash(data?.password || 'password123'),
      name: data?.name || `Test User ${timestamp}`,
    },
  })
}

/**
 * Seed test users with default credentials
 */
export async function seedTestUsers(): Promise<User[]> {
  const users = await Promise.all([
    createTestUser({
      email: 'alice@test.com',
      password: 'alice123',
      name: 'Alice Test',
    }),
    createTestUser({
      email: 'bob@test.com',
      password: 'bob123',
      name: 'Bob Test',
    }),
    createTestUser({
      email: 'charlie@test.com',
      password: 'charlie123',
      name: 'Charlie Test',
    }),
  ])

  return users
}
