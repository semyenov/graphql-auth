/**
 * Prisma Helper Functions
 *
 * Utility functions for common Prisma operations
 */

import type { PrismaClient } from '@prisma/client'
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
  prisma: PrismaClient,
  fn: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
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
export function buildWhereClause(
  filters: Record<string, unknown>,
): Record<string, unknown> {
  const where: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue

    // Handle different filter types
    if (typeof value === 'string') {
      // Case-insensitive string matching
      where[key] = { contains: value, mode: 'insensitive' }
    } else if (Array.isArray(value)) {
      // IN clause
      where[key] = { in: value }
    } else if (typeof value === 'object' && value !== null && 'min' in value) {
      // Range query
      const rangeValue = value as { min?: unknown; max?: unknown }
      where[key] = {
        gte: rangeValue.min,
        lte: rangeValue.max,
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
}): Record<string, 'asc' | 'desc'> {
  if (!sort) return { createdAt: 'desc' }

  return { [sort.field]: sort.direction }
}

/**
 * Apply cursor-based pagination
 */
export function applyCursorPagination(
  query: Record<string, unknown>,
  cursor?: string,
  take = 20,
): Record<string, unknown> {
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
export function applyOffsetPagination(
  query: Record<string, unknown>,
  page = 1,
  perPage = 20,
): Record<string, unknown> {
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
 * Check if record exists
 */
export async function exists(
  model: {
    count: (args: { where: Record<string, unknown> }) => Promise<number>
  },
  where: Record<string, unknown>,
): Promise<boolean> {
  const count = await model.count({ where })
  return count > 0
}
