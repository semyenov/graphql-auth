/**
 * Authentication Module Validation Schemas
 *
 * Contains all validation schemas and rules specific to authentication
 */

import { z } from 'zod'
import { AUTH, ERROR_MESSAGES, VALIDATION } from '../../constants'

/**
 * Email validation with normalization
 */
export const emailSchema = z
  .string()
  .min(1, ERROR_MESSAGES.INVALID_EMAIL)
  .email(ERROR_MESSAGES.INVALID_EMAIL)
  .max(VALIDATION.MAX_EMAIL_LENGTH, ERROR_MESSAGES.INVALID_EMAIL)
  .transform((email) => email.toLowerCase().trim())

/**
 * Password validation with strength requirements
 */
export const passwordSchema = z
  .string()
  .min(AUTH.MIN_PASSWORD_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_SHORT)
  .max(AUTH.MAX_PASSWORD_LENGTH, ERROR_MESSAGES.PASSWORD_TOO_LONG)

/**
 * Strong password validation with additional requirements
 */
export const strongPasswordSchema = passwordSchema
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter',
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter',
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number',
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    'Password must contain at least one special character',
  )

/**
 * Signup input validation
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z
    .string()
    .max(VALIDATION.MAX_NAME_LENGTH, ERROR_MESSAGES.NAME_TOO_LONG)
    .optional()
    .transform((name) => name?.trim()),
})

/**
 * Login input validation
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/**
 * Refresh token validation
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED)
    .regex(/^[A-Za-z0-9+/=]+$/, ERROR_MESSAGES.INVALID_REFRESH_TOKEN),
})

/**
 * Update profile validation
 */
export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .max(VALIDATION.MAX_NAME_LENGTH, ERROR_MESSAGES.NAME_TOO_LONG)
      .optional()
      .transform((name) => name?.trim()),
    email: emailSchema.optional(),
    currentPassword: passwordSchema.optional(),
    newPassword: passwordSchema.optional(),
  })
  .refine(
    (data) => {
      // If changing password, current password is required
      if (data.newPassword && !data.currentPassword) {
        return false
      }
      return true
    },
    {
      message: ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED,
      path: ['currentPassword'],
    },
  )

/**
 * Password reset request validation
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

/**
 * Password reset validation
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, ERROR_MESSAGES.INVALID_RESET_TOKEN),
  newPassword: passwordSchema,
})

/**
 * Two-factor authentication validation
 */
export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, ERROR_MESSAGES.INVALID_CODE)
    .regex(/^\d+$/, ERROR_MESSAGES.INVALID_CODE),
})

/**
 * Session validation
 */
export const sessionSchema = z.object({
  userId: z.number().positive(),
  deviceId: z.string().optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
})

// Re-export shared validation helpers for backwards compatibility
export {
  safeValidateInput as safeValidateAuthInput,
  validateInput as validateAuthInput,
} from '../../core/validation/helpers'
