import {
  cleanDatabase,
  createAuthContext,
  createGraphQLTestHelper,
  createMockContext,
  createTestServer,
  createTestUser,
} from '@test/utils'
import { extractNumericId, toPostId } from '@test/utils/helpers/relay.helpers'
import { beforeEach, describe, expect, it } from 'vitest'
import { TogglePublishPostMutation } from '../../../src/gql/mutations'
import { MeQuery } from '../../../src/gql/queries'
import { prisma } from '../../../src/prisma'
import { UserId } from '../../../src/types/value-objects'

describe('User queries', () => {
  const server = createTestServer()
  const gql = createGraphQLTestHelper(server)
  let testUserId: number
  let testUserEmail: string

  beforeEach(async () => {
    await cleanDatabase()
    // Create a test user using helper
    testUserEmail = `metest-${Date.now()}@example.com`
    const user = await createTestUser({
      email: testUserEmail,
      name: 'Me Test User',
    })
    testUserId = user.id
  })

  describe('me query', () => {
    it('should return current user when authenticated', async () => {
      try {
        const data = await gql.query(MeQuery, {}, createAuthContext(testUserId))

        expect(data.me).toBeDefined()
        if (data.me) {
          expect(data.me.email).toBe(testUserEmail)
          expect(data.me.name).toBe('Me Test User')
          // Check that the ID is a global ID
          expect(data.me.id).toMatch(/^[A-Za-z0-9+/=]+$/)
          const numericId = extractNumericId(data.me.id)
          expect(numericId).toBe(testUserId)
        }
      } catch (error) {
        console.error('Me query error:', error)
        throw error
      }
    })

    it('should return null when not authenticated', async () => {
      const data = await gql.query(
        MeQuery,
        {},
        createMockContext(), // No auth
      )

      expect(data.me).toBeNull()
    })
  })

  describe('togglePublishPost mutation', () => {
    it('should toggle post publish status when owner', async () => {
      // Create a draft post
      const post = await prisma.post.create({
        data: {
          title: 'Post to Toggle',
          content: 'Toggle content',
          published: false,
          authorId: testUserId,
        },
      })

      const variables = { id: toPostId(post.id) }

      // First toggle - should publish
      const data1 = await gql.mutate(
        TogglePublishPostMutation,
        variables,
        createAuthContext(UserId.create(testUserId)),
      )

      expect(data1.togglePublishPost?.published).toBe(true)

      // Second toggle - should unpublish
      const data2 = await gql.mutate(
        TogglePublishPostMutation,
        variables,
        createAuthContext(UserId.create(testUserId)),
      )

      expect(data2.togglePublishPost?.published).toBe(false)

      // Verify in database
      const updatedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(updatedPost?.published).toBe(false)
    })

    it('should not allow toggling posts by other users', async () => {
      // Create another user using helper
      const otherUser = await createTestUser({
        email: `other-${Date.now()}@example.com`,
        name: 'Other User',
      })

      // Create a post by other user
      const post = await prisma.post.create({
        data: {
          title: 'Other User Post',
          content: 'Not mine to toggle',
          published: false,
          authorId: otherUser.id,
        },
      })

      const variables = { id: toPostId(post.id) }

      await gql.expectError(
        TogglePublishPostMutation,
        variables,
        'You can only modify posts that you have created',
        createAuthContext(UserId.create(testUserId)), // Different user
      )

      // Verify post wasn't changed
      const unchangedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(unchangedPost?.published).toBe(false)
    })

    it('should fail for non-existent post', async () => {
      const variables = { id: toPostId(999999) } // Non-existent ID

      await gql.expectError(
        TogglePublishPostMutation,
        variables,
        'Post with identifier',
        createAuthContext(UserId.create(testUserId)),
      )
    })
  })
})
