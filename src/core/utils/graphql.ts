import type { DocumentNode } from 'graphql'
import { print } from 'graphql'
import type {
  GraphQLError,
  GraphQLResponse,
} from '../../graphql/context/context.types'

// =============================================================================
// ADVANCED QUERY UTILITIES
// =============================================================================

/**
 * Query builder for dynamic GraphQL queries
 */
export class QueryBuilder {
  private fields: string[] = []
  private fragments: string[] = []
  private variables: Record<string, string> = {}

  field(name: string): this {
    this.fields.push(name)
    return this
  }

  fragment(name: string, definition: string): this {
    this.fragments.push(`fragment ${name} { ${definition} }`)
    return this
  }

  variable(name: string, type: string): this {
    this.variables[name] = type
    return this
  }

  build(
    operationType: 'query' | 'mutation' | 'subscription',
    name?: string,
  ): string {
    const variableDeclarations = Object.entries(this.variables)
      .map(([name, type]) => `$${name}: ${type}`)
      .join(', ')

    const variablesPart = variableDeclarations
      ? `(${variableDeclarations})`
      : ''
    const operationName = name ? ` ${name}` : ''
    const fieldsString = this.fields.join('\n  ')
    const fragmentsString = this.fragments.join('\n')

    return `
      ${fragmentsString}
      ${operationType}${operationName}${variablesPart} {
        ${fieldsString}
      }
    `.trim()
  }
}

// =============================================================================
// RESPONSE TRANSFORMATION UTILITIES
// =============================================================================

/**
 * Extract data from GraphQL response or throw error
 */
export function unwrapResponse<T>(response: GraphQLResponse<T>): T {
  if (response.errors && response.errors.length > 0) {
    throw new GraphQLResponseError(response.errors)
  }
  if (!response.data) {
    throw new Error('GraphQL response contains no data')
  }
  return response.data
}

/**
 * Transform response data with a mapping function
 */
export function mapResponse<T, U>(
  response: GraphQLResponse<T>,
  mapper: (data: T) => U,
): GraphQLResponse<U> {
  return {
    ...response,
    data: response.data ? mapper(response.data) : undefined,
  }
}

/**
 * Flatten nested response structure
 */
export function flattenResponse<T extends Record<string, unknown>>(
  response: GraphQLResponse<T>,
): GraphQLResponse<T[keyof T]> {
  if (!response.data) return response as GraphQLResponse<T[keyof T]>

  const keys = Object.keys(response.data)
  if (keys.length === 1) {
    return {
      ...response,
      data: response.data[keys[0] as keyof T],
    }
  }
  return response as GraphQLResponse<T[keyof T]>
}

// Legacy class for backward compatibility
export const ResponseTransformer = {
  unwrap: unwrapResponse,
  map: mapResponse,
  flatten: flattenResponse,
}

/**
 * Custom error class for GraphQL responses
 */
export class GraphQLResponseError extends Error {
  constructor(public errors: GraphQLError[]) {
    super(`GraphQL Error: ${errors.map((e) => e.message).join(', ')}`)
    this.name = 'GraphQLResponseError'
  }

  get firstError(): GraphQLError | undefined {
    return this.errors[0]
  }

  hasErrorCode(code: string): boolean {
    return this.errors.some((error) => error.extensions?.code === code)
  }
}

// =============================================================================
// CACHING UTILITIES
// =============================================================================

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Simple in-memory cache for GraphQL responses
 */
export class GraphQLCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Generate cache key from query and variables
   */
  private generateKey(
    query: string,
    variables?: Record<string, unknown>,
  ): string {
    const variablesStr = variables ? JSON.stringify(variables) : ''
    return `${query}:${variablesStr}`
  }

  /**
   * Get cached response
   */
  get<T>(query: string, variables?: Record<string, unknown>): T | null {
    const key = this.generateKey(query, variables)
    const entry = this.cache.get(key)

    if (!entry) return null

    const now = Date.now()
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T | null
  }

  /**
   * Set cached response
   */
  set<T>(
    query: string,
    data: T,
    variables?: Record<string, unknown>,
    ttl: number = this.defaultTTL,
  ): void {
    const key = this.generateKey(query, variables)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// =============================================================================
// BATCHING UTILITIES
// =============================================================================

interface BatchedRequest {
  query: string
  variables?: Record<string, unknown>
  resolve: (response: GraphQLResponse) => void
  reject: (error: Error) => void
}

/**
 * GraphQL request batcher for combining multiple requests
 */
export class GraphQLBatcher {
  private queue: BatchedRequest[] = []
  private timeout: NodeJS.Timeout | null = null
  private batchDelay = 10 // ms

  constructor(
    private executor: (
      queries: string[],
      variables: Record<string, unknown>[],
    ) => Promise<GraphQLResponse[]>,
    delay = 10,
  ) {
    this.batchDelay = delay
  }

  /**
   * Add request to batch
   */
  add(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<GraphQLResponse> {
    return new Promise((resolve, reject) => {
      this.queue.push({ query, variables, resolve, reject })
      this.scheduleBatch()
    })
  }

  /**
   * Schedule batch execution
   */
  private scheduleBatch(): void {
    if (this.timeout) return

    this.timeout = setTimeout(() => {
      this.executeBatch()
    }, this.batchDelay)
  }

  /**
   * Execute batched requests
   */
  private async executeBatch(): Promise<void> {
    if (this.queue.length === 0) return

    const requests = this.queue.splice(0)
    this.timeout = null

    try {
      const queries = requests.map((req) => req.query)
      const variables = requests.map((req) => req.variables || {})

      const responses = await this.executor(queries, variables)

      requests.forEach((request, index) => {
        request.resolve(
          responses[index] || {
            errors: [{ name: 'NoResponseError', message: 'No response' }],
          },
        )
      })
    } catch (error) {
      requests.forEach((request) => {
        request.reject(
          error instanceof Error ? error : new Error(String(error)),
        )
      })
    }
  }
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * GraphQL query validation utilities
 */
export const QueryValidator = {
  /**
   * Validate that all required variables for a query are present
   */
  validateVariables(
    query: string,
    variables: Record<string, unknown> = {},
  ): string[] {
    const errors: string[] = []
    // Simplified regex to find declared variables: $varName:
    const requiredVars = query.match(/\$\w+:/g) || []

    for (const match of requiredVars) {
      const varName = match.match(/\$(\w+):/)
      if (varName?.[1] && !(varName[1] in variables)) {
        errors.push(`Required variable $${varName[1]} is missing`)
      }
    }
    return errors
  },

  /**
   * Check if a query contains a specific field
   */
  hasField(query: string, fieldName: string): boolean {
    const fieldRegex = new RegExp(`\\b${fieldName}\\b`)
    return fieldRegex.test(query)
  },

  /**
   * Get the type of a GraphQL operation
   */
  getOperationType(
    query: string,
  ): 'query' | 'mutation' | 'subscription' | null {
    const match = query.match(/^\s*(query|mutation|subscription)/i)
    return match
      ? (match[1]?.toLowerCase() as 'query' | 'mutation' | 'subscription')
      : null
  },
}

// =============================================================================
// DEVELOPMENT UTILITIES
// =============================================================================

/**
 * Development utilities for GraphQL debugging
 */
export const devTools = {
  /**
   * Pretty print GraphQL query
   */
  prettyPrint: (query: string | DocumentNode): string => {
    const queryString = typeof query === 'string' ? query : print(query)
    return queryString
      .replace(/\s+/g, ' ')
      .replace(/{\s*/g, ' {\n  ')
      .replace(/\s*}/g, '\n}')
      .replace(/,\s*/g, ',\n  ')
  },

  /**
   * Log GraphQL operation with timing
   */
  logOperation: async <T>(
    operation: string,
    executor: () => Promise<T>,
  ): Promise<T> => {
    const start = performance.now()
    console.log(`🚀 GraphQL ${operation} started`)

    try {
      const result = await executor()
      const duration = performance.now() - start
      console.log(
        `✅ GraphQL ${operation} completed in ${duration.toFixed(2)}ms`,
      )
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(
        `❌ GraphQL ${operation} failed in ${duration.toFixed(2)}ms:`,
        error,
      )
      throw error
    }
  },

  /**
   * Create GraphQL query analyzer
   */
  analyzeQuery: (query: string) => {
    const operationType = QueryValidator.getOperationType(query)
    const variables = query.match(/\$(\w+):\s*(\w+!?)/g) || []
    const fields = query.match(/\b\w+(?=\s*[{(])/g) || []

    return {
      operationType,
      variableCount: variables.length,
      variables: variables.map((v) => v.trim()),
      fieldCount: fields.length,
      fields: [...new Set(fields)],
      complexity: fields.length + variables.length,
    }
  },
}

// =============================================================================
// SCHEMA UTILITIES
// =============================================================================

/**
 * Utilities for working with GraphQL schema
 */
export const schemaUtils = {
  /**
   * Type-safe field selector builder
   */
  selectFields: <T extends Record<string, unknown>>(
    fields: (keyof T)[],
  ): string => {
    return fields.join('\n')
  },

  /**
   * Build nested field selection
   */
  selectNested: (field: string, subFields: string[]): string => {
    return `${field} {\n  ${subFields.join('\n  ')}\n}`
  },

  /**
   * Create field selector with fragments
   */
  withFragments: (fields: string[], fragments: string[]): string => {
    return [...fields, ...fragments.map((f) => `...${f}`)].join('\n  ')
  },
}

// =============================================================================
// MISCELLANEOUS UTILITIES
// =============================================================================

/**
 * Miscellaneous GraphQL utilities
 */
export const GraphQLUtils = {
  /**
   * Pretty print GraphQL query
   */
  prettyPrint: (query: string | DocumentNode): string => {
    const queryString = typeof query === 'string' ? query : print(query)
    return queryString
  },

  /**
   * Add a new field to a GraphQL query string
   */
  addField: (query: string, newField: string): string => {
    const insertionPoint = query.lastIndexOf('}')
    if (insertionPoint === -1) return query
    return `${query.slice(0, insertionPoint)}\n  ${newField}\n}${query.slice(
      insertionPoint + 1,
    )}`
  },

  /**
   * Extract unique fragment names from a query
   */
  getFragmentNames: (query: string): string[] => {
    const fragmentRegex = /fragment\s+(\w+)\s+on/g
    const matches = query.matchAll(fragmentRegex)
    return [...matches].map((match) => match[1]).filter(Boolean) as string[]
  },
}

// =============================================================================
// EXPORT DEFAULT UTILITIES
// =============================================================================

export const graphqlUtils = {
  QueryBuilder,
  ResponseTransformer,
  GraphQLResponseError,
  GraphQLCache,
  GraphQLBatcher,
  QueryValidator,
  devTools,
  schemaUtils,
  GraphQLUtils,
}

export default graphqlUtils
