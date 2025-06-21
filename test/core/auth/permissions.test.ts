import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  DeletePostMutation,
  LoginMutation,
  SignupMutation,
} from '../../../src/gql/mutations'
import {
  DraftsQuery,
  FeedQuery,
  MeQuery,
  PostQuery,
} from '../../../src/gql/queries'
import { PermissionUtils } from '../../../src/graphql/middleware/utils-clean'
import { prisma } from '../../../src/prisma'
import { UserId } from '../../../src/value-objects/user-id.vo'
import {
  cleanDatabase,
  createAuthContext,
  createMockContext,
  createTestServer,
  createTestUser,
  gqlHelpers,
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

      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof FeedQuery>,
        VariablesOf<typeof FeedQuery>
      >(server, print(FeedQuery), { first: 10 }, createMockContext())

      // At least 2 posts should be returned (may include posts from other tests)
      expect(data?.feed?.edges?.length).toBeGreaterThanOrEqual(2)
    })

    it('should require authentication for me query', async () => {
      // Test without authentication
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof MeQuery>,
        VariablesOf<typeof MeQuery>
      >(
        server,
        print(MeQuery),
        {},
        createMockContext(),
        'You must be logged in to perform this action. Please authenticate and try again.',
      )

      // Verify the test user exists
      const testUser = await prisma.user.findUnique({
        where: { id: testUserId },
      })
      expect(testUser).toBeTruthy()

      // Test with authentication - user should exist
      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof MeQuery>,
        VariablesOf<typeof MeQuery>
      >(
        server,
        print(MeQuery),
        {},
        createAuthContext(UserId.create(testUserId)),
      )
      // The me query should work since testUserId was created in beforeEach
      expect(data?.me).toBeTruthy()
      if (data?.me) {
        expect(data.me.id).toBe(toUserId(testUserId))
        expect(data.me.email).toBe(`permtest${testCounter}@example.com`)
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

      // User should be able to access their own drafts
      const ownDraftsData = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof DraftsQuery>,
        VariablesOf<typeof DraftsQuery>
      >(
        server,
        print(DraftsQuery),
        { first: 10 },
        createAuthContext(UserId.create(testUserId)),
      )

      const data = ownDraftsData as {
        drafts?: {
          edges: Array<{
            node: { id: string; title: string; published: boolean }
          }>
        }
      }
      expect(data?.drafts?.edges).toHaveLength(1)
      expect(data?.drafts?.edges?.[0]?.node?.title).toBe('User 1 Draft')

      // Other user should see their own drafts
      const otherDraftsData = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof DraftsQuery>,
        VariablesOf<typeof DraftsQuery>
      >(
        server,
        print(DraftsQuery),
        { first: 10 },
        createAuthContext(UserId.create(otherUserId)),
      )

      // Should return only their own drafts
      const otherData = otherDraftsData as {
        drafts?: {
          edges: Array<{
            node: { id: string; title: string; published: boolean }
          }>
        }
      }
      expect(otherData?.drafts?.edges).toHaveLength(1)
      expect(otherData?.drafts?.edges?.[0]?.node?.title).toBe('User 2 Draft')
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
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof DeletePostMutation>,
        VariablesOf<typeof DeletePostMutation>
      >(
        server,
        print(DeletePostMutation),
        { id: toPostId(post.id) },
        createAuthContext(UserId.create(testUserId)),
        'You can only modify posts that you have created',
      )

      // Verify post still exists
      const existingPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(existingPost).not.toBeNull()
    })

    it('should handle invalid post IDs gracefully', async () => {
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof DeletePostMutation>,
        VariablesOf<typeof DeletePostMutation>
      >(
        server,
        print(DeletePostMutation),
        { id: toPostId(999999) }, // Non-existent ID
        createAuthContext(UserId.create(testUserId)),
        `Post with identifier '${toPostId(999999)}' not found`,
      )
    })
  })

  describe('Rate Limiting and Security', () => {
    it('should apply rate limiting rules to signup', async () => {
      const variables = {
        email: `ratelimit${testCounter}@example.com`,
        password: 'securePassword123',
        name: 'Rate Limit Test User',
      }

      // First signup should succeed (rate limiting is placeholder for now)
      const data = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof SignupMutation>,
        VariablesOf<typeof SignupMutation>
      >(server, print(SignupMutation), variables, createMockContext())

      // Should succeed since rate limiting is not actually implemented yet
      expect(data).toBeDefined()
    })

    it('should allow public access to login', async () => {
      const variables = {
        email: 'nonexistent@example.com',
        password: 'wrongPassword',
      }

      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof LoginMutation>,
        VariablesOf<typeof LoginMutation>
      >(
        server,
        print(LoginMutation),
        variables,
        createMockContext(),
        'Invalid email or password',
      )
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
      const unauthData = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof PostQuery>,
        VariablesOf<typeof PostQuery>
      >(
        server,
        print(PostQuery),
        { id: toPostId(post.id) },
        createMockContext(),
      )

      expect(unauthData?.post).toBeDefined()
      expect(unauthData?.post?.id).toBe(toPostId(post.id))

      // With authentication - should succeed
      const authData = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof PostQuery>,
        VariablesOf<typeof PostQuery>
      >(
        server,
        print(PostQuery),
        { id: toPostId(post.id) },
        createAuthContext(UserId.create(testUserId)),
      )

      expect(authData?.post).toBeDefined()
      expect(authData?.post?.id).toBe(toPostId(post.id))
    })
  })
})
