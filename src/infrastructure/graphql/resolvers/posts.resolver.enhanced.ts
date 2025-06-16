/**
 * Posts GraphQL Resolvers (Enhanced)
 * 
 * Handles post-related GraphQL operations using enhanced Pothos patterns.
 */

import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context'
import { PostId } from '../../../core/value-objects/post-id.vo'
import {
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError
} from '../../../errors'
import { builder } from '../../../schema/builder'
import { PostCreateInput, PostOrderByInput, PostWhereInput } from '../../../schema/inputs'
import { transformPostWhereInput } from '../../../schema/utils/filter-transform'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import {
    commonValidations,
    createAuthenticatedMutation,
    createPrismaConnection
} from '../pothos-helpers'

// Create post mutation with enhanced patterns
createAuthenticatedMutation('createDraft', {
    description: 'Create a new draft post',
    type: 'Post',
    errors: [ValidationError],
    args: (t) => ({
        data: t.field({
            type: PostCreateInput,
            required: true,
            description: 'Post data including title and optional content',
        }),
    }),
    resolve: async (args, context) => {
        const postDto = await context.useCases.posts.create.execute({
            title: args.data.title,
            content: args.data.content || null,
            authorId: context.userId,
        })

        // Return the post with Prisma query for field selection
        return context.prisma.post.findUniqueOrThrow({
            where: { id: postDto.id },
        })
    },
})

// Update post mutation with authorization
builder.mutationField('updatePost', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Update an existing post',
        authScopes: (parent, args) => ({
            authenticated: true,
            postOwner: args.id,
        }),
        errors: {
            types: [NotFoundError, AuthorizationError, ValidationError],
        },
        args: {
            id: t.arg.id({ 
                required: true, 
                description: 'The global ID of the post to update',
                validate: {
                    schema: commonValidations.id,
                },
            }),
            title: t.arg.string({ 
                description: 'New title for the post',
                validate: {
                    schema: commonValidations.title.optional(),
                },
            }),
            content: t.arg.string({ 
                description: 'New content for the post',
                validate: {
                    schema: commonValidations.content,
                },
            }),
            published: t.arg.boolean({ 
                description: 'New published status for the post' 
            }),
        },
        resolve: async (query, _parent, args, context: EnhancedContext) => {
            const numericId = parseGlobalId(args.id.toString(), 'Post')

            const postDto = await context.useCases.posts.update.execute({
                postId: PostId.create(numericId),
                userId: context.userId!,
                title: args.title || undefined,
                content: args.content || undefined,
                published: args.published ?? undefined,
            })

            // Return the updated post with Prisma query for field selection
            return context.prisma.post.findUniqueOrThrow({
                ...query,
                where: { id: postDto.id },
            })
        },
    })
)

// Delete post mutation with authorization
builder.mutationField('deletePost', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Delete a post',
        nullable: true,
        authScopes: (parent, args) => ({
            authenticated: true,
            postOwner: args.id,
        }),
        errors: {
            types: [NotFoundError, AuthorizationError],
        },
        args: {
            id: t.arg.id({ 
                required: true, 
                description: 'The global ID of the post to delete',
                validate: {
                    schema: commonValidations.id,
                },
            }),
        },
        resolve: async (query, _parent, args, context: EnhancedContext) => {
            const numericId = parseGlobalId(args.id.toString(), 'Post')

            // First get the post to return it after deletion
            const post = await context.prisma.post.findUnique({
                ...query,
                where: { id: numericId },
            })

            if (!post) {
                throw new NotFoundError('Post', args.id.toString())
            }

            await context.useCases.posts.delete.execute({
                postId: PostId.create(numericId),
                userId: context.userId!,
            })

            // Return the post that was deleted
            return post
        },
    })
)

// Toggle publish post mutation
builder.mutationField('togglePublishPost', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Toggle the publication status of a post',
        authScopes: (parent, args) => ({
            authenticated: true,
            postOwner: args.id,
        }),
        errors: {
            types: [NotFoundError, AuthorizationError],
        },
        args: {
            id: t.arg.id({ 
                required: true, 
                description: 'The global ID of the post to toggle',
                validate: {
                    schema: commonValidations.id,
                },
            }),
        },
        resolve: async (query, _parent, args, context: EnhancedContext) => {
            const numericId = parseGlobalId(args.id.toString(), 'Post')

            // Get current post to check its published status
            const currentPost = await context.prisma.post.findUnique({
                where: { id: numericId },
                select: { published: true },
            })

            if (!currentPost) {
                throw new NotFoundError('Post', args.id.toString())
            }

            const postDto = await context.useCases.posts.update.execute({
                postId: PostId.create(numericId),
                userId: context.userId!,
                published: !currentPost.published,
            })

            // Return the updated post with Prisma query for field selection
            return context.prisma.post.findUniqueOrThrow({
                ...query,
                where: { id: postDto.id },
            })
        },
    })
)

// Increment post view count mutation (public)
builder.mutationField('incrementPostViewCount', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Increment the view count of a post',
        authScopes: {
            public: true,
        },
        errors: {
            types: [NotFoundError],
        },
        args: {
            id: t.arg.id({ 
                required: true, 
                description: 'The global ID of the post to increment view count',
                validate: {
                    schema: commonValidations.id,
                },
            }),
        },
        resolve: async (query, _parent, args, context: EnhancedContext) => {
            const numericId = parseGlobalId(args.id.toString(), 'Post')

            // Check if post exists
            const post = await context.prisma.post.findUnique({
                where: { id: numericId },
                select: { id: true, viewCount: true },
            })

            if (!post) {
                throw new NotFoundError('Post', args.id.toString())
            }

            // Increment view count directly in the database
            const updatedPost = await context.prisma.post.update({
                ...query,
                where: { id: numericId },
                data: { viewCount: post.viewCount + 1 },
            })

            return updatedPost
        },
    })
)

// Get post by ID query
builder.queryField('post', (t) =>
    t.prismaField({
        type: 'Post',
        nullable: true,
        authScopes: {
            public: true,
        },
        args: {
            id: t.arg.id({
                required: true,
                description: 'Global ID of the post to retrieve',
                validate: {
                    schema: commonValidations.id,
                },
            }),
        },
        resolve: async (query, _parent, args, ctx: EnhancedContext) => {
            // Decode the global ID to get the numeric ID
            const postId = parseGlobalId(args.id.toString(), 'Post')

            // Use the get post use case
            const postDto = await ctx.useCases.posts.get.execute({
                postId: PostId.create(postId),
                userId: ctx.userId || undefined,
            })

            if (!postDto) return null

            // Fetch the full post data with Prisma query optimization
            return ctx.prisma.post.findUnique({
                ...query,
                where: { id: postDto.id },
            })
        },
    })
)

// Feed query using helper
builder.queryField('feed', 
    createPrismaConnection('Post', {
        description: 'Get published posts with filtering and pagination',
        defaultWhere: { published: true },
        defaultOrderBy: { createdAt: 'desc' },
        authScopes: { public: true },
        additionalArgs: (t) => ({
            searchString: t.string({
                description: 'Search in title and content',
            }),
            where: t.field({ type: PostWhereInput }),
            orderBy: t.field({ type: [PostOrderByInput] }),
        }),
    })
)

// User drafts query with authentication
builder.queryField('drafts', (t) =>
    t.prismaConnection({
        type: 'Post',
        cursor: 'id',
        description: 'Get drafts for a specific user or the current user',
        authScopes: {
            authenticated: true,
        },
        args: {
            userId: t.arg.id({
                required: false,
                description: 'The ID of the user whose drafts to retrieve (defaults to current user)',
                validate: {
                    schema: z.string().regex(/^[A-Za-z0-9+/=]+$/).optional(),
                },
            }),
        },
        resolve: async (query, _root, args, context: EnhancedContext) => {
            // Use provided userId or default to current user
            let userNumericId: number
            if (args.userId) {
                userNumericId = parseGlobalId(args.userId.toString(), 'User')
                // Check if user can access other user's drafts
                if (userNumericId !== context.userId!.value) {
                    throw new AuthorizationError('You can only access your own drafts')
                }
            } else {
                userNumericId = context.userId!.value
            }

            // Return drafts directly from Prisma
            return context.prisma.post.findMany({
                ...query,
                where: {
                    authorId: userNumericId,
                    published: false
                },
                orderBy: { updatedAt: 'desc' },
            })
        },
        totalCount: async (_parent, args, context: EnhancedContext) => {
            // Use provided userId or default to current user
            let userNumericId: number
            if (args.userId) {
                userNumericId = parseGlobalId(args.userId.toString(), 'User')
                if (userNumericId !== context.userId!.value) {
                    return 0
                }
            } else {
                userNumericId = context.userId!.value
            }

            return context.prisma.post.count({
                where: {
                    authorId: userNumericId,
                    published: false
                },
            })
        },
    })
)