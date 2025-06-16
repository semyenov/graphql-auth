import { PrismaClient } from '@prisma/client'
import { DATABASE } from '../../constants'
import { env } from '../../environment'

/**
 * Database client configuration type
 */
interface DatabaseConfig {
  logLevels: readonly string[]
  transactionTimeout: number
  url: string
}

/**
 * Database client manager class
 * Provides singleton access to Prisma client with proper configuration
 */
export class DatabaseClient {
  private static instance: PrismaClient | null = null
  private static config: DatabaseConfig = {
    logLevels: DATABASE.LOG_LEVELS,
    transactionTimeout: DATABASE.TRANSACTION_TIMEOUT_MS,
    url: env.DATABASE_URL,
  }

  /**
   * Get the Prisma client instance
   * Creates a new instance if one doesn't exist
   */
  public static getClient(): PrismaClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient({
        log: DatabaseClient.config.logLevels as any,
        transactionOptions: {
          timeout: DatabaseClient.config.transactionTimeout as any,
        },
        datasources: {
          db: {
            url: DatabaseClient.config.url,
          },
        },
      })
    }

    return DatabaseClient.instance
  }

  /**
   * Set a test client instance
   * Primarily used for testing with isolated database instances
   */
  public static setTestClient(client: PrismaClient): void {
    DatabaseClient.instance = client
  }

  /**
   * Reset the client instance
   * Forces creation of a new client on next access
   */
  public static reset(): void {
    DatabaseClient.instance = null
  }

  /**
   * Disconnect the client and clean up resources
   * Should be called on application shutdown
   */
  public static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect()
      DatabaseClient.instance = null
    }
  }

  /**
   * Check if client is connected
   */
  public static isConnected(): boolean {
    return DatabaseClient.instance !== null
  }

  /**
   * Get current configuration
   */
  public static getConfig(): Readonly<DatabaseConfig> {
    return { ...DatabaseClient.config }
  }

  /**
   * Update configuration (primarily for testing)
   */
  public static updateConfig(newConfig: Partial<DatabaseConfig>): void {
    DatabaseClient.config = { ...DatabaseClient.config, ...newConfig }
    // Force reconnection with new config
    if (DatabaseClient.instance) {
      DatabaseClient.reset()
    }
  }
}

// Export a singleton instance for direct use
export const db = DatabaseClient.getClient()

// Export type for dependency injection
export type Database = PrismaClient