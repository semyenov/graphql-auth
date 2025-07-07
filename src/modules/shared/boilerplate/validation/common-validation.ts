/**
 * Common Validation Boilerplate
 *
 * ⚠️ DO NOT IMPORT THIS FILE DIRECTLY
 * Copy the functions you need into your module's utils directory
 *
 * Source: shared/boilerplate/validation/common-validation.ts
 * Version: 1.0.0
 * Last Updated: 2025-01-16
 */

/**
 * Email validation using standard regex pattern
 *
 * @example
 * // Copy this function to: modules/auth/utils/validation.ts
 * export function validateEmail(email: string): boolean {
 *   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 *   return emailRegex.test(email.trim().toLowerCase())
 * }
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}

/**
 * Password strength validation
 *
 * @example
 * // Copy this function to: modules/auth/utils/validation.ts
 * export function validatePassword(password: string): { valid: boolean; errors: string[] } {
 *   const errors: string[] = []
 *   if (password.length < 8) errors.push('Password must be at least 8 characters')
 *   if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter')
 *   // ... rest of validation
 *   return { valid: errors.length === 0, errors }
 * }
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
    return { valid: false, errors }
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * String length validation with trimming
 *
 * @example
 * // Copy this function to: modules/posts/utils/validation.ts
 * export function validateStringLength(
 *   value: string,
 *   min: number,
 *   max: number,
 *   fieldName = 'Field'
 * ): { valid: boolean; error?: string } {
 *   const trimmed = value?.trim() || ''
 *   if (trimmed.length < min) {
 *     return { valid: false, error: `${fieldName} must be at least ${min} characters` }
 *   }
 *   // ... rest of validation
 * }
 */
export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName = 'Field',
): { valid: boolean; error?: string } {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} is required` }
  }

  const trimmed = value.trim()

  if (trimmed.length < min) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${min} characters long`,
    }
  }

  if (trimmed.length > max) {
    return {
      valid: false,
      error: `${fieldName} must not exceed ${max} characters`,
    }
  }

  return { valid: true }
}

/**
 * URL validation
 *
 * @example
 * // Copy this function to: modules/users/utils/validation.ts
 * export function validateUrl(url: string): boolean {
 *   try {
 *     const urlObj = new URL(url)
 *     return ['http:', 'https:'].includes(urlObj.protocol)
 *   } catch {
 *     return false
 *   }
 * }
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false

  try {
    const urlObj = new URL(url.trim())
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

/**
 * Numeric validation with range
 *
 * @example
 * // Copy this function to: modules/posts/utils/validation.ts
 * export function validateNumber(
 *   value: unknown,
 *   min?: number,
 *   max?: number
 * ): { valid: boolean; error?: string; value?: number } {
 *   const num = Number(value)
 *   if (isNaN(num)) return { valid: false, error: 'Must be a valid number' }
 *   // ... rest of validation
 * }
 */
export function validateNumber(
  value: unknown,
  min?: number,
  max?: number,
): { valid: boolean; error?: string; value?: number } {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: 'Value is required' }
  }

  const num = Number(value)

  if (Number.isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' }
  }

  if (min !== undefined && num < min) {
    return { valid: false, error: `Must be at least ${min}` }
  }

  if (max !== undefined && num > max) {
    return { valid: false, error: `Must not exceed ${max}` }
  }

  return { valid: true, value: num }
}

/**
 * Required field validation
 *
 * @example
 * // Copy this function to: modules/auth/utils/validation.ts
 * export function validateRequired(value: unknown, fieldName = 'Field'): { valid: boolean; error?: string } {
 *   if (value === null || value === undefined || value === '') {
 *     return { valid: false, error: `${fieldName} is required` }
 *   }
 *   return { valid: true }
 * }
 */
export function validateRequired(
  value: unknown,
  fieldName = 'Field',
): { valid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return { valid: false, error: `${fieldName} is required` }
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` }
  }

  if (Array.isArray(value) && value.length === 0) {
    return { valid: false, error: `${fieldName} is required` }
  }

  return { valid: true }
}

/**
 * Sanitize input to prevent basic injection attacks
 *
 * @example
 * // Copy this function to: modules/posts/utils/validation.ts
 * export function sanitizeInput(input: string): string {
 *   return input
 *     .replace(/[<>]/g, '') // Remove basic HTML tags
 *     .replace(/javascript:/gi, '') // Remove javascript: protocol
 *     .trim()
 * }
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}
