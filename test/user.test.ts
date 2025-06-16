import bcrypt from 'bcryptjs'
import { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { TogglePublishPostDirectMutation } from '../src/gql/mutations-direct'
import { MeDirectQuery } from '../src/gql/queries-direct'
import { extractNumericId, toPostId } from './relay-utils'
import { prisma } from './setup'
import {
  createAuthContext,
  createMockContext,
  createTestServer,
  gqlHelpers,
} from './test-utils'

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
    // Create a test user
    testUserEmail = `metest-${Date.now()}@example.com`
    const user = await prisma.user.create({
      data: {
        email: testUserEmail,
        password: await bcrypt.hash('password123', 10),
        name: 'Me Test User',
      },
    })
    testUserId = user.id
  })

  describe('me query', () => {
    it('should return current user when authenticated', async () => {
      try {
        const data = await gqlHelpers.expectSuccessfulQuery<ResultOf<typeof MeDirectQuery>, VariablesOf<typeof MeDirectQuery>>(
          server,
          print(MeDirectQuery),
          {},
          createAuthContext(testUserId)
        )

        expect(data.meDirect).toBeDefined()
        if (data.meDirect) {
          expect(data.meDirect.email).toBe(testUserEmail)
          expect(data.meDirect.name).toBe('Me Test User')
          // Check that the ID is a global ID
          expect(data.meDirect.id).toMatch(/^[A-Za-z0-9+/=]+$/)
          const numericId = extractNumericId(data.meDirect.id)
          expect(numericId).toBe(testUserId)
        }
      } catch (error) {
        console.error('Me query error:', error)
        throw error
      }
    })

    it('should return null when not authenticated', async () => {
      await gqlHelpers.expectGraphQLError<ResultOf<typeof MeDirectQuery>, VariablesOf<typeof MeDirectQuery>>(
        server,
        print(MeDirectQuery),
        {},
        createMockContext(), // No auth
        'Authentication required'
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
      const data1 = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof TogglePublishPostDirectMutation>, VariablesOf<typeof TogglePublishPostDirectMutation>>(
        server,
        print(TogglePublishPostDirectMutation),
        variables,
        createAuthContext(testUserId)
      )

      expect(data1.togglePublishPostDirect?.published).toBe(true)

      // Second toggle - should unpublish
      const data2 = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof TogglePublishPostDirectMutation>, VariablesOf<typeof TogglePublishPostDirectMutation>>(
        server,
        print(TogglePublishPostDirectMutation),
        variables,
        createAuthContext(testUserId)
      )

      expect(data2.togglePublishPostDirect?.published).toBe(false)

      // Verify in database
      const updatedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(updatedPost?.published).toBe(false)
    })

    it('should not allow toggling posts by other users', async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          email: `other-${Date.now()}@example.com`,
          password: await bcrypt.hash('password', 10),
          name: 'Other User',
        },
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
        print(TogglePublishPostDirectMutation),
        variables,
        createAuthContext(testUserId), // Different user
        'You can only modify posts that you have created'
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
        print(TogglePublishPostDirectMutation),
        variables,
        createAuthContext(testUserId),
        'Post with identifier'
      )
    })
  })
})