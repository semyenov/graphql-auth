import { requireAuthentication } from '../../../../context/auth'
import type { EnhancedContext } from '../../../../context/enhanced-context'
import { normalizeError, NotFoundError } from '../../../../errors'
import { builder } from '../../../../schema/builder'
import { PostCreateInput } from '../../../../schema/inputs'
import { parseGlobalId } from '../../../../shared/infrastructure/graphql/relay-helpers'

/**
 * Create draft post mutation
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
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        // Ensure useris authenticated
        const userId = requireAuthentication(context)

        // Validate and create post
        const postDto = await context.useCases.posts.create.execute({
          title: args.data.title,
          content: args.data.content ?? null,
          authorId: userId,
        })

        // Return the created post with proper query selection
        return context.prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: parseInt(postDto.id) },
        })
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
)

/**
 * Update post mutation (enhanced)
 */
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Update an existing post with enhanced validation',
    args: {
      id: t.arg.id({
        required: true,
        description: 'The global ID of the post to update',
      }),
      title: t.arg.string({
        description: 'New title for the post',
      }),
      content: t.arg.string({
        description: 'New content for the post',
      }),
      published: t.arg.boolean({
        description: 'New published status for the post',
      }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        const userId = requireAuthentication(context)
        const postId = parseGlobalId(args.id.toString(), 'Post')

        if (!args.title && !args.content && args.published === undefined) {
          throw new Error('At least one field must be provided for update')
        }

        const postDto = await context.useCases.posts.update.execute({
          postId: postId.toString(),
          userId: userId.toString(),
          title: args.title ?? undefined,
          content: args.content ?? undefined,
          published: args.published ?? undefined,
        })

        // Return the updated post with proper query selection
        return context.prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: parseInt(postDto.id) },
        })
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
)

/**
 * Delete post mutation
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
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // First fetch the post with query to ensure we have all required field data
        const postToDelete = await context.prisma.post.findUnique({
          ...query,
          where: { id: postId },
        })

        if (!postToDelete) {
          throw new NotFoundError('Post', args.id.toString())
        }

        // Execute delete use case (this will verify permissions and delete it)
        await context.useCases.posts.delete.execute({
          postId: postId.toString(),
          userId: userId.toString(),
        })

        // Return the post data that we fetched before deletion
        return postToDelete
      } catch (error) {
        // Handle Prisma not found error
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
          throw new NotFoundError('Post', args.id.toString())
        }
        throw normalizeError(error)
      }
    },
  })
)

/**
 * Toggle post publication status
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
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // Get current post to check its published status
        const currentPost = await context.prisma.post.findUnique({
          where: { id: postId },
          select: { published: true },
        })
        if (!currentPost) {
          throw new NotFoundError('Post', args.id.toString())
        }

        // Toggle publish status through update use case
        const postDto = await context.useCases.posts.update.execute({
          postId: postId.toString(),
          userId: userId.toString(),
          published: !currentPost.published,
        })

        // Return the updated post with proper query selection
        return context.prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: parseInt(postDto.id) },
        })
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
)

/**
 * Increment post view count
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
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // Execute increment view count use case
        const postDto = await context.useCases.posts.incrementViewCount.execute({
          postId: postId.toString(),
        })

        // Return the updated post with proper query selection
        return context.prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: parseInt(postDto.id) },
        })
      } catch (error) {
        // Handle Prisma not found error
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
          throw new NotFoundError('Post', args.id.toString())
        }
        throw normalizeError(error)
      }
    },
  })
)