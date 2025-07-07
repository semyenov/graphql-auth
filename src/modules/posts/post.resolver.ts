/**
 * Post Module Resolver
 *
 * Consolidated post operations following the Direct Resolvers pattern.
 * Uses inline Shield rules with the Pothos plugin.
 */

import type { Prisma } from '@prisma/client'
import { container } from 'tsyringe'
import { z } from 'zod'
import { prisma } from '@/modules/shared/database'
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
import {
  isAuthenticatedUser,
  isPublic,
} from '@/modules/shared/rules/common.rules'
import {
  AuthorizationError,
  NotFoundError,
  RateLimitError,
} from '../../app/errors/types'
import { builder } from '../../graphql/schema/builder'
import { requireAuthentication } from '../auth/guards/auth.guards'
import { parseGlobalId } from '../shared/connections'
import { canIncrementViewCount, canViewPost, isPostOwner } from './post.rules'

// Service getters
const getLogger = () => container.resolve<ILogger>('ILogger')

// ============================================================================
// Input Types
// ============================================================================

const CreatePostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({
      required: true,
      validate: {
        schema: z.string().min(1).max(255),
      },
    }),
    content: t.string({
      required: false,
      validate: {
        schema: z.string().max(10000),
      },
    }),
    published: t.boolean({
      required: false,
      defaultValue: false,
    }),
  }),
})

const UpdatePostInput = builder.inputType('UpdatePostInput', {
  fields: (t) => ({
    title: t.string({
      required: false,
      validate: {
        schema: z.string().min(1).max(255),
      },
    }),
    content: t.string({
      required: false,
      validate: {
        schema: z.string().max(10000),
      },
    }),
    published: t.boolean({
      required: false,
    }),
  }),
})

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create post mutation
 */
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Create a new post',
    grantScopes: ['authenticated'],
    shield: isAuthenticatedUser,
    args: {
      input: t.arg({
        type: CreatePostInput,
        required: true,
      }),
    },
    resolve: async (query, _parent, args, context) => {
      const logger = getLogger().child({ resolver: 'createPost' })
      const userId = requireAuthentication(context)

      logger.info('Creating new post', {
        authorId: userId.value,
        title: args.input.title,
        published: args.input.published,
      })

      const post = await prisma.post.create({
        ...query,
        data: {
          title: args.input.title,
          content: args.input.content || null,
          published: args.input.published ?? false,
          authorId: userId.value,
        },
      })

      logger.info('Post created successfully', {
        postId: post.id,
        authorId: userId.value,
        published: post.published,
      })

      return post
    },
  }),
)

/**
 * Update post mutation
 */
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Update an existing post',
    grantScopes: ['authenticated'],
    shield: isPostOwner,
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({
        type: UpdatePostInput,
        required: true,
      }),
    },
    resolve: async (query, _parent, args, context) => {
      const logger = getLogger().child({ resolver: 'updatePost' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      logger.info('Updating post', { postId, userId: userId.value })

      // Build update data
      const updateData: Prisma.PostUpdateInput = {}
      if (args.input.title !== undefined)
        updateData.title = args.input.title || undefined
      if (args.input.content !== undefined)
        updateData.content = args.input.content ?? null
      if (args.input.published !== undefined)
        updateData.published = args.input.published ?? false

      const post = await prisma.post.update({
        ...query,
        where: { id: postId },
        data: updateData,
      })

      logger.info('Post updated successfully', { postId })

      return post
    },
  }),
)

/**
 * Delete post mutation
 */
builder.mutationField('deletePost', (t) =>
  t.boolean({
    description: 'Delete a post',
    grantScopes: ['authenticated'],
    shield: isPostOwner,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'deletePost' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      logger.info('Deleting post', { postId, userId: userId.value })

      await prisma.post.delete({
        where: { id: postId },
      })

      logger.info('Post deleted successfully', { postId })

      return true
    },
  }),
)

/**
 * Toggle publish post mutation
 */
builder.mutationField('togglePublishPost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Toggle the publish status of a post',
    grantScopes: ['authenticated'],
    shield: isPostOwner,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      const logger = getLogger().child({ resolver: 'togglePublishPost' })
      requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Get current publish status
      const existingPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { published: true },
      })

      if (!existingPost) {
        throw new NotFoundError('Post not found')
      }

      logger.info('Toggling post publish status', {
        postId,
        currentStatus: existingPost.published,
      })

      const post = await prisma.post.update({
        ...query,
        where: { id: postId },
        data: { published: !existingPost.published },
      })

      logger.info('Post publish status toggled', {
        postId,
        newStatus: post.published,
      })

      return post
    },
  }),
)

/**
 * Increment view count mutation
 */
builder.mutationField('incrementPostViewCount', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Increment the view count of a post',
    shield: canIncrementViewCount,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, _context) => {
      const logger = getLogger().child({ resolver: 'incrementPostViewCount' })
      const postId = parseGlobalId(args.id.toString(), 'Post')

      logger.info('Incrementing post view count', { postId })

      const post = await prisma.post.update({
        ...query,
        where: { id: postId },
        data: { viewCount: { increment: 1 } },
      })

      logger.info('Post view count incremented', {
        postId,
        newCount: post.viewCount,
      })

      return post
    },
  }),
)

/**
 * Create comment mutation with rate limiting
 */
builder.mutationField('createComment', (t) =>
  t.string({
    description: 'Create a comment on a post',
    grantScopes: ['authenticated'],
    shield: isAuthenticatedUser,
    args: {
      postId: t.arg.id({ required: true }),
      content: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1).max(1000),
        },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'createComment' })
      const userId = requireAuthentication(context)

      // Check rate limit using enhanced scopes
      if (
        'createScopes' in context &&
        typeof context.createScopes === 'function'
      ) {
        const scopes = context.createScopes()
        const withinLimit = await scopes.withinRateLimit(
          'createComment',
          10,
          3600000,
        )
        if (!withinLimit) {
          throw new RateLimitError('Too many comments. Please try again later.')
        }
      }

      const postId = parseGlobalId(args.postId.toString(), 'Post')

      // Verify post exists and is published
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true, published: true },
      })

      if (!post) {
        throw new NotFoundError('Post not found')
      }

      if (!post.published) {
        throw new AuthorizationError('Cannot comment on unpublished posts')
      }

      logger.info('Creating comment', {
        postId,
        userId: userId.value,
      })

      // In a real implementation, you would create a comment record
      // For now, just return a success message
      return `Comment "${args.content}" created successfully on post ${args.postId}`
    },
  }),
)

// ============================================================================
// Queries
// ============================================================================

/**
 * Feed query - Get published posts
 */
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Get published posts with optional search',
    shield: isPublic,
    args: {
      searchString: t.arg.string({
        required: false,
        validate: {
          schema: z.string().min(1).max(100),
        },
      }),
    },
    resolve: (query, _parent, args, _context) => {
      const whereClause: Prisma.PostWhereInput = { published: true }

      if (args.searchString) {
        whereClause.OR = [
          { title: { contains: args.searchString } },
          { content: { contains: args.searchString } },
        ]
      }

      return prisma.post.findMany({
        ...query,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      })
    },
    totalCount: (_parent, args, _context) => {
      const whereClause: Prisma.PostWhereInput = { published: true }

      if (args.searchString) {
        whereClause.OR = [
          { title: { contains: args.searchString } },
          { content: { contains: args.searchString } },
        ]
      }

      return prisma.post.count({ where: whereClause })
    },
  }),
)

/**
 * Drafts query - Get user's draft posts
 */
builder.queryField('drafts', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Get draft posts for the authenticated user',
    grantScopes: ['authenticated'],
    shield: isAuthenticatedUser,
    resolve: (query, _parent, _args, context) => {
      const userId = requireAuthentication(context)

      return prisma.post.findMany({
        ...query,
        where: {
          authorId: userId.value,
          published: false,
        },
        orderBy: { createdAt: 'desc' },
      })
    },
    totalCount: (_parent, _args, context) => {
      const userId = requireAuthentication(context)

      return prisma.post.count({
        where: {
          authorId: userId.value,
          published: false,
        },
      })
    },
  }),
)

/**
 * Get post by ID query
 */
builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    description: 'Get a post by ID',
    shield: canViewPost,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, _context) => {
      const postId = parseGlobalId(args.id.toString(), 'Post')

      return prisma.post.findUnique({
        ...query,
        where: { id: postId },
      })
    },
  }),
)

/**
 * Moderate post mutation - Admin only
 */
builder.mutationField('moderatePost', (t) =>
  t.boolean({
    description: 'Moderate a post (admin only)',
    grantScopes: ['admin'],
    args: {
      id: t.arg.id({ required: true }),
      action: t.arg.string({
        required: true,
        validate: {
          schema: z.enum(['approve', 'reject', 'flag']),
        },
      }),
      reason: t.arg.string({
        required: false,
        validate: {
          schema: z.string().max(500),
        },
      }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'moderatePost' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      logger.info('Moderating post', {
        postId,
        action: args.action,
        moderatorId: userId.value,
      })

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      })

      if (!post) {
        throw new NotFoundError('Post not found')
      }

      // In a real implementation, you would update moderation fields
      // For now, just log the action
      logger.info('Post moderated successfully', {
        postId,
        action: args.action,
        reason: args.reason,
      })

      return true
    },
  }),
)
