/**
 * Application configuration
 * Centralizes all configuration values and environment variables
 */

import { authConfig } from './auth'
import { databaseConfig } from './database'
import { env } from './environment'
import { serverConfig } from './server'

/**
 * Application defaults
 */
const APP_DEFAULTS = {
  NAME: 'GraphQL Auth Server',
  VERSION: '1.0.0',
  GRAPHQL_PATH: '/graphql',
} as const

/**
 * Pagination defaults
 */
const PAGINATION_DEFAULTS = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

/**
 * Validation defaults
 */
const VALIDATION_DEFAULTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 10000,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
} as const

/**
 * Rate limiting defaults
 */
const RATE_LIMIT_DEFAULTS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const

/**
 * Unified application configuration
 */
export const config = {
  app: {
    name: APP_DEFAULTS.NAME,
    version: APP_DEFAULTS.VERSION,
    environment: env.NODE_ENV,
  },

  server: {
    port: serverConfig.port,
    host: serverConfig.host,
    graphqlPath: serverConfig.graphqlPath,
    playground: serverConfig.playground,
    introspection: serverConfig.introspection,
    cors: serverConfig.cors,
    bodyLimit: serverConfig.bodyLimit,
    requestTimeout: serverConfig.requestTimeout,
  },

  auth: {
    jwtSecret: authConfig.jwtSecret,
    jwtExpiresIn: authConfig.jwtExpiresIn,
    refreshTokenExpiresIn: authConfig.refreshTokenExpiresIn,
    bcryptRounds: authConfig.bcryptRounds,
    passwordMinLength: authConfig.passwordMinLength,
    passwordMaxLength: authConfig.passwordMaxLength,
    sessionTimeout: authConfig.sessionTimeout,
    maxLoginAttempts: authConfig.maxLoginAttempts,
    lockoutDuration: authConfig.lockoutDuration,
  },

  database: {
    url: databaseConfig.url,
    logLevel: databaseConfig.logLevel,
    connectionLimit: databaseConfig.connectionLimit,
    poolTimeout: databaseConfig.poolTimeout,
  },

  pagination: {
    defaultLimit: PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    maxLimit: PAGINATION_DEFAULTS.MAX_LIMIT,
  },

  validation: {
    maxTitleLength: VALIDATION_DEFAULTS.MAX_TITLE_LENGTH,
    maxContentLength: VALIDATION_DEFAULTS.MAX_CONTENT_LENGTH,
    maxNameLength: VALIDATION_DEFAULTS.MAX_NAME_LENGTH,
    maxEmailLength: VALIDATION_DEFAULTS.MAX_EMAIL_LENGTH,
  },

  rateLimit: {
    windowMs: RATE_LIMIT_DEFAULTS.WINDOW_MS,
    maxRequests: RATE_LIMIT_DEFAULTS.MAX_REQUESTS,
  },
} as const

export type Config = typeof config

// Re-export for convenience
export { AUTH_DEFAULTS, AUTH_ERRORS, authConfig } from './auth'
export { DATABASE_DEFAULTS, databaseConfig, prismaLogConfig } from './database'
export { env, isDevelopment, isProduction, isTest } from './environment'
export { graphqlServerOptions, SERVER_DEFAULTS, serverConfig } from './server'
