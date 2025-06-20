/**
 * Pagination Utilities
 * 
 * Helper functions for implementing pagination across modules
 */

import {
  Connection,
  CursorPaginationArgs,
  Edge,
  OffsetPaginationArgs,
  PageInfo,
  PagePaginationArgs,
  PaginatedResponse,
  PAGINATION_DEFAULTS,
} from './pagination.types'

/**
 * Encode a cursor from an ID
 */
export function encodeCursor(id: string | number): string {
  return Buffer.from(`cursor:${id}`).toString('base64')
}

/**
 * Decode a cursor to get the ID
 */
export function decodeCursor(cursor: string): string {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    return decoded.replace('cursor:', '')
  } catch {
    throw new Error('Invalid cursor')
  }
}

/**
 * Create a connection from an array of items
 */
export function createConnection<T extends { id: string | number }>(
  items: T[],
  args: CursorPaginationArgs,
  totalCount?: number
): Connection<T> {
  const edges: Edge<T>[] = items.map(item => ({
    cursor: encodeCursor(item.id),
    node: item,
  }))

  const pageInfo: PageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: edges[0]?.cursor || null,
    endCursor: edges[edges.length - 1]?.cursor || null,
  }

  // Simple heuristic for hasNextPage/hasPreviousPage
  if (args.first && items.length === args.first) {
    pageInfo.hasNextPage = true
  }
  if (args.after) {
    pageInfo.hasPreviousPage = true
  }

  return {
    edges,
    pageInfo,
    totalCount,
  }
}

/**
 * Convert cursor pagination args to offset/limit
 */
export function cursorToOffset(args: CursorPaginationArgs): { offset: number; limit: number } {
  let offset = 0
  let limit: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT

  if (args.first) {
    limit = Math.min(args.first, PAGINATION_DEFAULTS.MAX_LIMIT)
  } else if (args.last) {
    limit = Math.min(args.last, PAGINATION_DEFAULTS.MAX_LIMIT)
  }

  if (args.after) {
    const id = decodeCursor(args.after)
    // In a real implementation, you'd need to find the position of this ID
    // For now, we'll use a simple numeric approach
    offset = parseInt(id, 10) || 0
  }

  return { offset, limit }
}

/**
 * Convert page pagination to offset/limit
 */
export function pageToOffset(args: PagePaginationArgs): { offset: number; limit: number } {
  const page = args.page || PAGINATION_DEFAULTS.DEFAULT_PAGE
  const perPage = args.perPage || PAGINATION_DEFAULTS.DEFAULT_LIMIT
  const limit = Math.min(perPage, PAGINATION_DEFAULTS.MAX_LIMIT)
  const offset = (page - 1) * limit

  return { offset, limit }
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  args: PagePaginationArgs
): PaginatedResponse<T> {
  const page = args.page || PAGINATION_DEFAULTS.DEFAULT_PAGE
  const perPage = args.perPage || PAGINATION_DEFAULTS.DEFAULT_LIMIT
  const totalPages = Math.ceil(total / perPage)

  return {
    items,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

/**
 * Apply pagination to a query builder (Prisma example)
 */
export function applyPagination(
  query: any,
  args: CursorPaginationArgs | OffsetPaginationArgs | PagePaginationArgs
): any {
  let skip: number | undefined
  let take: number | undefined
  let cursor: { id: number } | undefined

  if ('first' in args || 'after' in args) {
    // Cursor pagination
    const { offset, limit } = cursorToOffset(args as CursorPaginationArgs)
    skip = offset
    take = limit

    if (args.after) {
      cursor = { id: parseInt(decodeCursor(args.after), 10) }
      skip = 1 // Skip the cursor itself
    }
  } else if ('limit' in args || 'offset' in args) {
    // Offset pagination
    skip = (args as OffsetPaginationArgs).offset || 0
    take = (args as OffsetPaginationArgs).limit || PAGINATION_DEFAULTS.DEFAULT_LIMIT
  } else if ('page' in args || 'perPage' in args) {
    // Page pagination
    const { offset, limit } = pageToOffset(args as PagePaginationArgs)
    skip = offset
    take = limit
  }

  return {
    ...query,
    skip,
    take: take ? Math.min(take, PAGINATION_DEFAULTS.MAX_LIMIT) : undefined,
    cursor,
  }
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  perPage: number
) {
  const totalPages = Math.ceil(total / perPage)
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return {
    currentPage: page,
    perPage,
    total,
    totalPages,
    from,
    to,
  }
}

/**
 * Validate pagination arguments
 */
export function validatePaginationArgs(args: CursorPaginationArgs): void {
  if (args.first && args.last) {
    throw new Error('Cannot specify both first and last')
  }

  if (args.after && args.before) {
    throw new Error('Cannot specify both after and before')
  }

  if (args.first && args.first < 0) {
    throw new Error('First must be a positive number')
  }

  if (args.last && args.last < 0) {
    throw new Error('Last must be a positive number')
  }

  if (args.first && args.first > PAGINATION_DEFAULTS.MAX_LIMIT) {
    throw new Error(`First cannot exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`)
  }

  if (args.last && args.last > PAGINATION_DEFAULTS.MAX_LIMIT) {
    throw new Error(`Last cannot exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`)
  }
}

/**
 * Get default pagination args
 */
export function getDefaultPaginationArgs(): CursorPaginationArgs {
  return {
    first: PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    after: null,
    last: null,
    before: null,
  }
}

/**
 * Merge pagination args with defaults
 */
export function mergePaginationArgs(
  args: Partial<CursorPaginationArgs>
): CursorPaginationArgs {
  const defaults = getDefaultPaginationArgs()

  // If no pagination args provided, use defaults
  if (!args.first && !args.last && !args.after && !args.before) {
    return defaults
  }

  return {
    ...defaults,
    ...args,
  }
}

// Additional functions for tests
export function calculateOffset(page: number, pageSize: number): number {
  return Math.max(0, (page - 1) * pageSize)
}

export function calculateTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize)
}

export function hasNextPage(currentPage: number, totalPages: number): boolean {
  return currentPage < totalPages
}

export function hasPreviousPage(currentPage: number): boolean {
  return currentPage > 1
}

export function createPaginationInfo(params: {
  currentPage: number
  pageSize: number
  totalItems: number
  currentItems: number
}) {
  const totalPages = calculateTotalPages(params.totalItems, params.pageSize)
  const startIndex = calculateOffset(params.currentPage, params.pageSize)
  const endIndex = startIndex + params.currentItems - 1

  return {
    currentPage: params.currentPage,
    pageSize: params.pageSize,
    totalPages,
    totalItems: params.totalItems,
    hasNextPage: hasNextPage(params.currentPage, totalPages),
    hasPreviousPage: hasPreviousPage(params.currentPage),
    startIndex,
    endIndex,
  }
}

export function offsetToCursor(offset: number): string {
  return encodeCursor(offset)
}

export function parsePageNumber(value: any): number {
  const num = parseInt(value, 10)
  return isNaN(num) || num < 1 ? 1 : num
}

export function getDefaultPageSize(size?: number | null): number {
  if (size === null || size === undefined) return PAGINATION_DEFAULTS.DEFAULT_LIMIT
  if (size < 1) return PAGINATION_DEFAULTS.MIN_LIMIT
  return Math.min(size, PAGINATION_DEFAULTS.MAX_LIMIT)
}

export function validateCursorArgs(args: CursorPaginationArgs): void {
  if (args.first !== null && args.first !== undefined && args.last !== null && args.last !== undefined) {
    throw new Error('Cannot specify both "first" and "last"')
  }

  if (args.after !== null && args.after !== undefined && args.before !== null && args.before !== undefined) {
    throw new Error('Cannot specify both "after" and "before"')
  }

  if (args.first !== null && args.first !== undefined && args.first < 0) {
    throw new Error('Argument "first" must be a non-negative integer')
  }

  if (args.last !== null && args.last !== undefined && args.last < 0) {
    throw new Error('Argument "last" must be a non-negative integer')
  }

  if (args.first && args.first > PAGINATION_DEFAULTS.MAX_LIMIT) {
    throw new Error(`Argument "first" must not exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`)
  }

  if (args.last && args.last > PAGINATION_DEFAULTS.MAX_LIMIT) {
    throw new Error(`Argument "last" must not exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`)
  }

  if (args.after && args.last) {
    throw new Error('Cannot use "after" with "last"')
  }

  if (args.before && args.first) {
    throw new Error('Cannot use "before" with "first"')
  }
}

export function validateOffsetArgs(args: OffsetPaginationArgs): void {
  if (args.offset !== undefined && args.offset < 0) {
    throw new Error('Offset must be non-negative')
  }

  if (args.limit !== undefined && args.limit <= 0) {
    throw new Error('Limit must be positive')
  }

  if (args.limit !== undefined && args.limit > PAGINATION_DEFAULTS.MAX_LIMIT) {
    throw new Error(`Limit must not exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`)
  }
}

export function validatePageArgs(args: PagePaginationArgs): void {
  const page = args.page ?? 1
  const perPage = args.perPage ?? PAGINATION_DEFAULTS.DEFAULT_LIMIT
  
  if (page <= 0) {
    throw new Error('Page must be positive')
  }

  if (perPage <= 0) {
    throw new Error('Page size must be positive')
  }

  if (perPage > PAGINATION_DEFAULTS.MAX_LIMIT) {
    throw new Error(`Page size must not exceed ${PAGINATION_DEFAULTS.MAX_LIMIT}`)
  }
}

export function transformToCursorPagination(args: OffsetPaginationArgs): CursorPaginationArgs {
  return {
    first: args.limit || PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    after: args.offset && args.offset > 0 ? offsetToCursor(args.offset) : null,
    last: null,
    before: null,
  }
}

export function transformToOffsetPagination(args: CursorPaginationArgs): OffsetPaginationArgs {
  let offset = 0
  let limit: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT

  if (args.first) {
    limit = args.first
    if (args.after) {
      offset = parseInt(decodeCursor(args.after), 10) + 1
    }
  } else if (args.last) {
    limit = args.last
    if (args.before) {
      const beforeOffset = parseInt(decodeCursor(args.before), 10)
      offset = Math.max(0, beforeOffset - args.last - 1)
    }
  }

  return { offset, limit }
}

export function transformToPagePagination(args: OffsetPaginationArgs): PagePaginationArgs {
  const offset = args.offset || 0
  const limit = args.limit || PAGINATION_DEFAULTS.DEFAULT_LIMIT
  const page = Math.floor(offset / limit) + 1
  return {
    page,
    perPage: limit,
  }
}