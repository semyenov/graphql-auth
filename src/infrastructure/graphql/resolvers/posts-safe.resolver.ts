/**
 * Safe Post Mutations with Union Result Types
 * 
 * These mutations demonstrate advanced error handling patterns
 * using union types for comprehensive error reporting.
 */

import { container } from 'tsyringe'
import { requireAuthentication } from '../../../context/auth'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import type { ILogger } from '../../../core/services/logger.interface'
import { AuthorizationError, BaseError, normalizeError, NotFoundError } from '../../../errors'
import { builder } from '../../../schema/builder'
import { CreatePostInput, PostOrderByInput, PostWhereInput, UpdatePostInput } from '../../../schema/input-types'
import { createDeleteSuccess, createPostSuccess, DeleteResult, PostResult } from '../../../schema/result-types'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import { transformOrderBy } from '../../../schema/utils/filter-transform'

// Get logger from container
const getLogger = () => container.resolve<ILogger>('ILogger')

// Safe create post mutation with union result type
builder.mutationField('safeCreatePost', (t) =>
  t.field({
    type: PostResult,
    description: 'Create a post with comprehensive error handling',
    grantScopes: ['authenticated'],
    args: {
      input: t.arg({ type: CreatePostInput, required: true }),
    },
    resolve: async (_parent, args, context: EnhancedContext): Promise<PostResult | BaseError> => {
      const logger = getLogger().child({ resolver: 'safeCreatePost' })

      try {
        const userId = requireAuthentication(context)
        logger.info('Creating post', { userId: userId.value, title: args.input.title })

        const post = await context.prisma.post.create({
          data: {
            title: args.input.title,
            content: args.input.content || null,
            published: args.input.published ?? false,
            authorId: userId.value,
          },
        })

        logger.info('Post created successfully', { postId: post.id, userId: userId.value })
        return createPostSuccess(post, 'Post created successfully')
      } catch (error) {
        logger.error('Safe create post error', { error: error as Error, userId: context.userId?.value })
        return normalizeError(error)
      }
    },
  })
)

// Safe update post mutation with union result type
builder.mutationField('safeUpdatePost', (t) =>
  t.field({
    type: PostResult,
    description: 'Update a post with comprehensive error handling',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdatePostInput, required: true }),
    },
    resolve: async (_parent, args, context: EnhancedContext): Promise<PostResult | BaseError> => {
      const logger = getLogger().child({ resolver: 'safeUpdatePost' })

      try {
        const userId = requireAuthentication(context)
        const postId = parseGlobalId(args.id.toString(), 'Post')

        logger.info('Updating post', { postId, userId: userId.value })

        // Check if post exists and user owns it
        const existingPost = await context.prisma.post.findUnique({
          where: { id: postId },
          select: { authorId: true },
        })

        if (!existingPost) {
          logger.warn('Post not found', { postId })
          return new NotFoundError('Post', postId)
        }

        if (existingPost.authorId !== userId.value) {
          logger.warn('Unauthorized update attempt', { postId, userId: userId.value })
          return new AuthorizationError('You can only modify posts that you have created')
        }

        const post = await context.prisma.post.update({
          where: { id: postId },
          data: {
            ...(args.input.title !== undefined && { title: args.input.title }),
            ...(args.input.content !== undefined && { content: args.input.content }),
            ...(args.input.published !== undefined && { published: args.input.published }),
          },
        })

        logger.info('Post updated successfully', { postId, userId: userId.value })
        return createPostSuccess(post, 'Post updated successfully')
      } catch (error) {
        logger.error('Safe update post error', { error: error as Error, postId: args.id })
        return normalizeError(error)
      }
    },
  })
)

// Safe delete post mutation with union result type
builder.mutationField('safeDeletePost', (t) =>
  t.field({
    type: DeleteResult,
    description: 'Delete a post with comprehensive error handling',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, context: EnhancedContext): Promise<DeleteResult | BaseError> => {
      const logger = getLogger().child({ resolver: 'safeDeletePost' })

      try {
        const userId = requireAuthentication(context)
        const postId = parseGlobalId(args.id.toString(), 'Post')

        logger.info('Deleting post', { postId, userId: userId.value })

        // Check if post exists and user owns it
        const existingPost = await context.prisma.post.findUnique({
          where: { id: postId },
          select: { authorId: true, title: true },
        })

        if (!existingPost) {
          logger.warn('Post not found', { postId })
          return new NotFoundError('Post', postId)
        }

        if (existingPost.authorId !== userId.value) {
          logger.warn('Unauthorized delete attempt', { postId, userId: userId.value })
          return new AuthorizationError('You can only delete posts that you have created')
        }

        await context.prisma.post.delete({
          where: { id: postId },
        })

        logger.info('Post deleted successfully', { postId, userId: userId.value })
        return createDeleteSuccess(args.id.toString(), `Post "${existingPost.title}" deleted successfully`)
      } catch (error) {
        logger.error('Safe delete post error', { error: error as Error, postId: args.id })
        return normalizeError(error)
      }
    },
  })
)

// Optimized feed query with Prisma query optimization
builder.queryField('optimizedFeed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Optimized feed query with proper Prisma integration',
    grantScopes: ['public'],
    args: {
      searchString: t.arg.string({
        required: false,
        description: 'Search posts by title or content',
      }),
      orderBy: t.arg({ type: PostOrderByInput }),
      where: t.arg({ type: PostWhereInput }),
      limit: t.arg({ type: 'Int', required: false }),
      offset: t.arg({ type: 'Int', required: false }),
    },
    resolve: (query, _parent, args, context) => {
      // ALWAYS spread query for Prisma optimizations
      const whereClause: any = { published: true }

      if (args.searchString) {
        whereClause.OR = [
          { title: { contains: args.searchString, mode: 'insensitive' } },
          { content: { contains: args.searchString, mode: 'insensitive' } },
        ]
      }

      const orderBy = args.orderBy?.map(transformOrderBy) || [{ createdAt: 'desc' }]

      return context.prisma.post.findMany({
        ...query, // Critical for performance - enables field-level optimization
        where: whereClause,
        orderBy,
        include: {
          // Prisma will optimize based on GraphQL query
          author: query.include?.author,
          _count: {
            select: {
              comments: true // Add comment count if you have comments
            }
          }
        }
      })
    },
    totalCount: (_parent, args, context) => {
      const whereClause: any = { published: true }

      if (args.searchString) {
        whereClause.OR = [
          { title: { contains: args.searchString, mode: 'insensitive' } },
          { content: { contains: args.searchString, mode: 'insensitive' } },
        ]
      }

      return context.prisma.post.count({ where: whereClause })
    },
  })
)