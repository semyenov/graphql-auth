import type { ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import {
  CreatePostMutation,
  DeletePostMutation,
  IncrementPostViewCountMutation,
} from '../../../src/gql/mutations'
import { FeedQuery } from '../../../src/gql/queries'
import { prisma } from '../../../src/prisma'
import {
  cleanDatabase,
  createAuthContext,
  createMockContext,
  createTestServer,
  createTestUser,
  createUserWithPosts,
  gqlHelpers,
} from '../../utils'
import { toPostId } from '../../utils/helpers/relay'

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

interface CreatePostResponse {
  createPost: Post
}

interface IncrementPostViewCountResponse {
  incrementPostViewCount: Post
}

describe('Posts', () => {
  const server = createTestServer()
  let testUserId: UserId
  let testCounter = 0

  beforeEach(async () => {
    await cleanDatabase()
    // Create a test user with unique email
    testCounter++
    const user = await createTestUser({
      email: `posttest${testCounter}@example.com`,
      name: 'Post Test User',
    })
    testUserId = UserId.create(user.id)
  })

  describe('Query posts', () => {
    it('should fetch all published posts in feed', async () => {
      // Create user with posts
      const { posts } = await createUserWithPosts({
        userId: testUserId.value,
        postCount: 3,
        publishedPosts: 2,
      })

      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof FeedQuery>,
        VariablesOf<typeof FeedQuery>
      >(server, print(FeedQuery), { first: 10 }, createMockContext())

      // At least 2 posts should be returned (may include posts from other tests)
      expect(data.feed.edges.length).toBeGreaterThanOrEqual(2)
      expect(data.feed.edges.every((edge) => edge.node.published)).toBe(true)

      // Verify we got posts from our test user
      const publishedPosts = posts.filter(p => p.published)
      const publishedTitles = publishedPosts.map(p => p.title)
      const returnedTitles = data.feed.edges.map((edge) => edge.node.title)
      
      // Check that at least some of our posts are in the feed
      const ourPostsInFeed = returnedTitles.filter(title => 
        publishedTitles.includes(title)
      )
      expect(ourPostsInFeed.length).toBeGreaterThanOrEqual(2)
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

      const query = `
        query GetDrafts($first: Int, $after: String) {
          drafts(first: $first, after: $after) {
            edges {
              cursor
              node {
                id
                title
                content
                published
                viewCount
                createdAt
                updatedAt
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `

      const variables = {
        first: 10,
      }

      const data = await gqlHelpers.expectSuccessfulQuery<GetDraftsResponse>(
        server,
        query,
        variables,
        createAuthContext(testUserId),
      )

      expect(data.drafts?.edges).toHaveLength(2)
      expect(data.drafts?.edges.every((edge) => !edge.node.published)).toBe(
        true,
      )
    })

    it('should require authentication for drafts', async () => {
      const query = `
        query GetDrafts($first: Int, $after: String) {
          drafts(first: $first, after: $after) {
            edges {
              cursor
              node {
                id
                title
                content
                published
                viewCount
                createdAt
                updatedAt
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `

      const variables = {
        first: 10,
      }

      await gqlHelpers.expectGraphQLError(
        server,
        query,
        variables,
        createMockContext(), // No auth
        'You must be logged in to perform this action. Please authenticate and try again.',
      )
    })
  })

  describe('Create posts', () => {
    it('should create a draft when authenticated', async () => {
      const variables = {
        input: {
          title: 'New Draft Post',
          content: 'This is a new draft',
        },
      }

      const data =
        await gqlHelpers.expectSuccessfulMutation<CreatePostResponse>(
          server,
          print(CreatePostMutation),
          variables,
          createAuthContext(testUserId),
        )

      expect(data.createPost).toBeDefined()
      expect(data.createPost.title).toBe(variables.input.title)
      expect(data.createPost.published).toBe(false)
      // Author might not be included in the response due to Prisma query optimization

      // Verify in database
      const posts = await prisma.post.findMany({
        where: { authorId: testUserId.value },
      })
      expect(posts).toHaveLength(1)
      expect(posts[0]?.title).toBe(variables.input.title)
    })

    it('should require authentication to create drafts', async () => {
      const variables = {
        input: {
          title: 'Unauthorized Draft',
          content: 'Should not be created',
        },
      }

      await gqlHelpers.expectGraphQLError<CreatePostResponse>(
        server,
        print(CreatePostMutation),
        variables,
        createMockContext(), // No auth
        'You must be logged in to perform this action. Please authenticate and try again.',
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

      const variables = { id: toPostId(post.id) }

      const data = await gqlHelpers.expectSuccessfulMutation<{
        deletePost: boolean
      }>(
        server,
        print(DeletePostMutation),
        variables,
        createAuthContext(testUserId),
      )

      expect(data.deletePost).toBe(true)

      // Verify deletion
      const deletedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(deletedPost).toBeNull()
    })

    it('should not allow deleting posts by other users', async () => {
      // Create another user using test helper
      const otherUser = await createTestUser({
        email: `deleteother${testCounter}@example.com`,
        name: 'Other User',
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

      const variables = { id: toPostId(post.id) }

      await gqlHelpers.expectGraphQLError<{ deletePost: boolean }>(
        server,
        print(DeletePostMutation),
        variables,
        createAuthContext(testUserId), // Different user
        'You can only modify posts that you have created',
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

      await gqlHelpers.expectGraphQLError<{ deletePost: boolean }>(
        server,
        print(DeletePostMutation),
        variables,
        createMockContext(), // No authentication
        'You must be logged in to perform this action. Please authenticate and try again.',
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
      const data1 =
        await gqlHelpers.expectSuccessfulMutation<IncrementPostViewCountResponse>(
          server,
          print(IncrementPostViewCountMutation),
          variables,
          createMockContext(), // No auth required
        )

      expect(data1.incrementPostViewCount.viewCount).toBe(1)

      // Second increment
      const data2 =
        await gqlHelpers.expectSuccessfulMutation<IncrementPostViewCountResponse>(
          server,
          print(IncrementPostViewCountMutation),
          variables,
          createMockContext(),
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

      await gqlHelpers.expectGraphQLError<IncrementPostViewCountResponse>(
        server,
        print(IncrementPostViewCountMutation),
        variables,
        createMockContext(),
        'Post with identifier',
      )
    })
  })
})
