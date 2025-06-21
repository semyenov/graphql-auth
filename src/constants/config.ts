/**
 * Configuration-related constants
 */

export const APP_CONFIG = {
  NAME: 'GraphQL Auth Server',
  VERSION: '1.0.0',
  DEFAULT_ENVIRONMENT: 'development',
} as const

export const SERVER_CONFIG = {
  DEFAULT_PORT: 4000,
  DEFAULT_HOST: 'localhost',
  GRAPHQL_PATH: '/',
  HEALTH_CHECK_PATH: '/health',
  CORS_CREDENTIALS: true,
  INTROSPECTION_ENABLED: true,
} as const

export const AUTH_CONFIG = {
  DEFAULT_JWT_EXPIRES_IN: '7d',
  DEFAULT_BCRYPT_ROUNDS: 10,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  DEFAULT_JWT_SECRET: 'your-secret-123',
  TOKEN_ALGORITHM: 'HS256' as const,
} as const

export const DATABASE_CONFIG = {
  DEFAULT_URL: 'file:./dev.db',
  LOG_LEVELS_PRODUCTION: ['error', 'warn'] as const,
  LOG_LEVELS_DEVELOPMENT: ['query', 'info', 'warn', 'error'] as const,
  TRANSACTION_TIMEOUT_MS: 10000,
} as const

export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_TAKE_LIMIT: 50,
} as const

export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: {
    DEFAULT: 100,
    AUTH: 5,
    QUERY: 50,
    MUTATION: 20,
  },
} as const

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const
export type LogLevel = (typeof LOG_LEVELS)[number]

export const ENVIRONMENTS = ['development', 'production', 'test'] as const
export type Environment = (typeof ENVIRONMENTS)[number]
