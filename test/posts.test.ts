import bcrypt from 'bcryptjs'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserId } from '../src/core/value-objects/user-id.vo'
import {
  CreateDraftMutation,
  DeletePostMutation,
  IncrementPostViewCountMutation
} from '../src/gql/relay-mutations'
import {
  GetDraftsQuery,
  GetFeedQuery
} from '../src/gql/relay-queries'
import { CreateDraftVariables, DeletePostVariables, IncrementPostViewCountVariables } from '../src/gql/types.d'
import { extractNumericId, toPostId, toUserId } from './relay-utils'
import { prisma } from './setup'
import {
  createAuthContext,
  createMockContext,
  createTestServer,
  gqlHelpers
} from './test-utils'

// Type definitions for GraphQL responses
interface Post {
  id: string // Now a global ID
  title: string
  content?: string | null
  published: boolean
  viewCount: number
  author?: {
    id: string // Now a global ID
    name?: string | null
    email: string
  } | null
}

interface PostEdge {
  cursor: string
  node: Post
}

interface PostConnection {
  edges: PostEdge[]
  pageInfo: {
    hasNextPage: boolean
    endCursor?: string | null
  }
  totalCount?: number
}

interface GetFeedResponse {
  feed: PostConnection
}

interface GetDraftsResponse {
  drafts: PostConnection | null
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
  let testUserId: UserId
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
    testUserId = UserId.create(user.id)
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
            authorId: testUserId.value,
          },
          {
            title: 'Published Post 2',
            content: 'Content 2',
            published: true,
            authorId: testUserId.value,
          },
          {
            title: 'Draft Post',
            content: 'Draft content',
            published: false,
            authorId: testUserId.value,
          },
        ],
      })

      const data = await gqlHelpers.expectSuccessfulQuery<GetFeedResponse>(
        server,
        print(GetFeedQuery),
        { first: 10 },
        createMockContext()
      )

      expect(data.feed.edges).toHaveLength(2)
      expect(data.feed.edges.every(edge => edge.node.published)).toBe(true)
    })

    it('should fetch user drafts when authenticated', async () => {
      // Create draft posts
      await prisma.post.createMany({
        data: [
          {
            title: 'My Draft 1',
            content: 'Draft content 1',
            published: false,
            authorId: testUserId.value,
          },
          {
            title: 'My Draft 2',
            content: 'Draft content 2',
            published: false,
            authorId: testUserId.value,
          },
        ],
      })

      const variables = {
        userId: toUserId(testUserId.value),
        first: 10
      }

      const data = await gqlHelpers.expectSuccessfulQuery<GetDraftsResponse>(
        server,
        print(GetDraftsQuery),
        variables,
        createAuthContext(testUserId)
      )

      expect(data.drafts?.edges).toHaveLength(2)
      expect(data.drafts?.edges.every(edge => !edge.node.published)).toBe(true)
    })

    it('should require authentication for drafts', async () => {
      const variables = {
        userId: toUserId(testUserId.value),
        first: 10
      }

      await gqlHelpers.expectGraphQLError(
        server,
        print(GetDraftsQuery),
        variables,
        createMockContext(), // No auth
        'You must be logged in to perform this action. Please authenticate and try again.'
      )
    })
  })

  describe('Create posts', () => {
    it('should create a draft when authenticated', async () => {
      const variables = {
        data: {
          title: 'New Draft Post',
          content: 'This is a new draft',
        },
      }

      const data = await gqlHelpers.expectSuccessfulMutation<CreateDraftResponse>(
        server,
        print(CreateDraftMutation),
        variables,
        createAuthContext(testUserId)
      )

      expect(data.createDraft).toBeDefined()
      expect(data.createDraft.title).toBe(variables.data.title)
      expect(data.createDraft.published).toBe(false)
      // Author might not be included in the response due to Prisma query optimization

      // Verify in database
      const posts = await prisma.post.findMany({
        where: { authorId: testUserId.value },
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
        'Authentication required'
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
          authorId: testUserId.value,
        },
      })

      const variables: DeletePostVariables = { id: toPostId(post.id) }

      const data = await gqlHelpers.expectSuccessfulMutation<DeletePostResponse, DeletePostVariables>(
        server,
        print(DeletePostMutation),
        variables,
        createAuthContext(testUserId), // Different user
      )

      expect(extractNumericId(data.deletePost.id)).toBe(post.id)

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
          email: `deleteother${testCounter}@example.com`,
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

      const variables: DeletePostVariables = { id: toPostId(post.id) }

      await gqlHelpers.expectGraphQLError<DeletePostResponse, DeletePostVariables>(
        server,
        print(DeletePostMutation),
        variables,
        createAuthContext(testUserId), // Different user
        'You can only modify posts that you have created'
      )

      // Verify post still exists
      const existingPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(existingPost).not.toBeNull()
    })

    it('should require authentication to delete posts', async () => {
      // Create a post
      const post = await prisma.post.create({
        data: {
          title: 'Post to Delete',
          content: 'Will not be deleted',
          published: false,
          authorId: testUserId.value,
        },
      })

      const variables = { id: toPostId(post.id) }

      await gqlHelpers.expectGraphQLError<DeletePostResponse, DeletePostVariables>(
        server,
        print(DeletePostMutation),
        variables,
        createMockContext(), // No authentication
        'You must be logged in to perform this action. Please authenticate and try again.'
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
          authorId: testUserId.value,
          viewCount: 0,
        },
      })

      const variables = { id: toPostId(post.id) }

      // First increment
      const data1 = await gqlHelpers.expectSuccessfulMutation<IncrementPostViewCountResponse>(
        server,
        print(IncrementPostViewCountMutation),
        variables,
        createMockContext() // No auth required
      )

      expect(data1.incrementPostViewCount.viewCount).toBe(1)

      // Second increment
      const data2 = await gqlHelpers.expectSuccessfulMutation<IncrementPostViewCountResponse>(
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
      const variables = { id: toPostId(999999) } // Non-existent ID

      await gqlHelpers.expectGraphQLError<IncrementPostViewCountResponse, IncrementPostViewCountVariables>(
        server,
        print(IncrementPostViewCountMutation),
        variables,
        createMockContext(),
        'Post with identifier'
      )
    })
  })
})
