/**
 * Infrastructure-level constants for the application
 * Following modular monolith pattern - only infrastructure concerns here
 * Domain-specific constants have been moved to their respective modules
 */

// Re-export infrastructure constant modules
export * from './config'
export * from './context'
export * from './validation'

// Infrastructure-level constants that apply across all modules
import { DATABASE_CONFIG, RATE_LIMIT_CONFIG, SERVER_CONFIG } from './config'

/**
 * Server configuration (infrastructure)
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
 * Database configuration (infrastructure)
 */
export const DATABASE = {
  TRANSACTION_TIMEOUT_MS: DATABASE_CONFIG.TRANSACTION_TIMEOUT_MS,
  DEFAULT_TAKE_LIMIT: 50,
  MAX_TAKE_LIMIT: 100,
  LOG_LEVELS: ['warn', 'error'] as const,
} as const

/**
 * Rate limiting configuration (infrastructure)
 */
export const RATE_LIMIT = {
  WINDOW_MS: RATE_LIMIT_CONFIG.WINDOW_MS,
  MAX_REQUESTS: RATE_LIMIT_CONFIG.MAX_REQUESTS,
} as const

/**
 * Infrastructure-level error messages (generic, not domain-specific)
 */
export const INFRASTRUCTURE_ERROR_MESSAGES = {
  INTERNAL_ERROR: 'An internal error occurred',
  NETWORK_ERROR: 'Network error occurred',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  REQUEST_TIMEOUT: 'Request timed out',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  INVALID_INPUT: 'Invalid input provided',
} as const

/**
 * GraphQL context keys (infrastructure)
 */
export const CONTEXT_KEYS = {
  USER_ID: 'userId',
  REQUEST: 'request',
  RESPONSE: 'response',
  PRISMA: 'prisma',
} as const

/**
 * HTTP headers (infrastructure)
 */
export const HEADERS = {
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'content-type',
  USER_AGENT: 'user-agent',
} as const

/**
 * Environment types (infrastructure)
 */
export const ENVIRONMENTS = ['development', 'production', 'test'] as const
export type Environment = (typeof ENVIRONMENTS)[number]

/**
 * Log levels (infrastructure)
 */
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const
export type LogLevel = (typeof LOG_LEVELS)[number]

/**
 * Migration note for modular monolith pattern:
 *
 * Domain-specific constants have been moved to their respective modules:
 * - Authentication: src/modules/auth/constants.ts
 * - Posts: src/modules/posts/constants.ts
 * - Users: src/modules/users/constants.ts
 *
 * To access domain constants, import directly from the module:
 * import { AUTH_CONSTANTS } from '@/modules/auth/constants'
 * import { POST_CONSTANTS } from '@/modules/posts/constants'
 * import { USER_CONSTANTS } from '@/modules/users/constants'
 */
