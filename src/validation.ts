import { z } from 'zod'
import { CONTEXT_ERROR_CODES, CONTEXT_ERROR_MESSAGES, ContextErrorCode, ContextErrorMessage } from './constants/context'
import { VALIDATION_LIMITS, VALIDATION_MESSAGES, VALIDATION_PATTERNS } from './constants/validation'
import type { AppError, Result, ValidationError } from './types.d'

// Create a custom app error
export function createAppError(
  code: ContextErrorCode,
  message: ContextErrorMessage,
  field: string,
  details: Record<string, unknown>,
): AppError {
  return {
    code: code,
    message: message,
    field: field,
    details: details,
  }
}

// Create a validation error
export function createValidationError(
  field: string,
  message: ContextErrorMessage,
  value?: unknown,
): ValidationError {
  return {
    code: CONTEXT_ERROR_CODES.VALIDATION_ERROR as ContextErrorCode,
    field: field,
    message: message,
    value: value,
  }
}

// Validation schemas for inputs
export const signupSchema = z.object({
  email: z
    .string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .min(VALIDATION_LIMITS.EMAIL_MIN_LENGTH, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .max(VALIDATION_LIMITS.EMAIL_MAX_LENGTH, VALIDATION_MESSAGES.EMAIL_TOO_LONG),
  password: z
    .string()
    .min(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(VALIDATION_LIMITS.PASSWORD_MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD_TOO_LONG)
    .regex(
      VALIDATION_PATTERNS.STRONG_PASSWORD,
      VALIDATION_MESSAGES.PASSWORD_WEAK,
    ),
  name: z
    .string()
    .min(VALIDATION_LIMITS.NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME_TOO_SHORT)
    .max(VALIDATION_LIMITS.NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME_TOO_LONG)
    .optional(),
})

export const loginSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.EMAIL_INVALID).min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED),
  password: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
})

export const postCreateSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_LIMITS.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(VALIDATION_LIMITS.TITLE_MAX_LENGTH, VALIDATION_MESSAGES.TITLE_TOO_LONG)
    .trim(),
  content: z
    .string()
    .max(VALIDATION_LIMITS.CONTENT_MAX_LENGTH, VALIDATION_MESSAGES.CONTENT_TOO_LONG)
    .optional(),
})

export const postUpdateSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_LIMITS.TITLE_MIN_LENGTH, VALIDATION_MESSAGES.TITLE_REQUIRED)
    .max(VALIDATION_LIMITS.TITLE_MAX_LENGTH, VALIDATION_MESSAGES.TITLE_TOO_LONG)
    .trim()
    .optional(),
  content: z
    .string()
    .max(VALIDATION_LIMITS.CONTENT_MAX_LENGTH, VALIDATION_MESSAGES.CONTENT_TOO_LONG)
    .optional(),
  published: z.boolean().optional(),
})

// ID validation schemas
export const idSchema = z.object({
  id: z.number().int(VALIDATION_MESSAGES.ID_INVALID).positive(VALIDATION_MESSAGES.ID_NEGATIVE),
})

export const userUniqueSchema = z
  .object({
    id: z
      .number()
      .int(VALIDATION_MESSAGES.ID_INVALID)
      .positive(VALIDATION_MESSAGES.ID_NEGATIVE)
      .optional(),
    email: z.string().email(VALIDATION_MESSAGES.EMAIL_INVALID).optional(),
  })
  .refine(
    (data: { id?: number; email?: string }) =>
      data.id !== undefined || data.email !== undefined,
    {
      message: VALIDATION_MESSAGES.EITHER_ID_OR_EMAIL,
      path: ['id'],
    },
  )

// Pagination schemas
export const paginationSchema = z.object({
  skip: z
    .number()
    .int(VALIDATION_MESSAGES.ID_INVALID)
    .min(VALIDATION_LIMITS.SKIP_MIN, VALIDATION_MESSAGES.SKIP_NEGATIVE)
    .optional(),
  take: z
    .number()
    .int(VALIDATION_MESSAGES.ID_INVALID)
    .min(VALIDATION_LIMITS.TAKE_MIN, VALIDATION_MESSAGES.TAKE_TOO_SMALL)
    .max(VALIDATION_LIMITS.TAKE_MAX, VALIDATION_MESSAGES.TAKE_TOO_LARGE)
    .optional(),
})

export const feedInputSchema = z.object({
  searchString: z
    .string()
    .min(VALIDATION_LIMITS.SEARCH_MIN_LENGTH, VALIDATION_MESSAGES.SEARCH_EMPTY)
    .max(VALIDATION_LIMITS.SEARCH_MAX_LENGTH, VALIDATION_MESSAGES.SEARCH_TOO_LONG)
    .optional(),
  skip: z
    .number()
    .int(VALIDATION_MESSAGES.ID_INVALID)
    .min(VALIDATION_LIMITS.SKIP_MIN, VALIDATION_MESSAGES.SKIP_NEGATIVE)
    .optional(),
  take: z
    .number()
    .int(VALIDATION_MESSAGES.ID_INVALID)
    .min(VALIDATION_LIMITS.TAKE_MIN, VALIDATION_MESSAGES.TAKE_TOO_SMALL)
    .max(VALIDATION_LIMITS.TAKE_MAX, VALIDATION_MESSAGES.TAKE_TOO_LARGE)
    .optional(),
  orderBy: z
    .object({
      updatedAt: z.enum(['asc', 'desc']).optional(),
      createdAt: z.enum(['asc', 'desc']).optional(),
      viewCount: z.enum(['asc', 'desc']).optional(),
    })
    .optional(),
})

// Generic validation function with proper error handling
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
): Result<T, ValidationError[]> {
  try {
    const result = schema.parse(input)
    return { success: true, data: result }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.errors.map(
        (err: z.ZodIssue) =>
          createValidationError(
            err.path.join('.'),
            err.message as ContextErrorMessage,
            err.code === 'invalid_type' ? input : undefined,
          ),
      )
      return { success: false, error: validationErrors }
    }

    return {
      success: false,
      error: [createValidationError('unknown', CONTEXT_ERROR_MESSAGES.VALIDATION_ERROR as ContextErrorMessage)],
    }
  }
}

// Async validation wrapper
export async function validateInputAsync<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
): Promise<Result<T, ValidationError[]>> {
  return Promise.resolve(validateInput(schema, input))
}

// Type guards
export function isValidationError(error: AppError): error is ValidationError {
  return error.code === CONTEXT_ERROR_CODES.VALIDATION_ERROR as ContextErrorCode && 'field' in error
}

// Authentication type guard
export function isAuthenticated(context: { userId?: number | null }): boolean {
  return typeof context.userId === 'number' && context.userId !== null && context.userId > 0
}

// Safe parsing utilities
export function safeParseInt(value: unknown, defaultValue = 0): number {
  if (typeof value === 'number') return Math.floor(value)
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? defaultValue : parsed
  }
  return defaultValue
}

export function safeParseBoolean(
  value: unknown,
  defaultValue = false,
): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1'
  }
  if (typeof value === 'number') return value !== 0
  return defaultValue
}
