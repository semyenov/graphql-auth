/**
 * CORS middleware configuration
 * Handles Cross-Origin Resource Sharing settings for the application
 */

import { serverConfig } from '../config'

/**
 * CORS options type
 */
export interface CorsOptions {
  origin?: string | boolean | string[] | ((origin: string, callback: (err: Error | null, allow?: boolean) => void) => void)
  credentials?: boolean
  maxAge?: number
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
}

/**
 * Get CORS options based on environment
 */
export function getCorsOptions(): CorsOptions | boolean {
  const { cors } = serverConfig
  
  // If origin is a boolean, return it directly
  if (typeof cors.origin === 'boolean') {
    return cors.origin
  }
  
  // Return full CORS configuration
  return {
    origin: cors.origin,
    credentials: cors.credentials,
    maxAge: cors.maxAge,
    methods: cors.methods,
    allowedHeaders: cors.allowedHeaders,
    exposedHeaders: cors.exposedHeaders,
  }
}

/**
 * CORS error messages
 */
export const CORS_ERRORS = {
  ORIGIN_NOT_ALLOWED: 'Origin not allowed by CORS policy',
  INVALID_CREDENTIALS: 'CORS policy does not allow credentials for this origin',
} as const