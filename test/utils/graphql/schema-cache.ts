/**
 * Schema Cache Utilities for Testing
 *
 * Provides caching, invalidation, and testing utilities for GraphQL schema management
 */

import type { GraphQLSchema } from 'graphql'
import {
  getIntrospectionQuery,
  introspectionFromSchema,
  lexicographicSortSchema,
  printSchema,
} from 'graphql'
import { performance } from 'perf_hooks'
import { buildSchema, resetSchemaCache } from '../../../src/graphql/schema'

// Cache storage
let _cachedSchema: GraphQLSchema | null = null
let _cachedSchemaSDL: string | null = null
let _cacheTimestamp: number | null = null
let _buildMetrics: SchemaBuildMetrics | null = null

// Performance tracking
interface SchemaBuildMetrics {
  buildTime: number
  memoryBefore: number
  memoryAfter: number
  memoryUsed: number
  timestamp: number
}

// Schema cache statistics
interface SchemaCacheStats {
  isCached: boolean
  cacheAge: number | null
  hitCount: number
  missCount: number
  lastAccess: number | null
  buildMetrics: SchemaBuildMetrics | null
}

// Global stats tracking
let _hitCount = 0
let _missCount = 0
let _lastAccess: number | null = null

/**
 * Get a cached schema instance for testing
 * Builds the schema if not cached and tracks performance metrics
 */
export function getCachedSchema(): GraphQLSchema {
  const now = performance.now()

  if (_cachedSchema) {
    _hitCount++
    _lastAccess = now
    return _cachedSchema
  }

  // Schema not cached, build it
  _missCount++
  const memoryBefore = process.memoryUsage().heapUsed

  const buildStart = performance.now()
  const schema = buildSchema()
  const buildEnd = performance.now()

  const memoryAfter = process.memoryUsage().heapUsed

  // Cache the schema and metrics
  _cachedSchema = schema
  _cachedSchemaSDL = printSchema(lexicographicSortSchema(schema))
  _cacheTimestamp = now
  _lastAccess = now

  _buildMetrics = {
    buildTime: buildEnd - buildStart,
    memoryBefore,
    memoryAfter,
    memoryUsed: memoryAfter - memoryBefore,
    timestamp: now,
  }

  return schema
}

/**
 * Get the cached schema SDL (Schema Definition Language)
 */
export function getCachedSchemaSDL(): string {
  if (_cachedSchemaSDL) {
    return _cachedSchemaSDL
  }

  const schema = getCachedSchema()
  _cachedSchemaSDL = printSchema(lexicographicSortSchema(schema))
  return _cachedSchemaSDL
}

/**
 * Force refresh the schema cache
 * Useful when schema components have changed
 */
export function refreshSchemaCache(): GraphQLSchema {
  resetSchemaCache()
  _cachedSchema = null
  _cachedSchemaSDL = null
  _cacheTimestamp = null
  _buildMetrics = null

  return getCachedSchema()
}

/**
 * Clear the schema cache without rebuilding
 */
export function clearSchemaCache(): void {
  resetSchemaCache()
  _cachedSchema = null
  _cachedSchemaSDL = null
  _cacheTimestamp = null
  _buildMetrics = null
}

/**
 * Get schema cache statistics
 */
export function getSchemaStats(): SchemaCacheStats {
  const now = performance.now()

  return {
    isCached: _cachedSchema !== null,
    cacheAge: _cacheTimestamp ? now - _cacheTimestamp : null,
    hitCount: _hitCount,
    missCount: _missCount,
    lastAccess: _lastAccess,
    buildMetrics: _buildMetrics,
  }
}

/**
 * Reset cache statistics
 */
export function resetSchemaStats(): void {
  _hitCount = 0
  _missCount = 0
  _lastAccess = null
}

/**
 * Get schema introspection data
 */
export function getSchemaIntrospection() {
  const schema = getCachedSchema()
  return introspectionFromSchema(schema)
}

/**
 * Get schema introspection query result
 */
export function getIntrospectionQueryResult() {
  const schema = getCachedSchema()
  const introspectionQuery = getIntrospectionQuery()
  return introspectionFromSchema(schema, { descriptions: true })
}

/**
 * Compare two schemas for equality
 */
export function compareSchemas(
  schema1: GraphQLSchema,
  schema2: GraphQLSchema,
): boolean {
  const sdl1 = printSchema(lexicographicSortSchema(schema1))
  const sdl2 = printSchema(lexicographicSortSchema(schema2))
  return sdl1 === sdl2
}

/**
 * Compare current cached schema with a fresh build
 */
export function validateCachedSchema(): {
  isValid: boolean
  differences?: string[]
} {
  if (!_cachedSchema) {
    return { isValid: false, differences: ['No cached schema'] }
  }

  // Build fresh schema
  resetSchemaCache()
  const freshSchema = buildSchema()

  // Compare with cached
  const isValid = compareSchemas(_cachedSchema, freshSchema)

  if (!isValid) {
    const cachedSDL = printSchema(lexicographicSortSchema(_cachedSchema))
    const freshSDL = printSchema(lexicographicSortSchema(freshSchema))

    return {
      isValid: false,
      differences: [
        'Schema mismatch detected',
        `Cached SDL length: ${cachedSDL.length}`,
        `Fresh SDL length: ${freshSDL.length}`,
      ],
    }
  }

  return { isValid: true }
}

/**
 * Measure schema build performance
 */
export async function measureSchemaBuildPerformance(iterations = 5): Promise<{
  averageBuildTime: number
  minBuildTime: number
  maxBuildTime: number
  totalMemoryUsed: number
  buildTimes: number[]
}> {
  const buildTimes: number[] = []
  let totalMemoryUsed = 0

  for (let i = 0; i < iterations; i++) {
    // Clear cache to force rebuild
    clearSchemaCache()

    const memoryBefore = process.memoryUsage().heapUsed
    const start = performance.now()

    getCachedSchema()

    const end = performance.now()
    const memoryAfter = process.memoryUsage().heapUsed

    const buildTime = end - start
    const memoryUsed = memoryAfter - memoryBefore

    buildTimes.push(buildTime)
    totalMemoryUsed += memoryUsed
  }

  return {
    averageBuildTime: buildTimes.reduce((a, b) => a + b, 0) / buildTimes.length,
    minBuildTime: Math.min(...buildTimes),
    maxBuildTime: Math.max(...buildTimes),
    totalMemoryUsed,
    buildTimes,
  }
}

/**
 * Create a schema snapshot for testing
 */
export function createSchemaSnapshot(): {
  sdl: string
  timestamp: number
  typeCount: number
  fieldCount: number
  directiveCount: number
} {
  const schema = getCachedSchema()
  const sdl = printSchema(lexicographicSortSchema(schema))
  const typeMap = schema.getTypeMap()

  let fieldCount = 0
  Object.values(typeMap).forEach((type) => {
    if ('getFields' in type && typeof type.getFields === 'function') {
      fieldCount += Object.keys(type.getFields()).length
    }
  })

  return {
    sdl,
    timestamp: Date.now(),
    typeCount: Object.keys(typeMap).length,
    fieldCount,
    directiveCount: schema.getDirectives().length,
  }
}

/**
 * Utility to ensure schema is built and cached
 * Useful for test setup where you want to pre-warm the cache
 */
export function ensureSchemaCache(): void {
  if (!_cachedSchema) {
    getCachedSchema()
  }
}

/**
 * Get detailed schema information for debugging
 */
export function getSchemaDebugInfo(): {
  stats: SchemaCacheStats
  typeNames: string[]
  queryFields: string[]
  mutationFields: string[]
  sdlPreview: string
} {
  const schema = getCachedSchema()
  const stats = getSchemaStats()
  const typeMap = schema.getTypeMap()

  const queryType = schema.getQueryType()
  const mutationType = schema.getMutationType()

  const sdl = getCachedSchemaSDL()
  const sdlPreview = sdl.length > 500 ? sdl.substring(0, 500) + '...' : sdl

  return {
    stats,
    typeNames: Object.keys(typeMap).sort(),
    queryFields: queryType ? Object.keys(queryType.getFields()).sort() : [],
    mutationFields: mutationType
      ? Object.keys(mutationType.getFields()).sort()
      : [],
    sdlPreview,
  }
}

/**
 * Test utility to check if schema cache is performing well
 */
export function assertSchemaCachePerformance(
  maxBuildTime = 1000, // 1 second max
  maxMemoryUsage = 50 * 1024 * 1024, // 50MB max
): void {
  const stats = getSchemaStats()

  if (stats.buildMetrics) {
    if (stats.buildMetrics.buildTime > maxBuildTime) {
      throw new Error(
        `Schema build time ${stats.buildMetrics.buildTime}ms exceeds maximum ${maxBuildTime}ms`,
      )
    }

    if (stats.buildMetrics.memoryUsed > maxMemoryUsage) {
      throw new Error(
        `Schema memory usage ${stats.buildMetrics.memoryUsed} bytes exceeds maximum ${maxMemoryUsage} bytes`,
      )
    }
  }
}
