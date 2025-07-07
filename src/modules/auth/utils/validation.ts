/**
 * Auth Module - Validation Utilities
 *
 * ⚠️ Copied from shared/boilerplate/validation/common-validation.ts
 * Version: 1.0.0 (adapted for auth module)
 *
 * These utilities are copied and adapted for the auth module's specific needs.
 * This follows the modular monolith isolation pattern to prevent tight coupling.
 */

/**
 * Email validation for auth module
 * Source: shared/boilerplate/validation/common-validation.ts
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}

/**
 * Password strength validation for auth module
 * Source: shared/boilerplate/validation/common-validation.ts
 * Modified: Added auth-specific requirements and error messages
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

  // Auth module specific: minimum 8 characters (stricter than default)
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

  // Auth module specific: Check for common passwords
  const commonPasswords = [
    'password',
    '123456',
    'qwerty',
    'admin',
    'password123',
  ]
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more secure password.')
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Required field validation for auth forms
 * Source: shared/boilerplate/validation/common-validation.ts
 * Modified: Added auth-specific field names and error messages
 */
export function validateRequired(
  value: unknown,
  fieldName = 'Field',
): { valid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return {
      valid: false,
      error: `${fieldName} is required for authentication`,
    }
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, error: `${fieldName} cannot be empty` }
  }

  if (Array.isArray(value) && value.length === 0) {
    return { valid: false, error: `${fieldName} is required` }
  }

  return { valid: true }
}

/**
 * Sanitize auth input to prevent injection attacks
 * Source: shared/boilerplate/validation/common-validation.ts
 * Modified: Added auth-specific sanitization rules
 */
export function sanitizeAuthInput(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data URLs (auth specific)
    .trim()
}

/**
 * Validate username for auth module
 * Auth module specific validation - not from boilerplate
 */
export function validateUsername(username: string): {
  valid: boolean
  error?: string
} {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' }
  }

  const trimmed = username.trim()

  if (trimmed.length < 3) {
    return {
      valid: false,
      error: 'Username must be at least 3 characters long',
    }
  }

  if (trimmed.length > 30) {
    return { valid: false, error: 'Username must not exceed 30 characters' }
  }

  // Only allow alphanumeric characters, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      valid: false,
      error:
        'Username can only contain letters, numbers, underscores, and hyphens',
    }
  }

  // Cannot start or end with special characters
  if (/^[_-]|[_-]$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Username cannot start or end with underscores or hyphens',
    }
  }

  return { valid: true }
}

/**
 * Validate auth token format
 * Auth module specific validation - not from boilerplate
 */
export function validateAuthToken(token: string): {
  valid: boolean
  error?: string
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token is required' }
  }

  const trimmed = token.trim()

  // Basic JWT format check (3 parts separated by dots)
  const parts = trimmed.split('.')
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid token format' }
  }

  // Check if each part is valid base64
  for (const part of parts) {
    if (!(part && /^[A-Za-z0-9_-]+$/.test(part))) {
      return { valid: false, error: 'Invalid token encoding' }
    }
  }

  return { valid: true }
}

/**
 * Validate refresh token format
 * Auth module specific validation - not from boilerplate
 */
export function validateRefreshToken(token: string): {
  valid: boolean
  error?: string
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Refresh token is required' }
  }

  const trimmed = token.trim()

  // Refresh tokens should be hex strings of specific length
  if (!/^[a-f0-9]{64}$/.test(trimmed)) {
    return { valid: false, error: 'Invalid refresh token format' }
  }

  return { valid: true }
}

/**
 * Combined auth input validation
 * Auth module specific - aggregates multiple validations
 */
export interface AuthCredentials {
  email?: string
  username?: string
  password: string
}

export function validateAuthCredentials(credentials: AuthCredentials): {
  valid: boolean
  errors: Record<string, string[]>
} {
  const errors: Record<string, string[]> = {}

  // Validate email if provided
  if (credentials.email !== undefined) {
    if (!validateEmail(credentials.email)) {
      errors.email = ['Please enter a valid email address']
    }
  }

  // Validate username if provided
  if (credentials.username !== undefined) {
    const usernameResult = validateUsername(credentials.username)
    if (!usernameResult.valid && usernameResult.error) {
      errors.username = [usernameResult.error]
    }
  }

  // Validate password (always required)
  const passwordResult = validatePassword(credentials.password)
  if (!passwordResult.valid) {
    errors.password = passwordResult.errors
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
