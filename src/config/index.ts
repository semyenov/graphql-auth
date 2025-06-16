/**
 * Application configuration
 * Centralizes all configuration values and environment variables
 */

export const config = {
  app: {
    name: 'GraphQL Auth Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  server: {
    port: parseInt(process.env.PORT || '4000', 10),
    host: process.env.HOST || 'localhost',
    graphqlPath: '/',
    playground: process.env.NODE_ENV !== 'production',
    introspection: process.env.NODE_ENV !== 'production',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || process.env.APP_SECRET || 'your-secret-123',
    jwtExpiresIn: '7d',
    bcryptRounds: 10,
    passwordMinLength: 8,
    passwordMaxLength: 128,
  },

  database: {
    url: process.env.DATABASE_URL,
    logLevel: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  validation: {
    maxTitleLength: 255,
    maxContentLength: 10000,
    maxNameLength: 100,
    maxEmailLength: 255,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: {
      default: 100,
      auth: 5,
      query: 50,
      mutation: 20,
    },
  },
} as const

export type Config = typeof config