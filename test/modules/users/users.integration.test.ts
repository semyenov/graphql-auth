import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import { TogglePublishPostMutation } from '../../../src/gql/mutations'
import { MeQuery } from '../../../src/gql/queries'
import { prisma } from '../../../src/prisma'
import {
  cleanDatabase,
  createAuthContext,
  createMockContext,
  createTestServer,
  createTestUser,
  gqlHelpers,
} from '../../utils'
import { extractNumericId, toPostId } from '../../utils/helpers/relay'

// Type definitions for GraphQL responses
interface User {
  id: string // Now a global ID
  email: string
  name?: string | null
  posts?: Post[]
}

interface Post {
  id: string // Now a global ID
  title: string
  content?: string | null
  published: boolean
  viewCount: number
  author?: User | null
}

describe('User queries', () => {
  const server = createTestServer()
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
        const data = await gqlHelpers.expectSuccessfulQuery<
          ResultOf<typeof MeQuery>,
          VariablesOf<typeof MeQuery>
        >(server, print(MeQuery), {}, createAuthContext(UserId.create(testUserId)))

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
      await gqlHelpers.expectGraphQLError<
        ResultOf<typeof MeQuery>,
        VariablesOf<typeof MeQuery>
      >(
        server,
        print(MeQuery),
        {},
        createMockContext(), // No auth
        'You must be logged in to perform this action. Please authenticate and try again.',
      )
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
      const data1 = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof TogglePublishPostMutation>,
        VariablesOf<typeof TogglePublishPostMutation>
      >(
        server,
        print(TogglePublishPostMutation),
        variables,
        createAuthContext(UserId.create(testUserId)),
      )

      expect(data1.togglePublishPost?.published).toBe(true)

      // Second toggle - should unpublish
      const data2 = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof TogglePublishPostMutation>,
        VariablesOf<typeof TogglePublishPostMutation>
      >(
        server,
        print(TogglePublishPostMutation),
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

      await gqlHelpers.expectGraphQLError(
        server,
        print(TogglePublishPostMutation),
        variables,
        createAuthContext(UserId.create(testUserId)), // Different user
        'You can only modify posts that you have created',
      )

      // Verify post wasn't changed
      const unchangedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(unchangedPost?.published).toBe(false)
    })

    it('should fail for non-existent post', async () => {
      const variables = { id: toPostId(999999) } // Non-existent ID

      await gqlHelpers.expectGraphQLError(
        server,
        print(TogglePublishPostMutation),
        variables,
        createAuthContext(UserId.create(testUserId)),
        'Post with identifier',
      )
    })
  })
})
