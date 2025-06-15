import { z } from 'zod'
import type { EnvironmentConfig } from './types'

// Environment schema for validation
const EnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/)
    .transform((val: string) => parseInt(val, 10))
    .default('4000'),
  HOST: z.string().default('localhost'),
  APP_SECRET: z.string().min(8, 'APP_SECRET must be at least 8 characters'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  CORS_ORIGIN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
})

// Parse and validate environment variables
function parseEnvironment(): EnvironmentConfig {
  try {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT || '4000',
      HOST: process.env.HOST || 'localhost',
      APP_SECRET: process.env.APP_SECRET || 'appsecret321',
      DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
      CORS_ORIGIN: process.env.CORS_ORIGIN,
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
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
