/**
 * Filtering Utilities
 *
 * Helper functions for implementing filtering across modules
 */

import type {
  BaseFilter,
  BooleanFilter,
  DateFilter,
  FilterBuilderOptions,
  FilterValidationResult,
  NumberFilter,
  OrderByInput,
  SortOrder,
  StringFilter,
} from './filter.types'

/**
 * Convert string filter to Prisma format
 */
export function transformStringFilter(
  filter: StringFilter | undefined | null,
): Record<string, unknown> | undefined {
  if (!filter) return undefined

  const prismaFilter: Record<string, unknown> = {}

  if (filter.equals !== undefined) prismaFilter.equals = filter.equals
  if (filter.not !== undefined) prismaFilter.not = filter.not
  if (filter.in !== undefined) prismaFilter.in = filter.in
  if (filter.notIn !== undefined) prismaFilter.notIn = filter.notIn
  if (filter.contains !== undefined) {
    prismaFilter.contains = filter.contains
    if (filter.mode === 'insensitive') {
      prismaFilter.mode = 'insensitive'
    }
  }
  if (filter.startsWith !== undefined) {
    prismaFilter.startsWith = filter.startsWith
    if (filter.mode === 'insensitive') {
      prismaFilter.mode = 'insensitive'
    }
  }
  if (filter.endsWith !== undefined) {
    prismaFilter.endsWith = filter.endsWith
    if (filter.mode === 'insensitive') {
      prismaFilter.mode = 'insensitive'
    }
  }

  return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined
}

/**
 * Convert number filter to Prisma format
 */
export function transformNumberFilter(
  filter: NumberFilter | undefined | null,
): Record<string, unknown> | undefined {
  if (!filter) return undefined

  const prismaFilter: Record<string, unknown> = {}

  if (filter.equals !== undefined) prismaFilter.equals = filter.equals
  if (filter.not !== undefined) prismaFilter.not = filter.not
  if (filter.in !== undefined) prismaFilter.in = filter.in
  if (filter.notIn !== undefined) prismaFilter.notIn = filter.notIn
  if (filter.lt !== undefined) prismaFilter.lt = filter.lt
  if (filter.lte !== undefined) prismaFilter.lte = filter.lte
  if (filter.gt !== undefined) prismaFilter.gt = filter.gt
  if (filter.gte !== undefined) prismaFilter.gte = filter.gte

  return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined
}

/**
 * Convert date filter to Prisma format
 */
export function transformDateFilter(
  filter: DateFilter | undefined | null,
): Record<string, unknown> | undefined {
  if (!filter) return undefined

  const prismaFilter: Record<string, unknown> = {}

  const toDate = (value: Date | string | null | undefined) => {
    if (!value) return value
    return value instanceof Date ? value : new Date(value)
  }

  if (filter.equals !== undefined) prismaFilter.equals = toDate(filter.equals)
  if (filter.not !== undefined) prismaFilter.not = toDate(filter.not)
  if (filter.in !== undefined) prismaFilter.in = filter.in?.map(toDate)
  if (filter.notIn !== undefined) prismaFilter.notIn = filter.notIn?.map(toDate)
  if (filter.lt !== undefined) prismaFilter.lt = toDate(filter.lt)
  if (filter.lte !== undefined) prismaFilter.lte = toDate(filter.lte)
  if (filter.gt !== undefined) prismaFilter.gt = toDate(filter.gt)
  if (filter.gte !== undefined) prismaFilter.gte = toDate(filter.gte)

  return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined
}

/**
 * Convert boolean filter to Prisma format
 */
export function transformBooleanFilter(
  filter: BooleanFilter | undefined | null,
): boolean | Record<string, unknown> | undefined {
  if (!filter) return undefined

  if (filter.equals !== undefined) return filter.equals
  if (filter.not !== undefined) return { not: filter.not }

  return undefined
}

/**
 * Transform order by input to Prisma format
 */
export function transformOrderBy<T extends string>(
  orderBy: OrderByInput<T> | undefined | null,
): Record<T, SortOrder> | undefined {
  if (!orderBy) return undefined

  return {
    [orderBy.field]: orderBy.direction,
  }
}

/**
 * Transform multiple order by inputs
 */
export function transformOrderByArray<T extends string>(
  orderBy: OrderByInput<T>[] | undefined | null,
): Record<T, SortOrder>[] | undefined {
  if (!orderBy || orderBy.length === 0) return undefined

  return orderBy.map(transformOrderBy).filter(Boolean)
}

/**
 * Build a search query across multiple fields
 */
export function buildSearchQuery(
  search: string | undefined | null,
  fields: string[],
): { OR: Record<string, { contains: string; mode: string }>[] } | undefined {
  if (!search || search.trim().length === 0) return undefined

  const searchTerm = search.trim()

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  }
}

/**
 * Combine multiple filters with AND/OR logic
 */
export function combineFilters<T>(
  filters: (T | undefined)[],
  logic: 'AND' | 'OR' = 'AND',
): T | undefined {
  const validFilters = filters.filter(Boolean) as T[]

  if (validFilters.length === 0) return undefined
  if (validFilters.length === 1) return validFilters[0]

  return {
    [logic]: validFilters,
  } as T
}

/**
 * Apply base filter logic (AND, OR, NOT)
 */
export function applyBaseFilter<T>(
  filter: T & BaseFilter<T>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...filter }

  // Remove base filter properties from main object
  delete result.AND
  delete result.OR
  delete result.NOT

  // Apply logical operators
  if (filter.AND && filter.AND.length > 0) {
    result.AND = filter.AND.map((f) => applyBaseFilter(f as T & BaseFilter<T>))
  }

  if (filter.OR && filter.OR.length > 0) {
    result.OR = filter.OR.map((f) => applyBaseFilter(f as T & BaseFilter<T>))
  }

  if (filter.NOT) {
    result.NOT = applyBaseFilter(filter.NOT as T & BaseFilter<T>)
  }

  return result
}

/**
 * Validate filter depth to prevent deeply nested queries
 */
export function validateFilterDepth<T>(
  filter: T & BaseFilter<T>,
  maxDepth: number = 3,
  currentDepth: number = 0,
): FilterValidationResult {
  if (currentDepth > maxDepth) {
    return {
      valid: false,
      errors: [`Filter depth exceeds maximum allowed depth of ${maxDepth}`],
    }
  }

  const errors: string[] = []

  // Check AND filters
  if (filter.AND) {
    for (const andFilter of filter.AND) {
      const result = validateFilterDepth(
        andFilter as T & BaseFilter<T>,
        maxDepth,
        currentDepth + 1,
      )
      if (!result.valid && result.errors) {
        errors.push(...result.errors)
      }
    }
  }

  // Check OR filters
  if (filter.OR) {
    for (const orFilter of filter.OR) {
      const result = validateFilterDepth(
        orFilter as T & BaseFilter<T>,
        maxDepth,
        currentDepth + 1,
      )
      if (!result.valid && result.errors) {
        errors.push(...result.errors)
      }
    }
  }

  // Check NOT filter
  if (filter.NOT) {
    const result = validateFilterDepth(
      filter.NOT as T & BaseFilter<T>,
      maxDepth,
      currentDepth + 1,
    )
    if (!result.valid && result.errors) {
      errors.push(...result.errors)
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Sanitize filter to remove denied fields
 */
export function sanitizeFilter<T extends Record<string, unknown>>(
  filter: T,
  options: FilterBuilderOptions,
): T {
  const { allowedFields, deniedFields } = options

  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(filter)) {
    // Skip if field is denied
    if (deniedFields?.includes(key)) continue

    // Skip if allowedFields is set and field is not allowed
    if (allowedFields && !allowedFields.includes(key)) continue

    // Handle base filter properties recursively
    if (key === 'AND' || key === 'OR') {
      if (Array.isArray(value)) {
        sanitized[key] = value.map((f) => sanitizeFilter(f, options))
      }
    } else if (key === 'NOT') {
      sanitized[key] = sanitizeFilter(value, options)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Convert case-insensitive search to appropriate format
 */
export function applyCaseInsensitive<T extends Record<string, unknown>>(
  filter: T,
  fields: string[],
): T {
  const result = { ...filter }

  for (const field of fields) {
    if (result[field] && typeof result[field] === 'object') {
      if (
        result[field].contains ||
        result[field].startsWith ||
        result[field].endsWith
      ) {
        result[field as keyof T] = {
          ...result[field],
          mode: 'insensitive',
        }
      }
    }
  }

  return result
}

/**
 * Get filter summary for logging/debugging
 */
export function getFilterSummary(filter: Record<string, unknown>): string[] {
  const summary: string[] = []

  const addToSummary = (obj: Record<string, unknown>, prefix: string = '') => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue

      const fieldName = prefix ? `${prefix}.${key}` : key

      if (key === 'AND' || key === 'OR' || key === 'NOT') {
        summary.push(`${fieldName} operator`)
        if (Array.isArray(value)) {
          value.forEach((v, i) => addToSummary(v, `${fieldName}[${i}]`))
        } else {
          addToSummary(value, fieldName)
        }
      } else if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        // For nested objects, add the parent field
        summary.push(fieldName)
        addToSummary(value, fieldName)
      } else {
        summary.push(fieldName)
      }
    }
  }

  addToSummary(filter)
  return summary
}
