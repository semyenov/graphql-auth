/**
 * Direct Resolvers Tests
 * 
 * Tests for Pothos resolvers without use cases
 */

import bcrypt from 'bcryptjs'
import { graphql, ResultOf, VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from './setup'
import { createMockContext, createTestServer, gqlHelpers } from './test-utils'

describe('Direct Resolvers', () => {
    const server = createTestServer()

    beforeEach(async () => {
        // Create test data
        await prisma.user.deleteMany()
        await prisma.post.deleteMany()

        await prisma.user.create({
            data: {
                id: 1,
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
                name: 'Test User',
            },
        })
    })

    describe('Authentication', () => {
        it('should signup a new user', async () => {
            const mutation = graphql(`
                mutation SignupDirect($email: String!, $password: String!, $name: String) {
                    signupDirect(email: $email, password: $password, name: $name)
                }
            `)

            const data = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof mutation>, VariablesOf<typeof mutation>>(
                server,
                print(mutation),
                {
                    email: 'newuser@example.com',
                    password: 'password123',
                    name: 'New User',
                },
                createMockContext()
            )

            expect(data.signupDirect).toBeDefined()
            expect(typeof data.signupDirect).toBe('string')

            // Verify user was created
            const user = await prisma.user.findUnique({
                where: { email: 'newuser@example.com' },
            })
            expect(user).toBeDefined()
            expect(user?.name).toBe('New User')
        })

        it('should login with valid credentials', async () => {
            const mutation = graphql(`
                mutation LoginDirect($email: String!, $password: String!) {
                    loginDirect(email: $email, password: $password)
                }
            `)

            const data = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof mutation>, VariablesOf<typeof mutation>>(
                server,
                print(mutation),
                {
                    email: 'test@example.com',
                    password: 'password123',
                },
                createMockContext()
            )

            expect(data.loginDirect).toBeDefined()
            expect(typeof data.loginDirect).toBe('string')
        })

        it('should get current user', async () => {
            const query = graphql(`
                query MeDirect {
                    meDirect {
                        id
                        email
                        name
                    }
                }
            `)

            const authContext = {
                ...createMockContext(),
                userId: { value: 1 } as any,
                security: { isAuthenticated: true, userId: 1, roles: [], permissions: [] }
            }

            const data = await gqlHelpers.expectSuccessfulQuery<ResultOf<typeof query>, VariablesOf<typeof query>>(
                server,
                print(query),
                {},
                authContext
            )

            expect(data.meDirect).toBeDefined()
            expect(data.meDirect?.email).toBe('test@example.com')
            expect(data.meDirect?.name).toBe('Test User')
        })
    })

    describe('Posts', () => {
        it('should create a post', async () => {
            const mutation = graphql(`
                mutation CreatePostDirect($input: CreatePostInput!) {
                    createPostDirect(input: $input) {
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

            const authContext = {
                ...createMockContext(),
                userId: { value: 1 } as any,
                security: { isAuthenticated: true, userId: 1, roles: [], permissions: [] }
            }

            const data = await gqlHelpers.expectSuccessfulMutation<ResultOf<typeof mutation>, VariablesOf<typeof mutation>>(
                server,
                print(mutation),
                {
                    input: {
                        title: 'Test Post',
                        content: 'This is a test post',
                        published: false,
                    },
                },
                authContext
            )

            expect(data.createPostDirect).toBeDefined()
            expect(data.createPostDirect?.title).toBe('Test Post')
            expect(data.createPostDirect?.content).toBe('This is a test post')
            expect(data.createPostDirect?.published).toBe(false)
            expect(data.createPostDirect?.author?.email).toBe('test@example.com')
        })

        it('should get posts feed', async () => {
            // Create some posts
            await prisma.post.createMany({
                data: [
                    { title: 'Post 1', content: 'Content 1', published: true, authorId: 1 },
                    { title: 'Post 2', content: 'Content 2', published: true, authorId: 1 },
                    { title: 'Draft', content: 'Draft content', published: false, authorId: 1 },
                ],
            })

            const query = graphql(`
                query FeedDirect {
                    feedDirect {
                        edges {
                            node {
                                id
                                title
                                published
                            }
                        }
                        totalCount
                    }
                }
            `)

            const data = await gqlHelpers.expectSuccessfulQuery<ResultOf<typeof query>, VariablesOf<typeof query>>(
                server,
                print(query),
                {},
                createMockContext()
            )

            expect(data.feedDirect?.edges?.length).toBe(2)
            expect(data.feedDirect?.totalCount).toBe(2)
            expect(data.feedDirect?.edges?.every(edge => edge?.node?.published)).toBe(true)
        })

        it('should get user drafts', async () => {
            // Create some posts
            await prisma.post.createMany({
                data: [
                    { title: 'Draft 1', content: 'Draft 1', published: false, authorId: 1 },
                    { title: 'Draft 2', content: 'Draft 2', published: false, authorId: 1 },
                    { title: 'Published', content: 'Published', published: true, authorId: 1 },
                ],
            })

            const query = graphql(`
                query DraftsDirect {
                    draftsDirect {
                        edges {
                            node {
                                id
                                title
                                published
                            }
                        }
                        totalCount
                    }
                }
            `)

            const authContext = {
                ...createMockContext(),
                userId: { value: 1 } as any,
                security: { isAuthenticated: true, userId: 1, roles: [], permissions: [] }
            }

            const data = await gqlHelpers.expectSuccessfulQuery<ResultOf<typeof query>, VariablesOf<typeof query>>(
                server,
                print(query),
                {},
                authContext
            )

            expect(data.draftsDirect?.edges?.length).toBe(2)
            expect(data.draftsDirect?.totalCount).toBe(2)
            expect(data.draftsDirect?.edges?.every(edge => !edge?.node?.published)).toBe(true)
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
                query SearchUsersDirect($search: String!) {
                    searchUsersDirect(search: $search) {
                        edges {
                            node {
                                id
                                email
                                name
                            }
                        }
                        totalCount
                    }
                }
            `)

            const data = await gqlHelpers.expectSuccessfulQuery<ResultOf<typeof query>, VariablesOf<typeof query>>(
                server,
                print(query),
                { search: 'john' },
                createMockContext()
            )

            expect(data.searchUsersDirect?.edges?.length).toBe(1)
            expect(data.searchUsersDirect?.edges?.[0]?.node?.email).toBe('john@example.com')
        })
    })
})