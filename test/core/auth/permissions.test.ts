import type { ResultOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import { DeletePostMutation, LoginMutation } from '../../../src/gql/mutations'
import { FeedQuery, MeQuery, PostQuery } from '../../../src/gql/queries'
import { PermissionUtils } from '../../../src/graphql/middleware/utils-clean'
import { prisma } from '../../../src/prisma'
import {
  cleanDatabase,
  createAuthContext,
  createMockContext,
  createTestServer,
  createTestUser,
  executeOperation,
} from '../../utils'
import { toPostId, toUserId } from '../../utils/helpers/relay.helpers'

describe('Enhanced Permissions System', () => {
  const server = createTestServer()
  let testUserId: number
  let otherUserId: number
  let testCounter = 0

  beforeEach(async () => {
    testCounter++
    await cleanDatabase()

    // Create test users using helpers
    const user1 = await createTestUser({
      email: `permtest${testCounter}@example.com`,
      name: 'Permission Test User',
    })
    testUserId = user1.id

    const user2 = await createTestUser({
      email: `permtest${testCounter}other@example.com`,
      name: 'Other Permission Test User',
    })
    otherUserId = user2.id
  })

  describe('Permission Utilities', () => {
    it('should correctly identify if user can access their own data', () => {
      const context = createAuthContext(UserId.create(testUserId))
      const canAccess = PermissionUtils.canAccessUserData(context, testUserId)
      expect(canAccess).toBe(true)
    })

    it('should deny access to other users data for regular users', () => {
      const context = createAuthContext(UserId.create(testUserId))
      const canAccess = PermissionUtils.canAccessUserData(context, otherUserId)
      expect(canAccess).toBe(false)
    })

    it('should validate operations correctly', () => {
      const authenticatedContext = createAuthContext(UserId.create(testUserId))
      const unauthenticatedContext = createMockContext()

      // Test authenticated operations
      expect(
        PermissionUtils.validateOperation(authenticatedContext, 'createPost'),
      ).toBe(true)
      expect(
        PermissionUtils.validateOperation(authenticatedContext, 'deletePost'),
      ).toBe(true)
      expect(
        PermissionUtils.validateOperation(authenticatedContext, 'editPost'),
      ).toBe(true)

      // Test unauthenticated operations
      expect(
        PermissionUtils.validateOperation(unauthenticatedContext, 'createPost'),
      ).toBe(false)
      expect(
        PermissionUtils.validateOperation(unauthenticatedContext, 'deletePost'),
      ).toBe(false)
      expect(
        PermissionUtils.validateOperation(unauthenticatedContext, 'editPost'),
      ).toBe(false)

      // Test unknown operations
      expect(
        PermissionUtils.validateOperation(
          authenticatedContext,
          'unknownOperation',
        ),
      ).toBe(false)
    })

    it('should correctly check post modification permissions', async () => {
      // Create a post owned by testUserId
      const post = await prisma.post.create({
        data: {
          title: 'Test Post for Permissions',
          content: 'Test content',
          published: false,
          authorId: testUserId,
        },
      })

      const ownerContext = createAuthContext(UserId.create(testUserId))
      const otherContext = createAuthContext(UserId.create(otherUserId))

      // Owner should be able to modify
      const canOwnerModify = await PermissionUtils.canModifyPost(
        ownerContext,
        post.id,
      )
      expect(canOwnerModify).toBe(true)

      // Other user should not be able to modify
      const canOtherModify = await PermissionUtils.canModifyPost(
        otherContext,
        post.id,
      )
      expect(canOtherModify).toBe(false)

      // Unauthenticated user should not be able to modify
      const unauthenticatedContext = createMockContext()
      const canUnauthenticatedModify = await PermissionUtils.canModifyPost(
        unauthenticatedContext,
        post.id,
      )
      expect(canUnauthenticatedModify).toBe(false)
    })

    it('should handle role hierarchy correctly', () => {
      // Mock contexts with different roles
      const userContext = createAuthContext(UserId.create(testUserId))
      userContext.security.roles = ['user']

      const moderatorContext = createAuthContext(UserId.create(testUserId))
      moderatorContext.security.roles = ['moderator']

      const adminContext = createAuthContext(UserId.create(testUserId))
      adminContext.security.roles = ['admin']

      // Test role hierarchy
      expect(PermissionUtils.hasRoleOrHigher(userContext, 'user')).toBe(true)
      expect(PermissionUtils.hasRoleOrHigher(userContext, 'moderator')).toBe(
        false,
      )
      expect(PermissionUtils.hasRoleOrHigher(userContext, 'admin')).toBe(false)

      expect(PermissionUtils.hasRoleOrHigher(moderatorContext, 'user')).toBe(
        true,
      )
      expect(
        PermissionUtils.hasRoleOrHigher(moderatorContext, 'moderator'),
      ).toBe(true)
      expect(PermissionUtils.hasRoleOrHigher(moderatorContext, 'admin')).toBe(
        false,
      )

      expect(PermissionUtils.hasRoleOrHigher(adminContext, 'user')).toBe(true)
      expect(PermissionUtils.hasRoleOrHigher(adminContext, 'moderator')).toBe(
        true,
      )
      expect(PermissionUtils.hasRoleOrHigher(adminContext, 'admin')).toBe(true)
    })
  })

  describe('GraphQL Permission Rules', () => {
    it('should allow public access to feed query', async () => {
      // Create published posts
      await prisma.post.createMany({
        data: [
          {
            title: 'Public Post 1',
            content: 'Public content 1',
            published: true,
            authorId: testUserId,
          },
          {
            title: 'Public Post 2',
            content: 'Public content 2',
            published: true,
            authorId: otherUserId,
          },
        ],
      })

      const result = await executeOperation(
        server,
        print(FeedQuery),
        { first: 10 },
        createMockContext(),
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined()
        const data = result.body.singleResult.data as ResultOf<typeof FeedQuery>
        // At least 2 posts should be returned (may include posts from other tests)
        expect(data?.feed?.edges?.length).toBeGreaterThanOrEqual(2)
      }
    })

    it('should require authentication for me query', async () => {
      // Test without authentication
      const unauthResult = await executeOperation(
        server,
        print(MeQuery),
        {},
        createMockContext(),
      )
      expect(unauthResult.body.kind).toBe('single')
      if (unauthResult.body.kind === 'single') {
        expect(unauthResult.body.singleResult.errors).toBeDefined()
        expect(unauthResult.body.singleResult.errors?.[0]?.message).toContain(
          'You must be logged in to perform this action. Please authenticate and try again.',
        )
      }

      // Verify the test user exists
      const testUser = await prisma.user.findUnique({
        where: { id: testUserId },
      })
      expect(testUser).toBeTruthy()

      // Test with authentication - user should exist
      const authResult = await executeOperation(
        server,
        print(MeQuery),
        {},
        createAuthContext(UserId.create(testUserId)),
      )
      expect(authResult.body.kind).toBe('single')
      if (authResult.body.kind === 'single') {
        expect(authResult.body.singleResult.errors).toBeUndefined()
        const data = authResult.body.singleResult.data as ResultOf<
          typeof MeQuery
        >
        // The me query should work since testUserId was created in beforeEach
        expect(data?.me).toBeTruthy()
        if (data?.me) {
          expect(data.me.id).toBe(toUserId(testUserId))
          expect(data.me.email).toBe(`permtest${testCounter}@example.com`)
        }
      }
    })

    it('should enforce user ownership for drafts query', async () => {
      // Create drafts for both users
      await prisma.post.createMany({
        data: [
          {
            title: 'User 1 Draft',
            content: 'Private draft 1',
            published: false,
            authorId: testUserId,
          },
          {
            title: 'User 2 Draft',
            content: 'Private draft 2',
            published: false,
            authorId: otherUserId,
          },
        ],
      })

      // Create custom query without userId
      const draftsQuery = `
                query GetDrafts($first: Int, $after: String) {
                    drafts(first: $first, after: $after) {
                        edges {
                            cursor
                            node {
                                id
                                title
                                published
                            }
                        }
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                    }
                }
            `

      // User should be able to access their own drafts
      const ownDraftsResult = await executeOperation(
        server,
        draftsQuery,
        { first: 10 },
        createAuthContext(UserId.create(testUserId)),
      )

      expect(ownDraftsResult.body.kind).toBe('single')
      if (ownDraftsResult.body.kind === 'single') {
        expect(ownDraftsResult.body.singleResult.errors).toBeUndefined()
        const data = ownDraftsResult.body.singleResult.data as {
          drafts?: {
            edges: Array<{
              node: { id: string; title: string; published: boolean }
            }>
          }
        }
        expect(data?.drafts?.edges).toHaveLength(1)
        expect(data?.drafts?.edges?.[0]?.node?.title).toBe('User 1 Draft')
      }

      // Other user should see their own drafts
      const otherDraftsResult = await executeOperation(
        server,
        draftsQuery,
        { first: 10 },
        createAuthContext(UserId.create(otherUserId)),
      )

      expect(otherDraftsResult.body.kind).toBe('single')
      if (otherDraftsResult.body.kind === 'single') {
        // Should return only their own drafts
        expect(otherDraftsResult.body.singleResult.errors).toBeUndefined()
        const data = otherDraftsResult.body.singleResult.data as {
          drafts?: {
            edges: Array<{
              node: { id: string; title: string; published: boolean }
            }>
          }
        }
        expect(data?.drafts?.edges).toHaveLength(1)
        expect(data?.drafts?.edges?.[0]?.node?.title).toBe('User 2 Draft')
      }
    })

    it('should enforce post ownership for mutations', async () => {
      // Create a post owned by otherUserId
      const post = await prisma.post.create({
        data: {
          title: 'Other User Post',
          content: 'Not mine',
          published: false,
          authorId: otherUserId,
        },
      })

      // testUserId should not be able to delete otherUserId's post
      const result = await executeOperation(
        server,
        print(DeletePostMutation),
        { id: toPostId(post.id) },
        createAuthContext(UserId.create(testUserId)),
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors?.[0]?.message).toContain(
          'You can only modify posts that you have created',
        )
      }

      // Verify post still exists
      const existingPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(existingPost).not.toBeNull()
    })

    it('should handle invalid post IDs gracefully', async () => {
      const result = await executeOperation(
        server,
        print(DeletePostMutation),
        { id: toPostId(999999) }, // Non-existent ID
        createAuthContext(UserId.create(testUserId)),
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors?.[0]?.message).toContain(
          `Post with identifier '${toPostId(999999)}' not found`,
        )
      }
    })
  })

  describe('Rate Limiting and Security', () => {
    it('should apply rate limiting rules to signup', async () => {
      const signupMutation = `
        mutation Signup($email: String!, $password: String!, $name: String) {
          signup(email: $email, password: $password, name: $name)
        }
      `

      const variables = {
        email: `ratelimit${testCounter}@example.com`,
        password: 'securePassword123',
        name: 'Rate Limit Test User',
      }

      // First signup should succeed (rate limiting is placeholder for now)
      const result = await executeOperation(
        server,
        signupMutation,
        variables,
        createMockContext(),
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        // Should succeed since rate limiting is not actually implemented yet
        expect(result.body.singleResult.data).toBeDefined()
      }
    })

    it('should allow public access to login', async () => {
      const variables = {
        email: 'nonexistent@example.com',
        password: 'wrongPassword',
      }

      const result = await executeOperation(
        server,
        print(LoginMutation),
        variables,
        createMockContext(),
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        // Should get an error about invalid credentials, not authentication required
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors?.[0]?.message).toContain(
          'Invalid email or password',
        )
      }
    })
  })

  describe('Fallback Rules', () => {
    it('should allow public access to published posts', async () => {
      // Test that publi  shed posts can be viewed without authentication

      // Create a published post
      const post = await prisma.post.create({
        data: {
          title: 'Test Post',
          content: 'Test content',
          published: true,
          authorId: testUserId,
        },
      })

      // Without authentication - should succeed for published posts
      const unauthResult = await executeOperation(
        server,
        print(PostQuery),
        { id: toPostId(post.id) },
        createMockContext(),
      )

      expect(unauthResult.body.kind).toBe('single')
      if (unauthResult.body.kind === 'single') {
        expect(unauthResult.body.singleResult.errors).toBeUndefined()
        const data = unauthResult.body.singleResult.data as ResultOf<
          typeof PostQuery
        >
        expect(data?.post).toBeDefined()
        expect(data?.post?.id).toBe(toPostId(post.id))
      }

      // With authentication - should succeed
      const authResult = await executeOperation(
        server,
        print(PostQuery),
        { id: toPostId(post.id) },
        createAuthContext(UserId.create(testUserId)),
      )

      expect(authResult.body.kind).toBe('single')
      if (authResult.body.kind === 'single') {
        expect(authResult.body.singleResult.errors).toBeUndefined()
        const data = authResult.body.singleResult.data as ResultOf<
          typeof PostQuery
        >
        expect(data?.post).toBeDefined()
        expect(data?.post?.id).toBe(toPostId(post.id))
      }
    })
  })
})
