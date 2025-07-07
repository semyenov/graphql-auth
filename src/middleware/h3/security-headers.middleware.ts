/**
 * H3 Security Headers Middleware
 *
 * Applies comprehensive security headers to all HTTP responses
 */

import { defineEventHandler, type H3Event, setHeaders } from 'h3'
import { isDevelopment } from '../../app/config/environment'

export interface SecurityHeadersOptions {
  contentSecurityPolicy?: boolean | string
  crossOriginEmbedderPolicy?: boolean
  crossOriginOpenerPolicy?: boolean | string
  crossOriginResourcePolicy?: boolean | string
  dnsPrefetchControl?: boolean
  frameguard?: boolean | { action: 'deny' | 'sameorigin' }
  hidePoweredBy?: boolean
  hsts?:
    | boolean
    | {
        maxAge?: number
        includeSubDomains?: boolean
        preload?: boolean
      }
  ieNoOpen?: boolean
  noSniff?: boolean
  originAgentCluster?: boolean
  permittedCrossDomainPolicies?: boolean | string
  referrerPolicy?: boolean | string
  xssFilter?: boolean
}

const defaultOptions: SecurityHeadersOptions = {
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true,
}

/**
 * Get default CSP directives for GraphQL endpoints
 */
function getGraphQLCSPDirectives(): string {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "font-src 'self' https: data:",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "img-src 'self' data: https: cdn.jsdelivr.net",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' cdn.jsdelivr.net", // GraphiQL needs unsafe-inline
    "script-src-attr 'none'",
    "style-src 'self' https: 'unsafe-inline'",
    "worker-src 'self' blob:", // GraphiQL workers
    "connect-src 'self'",
    'upgrade-insecure-requests',
  ]

  return directives.join('; ')
}

/**
 * Apply security headers based on options
 */
function applySecurityHeaders(event: H3Event, options: SecurityHeadersOptions) {
  const headers: Record<string, string> = {}

  // Content-Security-Policy
  if (options.contentSecurityPolicy) {
    const cspValue =
      typeof options.contentSecurityPolicy === 'string'
        ? options.contentSecurityPolicy
        : getGraphQLCSPDirectives()

    // Use report-only in development
    const headerName = isDevelopment
      ? 'Content-Security-Policy-Report-Only'
      : 'Content-Security-Policy'

    headers[headerName] = cspValue
  }

  // Cross-Origin-Embedder-Policy
  if (options.crossOriginEmbedderPolicy) {
    headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
  }

  // Cross-Origin-Opener-Policy
  if (options.crossOriginOpenerPolicy) {
    headers['Cross-Origin-Opener-Policy'] =
      typeof options.crossOriginOpenerPolicy === 'string'
        ? options.crossOriginOpenerPolicy
        : 'same-origin'
  }

  // Cross-Origin-Resource-Policy
  if (options.crossOriginResourcePolicy) {
    headers['Cross-Origin-Resource-Policy'] =
      typeof options.crossOriginResourcePolicy === 'string'
        ? options.crossOriginResourcePolicy
        : 'same-origin'
  }

  // X-DNS-Prefetch-Control
  if (options.dnsPrefetchControl) {
    headers['X-DNS-Prefetch-Control'] = 'off'
  }

  // X-Frame-Options
  if (options.frameguard) {
    const action =
      typeof options.frameguard === 'object'
        ? options.frameguard.action
        : 'deny'
    headers['X-Frame-Options'] = action.toUpperCase()
  }

  // Remove X-Powered-By (H3 doesn't set it by default, but just in case)
  if (options.hidePoweredBy) {
    headers['X-Powered-By'] = ''
  }

  // Strict-Transport-Security (only in production)
  if (!isDevelopment && options.hsts) {
    const hstsOptions =
      typeof options.hsts === 'object'
        ? options.hsts
        : { maxAge: 15552000, includeSubDomains: true, preload: true }

    let hstsValue = `max-age=${hstsOptions.maxAge || 15552000}`
    if (hstsOptions.includeSubDomains) hstsValue += '; includeSubDomains'
    if (hstsOptions.preload) hstsValue += '; preload'

    headers['Strict-Transport-Security'] = hstsValue
  }

  // X-Download-Options
  if (options.ieNoOpen) {
    headers['X-Download-Options'] = 'noopen'
  }

  // X-Content-Type-Options
  if (options.noSniff) {
    headers['X-Content-Type-Options'] = 'nosniff'
  }

  // Origin-Agent-Cluster
  if (options.originAgentCluster) {
    headers['Origin-Agent-Cluster'] = '?1'
  }

  // X-Permitted-Cross-Domain-Policies
  if (options.permittedCrossDomainPolicies) {
    headers['X-Permitted-Cross-Domain-Policies'] =
      typeof options.permittedCrossDomainPolicies === 'string'
        ? options.permittedCrossDomainPolicies
        : 'none'
  }

  // Referrer-Policy
  if (options.referrerPolicy) {
    headers['Referrer-Policy'] =
      typeof options.referrerPolicy === 'string'
        ? options.referrerPolicy
        : 'no-referrer'
  }

  // X-XSS-Protection (disabled in modern browsers)
  if (options.xssFilter) {
    headers['X-XSS-Protection'] = '0'
  }

  // Apply all headers at once
  setHeaders(event, headers)
}

/**
 * Create security headers middleware for H3
 */
export function createSecurityHeadersMiddleware(
  options: SecurityHeadersOptions = {},
) {
  const mergedOptions = { ...defaultOptions, ...options }

  return defineEventHandler((event) => {
    applySecurityHeaders(event, mergedOptions)
  })
}
