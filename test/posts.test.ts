import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from './setup'
import { createAuthContext, createMockContext, createTestServer, executeOperation } from './test-utils'

describe('Posts', () => {
  const server = createTestServer()
  let testUserId: number
  let testCounter = 0

  beforeEach(async () => {
    // Create a test user with unique email
    testCounter++
    const user = await prisma.user.create({
      data: {
        email: `posttest${testCounter}@example.com`,
        password: await bcrypt.hash('password123', 10),
        name: 'Post Test User',
      },
    })
    testUserId = user.id
  })

  describe('Query posts', () => {
    it('should fetch all published posts in feed', async () => {
      // Create some posts
      await prisma.post.createMany({
        data: [
          {
            title: 'Published Post 1',
            content: 'Content 1',
            published: true,
            authorId: testUserId,
          },
          {
            title: 'Published Post 2',
            content: 'Content 2',
            published: true,
            authorId: testUserId,
          },
          {
            title: 'Draft Post',
            content: 'Draft content',
            published: false,
            authorId: testUserId,
          },
        ],
      })

      const feedQuery = `
        query {
          feed {
            id
            title
            content
            published
            author {
              id
              name
            }
          }
        }
      `

      const result = await executeOperation(server, feedQuery, {}, createMockContext())

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined()
        const data = result.body.singleResult.data as any
        expect(data?.feed).toHaveLength(2)
        expect(data?.feed.every((post: any) => post.published)).toBe(true)
      }
    })

    it('should fetch user drafts when authenticated', async () => {
      // Create draft posts
      await prisma.post.createMany({
        data: [
          {
            title: 'My Draft 1',
            content: 'Draft content 1',
            published: false,
            authorId: testUserId,
          },
          {
            title: 'My Draft 2',
            content: 'Draft content 2',
            published: false,
            authorId: testUserId,
          },
        ],
      })

      const draftsQuery = `
        query DraftsByUser($userUniqueInput: UserUniqueInput!) {
          draftsByUser(userUniqueInput: $userUniqueInput) {
            id
            title
            content
            published
          }
        }
      `

      const result = await executeOperation(
        server,
        draftsQuery,
        { userUniqueInput: { id: testUserId } },
        createAuthContext(testUserId.toString())
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined()
        const data = result.body.singleResult.data as any
        expect(data?.draftsByUser).toHaveLength(2)
        expect(data?.draftsByUser.every((post: any) => !post.published)).toBe(true)
      }
    })

    it('should require authentication for drafts', async () => {
      const draftsQuery = `
        query DraftsByUser($userUniqueInput: UserUniqueInput!) {
          draftsByUser(userUniqueInput: $userUniqueInput) {
            id
            title
          }
        }
      `

      const result = await executeOperation(
        server,
        draftsQuery,
        { userUniqueInput: { id: testUserId } },
        createMockContext() // No auth
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('User is not authenticated')
      }
    })
  })

  describe('Create posts', () => {
    it('should create a draft when authenticated', async () => {
      const createDraftMutation = `
        mutation CreateDraft($data: PostCreateInput!) {
          createDraft(data: $data) {
            id
            title
            content
            published
            author {
              id
              email
            }
          }
        }
      `

      const variables = {
        data: {
          title: 'New Draft Post',
          content: 'This is a new draft',
        },
      }

      const result = await executeOperation(
        server,
        createDraftMutation,
        variables,
        createAuthContext(testUserId.toString())
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined()
        const data = result.body.singleResult.data as any
        expect(data?.createDraft).toBeDefined()
        expect(data?.createDraft.title).toBe(variables.data.title)
        expect(data?.createDraft.published).toBe(false)
        expect(data?.createDraft.author.id).toBe(testUserId)
      }

      // Verify in database
      const posts = await prisma.post.findMany({
        where: { authorId: testUserId },
      })
      expect(posts).toHaveLength(1)
      expect(posts[0]!.title).toBe(variables.data.title)
    })

    it('should require authentication to create drafts', async () => {
      const createDraftMutation = `
        mutation CreateDraft($data: PostCreateInput!) {
          createDraft(data: $data) {
            id
            title
          }
        }
      `

      const variables = {
        data: {
          title: 'Unauthorized Draft',
          content: 'Should not be created',
        },
      }

      const result = await executeOperation(
        server,
        createDraftMutation,
        variables,
        createMockContext() // No auth
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('User is not authenticated')
      }
    })
  })

  describe('Delete posts', () => {
    it('should allow owner to delete their post', async () => {
      // Create a post
      const post = await prisma.post.create({
        data: {
          title: 'Post to Delete',
          content: 'Will be deleted',
          published: false,
          authorId: testUserId,
        },
      })

      const deletePostMutation = `
        mutation DeletePost($id: Int!) {
          deletePost(id: $id) {
            id
            title
          }
        }
      `

      const result = await executeOperation(
        server,
        deletePostMutation,
        { id: post.id },
        createAuthContext(testUserId.toString())
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeUndefined()
        const data = result.body.singleResult.data as any
        expect(data?.deletePost.id).toBe(post.id)
      }

      // Verify deletion
      const deletedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(deletedPost).toBeNull()
    })

    it('should not allow deleting posts by other users', async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: await bcrypt.hash('password', 10),
          name: 'Other User',
        },
      })

      // Create a post by other user
      const post = await prisma.post.create({
        data: {
          title: 'Other User Post',
          content: 'Not mine',
          published: false,
          authorId: otherUser.id,
        },
      })

      const deletePostMutation = `
        mutation DeletePost($id: Int!) {
          deletePost(id: $id) {
            id
            title
          }
        }
      `

      const result = await executeOperation(
        server,
        deletePostMutation,
        { id: post.id },
        createAuthContext(testUserId.toString()) // Different user
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('User is not the owner of the post')
      }

      // Verify post still exists
      const existingPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(existingPost).not.toBeNull()
    })
  })

  describe('Increment view count', () => {
    it('should increment post view count', async () => {
      // Create a post
      const post = await prisma.post.create({
        data: {
          title: 'Post with Views',
          content: 'View me',
          published: true,
          authorId: testUserId,
          viewCount: 0,
        },
      })

      const incrementViewMutation = `
        mutation IncrementPostViewCount($id: Int!) {
          incrementPostViewCount(id: $id) {
            id
            viewCount
          }
        }
      `

      // First increment
      const result1 = await executeOperation(
        server,
        incrementViewMutation,
        { id: post.id },
        createMockContext() // No auth required
      )

      expect(result1.body.kind).toBe('single')
      if (result1.body.kind === 'single') {
        expect(result1.body.singleResult.errors).toBeUndefined()
        const data = result1.body.singleResult.data as any
        expect(data?.incrementPostViewCount.viewCount).toBe(1)
      }

      // Second increment
      const result2 = await executeOperation(
        server,
        incrementViewMutation,
        { id: post.id },
        createMockContext()
      )

      expect(result2.body.kind).toBe('single')
      if (result2.body.kind === 'single') {
        expect(result2.body.singleResult.errors).toBeUndefined()
        const data = result2.body.singleResult.data as any
        expect(data?.incrementPostViewCount.viewCount).toBe(2)
      }

      // Verify in database
      const updatedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(updatedPost?.viewCount).toBe(2)
    })

    it('should fail for non-existent post', async () => {
      const incrementViewMutation = `
        mutation IncrementPostViewCount($id: Int!) {
          incrementPostViewCount(id: $id) {
            id
            viewCount
          }
        }
      `

      const result = await executeOperation(
        server,
        incrementViewMutation,
        { id: 999999 }, // Non-existent ID
        createMockContext()
      )

      expect(result.body.kind).toBe('single')
      if (result.body.kind === 'single') {
        expect(result.body.singleResult.errors).toBeDefined()
        expect(result.body.singleResult.errors![0]!.message).toContain('No record was found')
      }
    })
  })
})