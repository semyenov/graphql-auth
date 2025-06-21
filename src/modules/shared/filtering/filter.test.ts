/**
 * Filtering Utilities Tests
 */

import { describe, expect, it } from 'vitest'
import {
  applyBaseFilter,
  applyCaseInsensitive,
  buildSearchQuery,
  combineFilters,
  getFilterSummary,
  sanitizeFilter,
  transformBooleanFilter,
  transformDateFilter,
  transformNumberFilter,
  transformOrderBy,
  transformOrderByArray,
  transformStringFilter,
  validateFilterDepth,
} from './filter.utils'

describe('Filter Utilities', () => {
  describe('transformStringFilter', () => {
    it('should transform string filter to Prisma format', () => {
      const filter = {
        contains: 'test',
        mode: 'insensitive' as const,
      }

      const result = transformStringFilter(filter)
      expect(result).toEqual({
        contains: 'test',
        mode: 'insensitive',
      })
    })

    it('should handle all string operators', () => {
      const filter = {
        equals: 'exact',
        not: 'not this',
        in: ['a', 'b', 'c'],
        notIn: ['d', 'e'],
        startsWith: 'start',
        endsWith: 'end',
      }

      const result = transformStringFilter(filter)
      expect(result).toMatchObject({
        equals: 'exact',
        not: 'not this',
        in: ['a', 'b', 'c'],
        notIn: ['d', 'e'],
        startsWith: 'start',
        endsWith: 'end',
      })
    })

    it('should return undefined for empty or null filter', () => {
      expect(transformStringFilter(null)).toBeUndefined()
      expect(transformStringFilter(undefined)).toBeUndefined()
      expect(transformStringFilter({})).toBeUndefined()
    })
  })

  describe('transformNumberFilter', () => {
    it('should transform number filter to Prisma format', () => {
      const filter = {
        gte: 10,
        lte: 100,
      }

      const result = transformNumberFilter(filter)
      expect(result).toEqual({
        gte: 10,
        lte: 100,
      })
    })

    it('should handle all number operators', () => {
      const filter = {
        equals: 42,
        not: 13,
        in: [1, 2, 3],
        notIn: [4, 5],
        lt: 100,
        lte: 100,
        gt: 0,
        gte: 0,
      }

      const result = transformNumberFilter(filter)
      expect(result).toMatchObject(filter)
    })

    it('should return undefined for empty filter', () => {
      expect(transformNumberFilter(null)).toBeUndefined()
      expect(transformNumberFilter({})).toBeUndefined()
    })
  })

  describe('transformDateFilter', () => {
    it('should transform date filter with Date objects', () => {
      const date = new Date('2024-01-01')
      const filter = {
        gte: date,
        lte: new Date('2024-12-31'),
      }

      const result = transformDateFilter(filter)
      expect(result).toEqual({
        gte: date,
        lte: new Date('2024-12-31'),
      })
    })

    it('should convert string dates to Date objects', () => {
      const filter = {
        equals: '2024-01-01',
        gte: '2024-01-01T00:00:00Z',
      }

      const result = transformDateFilter(filter)
      expect(result?.equals).toBeInstanceOf(Date)
      expect(result?.gte).toBeInstanceOf(Date)
    })

    it('should handle arrays of dates', () => {
      const filter = {
        in: ['2024-01-01', '2024-02-01'],
        notIn: ['2024-03-01'],
      }

      const result = transformDateFilter(filter)
      expect(result?.in).toHaveLength(2)
      expect(result?.in?.[0]).toBeInstanceOf(Date)
      expect(result?.notIn?.[0]).toBeInstanceOf(Date)
    })
  })

  describe('transformBooleanFilter', () => {
    it('should transform boolean filter', () => {
      expect(transformBooleanFilter({ equals: true })).toBe(true)
      expect(transformBooleanFilter({ equals: false })).toBe(false)
      expect(transformBooleanFilter({ not: true })).toEqual({ not: true })
      expect(transformBooleanFilter({ not: false })).toEqual({ not: false })
    })

    it('should return undefined for empty filter', () => {
      expect(transformBooleanFilter(null)).toBeUndefined()
      expect(transformBooleanFilter({})).toBeUndefined()
    })
  })

  describe('transformOrderBy', () => {
    it('should transform order by input', () => {
      expect(transformOrderBy({ field: 'name', direction: 'asc' })).toEqual({
        name: 'asc',
      })
      expect(
        transformOrderBy({ field: 'createdAt', direction: 'desc' }),
      ).toEqual({ createdAt: 'desc' })
    })

    it('should handle null/undefined', () => {
      expect(transformOrderBy(null)).toBeUndefined()
      expect(transformOrderBy(undefined)).toBeUndefined()
    })
  })

  describe('transformOrderByArray', () => {
    it('should transform multiple order by inputs', () => {
      const orderBy = [
        { field: 'name', direction: 'asc' as const },
        { field: 'createdAt', direction: 'desc' as const },
      ]

      const result = transformOrderByArray(orderBy)
      expect(result).toEqual([{ name: 'asc' }, { createdAt: 'desc' }])
    })

    it('should handle empty array', () => {
      expect(transformOrderByArray([])).toBeUndefined()
      expect(transformOrderByArray(null)).toBeUndefined()
    })
  })

  describe('buildSearchQuery', () => {
    it('should build OR query for multiple fields', () => {
      const result = buildSearchQuery('test', ['name', 'email', 'bio'])

      expect(result).toEqual({
        OR: [
          { name: { contains: 'test', mode: 'insensitive' } },
          { email: { contains: 'test', mode: 'insensitive' } },
          { bio: { contains: 'test', mode: 'insensitive' } },
        ],
      })
    })

    it('should return undefined for empty search', () => {
      expect(buildSearchQuery('', ['name'])).toBeUndefined()
      expect(buildSearchQuery(null, ['name'])).toBeUndefined()
      expect(buildSearchQuery('   ', ['name'])).toBeUndefined()
    })

    it('should trim search term', () => {
      const result = buildSearchQuery('  test  ', ['name'])
      expect(result?.OR[0]).toEqual({
        name: { contains: 'test', mode: 'insensitive' },
      })
    })
  })

  describe('combineFilters', () => {
    it('should combine filters with AND logic', () => {
      const filters = [
        { name: { contains: 'test' } },
        { published: true },
        { createdAt: { gte: '2024-01-01' } },
      ]

      const result = combineFilters(filters, 'AND')
      expect(result).toEqual({
        AND: filters,
      })
    })

    it('should combine filters with OR logic', () => {
      const filters = [
        { name: { contains: 'test' } },
        { email: { contains: 'test' } },
      ]

      const result = combineFilters(filters, 'OR')
      expect(result).toEqual({
        OR: filters,
      })
    })

    it('should return single filter without wrapping', () => {
      const filter = { name: { contains: 'test' } }
      expect(combineFilters([filter])).toEqual(filter)
    })

    it('should filter out undefined values', () => {
      const filters = [
        { name: { contains: 'test' } },
        undefined,
        { published: true },
      ]

      const result = combineFilters(filters)
      expect(result).toEqual({
        AND: [{ name: { contains: 'test' } }, { published: true }],
      })
    })

    it('should return undefined for empty filters', () => {
      expect(combineFilters([])).toBeUndefined()
      expect(combineFilters([undefined, undefined])).toBeUndefined()
    })
  })

  describe('applyBaseFilter', () => {
    it('should apply logical operators recursively', () => {
      const filter = {
        name: { contains: 'test' },
        AND: [{ published: true }, { viewCount: { gte: 10 } }],
        OR: [{ featured: true }, { trending: true }],
        NOT: {
          deleted: true,
        },
      }

      const result = applyBaseFilter(filter as any)

      expect(result).toMatchObject({
        name: { contains: 'test' },
        AND: [{ published: true }, { viewCount: { gte: 10 } }],
        OR: [{ featured: true }, { trending: true }],
        NOT: {
          deleted: true,
        },
      })
    })
  })

  describe('validateFilterDepth', () => {
    it('should validate shallow filters', () => {
      const filter = {
        name: { contains: 'test' },
        published: true,
      }

      const result = validateFilterDepth(filter)
      expect(result.valid).toBe(true)
      expect(result.errors).toBeUndefined()
    })

    it('should reject deeply nested filters', () => {
      const filter = {
        AND: [
          {
            OR: [
              {
                AND: [
                  {
                    NOT: {
                      name: { contains: 'test' },
                    },
                  },
                ],
              },
            ],
          },
        ],
      }

      const result = validateFilterDepth(filter as any, 3)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain(
        'Filter depth exceeds maximum allowed depth of 3',
      )
    })

    it('should handle complex valid filters', () => {
      const filter = {
        name: { contains: 'test' },
        AND: [
          { published: true },
          {
            OR: [{ featured: true }, { viewCount: { gte: 100 } }],
          },
        ],
      }

      const result = validateFilterDepth(filter as any, 3)
      expect(result.valid).toBe(true)
    })
  })

  describe('sanitizeFilter', () => {
    it('should remove denied fields', () => {
      const filter = {
        name: { contains: 'test' },
        password: { equals: 'secret' },
        email: { contains: '@' },
      }

      const result = sanitizeFilter(filter, {
        deniedFields: ['password'],
      })

      expect(result).toEqual({
        name: { contains: 'test' },
        email: { contains: '@' },
      })
    })

    it('should only allow specified fields', () => {
      const filter = {
        name: { contains: 'test' },
        email: { contains: '@' },
        role: 'admin',
      }

      const result = sanitizeFilter(filter, {
        allowedFields: ['name', 'email'],
      })

      expect(result).toEqual({
        name: { contains: 'test' },
        email: { contains: '@' },
      })
    })

    it('should sanitize nested filters', () => {
      const filter = {
        AND: [
          { name: { contains: 'test' } },
          { password: { equals: 'secret' } },
        ],
        OR: [{ email: { contains: '@' } }, { role: 'admin' }],
      }

      const result = sanitizeFilter(filter, {
        deniedFields: ['password', 'role'],
      })

      expect(result).toMatchObject({
        AND: [{ name: { contains: 'test' } }, {}],
        OR: [{ email: { contains: '@' } }, {}],
      })
    })
  })

  describe('applyCaseInsensitive', () => {
    it('should add case insensitive mode to string filters', () => {
      const filter = {
        name: { contains: 'test' },
        email: { startsWith: 'user' },
        bio: { endsWith: 'text' },
      }

      const result = applyCaseInsensitive(filter, ['name', 'email', 'bio'])

      expect(result).toEqual({
        name: { contains: 'test', mode: 'insensitive' },
        email: { startsWith: 'user', mode: 'insensitive' },
        bio: { endsWith: 'text', mode: 'insensitive' },
      })
    })

    it('should not affect non-string filters', () => {
      const filter = {
        name: { contains: 'test' },
        age: { gte: 18 },
        active: true,
      }

      const result = applyCaseInsensitive(filter, ['name'])

      expect(result).toEqual({
        name: { contains: 'test', mode: 'insensitive' },
        age: { gte: 18 },
        active: true,
      })
    })
  })

  describe('getFilterSummary', () => {
    it('should generate filter summary', () => {
      const filter = {
        name: { contains: 'test' },
        published: true,
        viewCount: { gte: 10 },
        AND: [{ featured: true }, { author: { email: { contains: '@' } } }],
      }

      const summary = getFilterSummary(filter)

      expect(summary).toContain('name')
      expect(summary).toContain('published')
      expect(summary).toContain('viewCount')
      expect(summary).toContain('AND operator')
      expect(summary).toContain('AND[0].featured')
      expect(summary).toContain('AND[1].author.email')
    })

    it('should handle empty filters', () => {
      const summary = getFilterSummary({})
      expect(summary).toEqual([])
    })

    it('should skip null/undefined values', () => {
      const filter = {
        name: { contains: 'test' },
        email: null,
        age: undefined,
      }

      const summary = getFilterSummary(filter)
      expect(summary).toEqual(['name', 'name.contains'])
    })
  })
})
