/**
 * OIDC Integration Tests
 *
 * Integration tests for OIDC functionality including:
 * - Session management through Prisma
 * - Client management
 * - Provider service integration
 */

import type { OidcClient, User } from '@prisma/client'
import * as argon2 from 'argon2'
import type { KoaContextWithOIDC } from 'oidc-provider'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { IOidcProviderService } from '../../../modules/oidc/services/oidc-provider.service'
import { configureContainer } from '../../../src/app/config/container'
import { prisma } from '../../../src/prisma'

describe('OIDC Integration Tests', () => {
  let testUser: User
  let testClient: OidcClient
  let oidcService: IOidcProviderService

  beforeAll(async () => {
    // Configure DI container
    configureContainer()
    oidcService = container.resolve<IOidcProviderService>(
      'IOidcProviderService',
    )
  })

  beforeEach(async () => {
    // Clean database
    await prisma.oidcSession.deleteMany()
    await prisma.oidcClient.deleteMany()
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()

    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'oidc-test@example.com',
        password: await argon2.hash('password123'),
        name: 'OIDC Test User',
        emailVerified: true,
      },
    })

    // Create test client
    testClient = await prisma.oidcClient.create({
      data: {
        clientId: 'test-integration-client',
        clientSecret: 'test-secret',
        clientName: 'Test Integration Client',
        redirectUris: JSON.stringify(['http://localhost:3000/callback']),
        postLogoutRedirectUris: JSON.stringify(['http://localhost:3000']),
        grantTypes: JSON.stringify(['authorization_code', 'refresh_token']),
        responseTypes: JSON.stringify(['code']),
        scope: 'openid profile email',
        applicationType: 'web',
      },
    })
  })

  describe('Session Management Integration', () => {
    it('should create and retrieve sessions through service', async () => {
      // Create a session
      const session = await prisma.oidcSession.create({
        data: {
          sessionId: 'test-session-id',
          userId: testUser.id,
          clientId: testClient.clientId,
          scope: 'openid profile',
          authTime: new Date(),
          expiresAt: new Date(Date.now() + 86400000), // 1 day
        },
      })

      // Retrieve through service
      const userSessions = await oidcService.getUserSessions(testUser.id)

      expect(userSessions).toHaveLength(1)
      expect(userSessions[0]).toMatchObject({
        sessionId: 'test-session-id',
        clientId: testClient.clientId,
        scope: 'openid profile',
      })
    })

    it('should handle session expiration correctly', async () => {
      // Create expired session
      const expiredSession = await prisma.oidcSession.create({
        data: {
          sessionId: 'expired-session',
          userId: testUser.id,
          clientId: testClient.clientId,
          scope: 'openid',
          authTime: new Date(Date.now() - 86400000), // 1 day ago
          expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
        },
      })

      // Create active session
      const activeSession = await prisma.oidcSession.create({
        data: {
          sessionId: 'active-session',
          userId: testUser.id,
          clientId: testClient.clientId,
          scope: 'openid profile',
          authTime: new Date(),
          expiresAt: new Date(Date.now() + 86400000), // 1 day from now
        },
      })

      const sessions = await oidcService.getUserSessions(testUser.id)

      // Both sessions should be returned (service doesn't filter expired)
      expect(sessions).toHaveLength(2)

      // Check expiration status
      const expired = sessions.find((s) => s.sessionId === 'expired-session')
      const active = sessions.find((s) => s.sessionId === 'active-session')

      expect(expired?.expiresAt && expired.expiresAt < new Date()).toBe(true)
      expect(active?.expiresAt && active.expiresAt > new Date()).toBe(true)
    })

    it('should revoke sessions correctly', async () => {
      // Create multiple sessions
      await prisma.oidcSession.createMany({
        data: [
          {
            sessionId: 'session-1',
            userId: testUser.id,
            clientId: testClient.clientId,
            scope: 'openid',
            authTime: new Date(),
            expiresAt: new Date(Date.now() + 86400000),
          },
          {
            sessionId: 'session-2',
            userId: testUser.id,
            clientId: testClient.clientId,
            scope: 'openid profile',
            authTime: new Date(),
            expiresAt: new Date(Date.now() + 86400000),
          },
        ],
      })

      // Revoke one session
      await oidcService.revokeUserSession(testUser.id, 'session-1')

      let sessions = await oidcService.getUserSessions(testUser.id)
      expect(sessions).toHaveLength(1)
      expect(sessions[0]?.sessionId).toBe('session-2')

      // Revoke all sessions
      await oidcService.revokeAllUserSessions(testUser.id)

      sessions = await oidcService.getUserSessions(testUser.id)
      expect(sessions).toHaveLength(0)
    })
  })

  describe('Client Management Integration', () => {
    it('should manage clients through service', async () => {
      // Create client through service
      const newClient = await oidcService.createClient({
        clientId: 'service-client',
        clientName: 'Service Created Client',
        redirectUris: ['http://localhost:3001/callback'],
      })

      expect(newClient).toBeDefined()
      expect(newClient.clientId).toBe('service-client')

      // List all clients
      const clients = await oidcService.listClients()
      expect(clients.length).toBeGreaterThanOrEqual(2) // test client + new client

      // Update client
      const updated = await oidcService.updateClient('service-client', {
        clientName: 'Updated Service Client',
      })

      expect(updated.clientName).toBe('Updated Service Client')

      // Delete client
      await oidcService.deleteClient('service-client')

      const remainingClients = await oidcService.listClients()
      expect(
        remainingClients.find((c) => c.clientId === 'service-client'),
      ).toBeUndefined()
    })

    it('should handle client with sessions', async () => {
      // Create session for client
      await prisma.oidcSession.create({
        data: {
          sessionId: 'client-session',
          userId: testUser.id,
          clientId: testClient.clientId,
          scope: 'openid',
          authTime: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
        },
      })

      // Get sessions for user
      const sessions = await oidcService.getUserSessions(testUser.id)
      expect(sessions).toHaveLength(1)
      expect(sessions[0]?.clientId).toBe(testClient.clientId)
    })
  })

  describe('Account Finding Integration', () => {
    it('should find account for existing user', async () => {
      const mockCtx = {} as KoaContextWithOIDC
      const account = await oidcService.findAccount(
        mockCtx,
        testUser.id.toString(),
      )

      expect(account).toBeDefined()
      expect(account?.accountId).toBe(testUser.id.toString())

      if (account && 'claims' in account) {
        const claims = await account.claims()
        expect(claims).toMatchObject({
          sub: testUser.id.toString(),
          email: testUser.email,
          email_verified: testUser.emailVerified,
          name: testUser.name,
        })
      }
    })

    it('should return undefined for non-existent user', async () => {
      const mockCtx = {} as KoaContextWithOIDC
      const account = await oidcService.findAccount(mockCtx, '99999')

      expect(account).toBeUndefined()
    })
  })

  describe('Data Integrity', () => {
    it('should maintain referential integrity', async () => {
      // Create session
      await prisma.oidcSession.create({
        data: {
          sessionId: 'integrity-test',
          userId: testUser.id,
          clientId: testClient.clientId,
          scope: 'openid',
          authTime: new Date(),
          expiresAt: new Date(Date.now() + 86400000),
        },
      })

      // Delete user should cascade delete sessions
      await prisma.user.delete({
        where: { id: testUser.id },
      })

      const sessions = await prisma.oidcSession.findMany({
        where: { sessionId: 'integrity-test' },
      })

      expect(sessions).toHaveLength(0)
    })

    it('should handle concurrent session operations', async () => {
      // Create multiple sessions concurrently
      const sessionPromises = Array.from({ length: 5 }, (_, i) =>
        prisma.oidcSession.create({
          data: {
            sessionId: `concurrent-${i}`,
            userId: testUser.id,
            clientId: testClient.clientId,
            scope: 'openid',
            authTime: new Date(),
            expiresAt: new Date(Date.now() + 86400000),
          },
        }),
      )

      await Promise.all(sessionPromises)

      const sessions = await oidcService.getUserSessions(testUser.id)
      expect(sessions).toHaveLength(5)
    })
  })
})
