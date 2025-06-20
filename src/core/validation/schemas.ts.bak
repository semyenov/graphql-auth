/**
 * Core Validation Schemas
 * 
 * Common Zod schemas used across the application
 */

import { z } from 'zod'

// Common validation patterns
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  )

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')

// ID validation schemas
export const globalIdSchema = z
  .string()
  .min(1, 'ID is required')

export const numericIdSchema = z
  .number()
  .int('ID must be an integer')
  .positive('ID must be positive')

// Text content schemas
export const titleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be less than 200 characters')

export const contentSchema = z
  .string()
  .min(1, 'Content is required')
  .max(10000, 'Content must be less than 10,000 characters')

// Common object schemas
export const paginationSchema = z.object({
  first: z.number().int().min(1).max(100).optional(),
  last: z.number().int().min(1).max(100).optional(),
  after: z.string().optional(),
  before: z.string().optional(),
})

export const sortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc'),
})

// Auth-related schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema.optional(),
})

// Utility functions
export const createRequiredStringSchema = (
  fieldName: string,
  minLength = 1,
  maxLength = 255
) =>
  z
    .string()
    .min(minLength, `${fieldName} is required`)
    .max(maxLength, `${fieldName} must be less than ${maxLength} characters`)

export const createOptionalStringSchema = (maxLength = 255) =>
  z
    .string()
    .max(maxLength, `Field must be less than ${maxLength} characters`)
    .optional()

// Export commonly used validation helpers
export const commonValidations = {
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  title: titleSchema,
  content: contentSchema,
  globalId: globalIdSchema,
  numericId: numericIdSchema,
  pagination: paginationSchema,
  sort: sortSchema,
  login: loginSchema,
  signup: signupSchema,
} as const