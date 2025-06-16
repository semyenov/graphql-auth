import bcrypt from 'bcryptjs'
import { print } from 'graphql'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserId } from '../src/core/value-objects/user-id.vo'
import { DeletePostMutation, LoginMutation } from '../src/gql/relay-mutations'
import { GetDraftsQuery, GetFeedQuery, GetMeQuery, GetPostQuery } from '../src/gql/relay-queries'
import { PermissionUtils } from '../src/permissions'
import { toPostId, toUserId } from './relay-utils'
import { prisma } from './setup'
import {
    createAuthContext,
    createMockContext,
    createTestServer,
    executeOperation
} from './test-utils'

describe('Enhanced Permissions System', () => {
    const server = createTestServer()
    let testUserId: number
    let otherUserId: number
    let testCounter = 0

    beforeEach(async () => {
        testCounter++

        // Create test users
        const user1 = await prisma.user.create({
            data: {
                email: `permtest${testCounter}@example.com`,
                password: await bcrypt.hash('password123', 10),
                name: 'Permission Test User',
            },
        })
        testUserId = user1.id

        const user2 = await prisma.user.create({
            data: {
                email: `permtest${testCounter}other@example.com`,
                password: await bcrypt.hash('password123', 10),
                name: 'Other Permission Test User',
            },
        })
        otherUserId = user2.id
    })

    describe('Permission Utilities', () => {
        it('should correctly identify if user can access their own data', () => {
            const context = createAuthContext(UserId.create(testUserId))
            const canAccess = PermissionUtils.canAccessUserData(context, testUserId)
            expect(canAccess).toBe(true)
        })

        it('should deny access to other users data for regular users', () => {
            const context = createAuthContext(UserId.create(testUserId))
            const canAccess = PermissionUtils.canAccessUserData(context, otherUserId)
            expect(canAccess).toBe(false)
        })

        it('should validate operations correctly', () => {
            const authenticatedContext = createAuthContext(testUserId.toString())
            const unauthenticatedContext = createMockContext()

            // Test authenticated operations
            expect(PermissionUtils.validateOperation(authenticatedContext, 'createPost')).toBe(true)
            expect(PermissionUtils.validateOperation(authenticatedContext, 'deletePost')).toBe(true)
            expect(PermissionUtils.validateOperation(authenticatedContext, 'editPost')).toBe(true)

            // Test unauthenticated operations
            expect(PermissionUtils.validateOperation(unauthenticatedContext, 'createPost')).toBe(false)
            expect(PermissionUtils.validateOperation(unauthenticatedContext, 'deletePost')).toBe(false)
            expect(PermissionUtils.validateOperation(unauthenticatedContext, 'editPost')).toBe(false)

            // Test unknown operations
            expect(PermissionUtils.validateOperation(authenticatedContext, 'unknownOperation')).toBe(false)
        })

        it('should correctly check post modification permissions', async () => {
            // Create a post owned by testUserId
            const post = await prisma.post.create({
                data: {
                    title: 'Test Post for Permissions',
                    content: 'Test content',
                    published: false,
                    authorId: testUserId,
                },
            })

            const ownerContext = createAuthContext(UserId.create(testUserId))
            const otherContext = createAuthContext(UserId.create(otherUserId))

            // Owner should be able to modify
            const canOwnerModify = await PermissionUtils.canModifyPost(ownerContext, post.id)
            expect(canOwnerModify).toBe(true)

            // Other user should not be able to modify
            const canOtherModify = await PermissionUtils.canModifyPost(otherContext, post.id)
            expect(canOtherModify).toBe(false)

            // Unauthenticated user should not be able to modify
            const unauthenticatedContext = createMockContext()
            const canUnauthenticatedModify = await PermissionUtils.canModifyPost(unauthenticatedContext, post.id)
            expect(canUnauthenticatedModify).toBe(false)
        })

        it('should handle role hierarchy correctly', () => {
            // Mock contexts with different roles
            const userContext = createAuthContext(testUserId.toString())
            userContext.security.roles = ['user']

            const moderatorContext = createAuthContext(testUserId.toString())
            moderatorContext.security.roles = ['moderator']

            const adminContext = createAuthContext(testUserId.toString())
            adminContext.security.roles = ['admin']

            // Test role hierarchy
            expect(PermissionUtils.hasRoleOrHigher(userContext, 'user')).toBe(true)
            expect(PermissionUtils.hasRoleOrHigher(userContext, 'moderator')).toBe(false)
            expect(PermissionUtils.hasRoleOrHigher(userContext, 'admin')).toBe(false)

            expect(PermissionUtils.hasRoleOrHigher(moderatorContext, 'user')).toBe(true)
            expect(PermissionUtils.hasRoleOrHigher(moderatorContext, 'moderator')).toBe(true)
            expect(PermissionUtils.hasRoleOrHigher(moderatorContext, 'admin')).toBe(false)

            expect(PermissionUtils.hasRoleOrHigher(adminContext, 'user')).toBe(true)
            expect(PermissionUtils.hasRoleOrHigher(adminContext, 'moderator')).toBe(true)
            expect(PermissionUtils.hasRoleOrHigher(adminContext, 'admin')).toBe(true)
        })
    })

    describe('GraphQL Permission Rules', () => {
        it('should allow public access to feed query', async () => {
            // Create published posts
            await prisma.post.createMany({
                data: [
                    {
                        title: 'Public Post 1',
                        content: 'Public content 1',
                        published: true,
                        authorId: testUserId,
                    },
                    {
                        title: 'Public Post 2',
                        content: 'Public content 2',
                        published: true,
                        authorId: otherUserId,
                    },
                ],
            })

            const result = await executeOperation(
                server,
                print(GetFeedQuery),
                { first: 10 },
                createMockContext()
            )

            expect(result.body.kind).toBe('single')
            if (result.body.kind === 'single') {
                expect(result.body.singleResult.errors).toBeUndefined()
                const data = result.body.singleResult.data as any
                // At least 2 posts should be returned (may include posts from other tests)
                expect(data?.feed?.edges.length).toBeGreaterThanOrEqual(2)
            }
        })

        it('should require authentication for me query', async () => {
            // Test without authentication
            const unauthResult = await executeOperation(
                server,
                print(GetMeQuery),
                {},
                createMockContext()
            )
            expect(unauthResult.body.kind).toBe('single')
            if (unauthResult.body.kind === 'single') {
                expect(unauthResult.body.singleResult.errors).toBeDefined()
                expect(unauthResult.body.singleResult.errors![0]!.message).toContain('Authentication required')
            }

            // Verify the test user exists
            const testUser = await prisma.user.findUnique({
                where: { id: testUserId }
            })
            expect(testUser).toBeTruthy()
            
            // Test with authentication - user should exist
            const authResult = await executeOperation(
                server,
                print(GetMeQuery),
                {},
                createAuthContext(UserId.create(testUserId))
            )
            expect(authResult.body.kind).toBe('single')
            if (authResult.body.kind === 'single') {
                expect(authResult.body.singleResult.errors).toBeUndefined()
                const data = authResult.body.singleResult.data as any
                // The me query should work since testUserId was created in beforeEach
                expect(data?.me).toBeTruthy()
                if (data?.me) {
                    expect(data.me.id).toBe(toUserId(testUserId))
                    expect(data.me.email).toBe(`permtest${testCounter}@example.com`)
                }
            }
        })

        it('should enforce user ownership for drafts query', async () => {
            // Create drafts for both users
            await prisma.post.createMany({
                data: [
                    {
                        title: 'User 1 Draft',
                        content: 'Private draft 1',
                        published: false,
                        authorId: testUserId,
                    },
                    {
                        title: 'User 2 Draft',
                        content: 'Private draft 2',
                        published: false,
                        authorId: otherUserId,
                    },
                ],
            })

            // User should be able to access their own drafts
            const ownDraftsResult = await executeOperation(
                server,
                print(GetDraftsQuery),
                { userId: toUserId(testUserId), first: 10 },
                createAuthContext(UserId.create(testUserId))
            )

            expect(ownDraftsResult.body.kind).toBe('single')
            if (ownDraftsResult.body.kind === 'single') {
                expect(ownDraftsResult.body.singleResult.errors).toBeUndefined()
                const data = ownDraftsResult.body.singleResult.data as any
                expect(data?.drafts?.edges).toHaveLength(1)
                expect(data?.drafts?.edges[0].node.title).toBe('User 1 Draft')
            }

            // User should not be able to access other user's drafts
            const otherDraftsResult = await executeOperation(
                server,
                print(GetDraftsQuery),
                { userId: toUserId(otherUserId), first: 10 },
                createAuthContext(UserId.create(testUserId))
            )

            expect(otherDraftsResult.body.kind).toBe('single')
            if (otherDraftsResult.body.kind === 'single') {
                // Should return empty list, not error
                expect(otherDraftsResult.body.singleResult.errors).toBeUndefined()
                const data = otherDraftsResult.body.singleResult.data as any
                expect(data?.drafts?.edges).toHaveLength(0)
            }
        })

        it('should enforce post ownership for mutations', async () => {
            // Create a post owned by otherUserId
            const post = await prisma.post.create({
                data: {
                    title: 'Other User Post',
                    content: 'Not mine',
                    published: false,
                    authorId: otherUserId,
                },
            })

            // testUserId should not be able to delete otherUserId's post
            const result = await executeOperation(
                server,
                print(DeletePostMutation),
                { id: toPostId(post.id) },
                createAuthContext(UserId.create(testUserId))
            )

            expect(result.body.kind).toBe('single')
            if (result.body.kind === 'single') {
                expect(result.body.singleResult.errors).toBeDefined()
                expect(result.body.singleResult.errors![0]!.message).toContain('You can only modify posts that you have created')
            }

            // Verify post still exists
            const existingPost = await prisma.post.findUnique({
                where: { id: post.id },
            })
            expect(existingPost).not.toBeNull()
        })

        it('should handle invalid post IDs gracefully', async () => {
            const result = await executeOperation(
                server,
                print(DeletePostMutation),
                { id: toPostId(999999) }, // Non-existent ID
                createAuthContext(UserId.create(testUserId))
            )

            expect(result.body.kind).toBe('single')
            if (result.body.kind === 'single') {
                expect(result.body.singleResult.errors).toBeDefined()
                expect(result.body.singleResult.errors![0]!.message).toContain(`Post with identifier '${toPostId(999999)}' not found`)
            }
        })
    })

    describe('Rate Limiting and Security', () => {
        it('should apply rate limiting rules to signup', async () => {
            const signupMutation = `
        mutation Signup($email: String!, $password: String!, $name: String) {
          signup(email: $email, password: $password, name: $name)
        }
      `

            const variables = {
                email: `ratelimit${testCounter}@example.com`,
                password: 'securePassword123',
                name: 'Rate Limit Test User',
            }

            // First signup should succeed (rate limiting is placeholder for now)
            const result = await executeOperation(server, signupMutation, variables, createMockContext())

            expect(result.body.kind).toBe('single')
            if (result.body.kind === 'single') {
                // Should succeed since rate limiting is not actually implemented yet
                expect(result.body.singleResult.data).toBeDefined()
            }
        })

        it('should allow public access to login', async () => {
            const variables = {
                email: 'nonexistent@example.com',
                password: 'wrongPassword',
            }

            const result = await executeOperation(
                server,
                print(LoginMutation),
                variables,
                createMockContext()
            )

            expect(result.body.kind).toBe('single')
            if (result.body.kind === 'single') {
                // Should get an error about invalid credentials, not authentication required
                expect(result.body.singleResult.errors).toBeDefined()
                expect(result.body.singleResult.errors![0]!.message).toContain('Invalid email or password')
            }
        })
    })

    describe('Fallback Rules', () => {
        it('should allow public access to published posts', async () => {
            // Test that published posts can be viewed without authentication

            // Create a published post
            const post = await prisma.post.create({
                data: {
                    title: 'Test Post',
                    content: 'Test content',
                    published: true,
                    authorId: testUserId,
                },
            })

            // Without authentication - should succeed for published posts
            const unauthResult = await executeOperation(
                server,
                print(GetPostQuery),
                { id: toPostId(post.id) },
                createMockContext()
            )

            expect(unauthResult.body.kind).toBe('single')
            if (unauthResult.body.kind === 'single') {
                expect(unauthResult.body.singleResult.errors).toBeUndefined()
                const data = unauthResult.body.singleResult.data as any
                expect(data?.post).toBeDefined()
                expect(data?.post.id).toBe(toPostId(post.id))
            }

            // With authentication - should succeed
            const authResult = await executeOperation(
                server,
                print(GetPostQuery),
                { id: toPostId(post.id) },
                createAuthContext(UserId.create(testUserId))
            )

            expect(authResult.body.kind).toBe('single')
            if (authResult.body.kind === 'single') {
                expect(authResult.body.singleResult.errors).toBeUndefined()
                const data = authResult.body.singleResult.data as any
                expect(data?.post).toBeDefined()
                expect(data?.post.id).toBe(toPostId(post.id))
            }
        })
    })
})