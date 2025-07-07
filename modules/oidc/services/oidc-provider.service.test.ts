/**
 * OIDC Provider Service Unit Tests
 *
 * Tests for the OIDC provider service functionality including:
 * - Provider initialization
 * - Client management (CRUD operations)
 * - User sessions management
 * - Account finding
 */

import type { OidcClient, User } from '@prisma/client'
import type { KoaContextWithOIDC } from 'oidc-provider'
import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../../src/prisma'
import { OidcProviderService } from './oidc-provider.service'

describe('OidcProviderService', () => {
  let service: OidcProviderService
  let mockUser: User
  let mockClient: OidcClient

  beforeEach(async () => {
    // Clean database
    await prisma.oidcSession.deleteMany()
    await prisma.oidcClient.deleteMany()
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()

    // Create test data
    mockUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        emailVerified: true,
      },
    })

    mockClient = await prisma.oidcClient.create({
      data: {
        clientId: 'test-client',
        clientSecret: 'test-secret',
        clientName: 'Test Client',
        redirectUris: JSON.stringify(['http://localhost:3000/callback']),
        grantTypes: JSON.stringify(['authorization_code', 'refresh_token']),
        responseTypes: JSON.stringify(['code']),
        scope: 'openid profile email',
        applicationType: 'web',
      },
    })

    // Create service (container already configured in test setup)
    service = new OidcProviderService()
  })

  describe('Provider Management', () => {
    it('should initialize provider with correct configuration', () => {
      const provider = service.getProvider()
      expect(provider).toBeDefined()
      expect(provider.proxy).toBe(true)
    })

    it('should return callback middleware', () => {
      const provider = service.getProvider()
      expect(provider.callback).toBeDefined()
      expect(typeof provider.callback()).toBe('function')
    })
  })

  describe('Account Finding', () => {
    it('should find account by user id', async () => {
      const mockCtx = {} as KoaContextWithOIDC
      const account = await service.findAccount(mockCtx, mockUser.id.toString())

      expect(account).toBeDefined()
      expect(account?.accountId).toBe(mockUser.id.toString())
    })

    it('should return undefined for non-existent user', async () => {
      const mockCtx = {} as KoaContextWithOIDC
      const account = await service.findAccount(mockCtx, '99999')

      expect(account).toBeUndefined()
    })

    it('should return correct claims for account', async () => {
      const mockCtx = {} as KoaContextWithOIDC
      const account = await service.findAccount(mockCtx, mockUser.id.toString())

      if (account && 'claims' in account) {
        const claims = await account.claims()
        expect(claims).toMatchObject({
          sub: mockUser.id.toString(),
          email: mockUser.email,
          email_verified: mockUser.emailVerified,
          name: mockUser.name,
          preferred_username: mockUser.email,
        })
      }
    })
  })

  describe('Client Management', () => {
    describe('createClient', () => {
      it('should create a new OIDC client', async () => {
        const clientData = {
          clientId: 'new-client',
          clientSecret: 'new-secret',
          clientName: 'New Client',
          redirectUris: ['http://localhost:3001/callback'],
          postLogoutRedirectUris: ['http://localhost:3001/logout'],
          scope: 'openid profile',
          grantTypes: ['authorization_code'],
          responseTypes: ['code'],
          applicationType: 'web' as const,
        }

        const client = await service.createClient(clientData)

        expect(client).toBeDefined()
        expect(client.clientId).toBe(clientData.clientId)
        expect(client.clientName).toBe(clientData.clientName)
        expect(JSON.parse(client.redirectUris)).toEqual(clientData.redirectUris)
      })

      it('should use defaults for optional fields', async () => {
        const clientData = {
          clientId: 'minimal-client',
          clientName: 'Minimal Client',
          redirectUris: ['http://localhost:3002/callback'],
        }

        const client = await service.createClient(clientData)

        expect(client.scope).toBe('openid profile email')
        expect(JSON.parse(client.grantTypes)).toEqual([
          'authorization_code',
          'refresh_token',
        ])
        expect(JSON.parse(client.responseTypes)).toEqual(['code'])
        expect(client.applicationType).toBe('web')
      })
    })

    describe('getClient', () => {
      it('should retrieve existing client', async () => {
        const client = await service.getClient(mockClient.clientId)

        expect(client).toBeDefined()
        expect(client.clientId).toBe(mockClient.clientId)
        expect(JSON.parse(client.redirectUris)).toEqual([
          'http://localhost:3000/callback',
        ])
        expect(JSON.parse(client.grantTypes)).toEqual([
          'authorization_code',
          'refresh_token',
        ])
      })

      it('should throw NotFoundError for non-existent client', async () => {
        await expect(service.getClient('non-existent')).rejects.toThrow(
          'Client',
        )
      })
    })

    describe('listClients', () => {
      it('should return all clients with JSON fields', async () => {
        const clients = await service.listClients()

        expect(clients).toHaveLength(1)
        expect(clients[0]?.clientId).toBe(mockClient.clientId)
        expect(typeof clients[0]?.redirectUris).toBe('string')
        expect(typeof clients[0]?.grantTypes).toBe('string')
      })
    })

    describe('updateClient', () => {
      it('should update client properties', async () => {
        const updates = {
          clientName: 'Updated Client Name',
          redirectUris: ['http://localhost:3000/new-callback'],
          scope: 'openid profile email offline_access',
        }

        const updated = await service.updateClient(mockClient.clientId, updates)

        expect(updated.clientName).toBe(updates.clientName)
        expect(JSON.parse(updated.redirectUris)).toEqual(updates.redirectUris)
        expect(updated.scope).toBe(updates.scope)
      })

      it('should handle partial updates', async () => {
        const updates = { clientName: 'Only Name Updated' }
        const updated = await service.updateClient(mockClient.clientId, updates)

        expect(updated.clientName).toBe(updates.clientName)
        expect(JSON.parse(updated.redirectUris)).toEqual([
          'http://localhost:3000/callback',
        ])
      })
    })

    describe('deleteClient', () => {
      it('should delete client', async () => {
        await service.deleteClient(mockClient.clientId)

        const clients = await service.listClients()
        expect(clients).toHaveLength(0)
      })
    })
  })

  describe('User Sessions Management', () => {
    let sessionId: string

    beforeEach(async () => {
      sessionId = 'test-session-id'
      await prisma.oidcSession.create({
        data: {
          sessionId,
          userId: mockUser.id,
          clientId: mockClient.clientId,
          scope: 'openid profile',
          authTime: new Date(),
          expiresAt: new Date(Date.now() + 86400000), // 1 day
        },
      })
    })

    describe('getUserSessions', () => {
      it('should return user sessions with client info', async () => {
        const sessions = await service.getUserSessions(mockUser.id)

        expect(sessions).toHaveLength(1)
        expect(sessions[0]).toMatchObject({
          sessionId,
          clientId: mockClient.clientId,
          scope: 'openid profile',
        })
      })

      it('should return empty array for user without sessions', async () => {
        const sessions = await service.getUserSessions(99999)
        expect(sessions).toEqual([])
      })
    })

    describe('revokeUserSession', () => {
      it('should revoke specific user session', async () => {
        await service.revokeUserSession(mockUser.id, sessionId)

        const sessions = await service.getUserSessions(mockUser.id)
        expect(sessions).toHaveLength(0)
      })

      it('should handle non-existent session gracefully', async () => {
        // Should not throw when trying to revoke non-existent session
        await service.revokeUserSession(mockUser.id, 'non-existent')

        // Sessions should remain unchanged
        const sessions = await service.getUserSessions(mockUser.id)
        expect(sessions).toHaveLength(1)
      })
    })

    describe('revokeAllUserSessions', () => {
      it('should revoke all user sessions', async () => {
        // Create multiple sessions
        await prisma.oidcSession.create({
          data: {
            sessionId: 'session-2',
            userId: mockUser.id,
            clientId: mockClient.clientId,
            scope: 'openid',
            authTime: new Date(),
            expiresAt: new Date(Date.now() + 86400000),
          },
        })

        await service.revokeAllUserSessions(mockUser.id)

        const sessions = await service.getUserSessions(mockUser.id)
        expect(sessions).toHaveLength(0)
      })
    })
  })
})
