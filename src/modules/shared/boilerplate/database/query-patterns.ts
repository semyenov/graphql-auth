/**
 * Database Query Pattern Boilerplate
 *
 * ⚠️ DO NOT IMPORT THIS FILE DIRECTLY
 * Copy the patterns you need into your module's utils directory
 *
 * Source: shared/boilerplate/database/query-patterns.ts
 * Version: 1.0.0
 * Last Updated: 2025-01-16
 */

import type { PrismaClient } from '@prisma/client'

/**
 * Generic pagination pattern with total count
 *
 * @example
 * // Copy this pattern to: modules/posts/utils/database.ts
 * export async function paginatePosts(
 *   prisma: PrismaClient,
 *   skip: number = 0,
 *   take: number = 20,
 *   where?: any
 * ) {
 *   const [data, total] = await Promise.all([
 *     prisma.post.findMany({ skip, take, where, orderBy: { createdAt: 'desc' } }),
 *     prisma.post.count({ where })
 *   ])
 *   return { data, total, hasMore: skip + take < total }
 * }
 */
export async function paginateWithCount<T>(
  prisma: PrismaClient,
  model: string,
  skip: number = 0,
  take: number = 20,
  where?: any,
  orderBy?: any,
): Promise<{ data: T[]; total: number; hasMore: boolean }> {
  const [data, total] = await Promise.all([
    (prisma as any)[model].findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
    }),
    (prisma as any)[model].count({ where }),
  ])

  return {
    data,
    total,
    hasMore: skip + take < total,
  }
}

/**
 * Cursor-based pagination pattern
 *
 * @example
 * // Copy this pattern to: modules/posts/utils/database.ts
 * export async function paginatePostsByCursor(
 *   prisma: PrismaClient,
 *   cursor?: string,
 *   take: number = 20
 * ) {
 *   const posts = await prisma.post.findMany({
 *     take: take + 1, // Take one extra to check for more
 *     cursor: cursor ? { id: parseInt(cursor) } : undefined,
 *     skip: cursor ? 1 : 0,
 *     orderBy: { createdAt: 'desc' }
 *   })
 *   const hasMore = posts.length > take
 *   if (hasMore) posts.pop() // Remove the extra item
 *   return { data: posts, hasMore, nextCursor: hasMore ? posts[posts.length - 1]?.id.toString() : null }
 * }
 */
export async function paginateByCursor<T extends { id: number }>(
  findManyFunction: () => Promise<T[]>,
  take: number = 20,
): Promise<{ data: T[]; hasMore: boolean; nextCursor: string | null }> {
  const items = await findManyFunction()
  const hasMore = items.length > take

  if (hasMore) {
    items.pop() // Remove the extra item
  }

  return {
    data: items,
    hasMore,
    nextCursor: hasMore ? items[items.length - 1]?.id.toString() || null : null,
  }
}

/**
 * Safe find by ID with type safety
 *
 * @example
 * // Copy this pattern to: modules/users/utils/database.ts
 * export async function findUserById(prisma: PrismaClient, id: number): Promise<User | null> {
 *   try {
 *     return await prisma.user.findUnique({
 *       where: { id },
 *       select: {
 *         id: true,
 *         email: true,
 *         name: true,
 *         role: true,
 *         emailVerified: true,
 *         createdAt: true,
 *         updatedAt: true
 *       }
 *     })
 *   } catch (error) {
 *     throw new Error(`Failed to find user: ${error instanceof Error ? error.message : 'Unknown error'}`)
 *   }
 * }
 */
export async function safeFindById<T>(
  findFunction: () => Promise<T | null>,
  entityName: string,
  id: string | number,
): Promise<T | null> {
  try {
    return await findFunction()
  } catch (error) {
    throw new Error(
      `Failed to find ${entityName} with ID ${id}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    )
  }
}

/**
 * Batch loading pattern for N+1 prevention
 *
 * @example
 * // Copy this pattern to: modules/posts/utils/database.ts
 * export async function batchLoadPostsByAuthorIds(
 *   prisma: PrismaClient,
 *   authorIds: number[]
 * ): Promise<Post[][]> {
 *   const posts = await prisma.post.findMany({
 *     where: { authorId: { in: authorIds } },
 *     orderBy: { createdAt: 'desc' }
 *   })
 *
 *   return authorIds.map(authorId =>
 *     posts.filter(post => post.authorId === authorId)
 *   )
 * }
 */
export async function batchLoadByIds<T, K extends keyof T>(
  findManyFunction: (ids: any[]) => Promise<T[]>,
  ids: any[],
  groupByField: K,
): Promise<T[][]> {
  if (ids.length === 0) return []

  const items = await findManyFunction(ids)

  return ids.map((id) => items.filter((item) => item[groupByField] === id))
}

/**
 * Transaction wrapper with retry logic
 *
 * @example
 * // Copy this pattern to: modules/auth/utils/database.ts
 * export async function createUserWithTokens(
 *   prisma: PrismaClient,
 *   userData: CreateUserData,
 *   tokenData: CreateTokenData
 * ): Promise<{ user: User; tokens: RefreshToken[] }> {
 *   return await safeTransaction(prisma, async (tx) => {
 *     const user = await tx.user.create({ data: userData })
 *     const tokens = await tx.refreshToken.createMany({
 *       data: tokenData.map(token => ({ ...token, userId: user.id }))
 *     })
 *     return { user, tokens }
 *   })
 * }
 */
export async function safeTransaction<T>(
  prisma: PrismaClient,
  fn: (
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await prisma.$transaction(fn)
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('Unknown transaction error')

      // Don't retry on certain error types
      if (
        error instanceof Error &&
        (error.message.includes('Unique constraint') ||
          error.message.includes('Foreign key constraint'))
      ) {
        throw error
      }

      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 100))
    }
  }

  throw lastError || new Error('Transaction failed after retries')
}

/**
 * Search pattern with full-text capabilities
 *
 * @example
 * // Copy this pattern to: modules/posts/utils/database.ts
 * export async function searchPosts(
 *   prisma: PrismaClient,
 *   searchTerm: string,
 *   limit: number = 20
 * ): Promise<Post[]> {
 *   return await fuzzySearch(
 *     () => prisma.post.findMany({
 *       where: {
 *         OR: [
 *           { title: { contains: searchTerm, mode: 'insensitive' } },
 *           { content: { contains: searchTerm, mode: 'insensitive' } }
 *         ]
 *       },
 *       take: limit
 *     }),
 *     searchTerm,
 *     'posts'
 *   )
 * }
 */
export async function fuzzySearch<T>(
  searchFunction: () => Promise<T[]>,
  searchTerm: string,
  entityName: string,
): Promise<T[]> {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return []
  }

  try {
    return await searchFunction()
  } catch (error) {
    throw new Error(
      `Failed to search ${entityName}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    )
  }
}

/**
 * Soft delete pattern
 *
 * @example
 * // Copy this pattern to: modules/posts/utils/database.ts
 * export async function softDeletePost(
 *   prisma: PrismaClient,
 *   postId: number,
 *   deletedBy: number
 * ): Promise<Post> {
 *   return await softDelete(
 *     () => prisma.post.update({
 *       where: { id: postId },
 *       data: {
 *         deletedAt: new Date(),
 *         deletedBy: deletedBy
 *       }
 *     }),
 *     'post',
 *     postId
 *   )
 * }
 */
export async function softDelete<T>(
  updateFunction: () => Promise<T>,
  entityName: string,
  id: string | number,
): Promise<T> {
  try {
    return await updateFunction()
  } catch (error) {
    throw new Error(
      `Failed to soft delete ${entityName} with ID ${id}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    )
  }
}

/**
 * Upsert pattern with conflict resolution
 *
 * @example
 * // Copy this pattern to: modules/users/utils/database.ts
 * export async function upsertUserPreferences(
 *   prisma: PrismaClient,
 *   userId: number,
 *   preferences: UserPreferencesData
 * ): Promise<UserPreferences> {
 *   return await safeUpsert(
 *     () => prisma.userPreferences.upsert({
 *       where: { userId },
 *       create: { userId, ...preferences },
 *       update: preferences
 *     }),
 *     'user preferences',
 *     userId
 *   )
 * }
 */
export async function safeUpsert<T>(
  upsertFunction: () => Promise<T>,
  entityName: string,
  identifier: string | number,
): Promise<T> {
  try {
    return await upsertFunction()
  } catch (error) {
    throw new Error(
      `Failed to upsert ${entityName} for ${identifier}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    )
  }
}
