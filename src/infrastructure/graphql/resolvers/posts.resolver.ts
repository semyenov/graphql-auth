/**
 * Posts GraphQL Resolvers
 * 
 * Handles post-related GraphQL operations using clean architecture.
 */

import type { EnhancedContext } from '../../../context/enhanced-context'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { builder } from '../../../schema/builder'
import { PostCreateInput, PostOrderByInput, PostWhereInput } from '../../../schema/inputs'
import { transformPostWhereInput } from '../../../schema/utils/filter-transform'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import { normalizeGraphQLError } from '../errors/graphql-error-handler'

// Create post mutation
builder.mutationField('createDraft', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Create a new draft post',
    args: {
      data: t.arg({
        type: PostCreateInput,
        required: true,
        description: 'Post data including title and optional content',
      }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        if (!context.userId) {
          throw new Error('You must be logged in to create a post')
        }

        const postDto = await context.useCases.posts.create.execute({
          title: args.data.title,
          content: args.data.content || null,
          authorId: context.userId,
        })

        // Return the post with Prisma query for field selection
        return context.prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: postDto.id },
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Update post mutation
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Update an existing post',
    args: {
      id: t.arg.id({ required: true, description: 'The global ID of the post to update' }),
      title: t.arg.string({ description: 'New title for the post' }),
      content: t.arg.string({ description: 'New content for the post' }),
      published: t.arg.boolean({ description: 'New published status for the post' }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        if (!context.userId) {
          throw new Error('You must be logged in to update a post')
        }

        const numericId = parseGlobalId(args.id.toString(), 'Post')

        const postDto = await context.useCases.posts.update.execute({
          postId: PostId.create(numericId),
          userId: context.userId,
          title: args.title || undefined,
          content: args.content || undefined,
          published: args.published || undefined,
        })

        // Return the updated post with Prisma query for field selection
        return context.prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: postDto.id },
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Delete post mutation
builder.mutationField('deletePost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Delete a post',
    nullable: true,
    args: {
      id: t.arg.id({ required: true, description: 'The global ID of the post to delete' }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        if (!context.userId) {
          throw new Error('You must be logged in to delete a post')
        }

        const numericId = parseGlobalId(args.id.toString(), 'Post')

        // First get the post to return it after deletion
        const post = await context.prisma.post.findUnique({
          ...query,
          where: { id: numericId },
        })

        if (!post) {
          throw new Error(`Post with id ${args.id} not found`)
        }

        await context.useCases.posts.delete.execute({
          postId: PostId.create(numericId),
          userId: context.userId,
        })

        // Return the post that was deleted
        return post
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Toggle publish post mutation
builder.mutationField('togglePublishPost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Toggle the publication status of a post',
    args: {
      id: t.arg.id({ required: true, description: 'The global ID of the post to toggle' }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        if (!context.userId) {
          throw new Error('You must be logged in to toggle post publication')
        }

        const numericId = parseGlobalId(args.id.toString(), 'Post')

        // Get current post to check its published status
        const currentPost = await context.prisma.post.findUnique({
          where: { id: numericId },
          select: { published: true, authorId: true },
        })

        if (!currentPost) {
          throw new Error(`Post with id ${args.id} not found`)
        }

        if (currentPost.authorId !== context.userId?.value) {
          throw new Error('You can only toggle publication status of your own posts')
        }

        const postDto = await context.useCases.posts.update.execute({
          postId: PostId.create(numericId),
          userId: context.userId,
          published: !currentPost.published,
        })

        // Return the updated post with Prisma query for field selection
        return context.prisma.post.findUniqueOrThrow({
          ...query,
          where: { id: postDto.id },
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Increment post view count mutation
builder.mutationField('incrementPostViewCount', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Increment the view count of a post',
    args: {
      id: t.arg.id({ required: true, description: 'The global ID of the post to increment view count' }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        const numericId = parseGlobalId(args.id.toString(), 'Post')

        // Check if post exists
        const post = await context.prisma.post.findUnique({
          where: { id: numericId },
          select: { id: true, viewCount: true },
        })

        if (!post) {
          throw new Error(`Post with identifier '${args.id}' not found`)
        }

        // Increment view count directly in the database
        const updatedPost = await context.prisma.post.update({
          ...query,
          where: { id: numericId },
          data: { viewCount: post.viewCount + 1 },
        })

        return updatedPost
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Get post by ID query
builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      id: t.arg.id({
        required: true,
        description: 'Global ID of the post to retrieve',
      }),
    },
    resolve: async (query, _parent, args, ctx: EnhancedContext) => {
      try {
        // Decode the global ID to get the numeric ID
        const postId = parseGlobalId(args.id.toString(), 'Post')

        // Use the get post use case
        const postDto = await ctx.useCases.posts.get.execute({
          postId: PostId.create(postId),
          userId: ctx.userId || undefined,
        })

        if (!postDto) return null

        // Fetch the full post data with Prisma query optimization
        // Use the prisma client directly with the query parameter
        // Convert string ID to number for Prisma
        return ctx.prisma.post.findUnique({
          ...query,
          where: { id: postDto.id },
        })
      } catch (error) {
        // Post not found or not accessible
        return null
      }
    },
  })
)

// Feed query
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Get published posts with filtering and pagination',
    args: {
      searchString: t.arg.string({
        description: 'Search in title and content',
      }),
      where: t.arg({ type: PostWhereInput }),
      orderBy: t.arg({ type: [PostOrderByInput] }),
    },
    resolve: async (query, _root, args, context: EnhancedContext) => {
      try {
        // Build where clause
        let where: any = { published: true }

        if (args.searchString) {
          where = {
            ...where,
            OR: [
              { title: { contains: args.searchString } },
              { content: { contains: args.searchString } },
            ],
          }
        }

        if (args.where) {
          where = { ...where, ...transformPostWhereInput(args.where) }
        }

        // Return posts directly from Prisma
        return context.prisma.post.findMany({
          ...query,
          where,
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
    totalCount: async (_parent, args, context: EnhancedContext) => {
      try {
        // Build where clause (same as in resolve)
        let where: any = { published: true }

        if (args.searchString) {
          where = {
            ...where,
            OR: [
              { title: { contains: args.searchString } },
              { content: { contains: args.searchString } },
            ],
          }
        }

        if (args.where) {
          where = { ...where, ...transformPostWhereInput(args.where) }
        }

        return context.prisma.post.count({ where })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// User drafts query
builder.queryField('drafts', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Get drafts for a specific user or the current user',
    args: {
      userId: t.arg.id({
        required: false,
        description: 'The ID of the user whose drafts to retrieve (defaults to current user)'
      }),
    },
    resolve: async (query, _root, args, context: EnhancedContext) => {
      try {
        if (!context.userId) {
          throw new Error('You must be logged in to view drafts')
        }

        // Use provided userId or default to current user
        let userNumericId: number
        if (args.userId) {
          userNumericId = parseGlobalId(args.userId.toString(), 'User')
        } else {
          userNumericId = context.userId.value
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
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
    totalCount: async (_parent, args, context: EnhancedContext) => {
      try {
        if (!context.userId) {
          return 0
        }

        // Use provided userId or default to current user
        let userNumericId: number
        if (args.userId) {
          userNumericId = parseGlobalId(args.userId.toString(), 'User')
        } else {
          userNumericId = context.userId.value
        }

        return context.prisma.post.count({
          where: {
            authorId: userNumericId,
            published: false
          },
        })
      } catch (error) {
        return 0
      }
    },
  })
)