/**
 * Pagination Types
 *
 * Common types and interfaces for pagination across all modules
 */

/**
 * Cursor-based pagination arguments
 */
export interface CursorPaginationArgs {
  first?: number | null
  after?: string | null
  last?: number | null
  before?: string | null
}

/**
 * Offset-based pagination arguments
 */
export interface OffsetPaginationArgs {
  limit?: number
  offset?: number
}

/**
 * Page-based pagination arguments
 */
export interface PagePaginationArgs {
  page?: number
  perPage?: number
}

/**
 * Relay-style PageInfo
 */
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
}

/**
 * Connection edge interface
 */
export interface Edge<T> {
  cursor: string
  node: T
}

/**
 * Relay-style connection interface
 */
export interface Connection<T> {
  edges: Edge<T>[]
  pageInfo: PageInfo
  totalCount?: number
}

/**
 * Paginated response for offset/page-based pagination
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
  from: number
  to: number
}

/**
 * Pagination options for queries
 */
export interface PaginationOptions {
  defaultLimit?: number
  maxLimit?: number
  defaultPage?: number
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Sort order
 */
export interface SortOrder<T = string> {
  field: T
  direction: SortDirection
}

/**
 * Combined pagination and sorting args
 */
export interface PaginatedQueryArgs<TSortField = string>
  extends CursorPaginationArgs {
  orderBy?: SortOrder<TSortField>[]
}

/**
 * Pagination constants
 */
export const PAGINATION_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  DEFAULT_PAGE: 1,
} as const

/**
 * Type guard for cursor pagination
 */
export function isCursorPagination(
  args: unknown,
): args is CursorPaginationArgs {
  return (
    args !== null &&
    args !== undefined &&
    typeof args === 'object' &&
    ('first' in args || 'after' in args || 'last' in args || 'before' in args)
  )
}

/**
 * Type guard for offset pagination
 */
export function isOffsetPagination(
  args: unknown,
): args is OffsetPaginationArgs {
  return (
    args !== null &&
    args !== undefined &&
    typeof args === 'object' &&
    ('limit' in args || 'offset' in args)
  )
}

/**
 * Type guard for page pagination
 */
export function isPagePagination(args: unknown): args is PagePaginationArgs {
  return (
    args !== null &&
    args !== undefined &&
    typeof args === 'object' &&
    ('page' in args || 'perPage' in args)
  )
}
