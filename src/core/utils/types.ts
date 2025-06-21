/**
 * Type Utilities
 *
 * TypeScript type helpers and utilities
 */

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Make all properties of T required recursively
 */
export type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>
    }
  : T

/**
 * Make all properties of T readonly recursively
 */
export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>
    }
  : T

/**
 * Extract the type of a Promise
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T

/**
 * Make specified keys of T optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specified keys of T required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Extract keys of T that have values of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

/**
 * Create a union type from the values of an object
 */
export type ValueOf<T> = T[keyof T]

/**
 * Exclude null and undefined from T
 */
export type NonNullable<T> = T extends null | undefined ? never : T

/**
 * Create a type that represents either a value or an array of values
 */
export type MaybeArray<T> = T | T[]

/**
 * Create a type that represents either a value or a promise of that value
 */
export type MaybePromise<T> = T | Promise<T>

/**
 * Create a type that represents either a value or null
 */
export type Nullable<T> = T | null

/**
 * Create a type that represents either a value or undefined
 */
export type Optional<T> = T | undefined

/**
 * Extract the element type of an array
 */
export type ElementType<T> = T extends (infer E)[] ? E : never

/**
 * Create a type with a subset of keys from T
 */
export type Subset<T, K extends keyof T> = Pick<T, K>

/**
 * Create a type that excludes keys from T
 */
export type Without<T, K extends keyof T> = Omit<T, K>

/**
 * Type guard to check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Type guard to check if a value is null
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * Type guard to check if a value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * Type guard to check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Type guard to check if a value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Type guard to check if a value is an array
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/**
 * Type guard to check if a value is a function
 */
export function isFunction(
  value: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

/**
 * Type guard to check if a value is a Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * Type guard to check if a value is a RegExp
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp
}

/**
 * Type guard to check if a value is a Promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise ||
    (isObject(value) &&
      isFunction((value as Record<string, unknown>).then) &&
      isFunction((value as Record<string, unknown>).catch))
  )
}

/**
 * Assert that a condition is true, narrowing the type
 */
export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

/**
 * Assert that a value is never (useful for exhaustive switch statements)
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}

/**
 * Create a type-safe object entries function
 */
export function objectEntries<T extends Record<string, unknown>>(
  obj: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

/**
 * Create a type-safe object keys function
 */
export function objectKeys<T extends Record<string, unknown>>(
  obj: T,
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

/**
 * Create a type-safe object values function
 */
export function objectValues<T extends Record<string, unknown>>(
  obj: T,
): T[keyof T][] {
  return Object.values(obj) as T[keyof T][]
}

/**
 * Pick properties from an object with type safety
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Omit properties from an object with type safety
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result as Omit<T, K>
}
