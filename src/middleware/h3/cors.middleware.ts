import {
  defineEventHandler,
  type H3CorsOptions,
  handleCors as h3HandleCors,
} from 'h3'

/**
 * CORS middleware for H3
 */
export function corsMiddleware(options: H3CorsOptions = {}) {
  const defaultOptions: H3CorsOptions = {
    origin: (process.env.CORS_ORIGIN || '*') as '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['X-Request-Id'],
    maxAge: '86400', // 24 hours
    ...options,
  }

  return defineEventHandler((event) => {
    // Handle CORS preflight and regular requests
    h3HandleCors(event, defaultOptions)
  })
}
