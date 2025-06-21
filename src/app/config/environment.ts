import { z } from 'zod'

/**
 * Environment type definition
 */
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  HOST: string
  APP_SECRET: string
  DATABASE_URL: string
  CORS_ORIGIN?: string
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  JWT_SECRET?: string
}

/**
 * Environment constants
 */
const ENVIRONMENTS = ['development', 'production', 'test'] as const
const DEFAULT_PORT = 4000
const DEFAULT_HOST = 'localhost'
const MIN_SECRET_LENGTH = 32

/**
 * Environment schema for validation
 * Ensures all required environment variables are present and valid
 */
const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(ENVIRONMENTS).default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform((val: string) => Number.parseInt(val, 10))
    .default(String(DEFAULT_PORT)),
  HOST: z.string().default(DEFAULT_HOST),
  APP_SECRET: z
    .string()
    .min(
      MIN_SECRET_LENGTH,
      `APP_SECRET must be at least ${MIN_SECRET_LENGTH} characters`,
    ),
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
      PORT: process.env.PORT || String(DEFAULT_PORT),
      HOST: process.env.HOST || DEFAULT_HOST,
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
      for (const err of error.errors) {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      }
      process.exit(1)
    }
    throw error
  }
}

export const env = parseEnvironment()

export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
