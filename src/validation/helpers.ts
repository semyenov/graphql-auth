/**
 * Shared Validation Helpers
 *
 * Common validation utilities to reduce duplication across modules
 */

import { z } from 'zod'

/**
 * Generic validation helper that throws on error
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Safe validation that returns errors instead of throwing
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Validate multiple inputs with different schemas
 */
export function validateMultipleInputs<T extends Record<string, unknown>>(
  validations: {
    [K in keyof T]: {
      schema: z.ZodSchema<T[K]>
      data: unknown
    }
  },
): T {
  const result = {} as T

  for (const [key, { schema, data }] of Object.entries(validations)) {
    result[key as keyof T] = schema.parse(data)
  }

  return result
}

/**
 * Async validation helper for database-dependent validations
 */
export async function validateAsyncInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Promise<T> {
  return await schema.parseAsync(data)
}

/**
 * Safe async validation that returns errors instead of throwing
 */
export async function safeValidateAsyncInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Promise<
  { success: true; data: T } | { success: false; errors: z.ZodError }
> {
  const result = await schema.safeParseAsync(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Create a validation middleware that can be used in resolvers
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    return validateInput(schema, data)
  }
}

/**
 * Transform validation errors to a more user-friendly format
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : ''
    return `${path}${err.message}`
  })
}

/**
 * Common validation patterns
 */
export const commonValidations = {
  /**
   * Email validation with normalization
   */
  email: (maxLength = 254) =>
    z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email format')
      .max(maxLength, `Email must be less than ${maxLength} characters`)
      .transform((email) => email.toLowerCase().trim()),

  /**
   * Password validation
   */
  password: (minLength = 8, maxLength = 128) =>
    z
      .string()
      .min(minLength, `Password must be at least ${minLength} characters`)
      .max(maxLength, `Password must be less than ${maxLength} characters`),

  /**
   * Name validation with trimming
   */
  name: (maxLength = 100) =>
    z
      .string()
      .max(maxLength, `Name must be less than ${maxLength} characters`)
      .transform((name) => name.trim()),

  /**
   * ID validation for global IDs
   */
  globalId: () =>
    z
      .string()
      .min(1, 'ID is required')
      .regex(/^[A-Za-z0-9+/=]+$/, 'Invalid ID format'),

  /**
   * Positive integer validation
   */
  positiveInt: () =>
    z.number().int('Must be an integer').positive('Must be a positive number'),

  /**
   * Pagination limits
   */
  paginationLimit: (max = 100) =>
    z
      .number()
      .int()
      .min(1, 'Limit must be at least 1')
      .max(max, `Limit cannot exceed ${max}`),

  /**
   * Search query validation
   */
  searchQuery: (minLength = 2, maxLength = 100) =>
    z
      .string()
      .min(minLength, `Search query must be at least ${minLength} characters`)
      .max(maxLength, `Search query must be less than ${maxLength} characters`)
      .transform((query) => query.trim()),

  /**
   * Sort direction validation
   */
  sortDirection: () => z.enum(['asc', 'desc']).default('desc'),

  /**
   * Date range validation
   */
  dateRange: () =>
    z
      .object({
        start: z.date().optional(),
        end: z.date().optional(),
      })
      .refine((data) => {
        if (data.start && data.end) {
          return data.start <= data.end
        }
        return true
      }, 'Start date must be before end date'),

  /**
   * URL validation
   */
  url: () => z.string().url('Invalid URL format').max(2048, 'URL is too long'),

  /**
   * Slug validation (URL-friendly string)
   */
  slug: (maxLength = 100) =>
    z
      .string()
      .min(1, 'Slug is required')
      .max(maxLength, `Slug must be less than ${maxLength} characters`)
      .regex(
        /^[a-z0-9-]+$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      )
      .refine(
        (slug) => !(slug.startsWith('-') || slug.endsWith('-')),
        'Slug cannot start or end with a hyphen',
      ),
}
