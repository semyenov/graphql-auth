import { requireAuthentication } from '../../../../context/auth'
import { normalizeError, NotFoundError } from '../../../../errors'
import { prisma } from '../../../../prisma'
import { builder } from '../../../../schema/builder'
import { PostCreateInput } from '../../../../schema/inputs'
import { container } from '../../../../shared/infrastructure/container'
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
    resolve: async (query, _parent, args, context) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Validate and create post
        const post = await container.createPostUseCase.execute({
          title: args.data.title,
          content: args.data.content,
          authorId: userId,
        })

        // Return with Prisma query optimization
        return prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: post.id },
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
    resolve: async (query, _parent, args, context) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // First fetch the post with the query to ensure we have all requested fields
        const post = await prisma.post.findUnique({
          ...query,
          where: { id: postId },
        })

        if (!post) {
          throw new NotFoundError('Post', args.id.toString())
        }

        // Execute delete use case (this will also verify permissions)
        await container.deletePostUseCase.execute(postId, userId)

        // Return the post data we fetched earlier
        return post
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
    resolve: async (query, _parent, args, context) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // Execute toggle publish use case
        const post = await container.togglePublishPostUseCase.execute(postId, userId)

        // Return with Prisma query optimization
        return prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: post.id },
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
    resolve: async (query, _parent, args, _context) => {
      try {
        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // Execute increment view count use case
        const post = await container.incrementPostViewCountUseCase.execute(postId)

        // Return with Prisma query optimization
        return prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: post.id },
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