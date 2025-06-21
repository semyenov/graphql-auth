import type { Post as PrismaPost, User as PrismaUser } from '@prisma/client'
import type { GraphQLError } from 'graphql'
import type { Environment } from './app/constants/config'
import type { ContextErrorCode, ContextErrorMessage } from './context/constants'
import type { UserId } from './core/value-objects/user-id.vo'

// Domain Types
export interface User extends Omit<PrismaUser, 'password'> {
  id: number
  email: string
  role: string
  name: string | null
  posts?: Post[]
}

export interface Post extends PrismaPost {
  id: number
  title: string
  content: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  viewCount: number
  author?: User
  authorId: number | null
}

// Authentication Types
export interface AuthPayload {
  token: string
  user: User
}

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

// Input Types with validation
export interface SignupInput {
  email: string
  password: string
  name?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface PostCreateInput {
  title: string
  content?: string
}

export interface PostUpdateInput {
  title?: string
  content?: string
  published?: boolean
}

export interface UserUniqueInput {
  id?: number
  email?: string
}

export interface PostOrderByInput {
  updatedAt?: 'asc' | 'desc'
  createdAt?: 'asc' | 'desc'
  viewCount?: 'asc' | 'desc'
}

export interface FeedInput {
  searchString?: string
  skip?: number
  take?: number
  orderBy?: PostOrderByInput
}

export interface AppError {
  code: ContextErrorCode
  message: ContextErrorMessage
  field?: string
  details?: Record<string, unknown>
}

export interface ValidationError extends AppError {
  code: ContextErrorCode
  field: string
  value?: unknown
}

// Result Types for better error handling
export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E }

// Environment Types
export interface EnvironmentConfig {
  NODE_ENV: Environment
  PORT: number
  HOST: string
  APP_SECRET: string
  DATABASE_URL: string
  CORS_ORIGIN?: string
  LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'
  JWT_SECRET?: string
}

// Context Enhancement Types
export interface RequestMetadata {
  ip?: string
  userAgent?: string
  operationName?: string
  query?: string
  variables?: Record<string, unknown>
  startTime: number
}

// Utility Types
export type NonNullable<T> = T extends null | undefined ? never : T

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Pagination Types
export interface PaginationInput {
  skip?: number
  take?: number
}

export interface PaginatedResult<T> {
  nodes: T[]
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Response Types for GraphQL operations
export interface MutationResponse<T = unknown> {
  success: boolean
  data?: T
  error?: AppError
}

// Logging Types
export interface LogMetadata {
  requestId?: string
  userId?: number
  operationName?: string
  duration?: number
  error?: Error | GraphQLError
  [key: string]: unknown
}

// Security Types
export interface SecurityContext {
  isAuthenticated: boolean
  userId?: UserId
  userEmail?: string
  roles: string[]
  permissions: string[]
}
