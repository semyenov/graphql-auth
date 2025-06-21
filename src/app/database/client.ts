import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { env } from '../../app/config/environment'
import { DATABASE } from '../../constants'

/**
 * Database client configuration type
 */
interface DatabaseConfig {
  logLevels: Prisma.LogLevel[]
  transactionTimeout: number
  url: string
}

/**
 * Singleton instance and configuration
 */
let instance: PrismaClient | null = null
let config: DatabaseConfig = {
  logLevels: [...DATABASE.LOG_LEVELS] as Prisma.LogLevel[],
  transactionTimeout: DATABASE.TRANSACTION_TIMEOUT_MS,
  url: env.DATABASE_URL,
}

/**
 * Get the Prisma client instance
 * Creates a new instance if one doesn't exist
 */
export function getClient(): PrismaClient {
  if (!instance) {
    instance = new PrismaClient({
      log: config.logLevels,
      transactionOptions: {
        timeout: config.transactionTimeout,
      },
      datasources: {
        db: {
          url: config.url,
        },
      },
    })
  }

  return instance
}

/**
 * Set a test client instance
 * Primarily used for testing with isolated database instances
 */
export function setTestClient(client: PrismaClient): void {
  instance = client
}

/**
 * Reset the client instance
 * Forces creation of a new client on next access
 */
export function reset(): void {
  instance = null
}

/**
 * Disconnect the client and clean up resources
 * Should be called on application shutdown
 */
export async function disconnect(): Promise<void> {
  if (instance) {
    await instance.$disconnect()
    instance = null
  }
}

/**
 * Check if client is connected
 */
export function isConnected(): boolean {
  return instance !== null
}

/**
 * Get current configuration
 */
export function getConfig(): Readonly<DatabaseConfig> {
  return { ...config }
}

/**
 * Update configuration (primarily for testing)
 */
export function updateConfig(newConfig: Partial<DatabaseConfig>): void {
  config = { ...config, ...newConfig }
  // Force reconnection with new config
  if (instance) {
    reset()
  }
}

// Legacy class for backward compatibility
export const DatabaseClient = {
  getClient,
  setTestClient,
  reset,
  disconnect,
  isConnected,
  getConfig,
  updateConfig,
}

// Export a singleton instance for direct use
export const db = getClient()

// Export type for dependency injection
export type Database = PrismaClient
