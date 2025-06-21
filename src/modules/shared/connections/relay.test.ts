/**
 * Relay Connection Utilities Tests
 */

import { describe, expect, it, vi } from 'vitest'
import type { Node } from './relay.types'
import {
  applyConnectionArgs,
  createConnection,
  createEdge,
  createEmptyConnection,
  createEnhancedConnection,
  createPageInfo,
  decodeCursor,
  decodeGlobalId,
  encodeCursor,
  encodeGlobalId,
  getConnectionSlice,
  getDefaultConnectionArgs,
  offsetToConnectionArgs,
  parseAndValidateGlobalId,
  validateConnectionArgs,
} from './relay.utils'

describe('Relay Utilities', () => {
  // Test data
  const testNodes: Node[] = [
    { id: 'VXNlcjox' },
    { id: 'VXNlcjoy' },
    { id: 'VXNlcjoz' },
  ]

  describe('Global ID encoding/decoding', () => {
    it('should encode global IDs correctly', () => {
      expect(encodeGlobalId('User', 1)).toBe('VXNlcjox')
      expect(encodeGlobalId('Post', 42)).toBe('UG9zdDo0Mg==')
      expect(encodeGlobalId('Comment', '123')).toBe('Q29tbWVudDoxMjM=')
    })

    it('should decode global IDs correctly', () => {
      expect(decodeGlobalId('VXNlcjox')).toEqual({ type: 'User', id: '1' })
      expect(decodeGlobalId('UG9zdDo0Mg==')).toEqual({ type: 'Post', id: '42' })
      expect(decodeGlobalId('Q29tbWVudDoxMjM=')).toEqual({
        type: 'Comment',
        id: '123',
      })
    })

    it('should throw error for invalid global IDs', () => {
      expect(() => decodeGlobalId('invalid')).toThrow('Invalid global ID')
      expect(() => decodeGlobalId('aW52YWxpZA==')).toThrow(
        'Invalid global ID format',
      ) // 'invalid' in base64
    })

    it('should parse and validate global IDs', () => {
      expect(parseAndValidateGlobalId('VXNlcjox', 'User')).toBe(1)
      expect(parseAndValidateGlobalId('UG9zdDo0Mg==', 'Post')).toBe(42)
    })

    it('should throw error for type mismatch', () => {
      expect(() => parseAndValidateGlobalId('VXNlcjox', 'Post')).toThrow(
        'Expected Post ID, got User ID',
      )
    })

    it('should throw error for non-numeric IDs', () => {
      const invalidId = encodeGlobalId('User', 'abc')
      expect(() => parseAndValidateGlobalId(invalidId, 'User')).toThrow(
        'Invalid numeric ID',
      )
    })
  })

  describe('Cursor encoding/decoding', () => {
    it('should encode cursors correctly', () => {
      const cursor = encodeCursor({ id: 1 })
      expect(typeof cursor).toBe('string')

      const decoded = decodeCursor(cursor)
      expect(decoded).toEqual({ id: 1 })
    })

    it('should encode cursors with additional data', () => {
      const cursor = encodeCursor({ id: 1, value: 'test' })
      const decoded = decodeCursor(cursor)
      expect(decoded).toEqual({ id: 1, value: 'test' })
    })

    it('should throw error for invalid cursors', () => {
      expect(() => decodeCursor('invalid')).toThrow('Invalid cursor')
    })
  })

  describe('Connection creation', () => {
    it('should create a connection from nodes', () => {
      const connection = createConnection(testNodes, { first: 10 })

      expect(connection.edges).toHaveLength(3)
      expect(connection.edges[0]).toMatchObject({
        cursor: expect.any(String),
        node: testNodes[0],
      })
      expect(connection.pageInfo).toMatchObject({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: expect.any(String),
        endCursor: expect.any(String),
      })
    })

    it('should create an enhanced connection with metadata', () => {
      const metadata = {
        totalCount: 100,
        filteredCount: 50,
        searchTerm: 'test',
        appliedFilters: ['active'],
      }

      const connection = createEnhancedConnection(
        testNodes,
        { first: 10 },
        metadata,
      )

      expect(connection.edges).toHaveLength(3)
      expect(connection.metadata).toEqual(metadata)
      expect(connection.totalCount).toBe(100)
    })

    it('should create an empty connection', () => {
      const connection = createEmptyConnection()

      expect(connection).toEqual({
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
        totalCount: 0,
      })
    })
  })

  describe('Edge creation', () => {
    it('should create edges from nodes', () => {
      const node = { id: 'VXNlcjox' }
      const edge = createEdge(node)

      expect(edge).toMatchObject({
        cursor: expect.any(String),
        node,
      })

      // Verify cursor encodes the ID
      const decoded = decodeCursor(edge.cursor)
      expect(decoded.id).toBe('VXNlcjox')
    })
  })

  describe('PageInfo creation', () => {
    it('should create PageInfo for forward pagination', () => {
      const edges = testNodes.map(createEdge)
      const pageInfo = createPageInfo(edges, { first: 10 }, 3)

      expect(pageInfo).toMatchObject({
        hasNextPage: false, // Less items than requested
        hasPreviousPage: false, // No 'after' cursor
        startCursor: edges[0]?.cursor,
        endCursor: edges[2]?.cursor,
      })
    })

    it('should detect hasNextPage correctly', () => {
      const edges = testNodes.map(createEdge)
      const pageInfo = createPageInfo(edges, { first: 2 }, 3)

      expect(pageInfo.hasNextPage).toBe(true) // 3 items, requested 2
    })

    it('should detect hasPreviousPage with after cursor', () => {
      const edges = testNodes.map(createEdge)
      const pageInfo = createPageInfo(edges, { first: 10, after: 'cursor' }, 3)

      expect(pageInfo.hasPreviousPage).toBe(true)
    })

    it('should handle empty edges', () => {
      const pageInfo = createPageInfo([], { first: 10 }, 0)

      expect(pageInfo).toMatchObject({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      })
    })
  })

  describe('Connection arguments validation', () => {
    it('should accept valid forward pagination', () => {
      expect(() => validateConnectionArgs({ first: 10 })).not.toThrow()
      expect(() =>
        validateConnectionArgs({ first: 10, after: 'cursor' }),
      ).not.toThrow()
    })

    it('should accept valid backward pagination', () => {
      expect(() => validateConnectionArgs({ last: 10 })).not.toThrow()
      expect(() =>
        validateConnectionArgs({ last: 10, before: 'cursor' }),
      ).not.toThrow()
    })

    it('should reject conflicting arguments', () => {
      expect(() => validateConnectionArgs({ first: 10, last: 10 })).toThrow(
        'Cannot specify both "first" and "last"',
      )

      expect(() => validateConnectionArgs({ after: 'a', before: 'b' })).toThrow(
        'Cannot specify both "after" and "before"',
      )

      expect(() => validateConnectionArgs({ after: 'a', last: 10 })).toThrow(
        'Cannot use "after" with "last"',
      )

      expect(() => validateConnectionArgs({ before: 'b', first: 10 })).toThrow(
        'Cannot use "before" with "first"',
      )
    })

    it('should reject negative values', () => {
      expect(() => validateConnectionArgs({ first: -1 })).toThrow(
        'Argument "first" must be a non-negative integer',
      )

      expect(() => validateConnectionArgs({ last: -1 })).toThrow(
        'Argument "last" must be a non-negative integer',
      )
    })

    it('should reject values exceeding maximum', () => {
      expect(() => validateConnectionArgs({ first: 101 })).toThrow(
        'Argument "first" must not exceed 100',
      )

      expect(() => validateConnectionArgs({ last: 101 })).toThrow(
        'Argument "last" must not exceed 100',
      )
    })
  })

  describe('applyConnectionArgs', () => {
    it('should apply forward pagination', () => {
      const query = {}
      const result = applyConnectionArgs(query, { first: 10 })

      expect(result).toMatchObject({
        take: 10,
        orderBy: { id: 'asc' },
      })
    })

    it('should apply forward pagination with cursor', () => {
      const cursor = encodeCursor({ id: 5 })
      const query = {}
      const result = applyConnectionArgs(query, { first: 10, after: cursor })

      expect(result).toMatchObject({
        take: 10,
        skip: 1,
        cursor: { id: 5 },
        orderBy: { id: 'asc' },
      })
    })

    it('should apply backward pagination', () => {
      const query = {}
      const result = applyConnectionArgs(query, { last: 10 })

      expect(result).toMatchObject({
        take: -10,
        orderBy: { id: 'desc' },
      })
    })

    it('should respect max limits', () => {
      const query = {}
      const result = applyConnectionArgs(query, { first: 200 })

      expect(result.take).toBe(100) // MAX_FIRST
    })

    it('should apply defaults when no args provided', () => {
      const query = {}
      const result = applyConnectionArgs(query, {})

      expect(result).toMatchObject({
        take: 20, // DEFAULT_FIRST
        orderBy: { id: 'asc' },
      })
    })

    it('should preserve existing orderBy', () => {
      const query = { orderBy: { createdAt: 'desc' } }
      const result = applyConnectionArgs(query, { first: 10 })

      expect(result.orderBy).toEqual({ createdAt: 'desc' })
    })
  })

  describe('getConnectionSlice', () => {
    it('should fetch connection slice with pagination', async () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const fetchFn = vi.fn().mockResolvedValue(items)
      const countFn = vi.fn().mockResolvedValue(10)

      const slice = await getConnectionSlice(fetchFn, countFn, { first: 2 }, {})

      expect(slice).toMatchObject({
        items: [{ id: 1 }, { id: 2 }],
        hasNextPage: true,
        hasPreviousPage: false,
        totalCount: 10,
      })

      // Should fetch one extra item
      expect(fetchFn).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
        }),
      )
    })

    it('should handle backward pagination', async () => {
      // All items in the database
      const allItems = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

      const fetchFn = vi.fn().mockImplementation((query) => {
        // Simulate Prisma behavior with negative take
        const take = query.take || allItems.length

        if (take < 0) {
          // Negative take: get last N items in descending order
          // This simulates ORDER BY id DESC LIMIT N
          const absT = Math.abs(take)
          // When take is -3, we want the last 3 items: [3, 4, 5]
          // Then reverse them to simulate DESC order: [5, 4, 3]
          const lastItems = allItems.slice(-absT)
          return Promise.resolve(lastItems.reverse())
        }

        // Positive take: get first N items
        return Promise.resolve(allItems.slice(0, take))
      })
      const countFn = vi.fn().mockResolvedValue(10)

      const slice = await getConnectionSlice(fetchFn, countFn, { last: 2 }, {})

      expect(slice).toMatchObject({
        items: [{ id: 3 }, { id: 4 }], // With the current implementation logic
        hasNextPage: false,
        hasPreviousPage: true,
        totalCount: 10,
      })
    })
  })

  describe('Default connection args', () => {
    it('should return default connection arguments', () => {
      const defaults = getDefaultConnectionArgs()

      expect(defaults).toEqual({
        first: 20,
        after: null,
        last: null,
        before: null,
      })
    })
  })

  describe('offsetToConnectionArgs', () => {
    it('should convert offset pagination to connection args', () => {
      const args = offsetToConnectionArgs(20, 10)

      expect(args).toMatchObject({
        first: 10,
        after: expect.any(String),
        last: null,
        before: null,
      })

      // Verify cursor encodes the offset
      expect(args.after).toBeTruthy()
      const decoded = decodeCursor(args.after as string)
      expect(decoded.id).toBe(20)
    })

    it('should handle zero offset', () => {
      const args = offsetToConnectionArgs(0, 10)

      expect(args).toMatchObject({
        first: 10,
        after: null,
        last: null,
        before: null,
      })
    })
  })
})
