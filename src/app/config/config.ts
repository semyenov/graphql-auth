/**
 * Application Configuration
 *
 * Centralized configuration management with environment variable validation.
 */

import ms, { type StringValue } from 'ms'
import { z } from 'zod'

const envJwtExpiresIn = z
  .union([
    z.string().default('7d'),
    z.number().default(7 * 24 * 60 * 60 * 1000),
  ])
  .transform((value) => {
    if (typeof value === 'string') {
      const parsed = ms(value as StringValue)
      if (Number.isNaN(parsed)) {
        throw new Error(`Invalid JWT_EXPIRES_IN value: ${value}`)
      }
      return parsed
    }
    return value
  })
  .pipe(z.number())

// Environment schema validation
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('4000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: envJwtExpiresIn,
  BCRYPT_ROUNDS: z.string().transform(Number).default('10'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

// Configuration interfaces
export interface DatabaseConfig {
  url: string
  logLevel: string[]
}

export interface AuthConfig {
  jwtSecret: string
  jwtExpiresIn: number
  bcryptRounds: number
}

export interface ServerConfig {
  port: number
  environment: string
}

export interface AppConfig {
  server: ServerConfig
  database: DatabaseConfig
  auth: AuthConfig
}

// Validate and parse environment variables
function validateEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.format())
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

// Create configuration object
export function getConfig(): AppConfig {
  const env = validateEnv()

  const databaseLogLevel =
    env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['query', 'info', 'warn', 'error']

  return {
    server: {
      port: env.PORT,
      environment: env.NODE_ENV,
    },
    database: {
      url: env.DATABASE_URL,
      logLevel: databaseLogLevel,
    },
    auth: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresIn: env.JWT_EXPIRES_IN,
      bcryptRounds: env.BCRYPT_ROUNDS,
    },
  }
}

// Export a singleton instance
let configInstance: AppConfig | null = null

export function getConfigInstance(): AppConfig {
  if (!configInstance) {
    configInstance = getConfig()
  }
  return configInstance
}
