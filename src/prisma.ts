import { type Prisma, PrismaClient } from '@prisma/client'
import { env } from './app/config/environment'
import { DATABASE } from './constants'

/**
 * Type alias for PrismaClient to improve readability
 */
export type PrismaClientType = PrismaClient

/**
 * Global variable to hold the prisma instance
 */
let globalPrisma: PrismaClientType | null = null

/**
 * Factory function to create a configured Prisma client
 */
function createPrismaClient(): PrismaClientType {
  return new PrismaClient({
    log: DATABASE.LOG_LEVELS as unknown as Prisma.LogLevel[],
    transactionOptions: {
      timeout: DATABASE.TRANSACTION_TIMEOUT_MS,
    },
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  })
}

/**
 * Get or create the global Prisma instance
 * Implements singleton pattern for connection pooling
 */
function getPrismaClient(): PrismaClientType {
  if (globalPrisma) {
    return globalPrisma
  }

  // In test environment, we expect the client to be set explicitly
  if (env.NODE_ENV === 'test') {
    throw new Error('Prisma client not set for test environment')
  }

  globalPrisma = createPrismaClient()
  return globalPrisma
}

/**
 * Set a custom Prisma instance (primarily used for testing)
 * @param prismaInstance - The Prisma client instance to use globally
 */
export function setTestPrismaClient(prismaInstance: PrismaClientType): void {
  globalPrisma = prismaInstance
}

/**
 * Prisma client proxy that always returns the current instance
 * This pattern allows dynamic switching of the Prisma instance at runtime,
 * which is essential for test isolation. The proxy intercepts all property
 * access and delegates to the current Prisma instance.
 */
export const prisma = new Proxy({} as PrismaClientType, {
  get<K extends keyof PrismaClientType>(
    _target: PrismaClientType,
    prop: K,
  ): PrismaClientType[K] {
    const currentPrisma = getPrismaClient()
    return currentPrisma[prop]
  },

  has<K extends keyof PrismaClientType>(
    _target: PrismaClientType,
    prop: K,
  ): boolean {
    const currentPrisma = getPrismaClient()
    return prop in currentPrisma
  },
})

/**
 * Gracefully disconnect Prisma client
 * Should be called on application shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  if (globalPrisma) {
    await globalPrisma.$disconnect()
    globalPrisma = null
  }
}

/**
 * Export the old name for backward compatibility
 * @deprecated Use setTestPrismaClient instead
 */
export const setPrismaClient = setTestPrismaClient
