/**
 * Centralized constants for the application
 */

// Re-export all constant modules
export * from './config'
export * from './context'
export * from './graphql'
export * from './validation'

// Legacy exports for backward compatibility
import { AUTH_CONFIG, DATABASE_CONFIG, RATE_LIMIT_CONFIG, SERVER_CONFIG } from './config'
import { VALIDATION_LIMITS } from './validation'

/**
 * Authentication configuration (legacy)
 */
export const AUTH = {
  BCRYPT_ROUNDS: AUTH_CONFIG.DEFAULT_BCRYPT_ROUNDS,
  TOKEN_EXPIRY: AUTH_CONFIG.DEFAULT_JWT_EXPIRES_IN,
  TOKEN_ALGORITHM: AUTH_CONFIG.TOKEN_ALGORITHM,
  MIN_PASSWORD_LENGTH: AUTH_CONFIG.MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH: AUTH_CONFIG.MAX_PASSWORD_LENGTH,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

/**
 * Database configuration (legacy)
 */
export const DATABASE = {
  TRANSACTION_TIMEOUT_MS: DATABASE_CONFIG.TRANSACTION_TIMEOUT_MS,
  DEFAULT_TAKE_LIMIT: 50,
  MAX_TAKE_LIMIT: 100,
  LOG_LEVELS: ['warn', 'error'] as const,
} as const

/**
 * Server configuration (legacy)
 */
export const SERVER = {
  DEFAULT_PORT: SERVER_CONFIG.DEFAULT_PORT,
  DEFAULT_HOST: SERVER_CONFIG.DEFAULT_HOST,
  CORS_CREDENTIALS: SERVER_CONFIG.CORS_CREDENTIALS,
  INTROSPECTION_ENABLED: SERVER_CONFIG.INTROSPECTION_ENABLED,
  HEALTH_CHECK_PATH: SERVER_CONFIG.HEALTH_CHECK_PATH,
  GRAPHQL_PATH: SERVER_CONFIG.GRAPHQL_PATH,
} as const

/**
 * Role hierarchy for authorization
 */
export const ROLE_HIERARCHY = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
} as const

/**
 * Rate limiting configuration (legacy)
 */
export const RATE_LIMIT = {
  WINDOW_MS: RATE_LIMIT_CONFIG.WINDOW_MS,
  MAX_REQUESTS: RATE_LIMIT_CONFIG.MAX_REQUESTS,
} as const

/**
 * Validation configuration (legacy)
 */
export const VALIDATION = {
  MAX_TITLE_LENGTH: VALIDATION_LIMITS.TITLE_MAX_LENGTH,
  MAX_CONTENT_LENGTH: VALIDATION_LIMITS.CONTENT_MAX_LENGTH,
  MAX_NAME_LENGTH: VALIDATION_LIMITS.NAME_MAX_LENGTH,
  MAX_EMAIL_LENGTH: VALIDATION_LIMITS.EMAIL_MAX_LENGTH,
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
  USER_NOT_FOUND: 'No user found with the provided identifier',
  EMAIL_ALREADY_EXISTS: 'An account with this email address already exists. Please use a different email or sign in.',
  AUTHENTICATION_REQUIRED: 'You must be logged in to perform this action. Please authenticate and try again.',
  INVALID_TOKEN: 'The provided authentication token is invalid or malformed. Please sign in again.',
  TOKEN_EXPIRED: 'Your authentication token has expired. Please sign in again to continue.',
  CURRENT_PASSWORD_REQUIRED: 'Current password is required to change password',
  NEW_PASSWORD_REQUIRED: 'New password is required to change password',
  PASSWORD_MISMATCH: 'The provided passwords do not match',
  PASSWORD_TOO_SHORT: `Password must be at least ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} characters long for security`,
  PASSWORD_TOO_LONG: `Password cannot exceed ${AUTH_CONFIG.MAX_PASSWORD_LENGTH} characters`,
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required to refresh authentication',
  INVALID_REFRESH_TOKEN: 'The provided refresh token is invalid or malformed. Please request a new refresh token.',
  INVALID_RESET_TOKEN: 'The provided reset token is invalid or malformed. Please request a new reset token.',
  INVALID_CODE: 'The provided code is invalid or malformed. Please request a new code.',
  INVALID_EMAIL: 'Please provide a valid email address (e.g., user@example.com)',
  INVALID_INPUT: 'Invalid input provided',

  // Validation
  TITLE_REQUIRED: 'Post title is required and cannot be empty',
  TITLE_TOO_LONG: `Post title must not exceed ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} characters`,
  CONTENT_TOO_LONG: `Post content must not exceed ${VALIDATION_LIMITS.CONTENT_MAX_LENGTH} characters`,
  NAME_TOO_LONG: `Name must not exceed ${VALIDATION_LIMITS.NAME_MAX_LENGTH} characters`,

  // Authorization
  INSUFFICIENT_PERMISSIONS: 'You do not have the required permissions to perform this operation',
  POST_NOT_FOUND: 'The requested post could not be found. It may have been deleted or the ID is incorrect.',
  NOT_POST_OWNER: 'You can only modify posts that you have created',

  // Generic
  INTERNAL_ERROR: 'An internal error occurred',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  POST_CREATED: 'Post created successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_PUBLISHED: 'Post published successfully',
  POST_UNPUBLISHED: 'Post unpublished successfully',
} as const

/**
 * GraphQL context keys
 */
export const CONTEXT_KEYS = {
  USER_ID: 'userId',
  REQUEST: 'request',
  RESPONSE: 'response',
  PRISMA: 'prisma',
} as const

/**
 * HTTP headers
 */
export const HEADERS = {
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'content-type',
  USER_AGENT: 'user-agent',
} as const