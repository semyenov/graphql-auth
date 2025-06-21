import { z } from 'zod'
import { AUTH, ERROR_MESSAGES, VALIDATION } from '../../constants'
import { ValidationError } from '../../core/errors/types'

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(VALIDATION.MAX_EMAIL_LENGTH, ERROR_MESSAGES.INVALID_EMAIL)
  .email(ERROR_MESSAGES.INVALID_EMAIL)

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(AUTH.MIN_PASSWORD_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
  .max(AUTH.MAX_PASSWORD_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_LONG)

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(VALIDATION.MAX_NAME_LENGTH, ERROR_MESSAGES.NAME_TOO_LONG)
  .trim()

/**
 * Title validation schema
 */
export const titleSchema = z
  .string()
  .min(1, ERROR_MESSAGES.TITLE_REQUIRED)
  .max(VALIDATION.MAX_TITLE_LENGTH, ERROR_MESSAGES.TITLE_TOO_LONG)
  .trim()

/**
 * Content validation schema
 */
export const contentSchema = z
  .string()
  .max(VALIDATION.MAX_CONTENT_LENGTH, ERROR_MESSAGES.CONTENT_TOO_LONG)
  .optional()
  .nullable()

/**
 * Login input validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/**
 * Signup input validation schema
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema.optional(),
})

/**
 * Create post input validation schema
 */
export const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
})

/**
 * Update post input validation schema
 */
export const updatePostSchema = z.object({
  title: titleSchema.optional(),
  content: contentSchema,
  published: z.boolean().optional(),
})

/**
 * Validate input data against a schema
 * @throws {ValidationError} if validation fails
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      throw new ValidationError(errors)
    }
    throw error
  }
}

/**
 * Safe validation that returns result instead of throwing
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { success: false, errors }
    }
    throw error
  }
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  return AUTH.EMAIL_REGEX.test(email)
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
}

/**
 * Type guards for validation results
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> }

export function isValidationSuccess<T>(
  result: ValidationResult<T>,
): result is { success: true; data: T } {
  return result.success === true
}

export function isValidationError<T>(
  result: ValidationResult<T>,
): result is { success: false; errors: Record<string, string[]> } {
  return result.success === false
}
