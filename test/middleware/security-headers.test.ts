/**
 * Security Headers Middleware Tests
 */

import type { ServerResponse } from 'http'
import { describe, expect, it } from 'vitest'
import {
  applySecurityHeaders,
  graphqlSecurityConfig,
} from '../../src/app/middleware/security-headers'

describe('Security Headers Middleware', () => {
  describe('applySecurityHeaders', () => {
    it('should apply all default security headers', () => {
      const headers: Record<string, string> = {}
      const mockResponse = {
        setHeader: (name: string, value: string) => {
          headers[name] = value
        },
        removeHeader: (name: string) => {
          delete headers[name]
        },
      } as unknown as ServerResponse

      applySecurityHeaders(mockResponse)

      // Check essential security headers
      expect(headers['X-Content-Type-Options']).toBe('nosniff')
      expect(headers['X-Frame-Options']).toBe('DENY')
      expect(headers['X-XSS-Protection']).toBe('0')
      expect(headers['X-Download-Options']).toBe('noopen')
      expect(headers['X-DNS-Prefetch-Control']).toBe('off')
      expect(headers['Cross-Origin-Embedder-Policy']).toBe('require-corp')
      expect(headers['Cross-Origin-Opener-Policy']).toBe('same-origin')
      expect(headers['Cross-Origin-Resource-Policy']).toBe('same-origin')
      expect(headers['Origin-Agent-Cluster']).toBe('?1')
      expect(headers['X-Permitted-Cross-Domain-Policies']).toBe('none')
      expect(headers['Referrer-Policy']).toBe('no-referrer')
    })

    it('should not set HSTS header with explicit development config', () => {
      const headers: Record<string, string> = {}
      const mockResponse = {
        setHeader: (name: string, value: string) => {
          headers[name] = value
        },
        removeHeader: () => {},
      } as unknown as ServerResponse

      // Disable HSTS explicitly
      applySecurityHeaders(mockResponse, {
        hsts: undefined,
      })

      expect(headers['Strict-Transport-Security']).toBeUndefined()
    })

    it('should set HSTS header in production', () => {
      const headers: Record<string, string> = {}
      const mockResponse = {
        setHeader: (name: string, value: string) => {
          headers[name] = value
        },
        removeHeader: () => {},
      } as unknown as ServerResponse

      // Mock production environment
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      applySecurityHeaders(mockResponse)

      expect(headers['Strict-Transport-Security']).toBe(
        'max-age=15552000; includeSubDomains; preload',
      )

      // Restore environment
      process.env.NODE_ENV = originalEnv
    })

    it('should respect custom configuration', () => {
      const headers: Record<string, string> = {}
      const mockResponse = {
        setHeader: (name: string, value: string) => {
          headers[name] = value
        },
        removeHeader: () => {},
      } as unknown as ServerResponse

      applySecurityHeaders(mockResponse, {
        frameguard: { action: 'sameorigin' },
        referrerPolicy: 'strict-origin',
        xssFilter: false,
      })

      expect(headers['X-Frame-Options']).toBe('SAMEORIGIN')
      expect(headers['Referrer-Policy']).toBe('strict-origin')
      expect(headers['X-XSS-Protection']).toBeUndefined()
    })
  })

  describe('Content-Security-Policy', () => {
    it('should generate correct CSP header', () => {
      const headers: Record<string, string> = {}
      const mockResponse = {
        setHeader: (name: string, value: string) => {
          headers[name] = value
        },
        removeHeader: () => {},
      } as unknown as ServerResponse

      applySecurityHeaders(mockResponse)

      const csp = headers['Content-Security-Policy']
      expect(csp).toBeDefined()
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("object-src 'none'")
      expect(csp).toContain('upgrade-insecure-requests')
    })

    it('should support report-only mode', () => {
      const headers: Record<string, string> = {}
      const mockResponse = {
        setHeader: (name: string, value: string) => {
          headers[name] = value
        },
        removeHeader: () => {},
      } as unknown as ServerResponse

      applySecurityHeaders(mockResponse, {
        contentSecurityPolicy: {
          directives: { 'default-src': ["'self'"] },
          reportOnly: true,
        },
      })

      expect(headers['Content-Security-Policy-Report-Only']).toBeDefined()
      expect(headers['Content-Security-Policy']).toBeUndefined()
    })
  })

  describe('GraphQL Security Config', () => {
    it('should have GraphQL-specific CSP directives', () => {
      const { contentSecurityPolicy } = graphqlSecurityConfig
      expect(contentSecurityPolicy?.directives?.['script-src']).toContain(
        "'unsafe-inline'",
      )
      expect(contentSecurityPolicy?.directives?.['img-src']).toContain(
        'cdn.jsdelivr.net',
      )
      expect(contentSecurityPolicy?.directives?.['worker-src']).toContain(
        'blob:',
      )
    })
  })
})
