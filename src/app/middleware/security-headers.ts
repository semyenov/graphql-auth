/**
 * Security Headers Middleware
 *
 * Implements security headers similar to helmet.js for Bun/H3 environment.
 * Provides comprehensive security headers to protect against common web vulnerabilities.
 */

import type { IncomingMessage, ServerResponse } from 'http'
import { isDevelopment } from '../config/environment'

/**
 * Security header configuration
 */
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    directives?: Record<string, string[]>
    reportOnly?: boolean
  }
  crossOriginEmbedderPolicy?: boolean
  crossOriginOpenerPolicy?: string
  crossOriginResourcePolicy?: string
  dnsPrefetchControl?: boolean
  frameguard?: {
    action?: 'deny' | 'sameorigin'
  }
  hidePoweredBy?: boolean
  hsts?: {
    maxAge?: number
    includeSubDomains?: boolean
    preload?: boolean
  }
  ieNoOpen?: boolean
  noSniff?: boolean
  originAgentCluster?: boolean
  permittedCrossDomainPolicies?: string
  referrerPolicy?: string
  xssFilter?: boolean
}

/**
 * Default security headers configuration
 */
const defaultConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'base-uri': ["'self'"],
      'font-src': ["'self'", 'https:', 'data:'],
      'form-action': ["'self'"],
      'frame-ancestors': ["'self'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'script-src-attr': ["'none'"],
      'style-src': ["'self'", 'https:', "'unsafe-inline'"],
      'upgrade-insecure-requests': [],
    },
    reportOnly: false,
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: 'same-origin',
  crossOriginResourcePolicy: 'same-origin',
  dnsPrefetchControl: true,
  frameguard: {
    action: 'deny',
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 15552000, // 180 days
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: 'none',
  referrerPolicy: 'no-referrer',
  xssFilter: true,
}

/**
 * Create Content-Security-Policy header value
 */
function createCSPHeader(
  config: SecurityHeadersConfig['contentSecurityPolicy'],
): string {
  if (!config?.directives) return ''

  return Object.entries(config.directives)
    .map(([key, values]) => {
      if (values.length === 0) return key
      return `${key} ${values.join(' ')}`
    })
    .join('; ')
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(
  res: ServerResponse,
  config: SecurityHeadersConfig = defaultConfig,
): void {
  // Content-Security-Policy
  if (config.contentSecurityPolicy) {
    const cspValue = createCSPHeader(config.contentSecurityPolicy)
    if (cspValue) {
      const headerName = config.contentSecurityPolicy.reportOnly
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy'
      res.setHeader(headerName, cspValue)
    }
  }

  // Cross-Origin-Embedder-Policy
  if (config.crossOriginEmbedderPolicy) {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  }

  // Cross-Origin-Opener-Policy
  if (config.crossOriginOpenerPolicy) {
    res.setHeader('Cross-Origin-Opener-Policy', config.crossOriginOpenerPolicy)
  }

  // Cross-Origin-Resource-Policy
  if (config.crossOriginResourcePolicy) {
    res.setHeader(
      'Cross-Origin-Resource-Policy',
      config.crossOriginResourcePolicy,
    )
  }

  // X-DNS-Prefetch-Control
  if (config.dnsPrefetchControl !== false) {
    res.setHeader('X-DNS-Prefetch-Control', 'off')
  }

  // X-Frame-Options
  if (config.frameguard) {
    const action = config.frameguard.action || 'deny'
    res.setHeader('X-Frame-Options', action.toUpperCase())
  }

  // X-Powered-By
  if (config.hidePoweredBy !== false) {
    res.removeHeader('X-Powered-By')
  }

  // Strict-Transport-Security (only in production)
  if (!isDevelopment && config.hsts) {
    const {
      maxAge = 15552000,
      includeSubDomains = true,
      preload = true,
    } = config.hsts
    let hstsValue = `max-age=${maxAge}`
    if (includeSubDomains) hstsValue += '; includeSubDomains'
    if (preload) hstsValue += '; preload'
    res.setHeader('Strict-Transport-Security', hstsValue)
  }

  // X-Download-Options
  if (config.ieNoOpen !== false) {
    res.setHeader('X-Download-Options', 'noopen')
  }

  // X-Content-Type-Options
  if (config.noSniff !== false) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
  }

  // Origin-Agent-Cluster
  if (config.originAgentCluster) {
    res.setHeader('Origin-Agent-Cluster', '?1')
  }

  // X-Permitted-Cross-Domain-Policies
  if (config.permittedCrossDomainPolicies) {
    res.setHeader(
      'X-Permitted-Cross-Domain-Policies',
      config.permittedCrossDomainPolicies,
    )
  }

  // Referrer-Policy
  if (config.referrerPolicy) {
    res.setHeader('Referrer-Policy', config.referrerPolicy)
  }

  // X-XSS-Protection
  if (config.xssFilter !== false) {
    res.setHeader('X-XSS-Protection', '0') // Modern browsers have this disabled
  }
}

/**
 * Security headers middleware factory
 */
export function createSecurityHeadersMiddleware(
  config?: SecurityHeadersConfig,
) {
  const mergedConfig = { ...defaultConfig, ...config }

  return async (
    _req: IncomingMessage,
    res: ServerResponse,
    next: () => Promise<void>,
  ) => {
    // Apply security headers
    applySecurityHeaders(res, mergedConfig)

    // Continue to next middleware
    await next()
  }
}

/**
 * GraphQL-specific security headers configuration
 */
export const graphqlSecurityConfig: SecurityHeadersConfig = {
  ...defaultConfig,
  contentSecurityPolicy: {
    directives: {
      ...(defaultConfig.contentSecurityPolicy?.directives || {}),
      'script-src': ["'self'", "'unsafe-inline'"], // Required for GraphQL Playground
      'img-src': ["'self'", 'data:', 'https:', 'cdn.jsdelivr.net'], // GraphQL Playground assets
      'worker-src': ["'self'", 'blob:'], // GraphQL Playground workers
      'connect-src': ["'self'"], // GraphQL endpoint
    },
    reportOnly: isDevelopment,
  },
}

/**
 * Create an Apollo Server plugin for security headers
 */
export function createSecurityHeadersPlugin(_config?: SecurityHeadersConfig) {
  return {
    async requestDidStart() {
      return {
        async willSendResponse(requestContext: {
          response?: { http?: { headers?: Map<string, string> } }
        }) {
          const { response } = requestContext
          // Apply security headers to GraphQL responses
          if (response?.http?.headers) {
            // Add security headers as needed
            response.http.headers.set('X-Content-Type-Options', 'nosniff')
            response.http.headers.set('X-Frame-Options', 'DENY')
            response.http.headers.set('X-XSS-Protection', '0')

            if (!isDevelopment) {
              response.http.headers.set(
                'Strict-Transport-Security',
                'max-age=15552000; includeSubDomains; preload',
              )
            }
          }
        },
      }
    },
  }
}
