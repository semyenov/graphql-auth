import { z } from 'zod'
import { AUTH, SERVER } from './constants'
import type { EnvironmentConfig } from './types.d'

/**
 * Environment schema for validation
 * Ensures all required environment variables are present and valid
 */
const EnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform((val: string) => parseInt(val, 10))
    .default(String(SERVER.DEFAULT_PORT)),
  HOST: z.string().default(SERVER.DEFAULT_HOST),
  APP_SECRET: z.string().min(AUTH.MIN_PASSWORD_LENGTH,
    `APP_SECRET must be at least ${AUTH.MIN_PASSWORD_LENGTH} characters`),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  CORS_ORIGIN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  JWT_SECRET: z.string().optional(),
})

/**
 * Parse and validate environment variables
 * @throws {z.ZodError} if validation fails
 */
function parseEnvironment(): EnvironmentConfig {
  try {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT || String(SERVER.DEFAULT_PORT),
      HOST: process.env.HOST || SERVER.DEFAULT_HOST,
      APP_SECRET: process.env.APP_SECRET || 'appsecret321',
      DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      JWT_SECRET: process.env.JWT_SECRET || process.env.APP_SECRET,
    }

    return EnvironmentSchema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:')
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
      process.exit(1)
    }
    throw error
  }
}

export const env = parseEnvironment()

export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
