/**
 * Relay Connection Types
 *
 * Types and interfaces for Relay-style connections and global IDs
 */

/**
 * Node interface for Relay
 */
export interface Node {
  id: string
}

/**
 * PageInfo for connections
 */
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
}

/**
 * Edge interface
 */
export interface Edge<T extends Node> {
  cursor: string
  node: T
}

/**
 * Connection interface
 */
export interface Connection<T extends Node> {
  edges: Edge<T>[]
  pageInfo: PageInfo
  totalCount?: number
}

/**
 * Connection arguments
 */
export interface ConnectionArgs {
  first?: number | null
  after?: string | null
  last?: number | null
  before?: string | null
}

/**
 * Forward pagination arguments
 */
export interface ForwardPaginationArgs {
  first: number
  after?: string | null
}

/**
 * Backward pagination arguments
 */
export interface BackwardPaginationArgs {
  last: number
  before?: string | null
}

/**
 * Global ID components
 */
export interface GlobalIdComponents {
  type: string
  id: string | number
}

/**
 * Connection metadata
 */
export interface ConnectionMetadata {
  totalCount: number
  filteredCount?: number
  searchTerm?: string
  appliedFilters?: string[]
}

/**
 * Enhanced connection with metadata
 */
export interface EnhancedConnection<T extends Node> extends Connection<T> {
  metadata?: ConnectionMetadata
}

/**
 * Connection builder options
 */
export interface ConnectionBuilderOptions {
  includeMetadata?: boolean
  defaultFirst?: number
  maxFirst?: number
}

/**
 * Cursor data structure
 */
export interface CursorData {
  id: string | number
  value?: unknown // For sorting by non-id fields
}

/**
 * Connection slice info
 */
export interface ConnectionSlice<T> {
  items: T[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalCount?: number
}

/**
 * Type guards
 */
export function isNode(obj: unknown): obj is Node {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof (obj as Node).id === 'string'
  )
}

export function isConnection<T extends Node>(
  obj: unknown,
): obj is Connection<T> {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'edges' in obj &&
    'pageInfo' in obj &&
    Array.isArray((obj as Connection<T>).edges) &&
    (obj as Connection<T>).pageInfo !== null &&
    typeof (obj as Connection<T>).pageInfo === 'object' &&
    'hasNextPage' in (obj as Connection<T>).pageInfo &&
    'hasPreviousPage' in (obj as Connection<T>).pageInfo &&
    typeof (obj as Connection<T>).pageInfo.hasNextPage === 'boolean' &&
    typeof (obj as Connection<T>).pageInfo.hasPreviousPage === 'boolean'
  )
}

export function isForwardPagination(
  args: ConnectionArgs,
): args is ForwardPaginationArgs {
  return args.first !== null && args.first !== undefined && args.first > 0
}

export function isBackwardPagination(
  args: ConnectionArgs,
): args is BackwardPaginationArgs {
  return args.last !== null && args.last !== undefined && args.last > 0
}

/**
 * Connection constants
 */
export const CONNECTION_DEFAULTS = {
  DEFAULT_FIRST: 20,
  MAX_FIRST: 100,
  MIN_FIRST: 1,
} as const

/**
 * Global ID type prefixes
 */
export const GLOBAL_ID_TYPES = {
  USER: 'User',
  POST: 'Post',
  COMMENT: 'Comment',
  TAG: 'Tag',
  CATEGORY: 'Category',
} as const

export type GlobalIdType =
  (typeof GLOBAL_ID_TYPES)[keyof typeof GLOBAL_ID_TYPES]
