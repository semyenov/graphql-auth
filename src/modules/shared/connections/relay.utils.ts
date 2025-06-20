/**
 * Relay Connection Utilities
 *
 * Helper functions for implementing Relay-style connections
 */

// Re-export global ID utilities from core
export {
  encodeGlobalId,
  parseAndValidateGlobalId,
} from '../../../core/utils/relay'

import { fromGlobalId } from '../../../core/utils/relay'
import {
  CONNECTION_DEFAULTS,
  type Connection,
  type ConnectionArgs,
  type ConnectionMetadata,
  type ConnectionSlice,
  type CursorData,
  type Edge,
  type EnhancedConnection,
  type GlobalIdComponents,
  type Node,
  type PageInfo,
} from './relay.types'

/**
 * Decode a global ID (using core implementation)
 */
export function decodeGlobalId(globalId: string): GlobalIdComponents {
  const { type, id } = fromGlobalId(globalId)

  if (!(type && id)) {
    throw new Error('Invalid global ID format')
  }

  return { type, id }
}

/**
 * Encode a cursor
 */
export function encodeCursor(data: CursorData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

/**
 * Decode a cursor
 */
export function decodeCursor(cursor: string): CursorData {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch (_error) {
    throw new Error('Invalid cursor')
  }
}

/**
 * Create a connection from items
 */
export function createConnection<T extends Node>(
  items: T[],
  args: ConnectionArgs,
  totalCount?: number,
): Connection<T> {
  const edges = items.map((item) => createEdge(item))
  const pageInfo = createPageInfo(edges, args, items.length)

  return {
    edges,
    pageInfo,
    totalCount,
  }
}

/**
 * Create an enhanced connection with metadata
 */
export function createEnhancedConnection<T extends Node>(
  items: T[],
  args: ConnectionArgs,
  metadata?: ConnectionMetadata,
): EnhancedConnection<T> {
  const connection = createConnection(items, args, metadata?.totalCount)

  return {
    ...connection,
    metadata,
  }
}

/**
 * Create an edge from a node
 */
export function createEdge<T extends Node>(node: T): Edge<T> {
  return {
    cursor: encodeCursor({ id: node.id }),
    node,
  }
}

/**
 * Create PageInfo
 */
export function createPageInfo<T extends Node>(
  edges: Edge<T>[],
  args: ConnectionArgs,
  itemCount: number,
): PageInfo {
  const hasRequestedMoreThanExists =
    (args.first && itemCount < args.first) ||
    (args.last && itemCount < args.last)

  return {
    startCursor: edges[0]?.cursor || null,
    endCursor: edges[edges.length - 1]?.cursor || null,
    hasPreviousPage: !!args.after,
    hasNextPage: !!(args.first && !hasRequestedMoreThanExists),
  }
}

/**
 * Apply connection arguments to a query
 */
export function applyConnectionArgs<T extends Record<string, unknown>>(
  query: T,
  args: ConnectionArgs,
): T & {
  take: number
  skip: number | undefined
  cursor: { id: number } | undefined
  orderBy: Record<string, unknown>
} {
  let take: number | undefined
  let skip: number | undefined
  let cursor: { id: number } | undefined
  let orderBy: Record<string, unknown> = { id: 'asc' }

  // Forward pagination
  if (args.first) {
    take = Math.min(args.first, CONNECTION_DEFAULTS.MAX_FIRST)

    if (args.after) {
      const { id } = decodeCursor(args.after)
      cursor = { id: Number.parseInt(id.toString(), 10) }
      skip = 1 // Skip the cursor
    }
  }

  // Backward pagination
  else if (args.last) {
    take = -Math.min(args.last, CONNECTION_DEFAULTS.MAX_FIRST)
    orderBy = { id: 'desc' } as Record<string, unknown>

    if (args.before) {
      const { id } = decodeCursor(args.before)
      cursor = { id: Number.parseInt(id.toString(), 10) }
      skip = 1 // Skip the cursor
    }
  }

  // Default
  else {
    take = CONNECTION_DEFAULTS.DEFAULT_FIRST
  }

  return {
    ...query,
    take: take ?? CONNECTION_DEFAULTS.DEFAULT_FIRST,
    skip,
    cursor,
    orderBy: (query.orderBy as Record<string, unknown>) || orderBy,
  }
}

/**
 * Get connection slice (for custom implementations)
 */
export async function getConnectionSlice<T extends { id: number }>(
  fetchFn: (options: Record<string, unknown>) => Promise<T[]>,
  countFn: () => Promise<number>,
  args: ConnectionArgs,
  queryOptions: Record<string, unknown> = {},
): Promise<ConnectionSlice<T>> {
  const connectionQuery = applyConnectionArgs(queryOptions, args)

  // Fetch one extra item to determine hasNextPage
  const originalTake = connectionQuery.take
  connectionQuery.take = originalTake > 0 ? originalTake + 1 : originalTake - 1

  const items = await fetchFn(connectionQuery)
  const totalCount = await countFn()

  // Check if we got the extra item
  const hasExtraItem = Math.abs(items.length) > Math.abs(originalTake)

  // Remove the extra item
  if (hasExtraItem) {
    if (originalTake > 0) {
      items.pop()
    } else {
      items.shift()
    }
  }

  // Reverse items for backward pagination
  if (args.last) {
    items.reverse()
  }

  return {
    items,
    hasNextPage: args.first ? hasExtraItem : !!args.before,
    hasPreviousPage: args.last ? hasExtraItem : !!args.after,
    totalCount,
  }
}

/**
 * Validate connection arguments
 */
export function validateConnectionArgs(args: ConnectionArgs): void {
  if (args.first !== null && args.first !== undefined) {
    if (args.first < 0) {
      throw new Error('Argument "first" must be a non-negative integer')
    }
    if (args.first > CONNECTION_DEFAULTS.MAX_FIRST) {
      throw new Error(
        `Argument "first" must not exceed ${CONNECTION_DEFAULTS.MAX_FIRST}`,
      )
    }
  }

  if (args.last !== null && args.last !== undefined) {
    if (args.last < 0) {
      throw new Error('Argument "last" must be a non-negative integer')
    }
    if (args.last > CONNECTION_DEFAULTS.MAX_FIRST) {
      throw new Error(
        `Argument "last" must not exceed ${CONNECTION_DEFAULTS.MAX_FIRST}`,
      )
    }
  }

  if (args.first && args.last) {
    throw new Error('Cannot specify both "first" and "last"')
  }

  if (args.after && args.before) {
    throw new Error('Cannot specify both "after" and "before"')
  }

  if (args.after && args.last) {
    throw new Error('Cannot use "after" with "last"')
  }

  if (args.before && args.first) {
    throw new Error('Cannot use "before" with "first"')
  }
}

/**
 * Get default connection arguments
 */
export function getDefaultConnectionArgs(): ConnectionArgs {
  return {
    first: CONNECTION_DEFAULTS.DEFAULT_FIRST,
    after: null,
    last: null,
    before: null,
  }
}

/**
 * Convert offset pagination to connection args
 */
export function offsetToConnectionArgs(
  offset: number,
  limit: number,
): ConnectionArgs {
  // Create a cursor for the offset
  const cursor = offset > 0 ? encodeCursor({ id: offset }) : null

  return {
    first: limit,
    after: cursor,
    last: null,
    before: null,
  }
}

/**
 * Helper to create empty connection
 */
export function createEmptyConnection<T extends Node>(): Connection<T> {
  return {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    totalCount: 0,
  }
}
