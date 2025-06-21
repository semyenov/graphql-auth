/**
 * Filtering Types
 *
 * Common types and interfaces for filtering across all modules
 */

/**
 * String filter operators
 */
export interface StringFilter {
  equals?: string | null
  not?: string | null
  in?: string[] | null
  notIn?: string[] | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
  mode?: 'insensitive' | 'default'
}

/**
 * Number filter operators
 */
export interface NumberFilter {
  equals?: number | null
  not?: number | null
  in?: number[] | null
  notIn?: number[] | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
}

/**
 * Boolean filter
 */
export interface BooleanFilter {
  equals?: boolean | null
  not?: boolean | null
}

/**
 * Date filter operators
 */
export interface DateFilter {
  equals?: Date | string | null
  not?: Date | string | null
  in?: (Date | string)[] | null
  notIn?: (Date | string)[] | null
  lt?: Date | string | null
  lte?: Date | string | null
  gt?: Date | string | null
  gte?: Date | string | null
}

/**
 * Enum filter
 */
export interface EnumFilter<T> {
  equals?: T | null
  not?: T | null
  in?: T[] | null
  notIn?: T[] | null
}

/**
 * Nested filter operators
 */
export interface NestedFilter<T> {
  is?: T | null
  isNot?: T | null
  some?: T | null
  none?: T | null
  every?: T | null
}

/**
 * List filter operators
 */
export interface ListFilter<T> {
  has?: T | null
  hasEvery?: T[] | null
  hasSome?: T[] | null
  isEmpty?: boolean | null
}

/**
 * Base filter with logical operators
 */
export interface BaseFilter<T> {
  AND?: T[] | null
  OR?: T[] | null
  NOT?: T | null
}

/**
 * Common field filters
 */
export interface CommonFilters {
  search?: string | null
  ids?: (string | number)[] | null
  createdAt?: DateFilter | null
  updatedAt?: DateFilter | null
}

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Order by input
 */
export interface OrderByInput<T> {
  field: T
  direction: SortOrder
}

/**
 * Filter result metadata
 */
export interface FilterMetadata {
  totalCount: number
  filteredCount: number
  appliedFilters: string[]
}

/**
 * Filter validation result
 */
export interface FilterValidationResult {
  valid: boolean
  errors?: string[]
  warnings?: string[]
}

/**
 * Filter builder options
 */
export interface FilterBuilderOptions {
  maxDepth?: number
  allowedFields?: string[]
  deniedFields?: string[]
  caseSensitive?: boolean
}

/**
 * Type guard for string filter
 */
export function isStringFilter(filter: unknown): filter is StringFilter {
  return (
    typeof filter === 'object' &&
    filter !== null &&
    ((filter as StringFilter).equals !== undefined ||
      (filter as StringFilter).contains !== undefined ||
      (filter as StringFilter).startsWith !== undefined ||
      (filter as StringFilter).endsWith !== undefined)
  )
}

/**
 * Type guard for number filter
 */
export function isNumberFilter(filter: unknown): filter is NumberFilter {
  return (
    typeof filter === 'object' &&
    filter !== null &&
    ((filter as NumberFilter).equals !== undefined ||
      (filter as NumberFilter).lt !== undefined ||
      (filter as NumberFilter).lte !== undefined ||
      (filter as NumberFilter).gt !== undefined ||
      (filter as NumberFilter).gte !== undefined)
  )
}

/**
 * Type guard for date filter
 */
export function isDateFilter(filter: unknown): filter is DateFilter {
  return (
    typeof filter === 'object' &&
    filter !== null &&
    ((filter as DateFilter).equals !== undefined ||
      (filter as DateFilter).lt !== undefined ||
      (filter as DateFilter).lte !== undefined ||
      (filter as DateFilter).gt !== undefined ||
      (filter as DateFilter).gte !== undefined)
  )
}
