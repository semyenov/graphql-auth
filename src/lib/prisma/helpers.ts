/**
 * Prisma Helper Functions
 *
 * Utility functions for common Prisma operations
 */

import { Prisma } from '@prisma/client'

/**
 * Handle Prisma errors with user-friendly messages
 */
export function handlePrismaError(error: unknown): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        // Unique constraint violation
        const field = error.meta?.target as string[] | undefined
        return new Error(
          `A record with this ${field?.[0] || 'value'} already exists`,
        )
      }

      case 'P2003':
        // Foreign key constraint violation
        return new Error('Related record not found')

      case 'P2025':
        // Record not found
        return new Error('Record not found')

      case 'P2014':
        // Relation violation
        return new Error('Cannot perform this operation due to related records')

      default:
        return new Error(`Database error: ${error.message}`)
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new Error('Invalid data provided')
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new Error('Failed to connect to database')
  }

  return error as Error
}

/**
 * Create a transaction-safe operation
 */
export async function withTransaction<T>(
  prisma: any,
  fn: (tx: any) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx: any) => {
    try {
      return await fn(tx)
    } catch (error) {
      throw handlePrismaError(error)
    }
  })
}

/**
 * Build dynamic where clause
 */
export function buildWhereClause(filters: Record<string, any>): any {
  const where: any = {}

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue

    // Handle different filter types
    if (typeof value === 'string') {
      // Case-insensitive string matching
      where[key] = { contains: value, mode: 'insensitive' }
    } else if (Array.isArray(value)) {
      // IN clause
      where[key] = { in: value }
    } else if (typeof value === 'object' && value.min !== undefined) {
      // Range query
      where[key] = {
        gte: value.min,
        lte: value.max,
      }
    } else {
      // Exact match
      where[key] = value
    }
  }

  return where
}

/**
 * Build dynamic orderBy clause
 */
export function buildOrderByClause(sort?: {
  field: string
  direction: 'asc' | 'desc'
}): any {
  if (!sort) return { createdAt: 'desc' }

  return { [sort.field]: sort.direction }
}

/**
 * Apply cursor-based pagination
 */
export function applyCursorPagination(
  query: any,
  cursor?: string,
  take = 20,
): any {
  if (!cursor) {
    return { ...query, take }
  }

  return {
    ...query,
    take,
    skip: 1, // Skip the cursor
    cursor: { id: cursor },
  }
}

/**
 * Apply offset-based pagination
 */
export function applyOffsetPagination(query: any, page = 1, perPage = 20): any {
  return {
    ...query,
    skip: (page - 1) * perPage,
    take: perPage,
  }
}

/**
 * Batch operations helper
 */
export async function batchOperation<T, R>(
  items: T[],
  batchSize: number,
  operation: (batch: T[]) => Promise<R[]>,
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await operation(batch)
    results.push(...batchResults)
  }

  return results
}

/**
 * Upsert helper with better error handling
 */
export async function safeUpsert<T>(
  model: any,
  where: any,
  create: any,
  update: any,
): Promise<T> {
  try {
    return await model.upsert({
      where,
      create,
      update,
    })
  } catch (error) {
    throw handlePrismaError(error)
  }
}

/**
 * Check if record exists
 */
export async function exists(model: any, where: any): Promise<boolean> {
  const count = await model.count({ where })
  return count > 0
}

/**
 * Get or create record
 */
export async function getOrCreate<T>(
  model: any,
  where: any,
  create: any,
): Promise<{ record: T; created: boolean }> {
  const existing = await model.findUnique({ where })

  if (existing) {
    return { record: existing, created: false }
  }

  const record = await model.create({ data: create })
  return { record, created: true }
}

/**
 * Bulk create with conflict handling
 */
export async function bulkCreateWithConflictHandling<T>(
  model: any,
  data: any[],
  _conflictFields: string[],
): Promise<T[]> {
  try {
    return await model.createMany({
      data,
      skipDuplicates: true,
    })
  } catch (_error) {
    // Fallback to individual creates if bulk fails
    const results: T[] = []

    for (const item of data) {
      try {
        const result = await model.create({ data: item })
        results.push(result)
      } catch (err) {
        // Skip duplicates
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          continue
        }
        throw err
      }
    }

    return results
  }
}

/**
 * Execute raw SQL safely
 */
export async function executeRawSql<T>(
  prisma: any,
  sql: string,
  params: any[] = [],
): Promise<T> {
  try {
    return await prisma.$queryRawUnsafe(sql, ...params)
  } catch (error) {
    throw handlePrismaError(error)
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(prisma: any): Promise<{
  tables: Array<{ name: string; count: number }>
}> {
  const models = ['user', 'post', 'refreshToken']
  const tables = []

  for (const model of models) {
    const count = await (prisma as any)[model].count()
    tables.push({ name: model, count })
  }

  return { tables }
}
