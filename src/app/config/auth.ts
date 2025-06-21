/**
 * Authentication configuration
 * Manages all authentication and authorization settings
 */

import { z } from 'zod'

/**
 * Authentication configuration schema
 */
const AuthConfigSchema = z.object({
  jwtSecret: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  jwtExpiresIn: z
    .string()
    .regex(
      /^\d+[hdwmy]$/,
      'JWT_EXPIRES_IN must be a valid time string (e.g., 7d, 24h)',
    )
    .default('7d'),
  refreshTokenExpiresIn: z
    .string()
    .regex(
      /^\d+[hdwmy]$/,
      'REFRESH_TOKEN_EXPIRES_IN must be a valid time string',
    )
    .default('30d'),
  bcryptRounds: z.number().int().min(8).max(15).default(10),
  passwordMinLength: z.number().int().positive().default(8),
  passwordMaxLength: z.number().int().positive().default(100),
  sessionTimeout: z.number().int().positive().default(3600), // 1 hour in seconds
  maxLoginAttempts: z.number().int().positive().default(5),
  lockoutDuration: z.number().int().positive().default(900), // 15 minutes in seconds
})

/**
 * Parse authentication configuration from environment
 */
function parseAuthConfig() {
  const config = {
    jwtSecret: process.env.JWT_SECRET || process.env.APP_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
    passwordMaxLength: parseInt(process.env.PASSWORD_MAX_LENGTH || '100', 10),
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600', 10),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900', 10),
  }

  return AuthConfigSchema.parse(config)
}

export const authConfig = parseAuthConfig()

/**
 * Authentication defaults
 */
export const AUTH_DEFAULTS = {
  JWT_EXPIRES_IN: '7d',
  REFRESH_TOKEN_EXPIRES_IN: '30d',
  BCRYPT_ROUNDS: 10,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
  SESSION_TIMEOUT: 3600,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900,
} as const

/**
 * Authentication error messages
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED:
    'Account temporarily locked due to too many failed login attempts',
  SESSION_EXPIRED: 'Your session has expired. Please log in again',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
} as const
