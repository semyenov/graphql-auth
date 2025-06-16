import { z } from 'zod'
import { CONTEXT_ERROR_CODES, CONTEXT_ERROR_MESSAGES, ContextErrorCode, ContextErrorMessage } from './context/constants'
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
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

export const postCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  content: z
    .string()
    .max(10000, 'Content must be less than 10,000 characters')
    .optional(),
})

export const postUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim()
    .optional(),
  content: z
    .string()
    .max(10000, 'Content must be less than 10,000 characters')
    .optional(),
  published: z.boolean().optional(),
})

// ID validation schemas
export const idSchema = z.object({
  id: z.number().int('ID must be an integer').positive('ID must be positive'),
})

export const userUniqueSchema = z
  .object({
    id: z
      .number()
      .int('ID must be an integer')
      .positive('ID must be positive')
      .optional(),
    email: z.string().email('Invalid email format').optional(),
  })
  .refine(
    (data: { id?: number; email?: string }) =>
      data.id !== undefined || data.email !== undefined,
    {
      message: 'Either id or email must be provided',
      path: ['id'],
    },
  )

// Pagination schemas
export const paginationSchema = z.object({
  skip: z
    .number()
    .int('Skip must be an integer')
    .min(0, 'Skip must be non-negative')
    .optional(),
  take: z
    .number()
    .int('Take must be an integer')
    .min(1, 'Take must be at least 1')
    .max(100, 'Take must be at most 100')
    .optional(),
})

export const feedInputSchema = z.object({
  searchString: z
    .string()
    .min(1, 'Search string must not be empty')
    .max(255, 'Search string must be less than 255 characters')
    .optional(),
  skip: z
    .number()
    .int('Skip must be an integer')
    .min(0, 'Skip must be non-negative')
    .optional(),
  take: z
    .number()
    .int('Take must be an integer')
    .min(1, 'Take must be at least 1')
    .max(100, 'Take must be at most 100')
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
