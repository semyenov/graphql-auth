import type { Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../prisma'

/**
 * Base repository class that provides common database operations
 * All specific repositories should extend this class
 */
export abstract class BaseRepository {
  protected readonly db: PrismaClient

  constructor(dbClient?: PrismaClient) {
    // Allow dependency injection for testing, otherwise use singleton
    this.db = dbClient || prisma
  }

  /**
   * Execute a function within a database transaction
   */
  protected async transaction<T>(
    fn: Parameters<typeof this.db.$transaction>[0],
  ): Promise<T> {
    return this.db.$transaction(fn) as Prisma.PrismaPromise<T>
  }

  /**
   * Execute raw SQL query
   */
  protected async executeRaw<T = unknown>(
    sql: Prisma.Sql,
    ...args: unknown[]
  ): Promise<T> {
    return this.db.$executeRaw<T>(sql, ...args) as Prisma.PrismaPromise<T>
  }

  /**
   * Query raw SQL
   */
  protected async queryRaw<T = unknown>(
    sql: Prisma.Sql,
    ...args: unknown[]
  ): Promise<T> {
    return this.db.$queryRaw<T>(sql, ...args) as Prisma.PrismaPromise<T>
  }

  /**
   * Get database client for complex operations
   */
  protected getDbClient(): PrismaClient {
    return this.db
  }
}
