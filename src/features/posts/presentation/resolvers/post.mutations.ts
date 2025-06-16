import { requireAuthentication } from '../../../../context/auth'
import { normalizeError, NotFoundError } from '../../../../errors'
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
    resolve: async (_query, _parent, args, context) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Validate and create post
        const post = await container.createPostUseCase.execute({
          title: args.data.title,
          content: args.data.content,
          authorId: userId,
        })

        // Return the created post with proper query selection
        const result = await context.repositories.posts.findById(post.id)
        if (!result) {
          throw new NotFoundError('Post', post.id.toString())
        }
        return result
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
    resolve: async (_query, _parent, args, context) => {
      try {
        const userId = requireAuthentication(context)
        const postId = parseGlobalId(args.id.toString(), 'Post')

        if (!args.title && !args.content && args.published === undefined) {
          throw new Error('At least one field must be provided for update')
        }

        const existingPost = await context.repositories.posts.findById(postId)

        if (!existingPost) {
          throw new NotFoundError('Post', args.id.toString())
        }

        if (existingPost.authorId !== userId) {
          throw new Error('You can only update your own posts')
        }

        const updateData: any = {}
        if (args.title !== undefined) updateData.title = args.title
        if (args.content !== undefined) updateData.content = args.content
        if (args.published !== undefined) updateData.published = args.published

        return context.repositories.posts.update(postId, updateData)
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
    resolve: async (_query, _parent, args, context) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // First fetch the post with author to ensure we have all required field data
        const postWithAuthor = await context.repositories.posts.findById(postId, true)

        if (!postWithAuthor) {
          throw new NotFoundError('Post', args.id.toString())
        }

        // Execute delete use case (this will verify permissions and delete it)
        await container.deletePostUseCase.execute(postId, userId)

        // Return the post with author data that we fetched before deletion
        return postWithAuthor
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
    resolve: async (_query, _parent, args, context) => {
      try {
        // Ensure user is authenticated
        const userId = requireAuthentication(context)

        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // Execute toggle publish use case
        const post = await container.togglePublishPostUseCase.execute(postId, userId)

        // Return the updated post
        const result = await context.repositories.posts.findById(post.id)
        if (!result) {
          throw new NotFoundError('Post', post.id.toString())
        }
        return result
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
    resolve: async (_query, _parent, args, context) => {
      try {
        // Parse global ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // Execute increment view count use case
        const post = await container.incrementPostViewCountUseCase.execute(postId)

        // Return the updated post
        const result = await context.repositories.posts.findById(post.id)
        if (!result) {
          throw new NotFoundError('Post', post.id.toString())
        }
        return result
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