/**
 * Server configuration
 * Manages HTTP server and GraphQL server settings
 */

import { z } from 'zod'

/**
 * CORS configuration schema
 */
const CorsConfigSchema = z.object({
  origin: z
    .union([
      z.string(),
      z.boolean(),
      z.array(z.string()),
      z.function().args(z.string(), z.function()).returns(z.void()),
    ])
    .optional(),
  credentials: z.boolean().default(true),
  maxAge: z.number().int().positive().default(86400), // 24 hours
  methods: z.array(z.string()).default(['GET', 'POST', 'OPTIONS']),
  allowedHeaders: z.array(z.string()).optional(),
  exposedHeaders: z.array(z.string()).optional(),
})

/**
 * Server configuration schema
 */
const ServerConfigSchema = z.object({
  port: z.number().int().min(1).max(65535),
  host: z.string(),
  graphqlPath: z.string().default('/graphql'),
  playground: z.boolean(),
  introspection: z.boolean(),
  cors: CorsConfigSchema,
  bodyLimit: z
    .number()
    .int()
    .positive()
    .default(100 * 1024), // 100KB
  requestTimeout: z.number().int().positive().default(30000), // 30 seconds
})

/**
 * Parse server configuration
 */
function parseServerConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : !!isDevelopment // Disallow all origins in production by default

  const config = {
    port: Number.parseInt(process.env.PORT || '4000', 10),
    host: process.env.HOST || 'localhost',
    graphqlPath: process.env.GRAPHQL_PATH || '/graphql',
    playground: !isProduction && process.env.ENABLE_PLAYGROUND !== 'false',
    introspection:
      !isProduction && process.env.ENABLE_INTROSPECTION !== 'false',
    cors: {
      origin: corsOrigin,
      credentials: process.env.CORS_CREDENTIALS !== 'false',
      maxAge: Number.parseInt(process.env.CORS_MAX_AGE || '86400', 10),
      methods: process.env.CORS_METHODS?.split(',').map((m) => m.trim()) || [
        'GET',
        'POST',
        'OPTIONS',
      ],
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',').map((h) =>
        h.trim(),
      ),
      exposedHeaders: process.env.CORS_EXPOSED_HEADERS?.split(',').map((h) =>
        h.trim(),
      ),
    },
    bodyLimit: Number.parseInt(process.env.BODY_LIMIT || '102400', 10), // 100KB default
    requestTimeout: Number.parseInt(process.env.REQUEST_TIMEOUT || '30000', 10), // 30s default
  }

  return ServerConfigSchema.parse(config)
}

export const serverConfig = parseServerConfig()

/**
 * Server defaults
 */
export const SERVER_DEFAULTS = {
  DEFAULT_PORT: 4000,
  DEFAULT_HOST: 'localhost',
  GRAPHQL_PATH: '/graphql',
  DEFAULT_BODY_LIMIT: 100 * 1024, // 100KB
  DEFAULT_REQUEST_TIMEOUT: 30000, // 30 seconds
} as const

/**
 * GraphQL server options
 */
export const graphqlServerOptions = {
  path: serverConfig.graphqlPath,
  playground: serverConfig.playground,
  introspection: serverConfig.introspection,
  formatError: (error: unknown) => {
    // Remove stack traces in production
    if (
      process.env.NODE_ENV === 'production' &&
      error &&
      typeof error === 'object'
    ) {
      const typedError = error as {
        extensions?: {
          exception?: { stacktrace?: unknown }
          stacktrace?: unknown
        }
      }
      if (typedError.extensions?.exception?.stacktrace) {
        typedError.extensions.exception.stacktrace = undefined
      }
      if (typedError.extensions?.stacktrace) {
        typedError.extensions.stacktrace = undefined
      }
    }
    return error
  },
}
