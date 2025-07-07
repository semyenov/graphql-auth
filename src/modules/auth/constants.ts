/**
 * Authentication Module Constants
 * Following modular monolith pattern - domain-specific constants isolated within module
 */

// Auth configuration constants (moved from app/constants)
export const AUTH_CONSTANTS = {
  // Password requirements
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,

  // Token configuration
  TOKEN_ALGORITHM: 'HS256' as const,
  DEFAULT_JWT_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',

  // Argon2 configuration
  ARGON2_CONFIG: {
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  },

  // Validation patterns
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Rate limiting
  RATE_LIMITS: {
    LOGIN: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_ATTEMPTS: 5,
    },
    SIGNUP: {
      WINDOW_MS: 60 * 60 * 1000, // 1 hour
      MAX_ATTEMPTS: 3,
    },
    PASSWORD_RESET: {
      WINDOW_MS: 60 * 60 * 1000, // 1 hour
      MAX_ATTEMPTS: 3,
    },
  },
} as const

// Auth-specific error messages
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS:
    'Invalid email or password. Please check your credentials and try again.',
  USER_NOT_FOUND: 'No user found with the provided identifier',
  EMAIL_ALREADY_EXISTS:
    'An account with this email address already exists. Please use a different email or sign in.',
  AUTHENTICATION_REQUIRED:
    'You must be logged in to perform this action. Please authenticate and try again.',
  INVALID_TOKEN:
    'The provided authentication token is invalid or malformed. Please sign in again.',
  TOKEN_EXPIRED:
    'Your authentication token has expired. Please sign in again to continue.',
  CURRENT_PASSWORD_REQUIRED: 'Current password is required to change password',
  NEW_PASSWORD_REQUIRED: 'New password is required to change password',
  PASSWORD_MISMATCH: 'The provided passwords do not match',
  PASSWORD_TOO_SHORT: `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters long for security`,
  PASSWORD_TOO_LONG: `Password cannot exceed ${AUTH_CONSTANTS.MAX_PASSWORD_LENGTH} characters`,
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required to refresh authentication',
  INVALID_REFRESH_TOKEN:
    'The provided refresh token is invalid or malformed. Please request a new refresh token.',
  INVALID_RESET_TOKEN:
    'The provided reset token is invalid or malformed. Please request a new reset token.',
  INVALID_CODE:
    'The provided code is invalid or malformed. Please request a new code.',
  INVALID_EMAIL:
    'Please provide a valid email address (e.g., user@example.com)',
  ACCOUNT_LOCKED:
    'Account temporarily locked due to too many failed login attempts',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in',
} as const

// Auth success messages
export const AUTH_SUCCESS_MESSAGES = {
  USER_CREATED: 'User account created successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email address verified successfully',
  PASSWORD_RESET_SENT: 'Password reset instructions sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
} as const

// Role hierarchy for authorization (auth-specific)
export const ROLE_HIERARCHY = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
} as const

export type AuthRole = keyof typeof ROLE_HIERARCHY
export type AuthErrorMessage = keyof typeof AUTH_ERROR_MESSAGES
export type AuthSuccessMessage = keyof typeof AUTH_SUCCESS_MESSAGES
