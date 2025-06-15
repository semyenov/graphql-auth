import bcrypt from 'bcryptjs'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import type {
  CreateDraftVariables,
  DeletePostVariables,
  GetDraftsByUserVariables,
  IncrementPostViewCountVariables
} from '../src/gql'
import {
  CreateDraftMutation,
  DeletePostMutation,
  GetDraftsByUserQuery,
  GetFeedQuery,
  IncrementPostViewCountMutation
} from '../src/gql'
import { prisma } from './setup'
import {
  createAuthContext,
  createMockContext,
  createTestServer,
  gqlHelpers
} from './test-utils'

// Type definitions for GraphQL responses
interface Post {
  id: number
  title: string
  content?: string
  published: boolean
  viewCount: number
  author?: {
    id: number
    name?: string
    email: string
  }
}

interface GetFeedResponse {
  feed: Post[]
}

interface GetDraftsByUserResponse {
  draftsByUser: Post[]
}

interface CreateDraftResponse {
  createDraft: Post
}

interface DeletePostResponse {
  deletePost: Post
}

interface IncrementPostViewCountResponse {
  incrementPostViewCount: Post
}

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

      const data = await gqlHelpers.expectSuccessfulQuery<GetFeedResponse>(
        server,
        print(GetFeedQuery),
        {},
        createMockContext()
      )

      expect(data.feed).toHaveLength(2)
      expect(data.feed.every((post: Post) => post.published)).toBe(true)
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

      const variables: GetDraftsByUserVariables = {
        userUniqueInput: { id: testUserId }
      }

      const data = await gqlHelpers.expectSuccessfulQuery<GetDraftsByUserResponse, GetDraftsByUserVariables>(
        server,
        print(GetDraftsByUserQuery),
        variables,
        createAuthContext(testUserId.toString())
      )

      expect(data.draftsByUser).toHaveLength(2)
      expect(data.draftsByUser.every((post: Post) => !post.published)).toBe(true)
    })

    it('should require authentication for drafts', async () => {
      const variables: GetDraftsByUserVariables = {
        userUniqueInput: { id: testUserId }
      }

      await gqlHelpers.expectGraphQLError<GetDraftsByUserResponse, GetDraftsByUserVariables>(
        server,
        print(GetDraftsByUserQuery),
        variables,
        createMockContext(), // No auth
        'User is not authenticated'
      )
    })
  })

  describe('Create posts', () => {
    it('should create a draft when authenticated', async () => {
      const variables: CreateDraftVariables = {
        data: {
          title: 'New Draft Post',
          content: 'This is a new draft',
        },
      }

      const data = await gqlHelpers.expectSuccessfulMutation<CreateDraftResponse, CreateDraftVariables>(
        server,
        print(CreateDraftMutation),
        variables,
        createAuthContext(testUserId.toString())
      )

      expect(data.createDraft).toBeDefined()
      expect(data.createDraft.title).toBe(variables.data.title)
      expect(data.createDraft.published).toBe(false)
      expect(data.createDraft.author?.id).toBe(testUserId)

      // Verify in database
      const posts = await prisma.post.findMany({
        where: { authorId: testUserId },
      })
      expect(posts).toHaveLength(1)
      expect(posts[0]!.title).toBe(variables.data.title)
    })

    it('should require authentication to create drafts', async () => {
      const variables: CreateDraftVariables = {
        data: {
          title: 'Unauthorized Draft',
          content: 'Should not be created',
        },
      }

      await gqlHelpers.expectGraphQLError<CreateDraftResponse, CreateDraftVariables>(
        server,
        print(CreateDraftMutation),
        variables,
        createMockContext(), // No auth
        'User is not authenticated'
      )
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

      const variables: DeletePostVariables = { id: post.id }

      const data = await gqlHelpers.expectSuccessfulMutation<DeletePostResponse, DeletePostVariables>(
        server,
        print(DeletePostMutation),
        variables,
        createAuthContext(testUserId.toString())
      )

      expect(data.deletePost.id).toBe(post.id)

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

      const variables: DeletePostVariables = { id: post.id }

      await gqlHelpers.expectGraphQLError<DeletePostResponse, DeletePostVariables>(
        server,
        print(DeletePostMutation),
        variables,
        createAuthContext(testUserId.toString()), // Different user
        'User is not the owner of the post'
      )

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

      const variables: IncrementPostViewCountVariables = { id: post.id }

      // First increment
      const data1 = await gqlHelpers.expectSuccessfulMutation<IncrementPostViewCountResponse, IncrementPostViewCountVariables>(
        server,
        print(IncrementPostViewCountMutation),
        variables,
        createMockContext() // No auth required
      )

      expect(data1.incrementPostViewCount.viewCount).toBe(1)

      // Second increment
      const data2 = await gqlHelpers.expectSuccessfulMutation<IncrementPostViewCountResponse, IncrementPostViewCountVariables>(
        server,
        print(IncrementPostViewCountMutation),
        variables,
        createMockContext()
      )

      expect(data2.incrementPostViewCount.viewCount).toBe(2)

      // Verify in database
      const updatedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(updatedPost?.viewCount).toBe(2)
    })

    it('should fail for non-existent post', async () => {
      const variables: IncrementPostViewCountVariables = { id: 999999 } // Non-existent ID

      await gqlHelpers.expectGraphQLError<IncrementPostViewCountResponse, IncrementPostViewCountVariables>(
        server,
        print(IncrementPostViewCountMutation),
        variables,
        createMockContext(),
        'No record was found'
      )
    })
  })
})