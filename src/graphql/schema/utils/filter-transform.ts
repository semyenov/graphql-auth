/**
 * Utility functions to transform GraphQL filter inputs to Prisma where clauses
 */

import type { Prisma } from '@prisma/client'

// Transform string filter to Prisma where clause
export function transformStringFilter(
  filter: Prisma.StringFilter | null | undefined,
): Prisma.StringFilter | undefined {
  if (!filter) return undefined

  const prismaFilter: Prisma.StringFilter = {}

  if (filter.equals !== undefined && filter.equals !== null)
    prismaFilter.equals = filter.equals
  if (filter.contains !== undefined && filter.contains !== null)
    prismaFilter.contains = filter.contains
  if (filter.startsWith !== undefined && filter.startsWith !== null)
    prismaFilter.startsWith = filter.startsWith
  if (filter.endsWith !== undefined && filter.endsWith !== null)
    prismaFilter.endsWith = filter.endsWith
  if (filter.not !== undefined && filter.not !== null)
    prismaFilter.not = filter.not

  return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined
}

export interface UserWhereInputType {
  name?: Prisma.StringFilter | null
  email?: Prisma.StringFilter | null
}

export function transformUserWhereInput(
  where: UserWhereInputType | null | undefined,
) {
  if (!where) return undefined

  const prismaWhere: Prisma.UserWhereInput = {}

  if (where.name) {
    prismaWhere.name = transformStringFilter(where.name)
  }
  if (where.email) {
    prismaWhere.email = transformStringFilter(where.email)
  }

  return Object.keys(prismaWhere).length > 0 ? prismaWhere : undefined
}

export interface PostWhereInputType {
  title?: Prisma.StringFilter
  content?: Prisma.StringFilter
  published?: Prisma.BoolFilter
  viewCount?: Prisma.IntFilter
  createdAt?: Prisma.DateTimeFilter
  updatedAt?: Prisma.DateTimeFilter
}

// Transform post where input to Prisma where clause
export function transformPostWhereInput(
  where: PostWhereInputType | null | undefined,
) {
  if (!where) return undefined

  const prismaWhere: Prisma.PostWhereInput = {}

  if (where.title) {
    prismaWhere.title = transformStringFilter(where.title)
  }
  if (where.content) {
    prismaWhere.content = transformStringFilter(where.content)
  }
  if (where.published !== undefined) {
    prismaWhere.published = where.published
  }
  if (where.viewCount !== undefined) {
    prismaWhere.viewCount = where.viewCount
  }
  if (where.createdAt !== undefined) {
    prismaWhere.createdAt = where.createdAt
  }
  if (where.updatedAt !== undefined) {
    prismaWhere.updatedAt = where.updatedAt
  }

  return Object.keys(prismaWhere).length > 0 ? prismaWhere : undefined
}

export interface OrderByInputType {
  id?: Prisma.SortOrder | null
  title?: Prisma.SortOrder | null
  content?: Prisma.SortOrder | null
  published?: Prisma.SortOrder | null
  viewCount?: Prisma.SortOrder | null
  createdAt?: Prisma.SortOrder | null
  updatedAt?: Prisma.SortOrder | null
  [key: string]: Prisma.SortOrder | null | undefined
}

// Transform order by input to Prisma orderBy clause
export function transformOrderBy(orderBy: OrderByInputType | null | undefined) {
  if (!orderBy) return undefined

  const prismaOrderBy: Prisma.PostOrderByWithRelationInput = {}

  for (const key of Object.keys(orderBy)) {
    if (orderBy[key] !== undefined) {
      prismaOrderBy[key as keyof Prisma.PostOrderByWithRelationInput] = orderBy[
        key
      ] as Prisma.SortOrder
    }
  }

  return Object.keys(prismaOrderBy).length > 0 ? prismaOrderBy : undefined
}
