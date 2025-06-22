/**
 * OIDC Middleware Unit Tests
 *
 * Tests for OIDC middleware functionality including:
 * - Route handling for OIDC endpoints
 * - Error handling
 * - Integration with OIDC provider
 */

import type { IncomingMessage, ServerResponse } from 'node:http'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createOidcMiddleware } from '../../../modules/oidc/oidc.middleware'
import type { IOidcProviderService } from '../../../modules/oidc/services/oidc-provider.service'

// Create mocks that will be reset in beforeEach
interface MockProvider {
  callback: ReturnType<typeof vi.fn>
  interactionDetails: ReturnType<typeof vi.fn>
  interactionFinished: ReturnType<typeof vi.fn>
}

let mockProvider: MockProvider
let mockOidcService: IOidcProviderService

function createMocks() {
  mockProvider = {
    callback: vi.fn(),
    interactionDetails: vi.fn(),
    interactionFinished: vi.fn(),
  }

  mockOidcService = {
    getProvider: vi.fn().mockReturnValue(mockProvider),
    findAccount: vi.fn(),
    createClient: vi.fn(),
    getClient: vi.fn(),
    listClients: vi.fn(),
    updateClient: vi.fn(),
    deleteClient: vi.fn(),
    getUserSessions: vi.fn(),
    revokeUserSession: vi.fn(),
    revokeAllUserSessions: vi.fn(),
  }
}

describe('OIDC Middleware Tests', () => {
  let middleware: ReturnType<typeof createOidcMiddleware>
  let mockReq: Partial<IncomingMessage>
  let mockRes: Partial<ServerResponse>
  let mockNext: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()

    // Create fresh mocks
    createMocks()

    // Setup the callback to return a function
    const callbackHandler = vi.fn().mockResolvedValue(undefined)
    mockProvider.callback.mockReturnValue(callbackHandler)

    // Register mock service
    container.clearInstances()
    container.register<IOidcProviderService>('IOidcProviderService', {
      useValue: mockOidcService,
    })

    // Create middleware
    middleware = createOidcMiddleware()

    // Create mock request and response
    mockReq = {
      url: '/',
      method: 'GET',
      headers: {},
    }

    mockRes = {
      statusCode: 200,
      end: vi.fn(),
      setHeader: vi.fn(),
      write: vi.fn(),
    }

    mockNext = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Route Handling', () => {
    it('should handle OIDC routes', async () => {
      mockReq.url = '/oidc/auth'
      const providerCallback = vi.fn().mockResolvedValue(undefined)
      mockProvider.callback.mockReturnValue(providerCallback)

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockProvider.callback).toHaveBeenCalled()
      expect(providerCallback).toHaveBeenCalledWith(mockReq, mockRes)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should handle .well-known routes', async () => {
      mockReq.url = '/.well-known/openid-configuration'
      const providerCallback = vi.fn().mockResolvedValue(undefined)
      mockProvider.callback.mockReturnValue(providerCallback)

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockProvider.callback).toHaveBeenCalled()
      expect(providerCallback).toHaveBeenCalledWith(mockReq, mockRes)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should pass through non-OIDC routes', async () => {
      mockReq.url = '/graphql'

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockProvider.callback).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalled()
    })

    it('should handle routes without next function', async () => {
      mockReq.url = '/graphql'

      await middleware(mockReq as IncomingMessage, mockRes as ServerResponse)

      expect(mockProvider.callback).not.toHaveBeenCalled()
      expect(mockNext).not.toHaveBeenCalled()
      expect(mockRes.end).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle provider errors with next function', async () => {
      mockReq.url = '/oidc/auth'
      const error = new Error('Provider error')
      const providerCallback = vi.fn().mockRejectedValue(error)
      mockProvider.callback.mockReturnValue(providerCallback)

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalled()
      expect(mockRes.statusCode).toBe(200) // Should not change status
    })

    it('should handle provider errors without next function', async () => {
      mockReq.url = '/oidc/auth'
      const error = new Error('Provider error')
      const providerCallback = vi.fn().mockRejectedValue(error)
      mockProvider.callback.mockReturnValue(providerCallback)

      await middleware(mockReq as IncomingMessage, mockRes as ServerResponse)

      expect(mockRes.statusCode).toBe(500)
      expect(mockRes.end).toHaveBeenCalledWith('Internal Server Error')
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined URL', async () => {
      mockReq.url = undefined

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalled()
      expect(mockProvider.callback).not.toHaveBeenCalled()
    })

    it('should handle empty URL', async () => {
      mockReq.url = ''

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockNext).toHaveBeenCalled()
      expect(mockProvider.callback).not.toHaveBeenCalled()
    })

    it('should handle URL with query parameters', async () => {
      mockReq.url =
        '/oidc/auth?client_id=test&redirect_uri=http://localhost:3000'
      const providerCallback = vi.fn().mockResolvedValue(undefined)
      mockProvider.callback.mockReturnValue(providerCallback)

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockProvider.callback).toHaveBeenCalled()
      expect(providerCallback).toHaveBeenCalledWith(mockReq, mockRes)
    })

    it('should handle .well-known/jwks.json route', async () => {
      mockReq.url = '/.well-known/jwks.json'
      const providerCallback = vi.fn().mockResolvedValue(undefined)
      mockProvider.callback.mockReturnValue(providerCallback)

      await middleware(
        mockReq as IncomingMessage,
        mockRes as ServerResponse,
        mockNext,
      )

      expect(mockProvider.callback).toHaveBeenCalled()
      expect(providerCallback).toHaveBeenCalledWith(mockReq, mockRes)
    })
  })

  describe('Provider Integration', () => {
    it('should get provider from service', () => {
      createOidcMiddleware()

      expect(mockOidcService.getProvider).toHaveBeenCalled()
    })

    it('should reuse the same provider instance', async () => {
      // Clear previous calls
      vi.clearAllMocks()

      const middleware1 = createOidcMiddleware()
      const middleware2 = createOidcMiddleware()

      mockReq.url = '/oidc/auth'
      await middleware1(mockReq as IncomingMessage, mockRes as ServerResponse)
      await middleware2(mockReq as IncomingMessage, mockRes as ServerResponse)

      expect(mockOidcService.getProvider).toHaveBeenCalledTimes(2)
    })
  })
})
