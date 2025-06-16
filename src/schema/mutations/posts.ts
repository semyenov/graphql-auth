import { getUserId } from '../../context/utils'
import { AuthenticationError, NotFoundError, normalizeError } from '../../errors'
import { prisma } from '../../prisma'
import { createPostSchema, validateInput } from '../../utils/validation'
import { builder } from '../builder'
import { PostCreateInput } from '../inputs'
import { parseGlobalID } from '../utils'

/**
 * Create a new draft post
 * Posts are created as drafts by default and must be explicitly published
 */
builder.mutationField('createDraft', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Create a new draft post for the authenticated user',
        args: {
            data: t.arg({
                type: PostCreateInput,
                required: true,
                description: 'Post data including title and optional content',
            }),
        },
        resolve: async (query, _parent, args, context) => {
            try {
                // Check authentication
                const userId = getUserId(context)
                if (!userId) {
                    throw new AuthenticationError()
                }

                // Validate input
                const validatedData = validateInput(createPostSchema, args.data)

                // Create the post
                return await prisma.post.create({
                    ...query,
                    data: {
                        title: validatedData.title,
                        content: validatedData.content,
                        authorId: userId,
                        published: false, // Always create as draft
                    },
                })
            } catch (error) {
                throw normalizeError(error)
            }
        },
    })
)

/**
 * Toggle post publication status
 * Switches between published and draft state
 */
builder.mutationField('togglePublishPost', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Toggle the publication status of a post',
        args: {
            id: t.arg.id({
                required: true,
                description: 'The global ID of the post to toggle',
            }),
        },
        resolve: async (query, _parent, args, context) => {
            try {
                // Check authentication
                const userId = getUserId(context)
                if (!userId) {
                    throw new AuthenticationError()
                }

                // Decode the global ID
                const { id: postId } = parseGlobalID(args.id, 'Post')

                // Find the post and check ownership
                const post = await prisma.post.findUnique({
                    where: { id: postId },
                    select: {
                        published: true,
                        authorId: true,
                    },
                })

                if (!post) {
                    throw new NotFoundError('Post', args.id)
                }

                // Update the post
                return await prisma.post.update({
                    ...query,
                    where: { id: postId },
                    data: { published: !post.published },
                })
            } catch (error) {
                throw normalizeError(error)
            }
        },
    })
)

/**
 * Increment post view count
 * Tracks the number of times a post has been viewed
 */
builder.mutationField('incrementPostViewCount', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Increment the view count of a post',
        args: {
            id: t.arg.id({
                required: true,
                description: 'The global ID of the post to increment view count',
            }),
        },
        resolve: async (query, _parent, args) => {
            try {
                // Decode the global ID
                const { id: postId } = parseGlobalID(args.id, 'Post')

                // Update view count atomically
                return await prisma.post.update({
                    ...query,
                    where: { id: postId },
                    data: {
                        viewCount: {
                            increment: 1,
                        },
                    },
                })
            } catch (error) {
                // Handle case where post doesn't exist
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    throw new NotFoundError('Post', args.id)
                }
                throw normalizeError(error)
            }
        },
    })
)

/**
 * Delete a post
 * Permanently removes a post from the database
 */
builder.mutationField('deletePost', (t) =>
    t.prismaField({
        type: 'Post',
        description: 'Delete a post permanently',
        args: {
            id: t.arg.id({
                required: true,
                description: 'The global ID of the post to delete',
            }),
        },
        resolve: async (query, _parent, args, context) => {
            try {
                // Check authentication
                const userId = getUserId(context)
                if (!userId) {
                    throw new AuthenticationError()
                }

                // Decode the global ID
                const { id: postId } = parseGlobalID(args.id, 'Post')

                // Delete the post (will fail if it doesn't exist)
                return await prisma.post.delete({
                    ...query,
                    where: { id: postId },
                })
            } catch (error) {
                // Handle case where post doesn't exist
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    throw new NotFoundError('Post', args.id)
                }
                throw normalizeError(error)
            }
        },
    })
)