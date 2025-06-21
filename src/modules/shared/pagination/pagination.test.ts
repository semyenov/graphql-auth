/**
 * Pagination Utilities Tests
 */

import { describe, expect, it } from 'vitest'
import {
  calculateOffset,
  calculateTotalPages,
  createPaginationInfo,
  getDefaultPageSize,
  hasNextPage,
  hasPreviousPage,
  offsetToCursor,
  parsePageNumber,
  transformToCursorPagination,
  transformToOffsetPagination,
  transformToPagePagination,
  validateCursorArgs,
  validateOffsetArgs,
  validatePageArgs,
} from './pagination.utils'

describe('Pagination Utilities', () => {
  describe('calculateOffset', () => {
    it('should calculate correct offset for page-based pagination', () => {
      expect(calculateOffset(1, 10)).toBe(0)
      expect(calculateOffset(2, 10)).toBe(10)
      expect(calculateOffset(3, 20)).toBe(40)
    })

    it('should handle edge cases', () => {
      expect(calculateOffset(0, 10)).toBe(0) // Invalid page, treated as 1
      expect(calculateOffset(-1, 10)).toBe(0) // Negative page
    })
  })

  describe('calculateTotalPages', () => {
    it('should calculate correct total pages', () => {
      expect(calculateTotalPages(100, 10)).toBe(10)
      expect(calculateTotalPages(95, 10)).toBe(10)
      expect(calculateTotalPages(0, 10)).toBe(0)
      expect(calculateTotalPages(1, 10)).toBe(1)
    })
  })

  describe('hasNextPage', () => {
    it('should determine if there is a next page', () => {
      expect(hasNextPage(1, 10)).toBe(true)
      expect(hasNextPage(10, 10)).toBe(false)
      expect(hasNextPage(5, 10)).toBe(true)
    })
  })

  describe('hasPreviousPage', () => {
    it('should determine if there is a previous page', () => {
      expect(hasPreviousPage(1)).toBe(false)
      expect(hasPreviousPage(2)).toBe(true)
      expect(hasPreviousPage(10)).toBe(true)
    })
  })

  describe('createPaginationInfo', () => {
    it('should create pagination info object', () => {
      const info = createPaginationInfo({
        currentPage: 3,
        pageSize: 10,
        totalItems: 95,
        currentItems: 10,
      })

      expect(info).toEqual({
        currentPage: 3,
        pageSize: 10,
        totalPages: 10,
        totalItems: 95,
        hasNextPage: true,
        hasPreviousPage: true,
        startIndex: 20,
        endIndex: 29,
      })
    })

    it('should handle last page correctly', () => {
      const info = createPaginationInfo({
        currentPage: 10,
        pageSize: 10,
        totalItems: 95,
        currentItems: 5,
      })

      expect(info).toEqual({
        currentPage: 10,
        pageSize: 10,
        totalPages: 10,
        totalItems: 95,
        hasNextPage: false,
        hasPreviousPage: true,
        startIndex: 90,
        endIndex: 94,
      })
    })
  })

  describe('Cursor Pagination', () => {
    describe('validateCursorArgs', () => {
      it('should throw error for conflicting arguments', () => {
        expect(() => validateCursorArgs({ first: 10, last: 10 })).toThrowError(
          'Cannot specify both "first" and "last"',
        )

        expect(() =>
          validateCursorArgs({ after: 'cursor', before: 'cursor' }),
        ).toThrowError('Cannot specify both "after" and "before"')
      })

      it('should throw error for negative values', () => {
        expect(() => validateCursorArgs({ first: -1 })).toThrowError(
          'Argument "first" must be a non-negative integer',
        )

        expect(() => validateCursorArgs({ last: -1 })).toThrowError(
          'Argument "last" must be a non-negative integer',
        )
      })

      it('should throw error for exceeding max values', () => {
        expect(() => validateCursorArgs({ first: 101 })).toThrowError(
          'Argument "first" must not exceed 100',
        )
      })

      it('should accept valid arguments', () => {
        expect(() => validateCursorArgs({ first: 10 })).not.toThrow()
        expect(() =>
          validateCursorArgs({ last: 10, before: 'cursor' }),
        ).not.toThrow()
        expect(() => validateCursorArgs({})).not.toThrow()
      })
    })

    describe('transformToCursorPagination', () => {
      it('should transform offset to cursor pagination', () => {
        const result = transformToCursorPagination({ offset: 20, limit: 10 })

        expect(result.first).toBe(10)
        expect(result.after).toBeDefined()
        expect(result.last).toBeNull()
        expect(result.before).toBeNull()
      })

      it('should handle zero offset', () => {
        const result = transformToCursorPagination({ offset: 0, limit: 10 })

        expect(result.first).toBe(10)
        expect(result.after).toBeNull()
      })
    })
  })

  describe('Offset Pagination', () => {
    describe('validateOffsetArgs', () => {
      it('should throw error for negative values', () => {
        expect(() =>
          validateOffsetArgs({ offset: -1, limit: 10 }),
        ).toThrowError('Offset must be non-negative')

        expect(() => validateOffsetArgs({ offset: 0, limit: -1 })).toThrowError(
          'Limit must be positive',
        )
      })

      it('should throw error for exceeding max limit', () => {
        expect(() =>
          validateOffsetArgs({ offset: 0, limit: 101 }),
        ).toThrowError('Limit must not exceed 100')
      })

      it('should accept valid arguments', () => {
        expect(() => validateOffsetArgs({ offset: 0, limit: 10 })).not.toThrow()
        expect(() =>
          validateOffsetArgs({ offset: 100, limit: 50 }),
        ).not.toThrow()
      })
    })

    describe('transformToOffsetPagination', () => {
      it('should transform cursor to offset pagination', () => {
        const cursor = offsetToCursor(20)
        const result = transformToOffsetPagination({ first: 10, after: cursor })

        expect(result.offset).toBe(21) // Skip the cursor item
        expect(result.limit).toBe(10)
      })

      it('should handle no cursor', () => {
        const result = transformToOffsetPagination({ first: 10 })

        expect(result.offset).toBe(0)
        expect(result.limit).toBe(10)
      })

      it('should handle backward pagination', () => {
        const cursor = offsetToCursor(30)
        const result = transformToOffsetPagination({ last: 10, before: cursor })

        expect(result.offset).toBe(19) // 30 - 10 - 1
        expect(result.limit).toBe(10)
      })
    })
  })

  describe('Page Pagination', () => {
    describe('validatePageArgs', () => {
      it('should throw error for invalid page numbers', () => {
        expect(() => validatePageArgs({ page: 0, perPage: 10 })).toThrowError(
          'Page must be positive',
        )

        expect(() => validatePageArgs({ page: -1, perPage: 10 })).toThrowError(
          'Page must be positive',
        )
      })

      it('should throw error for invalid page size', () => {
        expect(() => validatePageArgs({ page: 1, perPage: 0 })).toThrowError(
          'Page size must be positive',
        )

        expect(() => validatePageArgs({ page: 1, perPage: 101 })).toThrowError(
          'Page size must not exceed 100',
        )
      })

      it('should accept valid arguments', () => {
        expect(() => validatePageArgs({ page: 1, perPage: 10 })).not.toThrow()
        expect(() => validatePageArgs({ page: 100, perPage: 50 })).not.toThrow()
      })
    })

    describe('transformToPagePagination', () => {
      it('should transform offset to page pagination', () => {
        const result = transformToPagePagination({ offset: 20, limit: 10 })

        expect(result.page).toBe(3)
        expect(result.perPage).toBe(10)
      })

      it('should handle zero offset', () => {
        const result = transformToPagePagination({ offset: 0, limit: 10 })

        expect(result.page).toBe(1)
        expect(result.perPage).toBe(10)
      })

      it('should handle non-aligned offsets', () => {
        const result = transformToPagePagination({ offset: 25, limit: 10 })

        expect(result.page).toBe(3) // Floor(25/10) + 1
        expect(result.perPage).toBe(10)
      })
    })
  })

  describe('parsePageNumber', () => {
    it('should parse valid page numbers', () => {
      expect(parsePageNumber('5')).toBe(5)
      expect(parsePageNumber(10)).toBe(10)
      expect(parsePageNumber('1')).toBe(1)
    })

    it('should return 1 for invalid values', () => {
      expect(parsePageNumber(null)).toBe(1)
      expect(parsePageNumber(undefined)).toBe(1)
      expect(parsePageNumber('abc')).toBe(1)
      expect(parsePageNumber(0)).toBe(1)
      expect(parsePageNumber(-1)).toBe(1)
    })
  })

  describe('getDefaultPageSize', () => {
    it('should return default values', () => {
      expect(getDefaultPageSize()).toBe(20)
      expect(getDefaultPageSize(50)).toBe(50)
      expect(getDefaultPageSize(null)).toBe(20)
      expect(getDefaultPageSize(undefined)).toBe(20)
    })

    it('should enforce limits', () => {
      expect(getDefaultPageSize(0)).toBe(1)
      expect(getDefaultPageSize(-1)).toBe(1)
      expect(getDefaultPageSize(200)).toBe(100)
    })
  })
})
