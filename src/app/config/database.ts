/**
 * Database configuration
 * Manages all database-related settings including Prisma configuration
 */

import { z } from 'zod'

/**
 * Database configuration schema
 */
const DatabaseConfigSchema = z.object({
  url: z.string().url('DATABASE_URL must be a valid URL'),
  logLevel: z.enum(['query', 'info', 'warn', 'error']).array().optional(),
  connectionLimit: z.number().int().positive().default(10),
  poolTimeout: z.number().int().positive().default(2000),
})

/**
 * Parse database configuration from environment
 */
function parseDatabaseConfig() {
  const isProduction = process.env.NODE_ENV === 'production'

  const config = {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    logLevel: isProduction
      ? ['error', 'warn']
      : ['query', 'info', 'warn', 'error'],
    connectionLimit: parseInt(
      process.env.DATABASE_CONNECTION_LIMIT || '10',
      10,
    ),
    poolTimeout: parseInt(process.env.DATABASE_POOL_TIMEOUT || '2000', 10),
  }

  return DatabaseConfigSchema.parse(config)
}

export const databaseConfig = parseDatabaseConfig()

/**
 * Prisma log configuration
 */
export const prismaLogConfig = {
  emit: 'event',
  level: databaseConfig.logLevel,
}

/**
 * Database defaults
 */
export const DATABASE_DEFAULTS = {
  DEFAULT_URL: 'file:./dev.db',
  CONNECTION_LIMIT: 10,
  POOL_TIMEOUT: 2000,
  LOG_LEVELS_DEVELOPMENT: ['query', 'info', 'warn', 'error'],
  LOG_LEVELS_PRODUCTION: ['error', 'warn'],
} as const
