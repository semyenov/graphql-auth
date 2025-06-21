/**
 * Prisma database utilities for testing
 */

import { PrismaClient } from '@prisma/client'

// Re-export the test prisma client from test-env
export { prisma } from '../../test-env'

/**
 * Create a new Prisma client for isolated tests
 */
export function createTestPrismaClient(databaseUrl?: string): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl || process.env.DATABASE_URL || 'file:./test.db',
      },
    },
  })
}
