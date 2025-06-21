/**
 * Direct Resolvers Tests
 *
 * Tests for Pothos resolvers without use cases
 */

import type { ApolloServer } from '@apollo/server'
import type { User } from '@prisma/client'
import { graphql, type ResultOf, type VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { UserId } from '../../../src/core/value-objects/user-id.vo'
import type { Context } from '../../../src/graphql/context/context.types'
import { prisma } from '../../../src/prisma'
import {
  cleanDatabase,
  createAuthContext,
  createMockContext,
  createTestServer,
  createTestUser,
  gqlHelpers,
} from '../../utils'

describe('Direct Resolvers', () => {
  let server: ApolloServer<Context>
  let testUser: User

  beforeAll(async () => {
    server = createTestServer()
  })

  beforeEach(async () => {
    await cleanDatabase()

    // Create test user and capture the user data
    const user = await createTestUser({
      email: 'test@example.com',
      name: 'Test User',
    })
    testUser = user
  })

  describe('Authentication', () => {
    it('should signup a new user', async () => {
      const mutation = graphql(`
                mutation Signup($email: String!, $password: String!, $name: String) {
                    signup(email: $email, password: $password, name: $name)
                }
            `)

      const data = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof mutation>,
        VariablesOf<typeof mutation>
      >(
        server,
        print(mutation),
        {
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        },
        createMockContext(),
      )

      expect(data.signup).toBeDefined()
      expect(typeof data.signup).toBe('string')

      // Verify user was created
      const user = await prisma.user.findUnique({
        where: { email: 'newuser@example.com' },
      })
      expect(user).toBeDefined()
      expect(user?.name).toBe('New User')
    })

    it('should login with valid credentials', async () => {
      const mutation = graphql(`
                mutation Login($email: String!, $password: String!) {
                    login(email: $email, password: $password)
                }
            `)

      const data = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof mutation>,
        VariablesOf<typeof mutation>
      >(
        server,
        print(mutation),
        {
          email: 'test@example.com',
          password: 'password123',
        },
        createMockContext(),
      )

      expect(data.login).toBeDefined()
      expect(typeof data.login).toBe('string')
    })

    it('should get current user', async () => {
      const query = graphql(`
                query Me {
                    me {
                        id
                        email
                        name
                    }
                }
            `)

      const authContext = createAuthContext(UserId.create(testUser.id))

      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof query>,
        VariablesOf<typeof query>
      >(server, print(query), {}, authContext)

      expect(data.me).toBeDefined()
      expect(data.me?.email).toBe('test@example.com')
      expect(data.me?.name).toBe('Test User')
    })
  })

  describe('Posts', () => {
    it('should create a post', async () => {
      const mutation = graphql(`
                mutation CreatePost($input: CreatePostInput!) {
                    createPost(input: $input) {
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
            `)

      const authContext = createAuthContext(UserId.create(testUser.id))

      const data = await gqlHelpers.expectSuccessfulMutation<
        ResultOf<typeof mutation>,
        VariablesOf<typeof mutation>
      >(
        server,
        print(mutation),
        {
          input: {
            title: 'Test Post',
            content: 'This is a test post',
            published: false,
          },
        },
        authContext,
      )

      expect(data.createPost).toBeDefined()
      expect(data.createPost?.title).toBe('Test Post')
      expect(data.createPost?.content).toBe('This is a test post')
      expect(data.createPost?.published).toBe(false)
      expect(data.createPost?.author?.email).toBe('test@example.com')
    })

    it('should get posts feed', async () => {
      // Create some posts
      await prisma.post.createMany({
        data: [
          {
            title: 'Post 1',
            content: 'Content 1',
            published: true,
            authorId: testUser.id,
          },
          {
            title: 'Post 2',
            content: 'Content 2',
            published: true,
            authorId: testUser.id,
          },
          {
            title: 'Draft',
            content: 'Draft content',
            published: false,
            authorId: testUser.id,
          },
        ],
      })

      const query = graphql(`
                query Feed($first: Int) {
                    feed(first: $first) {
                        edges {
                            node {
                                id
                                published
                            }
                        }
                        totalCount
                    }
                }
            `)

      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof query>,
        VariablesOf<typeof query>
      >(server, print(query), { first: 10 }, createMockContext())

      expect(data.feed?.edges?.length).toBe(2)
      expect(data.feed?.totalCount).toBe(2)
      expect(data.feed?.edges?.every((edge) => edge?.node?.published)).toBe(
        true,
      )
    })

    it('should get user drafts', async () => {
      // Create some posts
      await prisma.post.createMany({
        data: [
          {
            title: 'Draft 1',
            content: 'Draft 1',
            published: false,
            authorId: testUser.id,
          },
          {
            title: 'Draft 2',
            content: 'Draft 2',
            published: false,
            authorId: testUser.id,
          },
          {
            title: 'Published',
            content: 'Published',
            published: true,
            authorId: testUser.id,
          },
        ],
      })

      const query = graphql(`
                query Drafts($first: Int) {
                    drafts(first: $first) {
                        edges {
                            node {
                                id
                                published
                            }
                        }
                        totalCount
                    }
                }
            `)

      const authContext = createAuthContext(UserId.create(testUser.id))

      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof query>,
        VariablesOf<typeof query>
      >(server, print(query), { first: 10 }, authContext)

      expect(data.drafts?.edges?.length).toBe(2)
      expect(data.drafts?.totalCount).toBe(2)
      expect(data.drafts?.edges?.every((edge) => !edge?.node?.published)).toBe(
        true,
      )
    })
  })

  describe('Users', () => {
    it('should search users', async () => {
      // Create more users
      await prisma.user.createMany({
        data: [
          { email: 'john@example.com', password: 'hash', name: 'John Doe' },
          { email: 'jane@example.com', password: 'hash', name: 'Jane Smith' },
        ],
      })

      const query = graphql(`
                query SearchUsers($search: String!) {
                    searchUsers(search: $search) {
                        edges {
                            node {
                                id
                                email
                            }
                        }
                    }
                }
            `)

      const data = await gqlHelpers.expectSuccessfulQuery<
        ResultOf<typeof query>,
        VariablesOf<typeof query>
      >(
        server,
        print(query),
        { search: 'john@example.com' },
        createMockContext(),
      )

      expect(data.searchUsers?.edges?.length).toBe(1)
      expect(data.searchUsers?.edges?.[0]?.node?.email).toBe('john@example.com')
    })
  })
})
