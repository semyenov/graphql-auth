/**
 * Centralized constants for the application
 */

/**
 * Authentication configuration
 */
export const AUTH = {
  BCRYPT_ROUNDS: 10,
  TOKEN_EXPIRY: '7d',
  TOKEN_ALGORITHM: 'HS256' as const,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

/**
 * Database configuration
 */
export const DATABASE = {
  TRANSACTION_TIMEOUT_MS: 10000,
  DEFAULT_TAKE_LIMIT: 50,
  MAX_TAKE_LIMIT: 100,
  LOG_LEVELS: ['warn', 'error'] as const,
} as const

/**
 * Server configuration
 */
export const SERVER = {
  DEFAULT_PORT: 4000,
  DEFAULT_HOST: 'localhost',
  CORS_CREDENTIALS: true,
  INTROSPECTION_ENABLED: true,
  HEALTH_CHECK_PATH: '/health',
  GRAPHQL_PATH: '/',
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
 * Rate limiting configuration
 */
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: {
    DEFAULT: 100,
    AUTH: 5, // Stricter for auth endpoints
    QUERY: 50,
    MUTATION: 20,
  },
} as const

/**
 * Validation configuration
 */
export const VALIDATION = {
  MAX_TITLE_LENGTH: 255,
  MAX_CONTENT_LENGTH: 10000,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
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

  // Validation
  INVALID_EMAIL: 'Please provide a valid email address (e.g., user@example.com)',
  PASSWORD_TOO_SHORT: `Password must be at least ${AUTH.MIN_PASSWORD_LENGTH} characters long for security`,
  PASSWORD_TOO_LONG: `Password cannot exceed ${AUTH.MAX_PASSWORD_LENGTH} characters`,
  TITLE_REQUIRED: 'Post title is required and cannot be empty',
  TITLE_TOO_LONG: `Post title must not exceed ${VALIDATION.MAX_TITLE_LENGTH} characters`,
  CONTENT_TOO_LONG: `Post content must not exceed ${VALIDATION.MAX_CONTENT_LENGTH} characters`,
  NAME_TOO_LONG: `Name must not exceed ${VALIDATION.MAX_NAME_LENGTH} characters`,

  // Authorization
  INSUFFICIENT_PERMISSIONS: 'You do not have the required permissions to perform this operation',
  POST_NOT_FOUND: 'The requested post could not be found. It may have been deleted or the ID is incorrect.',
  NOT_POST_OWNER: 'You can only modify posts that you have created',

  // Generic
  INTERNAL_ERROR: 'An internal error occurred',
  INVALID_INPUT: 'Invalid input provided',
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