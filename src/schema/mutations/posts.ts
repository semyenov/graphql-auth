import { requireAuthentication } from '../../context/auth'
import { NotFoundError, normalizeError } from '../../errors'
import { createPostSchema, validateInput } from '../../utils/validation'
import { builder } from '../builder'
import { PostCreateInput } from '../inputs'
import { parseGlobalID } from '../utils'
import {
    createDraftPost,
    deletePostById,
    incrementPostViews,
    togglePostPublication,
    validatePostAccess,
} from './utils'

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
                // Ensure user is authenticated
                const userId = requireAuthentication(context)

                // Validate and sanitize input
                const validatedData = validateInput(createPostSchema, args.data)

                // Create the draft post
                return await createDraftPost(
                    validatedData.title,
                    validatedData.content,
                    userId,
                    query
                )
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
                // Validate post access and ownership
                const { post, postId } = await validatePostAccess(
                    args.id.toString(),
                    context,
                    true // Check ownership
                )

                // Toggle the publication status
                return await togglePostPublication(
                    postId,
                    post.published ?? false,
                    query
                )
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
                // Parse the global ID
                const { id: postId } = parseGlobalID(args.id.toString(), 'Post')

                // Increment view count
                return await incrementPostViews(postId, query)
            } catch (error) {
                // Handle Prisma P2025 error (record not found)
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    throw new NotFoundError('Post', args.id.toString())
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
                // Validate post access and ownership
                const { postId } = await validatePostAccess(
                    args.id.toString(),
                    context,
                    true // Check ownership
                )

                // Delete the post
                return await deletePostById(postId, query)
            } catch (error) {
                // Handle Prisma P2025 error (record not found)
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                    throw new NotFoundError('Post', args.id.toString())
                }
                throw normalizeError(error)
            }
        },
    })
)