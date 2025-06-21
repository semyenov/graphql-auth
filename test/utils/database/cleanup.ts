/**
 * Database cleanup utilities for testing
 */

import type { PrismaClient } from '@prisma/client'
import { prisma } from './prisma'

/**
 * Clean all tables in the database
 */
export async function cleanDatabase(client: PrismaClient = prisma): Promise<void> {
  // Use transactions to ensure atomic cleanup
  await client.$transaction([
    client.post.deleteMany({}),
    client.user.deleteMany({}),
  ])
}