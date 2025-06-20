/**
 * Application configuration
 * Centralizes all configuration values and environment variables
 */

import { 
  APP_CONFIG, 
  AUTH_CONFIG, 
  DATABASE_CONFIG, 
  PAGINATION_CONFIG, 
  RATE_LIMIT_CONFIG, 
  SERVER_CONFIG 
} from '../constants/config'
import { VALIDATION } from '../constants'

export const config = {
  app: {
    name: APP_CONFIG.NAME,
    version: APP_CONFIG.VERSION,
    environment: process.env.NODE_ENV || APP_CONFIG.DEFAULT_ENVIRONMENT,
  },

  server: {
    port: parseInt(process.env.PORT || String(SERVER_CONFIG.DEFAULT_PORT), 10),
    host: process.env.HOST || SERVER_CONFIG.DEFAULT_HOST,
    graphqlPath: SERVER_CONFIG.GRAPHQL_PATH,
    playground: process.env.NODE_ENV !== 'production',
    introspection: process.env.NODE_ENV !== 'production',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || process.env.APP_SECRET || AUTH_CONFIG.DEFAULT_JWT_SECRET,
    jwtExpiresIn: AUTH_CONFIG.DEFAULT_JWT_EXPIRES_IN,
    bcryptRounds: AUTH_CONFIG.DEFAULT_BCRYPT_ROUNDS,
    passwordMinLength: AUTH_CONFIG.MIN_PASSWORD_LENGTH,
    passwordMaxLength: AUTH_CONFIG.MAX_PASSWORD_LENGTH,
  },

  database: {
    url: process.env.DATABASE_URL,
    logLevel: process.env.NODE_ENV === 'production' ? DATABASE_CONFIG.LOG_LEVELS_PRODUCTION : DATABASE_CONFIG.LOG_LEVELS_DEVELOPMENT,
  },

  pagination: {
    defaultLimit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    maxLimit: PAGINATION_CONFIG.MAX_LIMIT,
  },

  validation: {
    maxTitleLength: VALIDATION.MAX_TITLE_LENGTH,
    maxContentLength: VALIDATION.MAX_CONTENT_LENGTH,
    maxNameLength: VALIDATION.MAX_NAME_LENGTH,
    maxEmailLength: VALIDATION.MAX_EMAIL_LENGTH,
  },

  rateLimit: {
    windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
    maxRequests: RATE_LIMIT_CONFIG.MAX_REQUESTS,
  },
} as const

export type Config = typeof config