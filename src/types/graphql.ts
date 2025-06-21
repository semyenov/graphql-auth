/**
 * GraphQL-specific Type Definitions
 *
 * Types specific to GraphQL operations and schema
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import type { GraphQLResolveInfo } from 'graphql'
import type { IContext } from '../graphql/context/context.types'

/**
 * GraphQL resolver function types
 */
export type Resolver<
  TResult,
  TParent = Record<string, never>,
  TArgs = Record<string, never>,
  TContext = IContext,
> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionResolver<
  TResult,
  TParent = Record<string, never>,
  TArgs = Record<string, never>,
  TContext = IContext,
> = {
  subscribe: Resolver<AsyncIterator<TResult>, TParent, TArgs, TContext>
  resolve?: Resolver<TResult, TParent, TArgs, TContext>
}

/**
 * Field resolver types
 */
export type FieldResolver<
  TResult = unknown,
  TParent = unknown,
  TArgs = unknown,
> = Resolver<TResult, TParent, TArgs, IContext>

/**
 * Mutation resolver types
 */
export type MutationResolver<TResult = unknown, TArgs = unknown> = Resolver<
  TResult,
  Record<string, never>,
  TArgs,
  IContext
>

/**
 * Query resolver types
 */
export type QueryResolver<TResult = unknown, TArgs = unknown> = Resolver<
  TResult,
  Record<string, never>,
  TArgs,
  IContext
>

/**
 * Custom scalar types
 */
export interface DateTimeScalarConfig {
  name: 'DateTime'
  serialize: (value: Date) => string
  parseValue: (value: string) => Date
  parseLiteral: (ast: unknown) => Date
}

export interface EmailScalarConfig {
  name: 'Email'
  serialize: (value: string) => string
  parseValue: (value: string) => string
  parseLiteral: (ast: unknown) => string
}

/**
 * GraphQL operation types
 */
export type GraphQLOperation = {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

export type GraphQLResult<T = unknown> = {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
    extensions?: Record<string, unknown>
  }>
  extensions?: Record<string, unknown>
}

/**
 * GraphQL middleware types
 */
export type GraphQLMiddleware = (
  resolve: (
    root: unknown,
    args: unknown,
    context: IContext,
    info: GraphQLResolveInfo,
  ) => unknown,
  root: unknown,
  args: unknown,
  context: IContext,
  info: GraphQLResolveInfo,
) => unknown

/**
 * GraphQL directive types
 */
export type DirectiveResolver<TArgs = Record<string, unknown>> = (
  next: (
    root: unknown,
    args: unknown,
    context: IContext,
    info: GraphQLResolveInfo,
  ) => unknown,
  root: unknown,
  args: TArgs,
  context: IContext,
  info: GraphQLResolveInfo,
) => unknown

/**
 * GraphQL input types
 */
export type WhereInput<T> = {
  [K in keyof T]?: T[K] extends string
    ? StringFilter
    : T[K] extends number
      ? IntFilter
      : T[K] extends boolean
        ? BooleanFilter
        : T[K] extends Date
          ? DateTimeFilter
          : T[K]
} & {
  AND?: WhereInput<T>[]
  OR?: WhereInput<T>[]
  NOT?: WhereInput<T>
}

export type StringFilter = {
  equals?: string
  not?: string | StringFilter
  in?: string[]
  notIn?: string[]
  contains?: string
  startsWith?: string
  endsWith?: string
  mode?: 'default' | 'insensitive'
}

export type IntFilter = {
  equals?: number
  not?: number | IntFilter
  in?: number[]
  notIn?: number[]
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}

export type BooleanFilter = {
  equals?: boolean
  not?: boolean | BooleanFilter
}

export type DateTimeFilter = {
  equals?: Date | string
  not?: Date | string | DateTimeFilter
  in?: Array<Date | string>
  notIn?: Array<Date | string>
  lt?: Date | string
  lte?: Date | string
  gt?: Date | string
  gte?: Date | string
}

/**
 * GraphQL ordering types
 */
export type OrderByInput<T> = {
  [K in keyof T]?: 'asc' | 'desc'
}

/**
 * GraphQL connection types
 */
export type ConnectionArgs = {
  first?: number
  after?: string
  last?: number
  before?: string
}

export type Edge<T> = {
  node: T
  cursor: string
}

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export type Connection<T> = {
  edges: Edge<T>[]
  pageInfo: PageInfo
  totalCount?: number
}

/**
 * GraphQL subscription types
 */
export type SubscriptionPayload<T = unknown> = {
  [key: string]: T
}

export type SubscriptionFilter<T = unknown> = (
  payload: T,
  variables: Record<string, unknown>,
  context: IContext,
) => boolean | Promise<boolean>

/**
 * GraphQL error extension types
 */
export type GraphQLErrorExtensions = {
  code?: string
  statusCode?: number
  field?: string
  details?: Record<string, unknown>
  timestamp?: string
  requestId?: string
  userId?: string
}

/**
 * GraphQL validation types
 */
export type ValidationRule = {
  field: string
  message: string
  validator: (value: unknown) => boolean | Promise<boolean>
}

export type ValidationContext = {
  fieldName: string
  fieldValue: unknown
  parentValue: unknown
  args: Record<string, unknown>
  context: IContext
  info: GraphQLResolveInfo
}
