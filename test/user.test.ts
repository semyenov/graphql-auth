import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from './setup'
import { createAuthContext, createMockContext, createTestServer, executeOperation } from './test-utils'

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
      const meQuery = `
        query {
          me {
            id
            email
            name
          }
        }
      `

      const result = await executeOperation(
        server,
        meQuery,
        {},
        createAuthContext(testUserId.toString())
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined()
        const data = result.body.singleResult.data as any
        expect(data?.me).toBeDefined()
        expect(data?.me.id).toBe(testUserId)
        expect(data?.me.email).toBe(testUserEmail)
        expect(data?.me.name).toBe('Me Test User')
      }
    })

    it('should return null when not authenticated', async () => {
      const meQuery = `
        query {
          me {
            id
            email
            name
          }
        }
      `

      const result = await executeOperation(
        server,
        meQuery,
        {},
        createMockContext() // No auth
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        // The me query should be protected by permissions
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('Authentication required')
      }
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

      const togglePublishMutation = `
        mutation TogglePublishPost($id: Int!) {
          togglePublishPost(id: $id) {
            id
            title
            published
          }
        }
      `

      // First toggle - should publish
      const result1 = await executeOperation(
        server,
        togglePublishMutation,
        { id: post.id },
        createAuthContext(testUserId.toString())
      )

      expect(result1.body.kind).toBe('single')
      if (result1.body.kind === 'single') {
        expect(result1.body.singleResult.errors).toBeUndefined()
        const data = result1.body.singleResult.data as any
        expect(data?.togglePublishPost.published).toBe(true)
      }

      // Second toggle - should unpublish
      const result2 = await executeOperation(
        server,
        togglePublishMutation,
        { id: post.id },
        createAuthContext(testUserId.toString())
      )

      expect(result2.body.kind).toBe('single')
      if (result2.body.kind === 'single') {
        expect(result2.body.singleResult.errors).toBeUndefined()
        const data = result2.body.singleResult.data as any
        expect(data?.togglePublishPost.published).toBe(false)
      }

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

      const togglePublishMutation = `
        mutation TogglePublishPost($id: Int!) {
          togglePublishPost(id: $id) {
            id
            published
          }
        }
      `

      const result = await executeOperation(
        server,
        togglePublishMutation,
        { id: post.id },
        createAuthContext(testUserId.toString()) // Different user
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('User is not the owner of the post')
      }

      // Verify post wasn't changed
      const unchangedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(unchangedPost?.published).toBe(false)
    })

    it('should fail for non-existent post', async () => {
      const togglePublishMutation = `
        mutation TogglePublishPost($id: Int!) {
          togglePublishPost(id: $id) {
            id
            published
          }
        }
      `

      const result = await executeOperation(
        server,
        togglePublishMutation,
        { id: 999999 }, // Non-existent ID
        createAuthContext(testUserId.toString())
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('Post not found')
      }
    })
  })
})