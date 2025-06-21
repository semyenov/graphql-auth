/**
 * Global Type Definitions
 *
 * Global TypeScript types and ambient declarations
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

/**
 * Environment variable types
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      JWT_SECRET: string
      ARGON2_MEMORY_COST?: string
      ARGON2_TIME_COST?: string
      ARGON2_PARALLELISM?: string
      NODE_ENV?: 'development' | 'production' | 'test'
      PORT?: string
      HOST?: string
      CORS_ORIGIN?: string
      REDIS_URL?: string
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'
    }
  }
}

/**
 * Utility types for the application
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<T, TRequired>

export type RequiredExceptFor<T, TOptional extends keyof T> = Required<
  Omit<T, TOptional>
> &
  Pick<T, TOptional>

/**
 * Database-related types
 */
export type EntityId = string | number

export type Timestamps = {
  createdAt: Date
  updatedAt: Date
}

export type SoftDeleteTimestamps = Timestamps & {
  deletedAt: Date | null
}

/**
 * Pagination types
 */
export type PaginationInput = {
  take?: number
  skip?: number
  cursor?: string
}

export type PaginationInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
  totalCount?: number
}

export type Connection<T> = {
  edges: Array<{
    node: T
    cursor: string
  }>
  pageInfo: PaginationInfo
}

/**
 * API Response types
 */
export type ApiResponse<T = unknown> = {
  data: T
  message?: string
  errors?: Array<{
    message: string
    code?: string
    field?: string
  }>
}

export type ApiError = {
  message: string
  code: string
  statusCode: number
  field?: string
  details?: Record<string, unknown>
}

/**
 * Authentication types
 */
export type AuthTokens = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type TokenPayload = {
  userId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * User role types
 */
export type UserRole = 'user' | 'moderator' | 'admin'

export type Permission =
  | 'read:posts'
  | 'create:posts'
  | 'update:own_posts'
  | 'update:any_posts'
  | 'delete:own_posts'
  | 'delete:any_posts'
  | 'manage:users'
  | 'manage:system'

/**
 * GraphQL Context types
 */
export type RequestMetadata = {
  ip?: string
  userAgent?: string
  requestId: string
  timestamp: string
}

export type SecurityContext = {
  isAuthenticated: boolean
  userId?: string
  permissions: Permission[]
  rateLimitKey: string
}

export type User = {
  id: string
  email: string
  name?: string
  role: UserRole
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Logging types
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogContext = {
  userId?: string
  requestId?: string
  operation?: string
  duration?: number
  [key: string]: unknown
}

/**
 * Performance monitoring types
 */
export type PerformanceMetrics = {
  duration: number
  memory: {
    used: number
    total: number
  }
  queries: {
    count: number
    duration: number
  }
}

/**
 * Module augmentation for third-party libraries
 */
declare module 'graphql' {
  interface GraphQLResolveInfo {
    cacheControl?: {
      setCacheHint: (hint: {
        maxAge?: number
        scope?: 'PRIVATE' | 'PUBLIC'
      }) => void
    }
  }
}

declare module 'prisma' {
  interface PrismaClient {
    $metrics?: {
      prometheus: () => Promise<string>
    }
  }
}
