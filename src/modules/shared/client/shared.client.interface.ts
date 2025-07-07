/**
 * Shared Module Client Interface
 * Following modular monolith pattern - defines the public API for cross-cutting concerns
 *
 * This interface represents shared services that multiple modules can use.
 * These are infrastructure-level services that don't belong to any specific domain.
 */

// Input/Output types for the client interface
export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface RateLimitCheckResult {
  allowed: boolean
  remainingPoints: number
  msBeforeNext: number
  totalHits: number
}

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  namespace?: string
}

export interface LogContext {
  [key: string]: unknown
}

export interface RelayConnection<T> {
  edges: Array<{
    node: T
    cursor: string
  }>
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor?: string
    endCursor?: string
  }
  totalCount: number
}

export interface ConnectionArgs {
  first?: number
  last?: number
  after?: string
  before?: string
}

export interface FilterOptions {
  [key: string]: unknown
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

/**
 * Shared Module Client Interface
 *
 * This interface defines cross-cutting services that all modules can use.
 * These are infrastructure concerns that support the domain modules.
 */
export interface ISharedClient {
  // Email services
  sendEmail(options: EmailOptions): Promise<boolean>
  sendBulkEmail(
    recipients: string[],
    options: Omit<EmailOptions, 'to'>,
  ): Promise<boolean>
  validateEmailAddress(email: string): Promise<boolean>

  // Rate limiting services
  checkRateLimit(
    key: string,
    identifier: string,
    points?: number,
  ): Promise<RateLimitCheckResult>
  consumeRateLimit(
    key: string,
    identifier: string,
    points?: number,
  ): Promise<void>
  resetRateLimit(key: string, identifier: string): Promise<void>

  // Caching services
  cacheGet<T>(key: string, options?: CacheOptions): Promise<T | null>
  cacheSet<T>(key: string, value: T, options?: CacheOptions): Promise<boolean>
  cacheDelete(key: string, options?: CacheOptions): Promise<boolean>
  cacheClear(namespace?: string): Promise<boolean>

  // Logging services
  logInfo(message: string, context?: LogContext): Promise<void>
  logError(message: string, error?: Error, context?: LogContext): Promise<void>
  logWarn(message: string, context?: LogContext): Promise<void>
  logDebug(message: string, context?: LogContext): Promise<void>

  // Relay connection utilities
  createConnection<T>(
    nodes: T[],
    args: ConnectionArgs,
    totalCount: number,
    getId: (node: T) => string,
  ): Promise<RelayConnection<T>>

  encodeGlobalId(type: string, id: string | number): Promise<string>
  decodeGlobalId(globalId: string): Promise<{ type: string; id: string }>

  // Pagination utilities
  calculatePaginationParams(args: ConnectionArgs): Promise<{
    skip: number
    take: number
    cursor?: string
  }>

  // Filtering and sorting utilities
  buildWhereClause(filters: FilterOptions): Promise<Record<string, unknown>>
  buildOrderByClause(sorts: SortOptions[]): Promise<Record<string, unknown>>

  // Validation utilities
  validateInput<T>(
    input: T,
    schema: unknown,
  ): Promise<{ valid: boolean; errors?: string[] }>
  sanitizeInput<T>(input: T): Promise<T>

  // Security utilities
  hashSensitiveData(data: string): Promise<string>
  generateSecureToken(length?: number): Promise<string>
  maskSensitiveData(data: string, visibleChars?: number): Promise<string>

  // File utilities (if applicable)
  uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string>
  deleteFile(fileUrl: string): Promise<boolean>
  generatePresignedUrl(fileKey: string, expiresIn?: number): Promise<string>
}

/**
 * Shared Module Events
 *
 * Infrastructure-level events that multiple modules might be interested in.
 */
export interface SharedModuleEvents {
  'email.sent': {
    to: string
    subject: string
    success: boolean
    timestamp: Date
  }
  'email.failed': {
    to: string
    subject: string
    error: string
    timestamp: Date
  }
  'rate_limit.exceeded': {
    key: string
    identifier: string
    points: number
    timestamp: Date
  }
  'cache.miss': {
    key: string
    namespace?: string
    timestamp: Date
  }
  'cache.hit': {
    key: string
    namespace?: string
    timestamp: Date
  }
  'error.logged': {
    message: string
    level: 'error' | 'warn' | 'info' | 'debug'
    context?: LogContext
    timestamp: Date
  }
  'file.uploaded': {
    filename: string
    size: number
    mimeType: string
    url: string
    timestamp: Date
  }
  'file.deleted': {
    url: string
    timestamp: Date
  }
}

/**
 * Error types that the Shared module can return
 */
export class SharedClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = 'SharedClientError'
  }
}

export class RateLimitExceededError extends SharedClientError {
  constructor(
    public readonly retryAfter: number,
    message = 'Rate limit exceeded',
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429)
  }
}

export class EmailDeliveryError extends SharedClientError {
  constructor(message = 'Failed to deliver email') {
    super(message, 'EMAIL_DELIVERY_FAILED', 502)
  }
}

export class CacheError extends SharedClientError {
  constructor(message = 'Cache operation failed') {
    super(message, 'CACHE_ERROR', 500)
  }
}

export class ValidationError extends SharedClientError {
  constructor(
    message: string,
    public readonly errors: string[],
  ) {
    super(message, 'VALIDATION_ERROR', 422)
  }
}
