/**
 * Prisma Client Configuration
 *
 * Centralized Prisma client setup with logging and extensions
 */

import { PrismaClient } from '@prisma/client'
import { databaseConfig } from '../../app/config/database'

/**
 * Create Prisma client with configuration
 */
function createPrismaClient() {
  const client = new PrismaClient({
    log: databaseConfig.logLevel,
    datasources: {
      db: {
        url: databaseConfig.url,
      },
    },
  })

  // Add middleware for soft deletes if needed
  client.$use(async (params, next) => {
    // Example: Auto-set timestamps
    if (params.action === 'create') {
      params.args.data.createdAt = params.args.data.createdAt || new Date()
      params.args.data.updatedAt = params.args.data.updatedAt || new Date()
    }

    if (params.action === 'update' || params.action === 'updateMany') {
      params.args.data.updatedAt = new Date()
    }

    return next(params)
  })

  return client
}

/**
 * Global Prisma client instance
 */
type GlobalThisWithPrisma = typeof globalThis & {
  prisma?: PrismaClient
}

export const prisma =
  (globalThis as GlobalThisWithPrisma).prisma || createPrismaClient()

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  ;(globalThis as GlobalThisWithPrisma).prisma = prisma
}

/**
 * Gracefully shutdown Prisma
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect()
}

/**
 * Check database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}
