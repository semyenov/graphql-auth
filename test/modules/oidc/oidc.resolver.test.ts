/**
 * OIDC Resolver Integration Tests
 *
 * Tests for OIDC GraphQL resolvers including:
 * - Client queries (list, get)
 * - Client mutations (create, update, delete)
 * - User session queries
 * - Authorization checks
 */

import type { OidcClient, User } from '@prisma/client'
import {
  createAuthenticatedContext,
  createMockContext,
  createTestServer,
  executeOperation,
} from '@test/utils'
import * as argon2 from 'argon2'
import { graphql } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../../src/prisma'

// GraphQL queries and mutations
const ListOidcClientsQuery = graphql(`
  query ListOidcClients {
    oidcClients {
      id
      clientId
      clientName
      redirectUris
      scope
      grantTypes
      responseTypes
      applicationType
    }
  }
`)

const GetOidcClientQuery = graphql(`
  query GetOidcClient($clientId: String!) {
    oidcClient(clientId: $clientId) {
      id
      clientId
      clientName
      redirectUris
      postLogoutRedirectUris
      scope
      grantTypes
      responseTypes
      applicationType
      clientUri
      logoUri
      createdAt
      updatedAt
    }
  }
`)

const MyOidcSessionsQuery = graphql(`
  query MyOidcSessions {
    myOidcSessions {
      id
      sessionId
      client {
        clientId
        clientName
      }
      scope
      authTime
      expiresAt
    }
  }
`)

const CreateOidcClientMutation = graphql(`
  mutation CreateOidcClient($input: OidcClientInput!) {
    createOidcClient(input: $input) {
      id
      clientId
      clientName
      redirectUris
      scope
    }
  }
`)

const UpdateOidcClientMutation = graphql(`
  mutation UpdateOidcClient($clientId: String!, $input: OidcClientUpdateInput!) {
    updateOidcClient(clientId: $clientId, input: $input) {
      id
      clientId
      clientName
      redirectUris
      scope
    }
  }
`)

const DeleteOidcClientMutation = graphql(`
  mutation DeleteOidcClient($clientId: String!) {
    deleteOidcClient(clientId: $clientId)
  }
`)

const RevokeOidcSessionMutation = graphql(`
  mutation RevokeOidcSession($sessionId: String!) {
    revokeOidcSession(sessionId: $sessionId)
  }
`)

const RevokeAllOidcSessionsMutation = graphql(`
  mutation RevokeAllOidcSessions {
    revokeAllOidcSessions
  }
`)

describe('OIDC Resolver Tests', () => {
  const server = createTestServer()
  let adminUser: User
  let regularUser: User
  let testClient: OidcClient

  beforeEach(async () => {
    // Clean database
    await prisma.oidcSession.deleteMany()
    await prisma.oidcClient.deleteMany()
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()

    // Create test users
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await argon2.hash('password'),
        name: 'Admin User',
        role: 'admin',
        emailVerified: true,
      },
    })

    regularUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: await argon2.hash('password'),
        name: 'Regular User',
        role: 'user',
        emailVerified: true,
      },
    })

    // Create test client
    testClient = await prisma.oidcClient.create({
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
  })

  describe('Queries', () => {
    describe('oidcClients', () => {
      it('should list clients for admin users', async () => {
        const context = createAuthenticatedContext(adminUser)
        const result = await executeOperation(
          server,
          print(ListOidcClientsQuery),
          {},
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.oidcClients).toHaveLength(1)
        expect(result.body.singleResult.data?.oidcClients[0]).toMatchObject({
          clientId: 'test-client',
          clientName: 'Test Client',
          redirectUris: ['http://localhost:3000/callback'],
        })
      })

      it('should deny access for non-admin users', async () => {
        const context = createAuthenticatedContext(regularUser)
        const result = await executeOperation(
          server,
          print(ListOidcClientsQuery),
          {},
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors?.[0].message).toContain(
          'Not authorized',
        )
      })

      it('should require authentication', async () => {
        const context = createMockContext()
        const result = await executeOperation(
          server,
          print(ListOidcClientsQuery),
          {},
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeDefined()
      })
    })

    describe('oidcClient', () => {
      it('should get specific client for admin users', async () => {
        const context = createAuthenticatedContext(adminUser)
        const result = await executeOperation(
          server,
          print(GetOidcClientQuery),
          { clientId: testClient.clientId },
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.oidcClient).toMatchObject({
          clientId: 'test-client',
          clientName: 'Test Client',
          redirectUris: ['http://localhost:3000/callback'],
          scope: 'openid profile email',
        })
      })

      it('should return error for non-existent client', async () => {
        const context = createAuthenticatedContext(adminUser)
        const result = await executeOperation(
          server,
          print(GetOidcClientQuery),
          { clientId: 'non-existent' },
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeDefined()
      })
    })

    describe('myOidcSessions', () => {
      beforeEach(async () => {
        // Create session for regular user
        await prisma.oidcSession.create({
          data: {
            sessionId: 'user-session-1',
            userId: regularUser.id,
            clientId: testClient.clientId,
            scope: 'openid profile',
            authTime: new Date(),
            expiresAt: new Date(Date.now() + 86400000),
          },
        })
      })

      it('should return user sessions', async () => {
        const context = createAuthenticatedContext(regularUser)
        const result = await executeOperation(
          server,
          print(MyOidcSessionsQuery),
          {},
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.myOidcSessions).toHaveLength(1)
        expect(result.body.singleResult.data?.myOidcSessions[0]).toMatchObject({
          sessionId: 'user-session-1',
          client: {
            clientId: testClient.clientId,
            clientName: testClient.clientName,
          },
          scope: 'openid profile',
        })
      })

      it('should require authentication', async () => {
        const context = createMockContext()
        const result = await executeOperation(
          server,
          print(MyOidcSessionsQuery),
          {},
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeDefined()
      })
    })
  })

  describe('Mutations', () => {
    describe('createOidcClient', () => {
      it('should create client for admin users', async () => {
        const context = createAuthenticatedContext(adminUser)
        const input = {
          clientId: 'new-client',
          clientName: 'New Client',
          redirectUris: ['http://localhost:3001/callback'],
          scope: 'openid profile',
        }

        const result = await executeOperation(
          server,
          print(CreateOidcClientMutation),
          { input },
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.createOidcClient).toMatchObject({
          clientId: 'new-client',
          clientName: 'New Client',
          redirectUris: ['http://localhost:3001/callback'],
        })

        // Verify in database
        const created = await prisma.oidcClient.findUnique({
          where: { clientId: 'new-client' },
        })
        expect(created).toBeDefined()
      })

      it('should deny access for non-admin users', async () => {
        const context = createAuthenticatedContext(regularUser)
        const input = {
          clientId: 'new-client',
          clientName: 'New Client',
          redirectUris: ['http://localhost:3001/callback'],
        }

        const result = await executeOperation(
          server,
          print(CreateOidcClientMutation),
          { input },
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeDefined()
      })
    })

    describe('updateOidcClient', () => {
      it('should update client for admin users', async () => {
        const context = createAuthenticatedContext(adminUser)
        const input = {
          clientName: 'Updated Client Name',
          redirectUris: ['http://localhost:3000/new-callback'],
        }

        const result = await executeOperation(
          server,
          print(UpdateOidcClientMutation),
          { clientId: testClient.clientId, input },
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.updateOidcClient).toMatchObject({
          clientName: 'Updated Client Name',
          redirectUris: ['http://localhost:3000/new-callback'],
        })
      })
    })

    describe('deleteOidcClient', () => {
      it('should delete client for admin users', async () => {
        const context = createAuthenticatedContext(adminUser)
        const result = await executeOperation(
          server,
          print(DeleteOidcClientMutation),
          { clientId: testClient.clientId },
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.deleteOidcClient).toBe(true)

        // Verify deletion
        const deleted = await prisma.oidcClient.findUnique({
          where: { clientId: testClient.clientId },
        })
        expect(deleted).toBeNull()
      })
    })

    describe('revokeOidcSession', () => {
      beforeEach(async () => {
        await prisma.oidcSession.create({
          data: {
            sessionId: 'user-session-1',
            userId: regularUser.id,
            clientId: testClient.clientId,
            scope: 'openid profile',
            authTime: new Date(),
            expiresAt: new Date(Date.now() + 86400000),
          },
        })
      })

      it('should revoke user session', async () => {
        const context = createAuthenticatedContext(regularUser)
        const result = await executeOperation(
          server,
          print(RevokeOidcSessionMutation),
          { sessionId: 'user-session-1' },
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.revokeOidcSession).toBe(true)

        // Verify deletion
        const sessions = await prisma.oidcSession.findMany({
          where: { userId: regularUser.id },
        })
        expect(sessions).toHaveLength(0)
      })

      it('should only revoke own sessions', async () => {
        const context = createAuthenticatedContext(adminUser)
        const result = await executeOperation(
          server,
          print(RevokeOidcSessionMutation),
          { sessionId: 'user-session-1' },
          context,
        )

        // Should succeed but not actually delete (session belongs to different user)
        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()

        // Session should still exist
        const sessions = await prisma.oidcSession.findMany({
          where: { userId: regularUser.id },
        })
        expect(sessions).toHaveLength(1)
      })
    })

    describe('revokeAllOidcSessions', () => {
      beforeEach(async () => {
        // Create multiple sessions
        await prisma.oidcSession.createMany({
          data: [
            {
              sessionId: 'session-1',
              userId: regularUser.id,
              clientId: testClient.clientId,
              scope: 'openid',
              authTime: new Date(),
              expiresAt: new Date(Date.now() + 86400000),
            },
            {
              sessionId: 'session-2',
              userId: regularUser.id,
              clientId: testClient.clientId,
              scope: 'openid profile',
              authTime: new Date(),
              expiresAt: new Date(Date.now() + 86400000),
            },
          ],
        })
      })

      it('should revoke all user sessions', async () => {
        const context = createAuthenticatedContext(regularUser)
        const result = await executeOperation(
          server,
          print(RevokeAllOidcSessionsMutation),
          {},
          context,
        )

        expect(result.body.kind).toBe('single')
        expect(result.body.singleResult.errors).toBeUndefined()
        expect(result.body.singleResult.data?.revokeAllOidcSessions).toBe(true)

        // Verify all sessions deleted
        const sessions = await prisma.oidcSession.findMany({
          where: { userId: regularUser.id },
        })
        expect(sessions).toHaveLength(0)
      })
    })
  })
})
