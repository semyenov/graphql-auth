/**
 * Global Types Index
 *
 * Central export point for all global types
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

// Re-export types from other modules for convenience
export type { Context, IContext } from '../graphql/context/context.types'
export type { Email } from '../value-objects/email.vo'
export type { UserId as UserIdVO } from '../value-objects/user-id.vo'

export type {
  ApiError,
  ApiResponse,
  AuthTokens,
  Connection as GraphQLConnection,
  EntityId,
  LogContext,
  LogLevel,
  OptionalExceptFor,
  PaginationInfo,
  PaginationInput,
  PerformanceMetrics,
  Permission,
  Prettify,
  RequestMetadata,
  RequiredExceptFor,
  SecurityContext,
  SoftDeleteTimestamps,
  Timestamps,
  TokenPayload,
  User,
  UserRole,
} from './global'
export type {
  BooleanFilter,
  Connection as RelayConnection,
  ConnectionArgs,
  DateTimeFilter,
  DateTimeScalarConfig,
  DirectiveResolver,
  Edge,
  EmailScalarConfig,
  FieldResolver,
  GraphQLErrorExtensions,
  GraphQLMiddleware,
  GraphQLOperation,
  GraphQLResult,
  IntFilter,
  MutationResolver,
  OrderByInput,
  PageInfo,
  QueryResolver,
  Resolver,
  StringFilter,
  SubscriptionFilter,
  SubscriptionPayload,
  SubscriptionResolver,
  ValidationContext,
  ValidationRule,
  WhereInput,
} from './graphql'

/**
 * Commonly used type combinations
 */
export type ID = string | number

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type Maybe<T> = T | null | undefined

export type NonEmptyArray<T> = [T, ...T[]]

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

/**
 * Function utility types
 */
export type AsyncFunction<
  TArgs extends readonly unknown[] = [],
  TReturn = unknown,
> = (...args: TArgs) => Promise<TReturn>

export type SyncFunction<
  TArgs extends readonly unknown[] = [],
  TReturn = unknown,
> = (...args: TArgs) => TReturn

export type AnyFunction<
  TArgs extends readonly unknown[] = [],
  TReturn = unknown,
> = AsyncFunction<TArgs, TReturn> | SyncFunction<TArgs, TReturn>

/**
 * Object utility types
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

export type ValuesOfType<T, U> = T[KeysOfType<T, U>]

export type StringKeys<T> = Extract<keyof T, string>

export type NumberKeys<T> = Extract<keyof T, number>

export type SymbolKeys<T> = Extract<keyof T, symbol>

/**
 * Array utility types
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

export type Head<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...unknown[],
]
  ? H
  : never

export type Tail<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...infer Rest,
]
  ? Rest
  : []

/**
 * Promise utility types
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T

export type PromiseType<T extends Promise<unknown>> = T extends Promise<infer U>
  ? U
  : never

/**
 * Union utility types
 */
export type UnionToIntersection<U> = (
  U extends unknown
    ? (k: U) => void
    : never
) extends (k: infer I) => void
  ? I
  : never

export type LastOfUnion<T> = UnionToIntersection<
  T extends unknown ? () => T : never
> extends () => infer R
  ? R
  : never

/**
 * Branded types for type safety
 */
export type Brand<T, B> = T & { __brand: B }

export type UserId = Brand<string, 'UserId'>
export type PostId = Brand<string, 'PostId'>
export type UserEmail = Brand<string, 'UserEmail'>
export type JWT = Brand<string, 'JWT'>
export type HashedPassword = Brand<string, 'HashedPassword'>

/**
 * Database entity base types
 */
export type BaseEntity = {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type SoftDeletableEntity = BaseEntity & {
  deletedAt: Date | null
}

/**
 * Audit trail types
 */
export type AuditableEntity = BaseEntity & {
  createdBy?: string
  updatedBy?: string
}

/**
 * Versioned entity types
 */
export type VersionedEntity = BaseEntity & {
  version: number
}
