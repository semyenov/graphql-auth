/**
 * Shared domain types used across features
 */

export interface PaginationInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export interface Connection<T> {
  edges: Edge<T>[]
  pageInfo: PaginationInfo
  totalCount: number
}

export interface Edge<T> {
  node: T
  cursor: string
}

export interface PageArgs {
  first?: number
  after?: string
  last?: number
  before?: string
}

export interface TimestampedEntity {
  createdAt: Date
  updatedAt: Date
}

export interface IdentifiableEntity {
  id: number
}

export type Entity = IdentifiableEntity & TimestampedEntity