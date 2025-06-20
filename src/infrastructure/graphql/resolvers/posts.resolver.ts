/**
 * Posts GraphQL Resolvers (Direct Implementation)
 * 
 * Implements post operations directly in Pothos resolvers without use cases.
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import { requireAuthentication } from '../../../context/auth'
import type { ILogger } from '../../../core/services/logger.interface'
import { AuthorizationError, NotFoundError, RateLimitError } from '../../../errors'
import { prisma } from '../../../prisma'
import { builder } from '../../../schema/builder'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'

// Get logger from container
const getLogger = () => container.resolve<ILogger>('ILogger')

// Input types for post mutations
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

// Create post mutation
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Create a new post',
    grantScopes: ['authenticated'],
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
        published: args.input.published
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
        published: post.published
      })

      return post
    },
  })
)

// Update post mutation
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Update an existing post',
    // For now, use basic auth and check ownership in resolver
    grantScopes: ['authenticated'],
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

      // Check if post exists and user owns it
      const existingPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      })

      if (!existingPost) {
        throw new NotFoundError('Post', args.id.toString())
      }

      if (existingPost.authorId !== userId.value) {
        throw new AuthorizationError('You can only modify posts that you have created')
      }

      logger.info('Updating post', { postId, userId: userId.value })

      // Build update data
      const updateData: any = {}
      if (args.input.title !== undefined) updateData.title = args.input.title
      if (args.input.content !== undefined) updateData.content = args.input.content
      if (args.input.published !== undefined) updateData.published = args.input.published

      const post = await prisma.post.update({
        ...query,
        where: { id: postId },
        data: updateData,
      })

      logger.info('Post updated successfully', { postId })

      return post
    },
  })
)

// Delete post mutation
builder.mutationField('deletePost', (t) =>
  t.boolean({
    description: 'Delete a post',
    // For now, keep simple authentication check
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      const logger = getLogger().child({ resolver: 'deletePost' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Check if post exists and user owns it (or is admin)
      const existingPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      })

      if (!existingPost) {
        throw new NotFoundError('Post', args.id.toString())
      }

      // Admin can delete any post, otherwise must be owner
      if (existingPost.authorId !== userId.value && context.user?.role !== 'admin') {
        throw new AuthorizationError('You can only modify posts that you have created')
      }

      logger.info('Deleting post', { postId, userId: userId.value })

      await prisma.post.delete({
        where: { id: postId },
      })

      logger.info('Post deleted successfully', { postId })

      return true
    },
  })
)

// Toggle publish post mutation
builder.mutationField('togglePublishPost', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Toggle the publish status of a post',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      const logger = getLogger().child({ resolver: 'togglePublishPost' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Check if post exists and user owns it
      const existingPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, published: true },
      })

      if (!existingPost) {
        throw new NotFoundError('Post', args.id.toString())
      }

      if (existingPost.authorId !== userId.value) {
        throw new AuthorizationError('You can only modify posts that you have created')
      }

      logger.info('Toggling post publish status', {
        postId,
        currentStatus: existingPost.published
      })

      const post = await prisma.post.update({
        ...query,
        where: { id: postId },
        data: { published: !existingPost.published },
      })

      logger.info('Post publish status toggled', {
        postId,
        newStatus: post.published
      })

      return post
    },
  })
)

// Increment view count mutation
builder.mutationField('incrementPostViewCount', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Increment the view count of a post',
    grantScopes: ['public'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, _context) => {
      const logger = getLogger().child({ resolver: 'incrementPostViewCount' })
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Check if post exists
      const existingPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      })

      if (!existingPost) {
        throw new NotFoundError('Post', args.id.toString())
      }

      logger.info('Incrementing post view count', { postId })

      const post = await prisma.post.update({
        ...query,
        where: { id: postId },
        data: { viewCount: { increment: 1 } },
      })

      logger.info('Post view count incremented', {
        postId,
        newCount: post.viewCount
      })

      return post
    },
  })
)

// Feed query
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Get published posts with optional search',
    args: {
      searchString: t.arg.string({
        required: false,
        validate: {
          schema: z.string().min(1).max(100),
        },
      }),
    },
    resolve: (query, _parent, args, _context) => {
      const whereClause: any = { published: true }

      if (args.searchString) {
        whereClause.OR = [
          { title: { contains: args.searchString, mode: 'insensitive' } },
          { content: { contains: args.searchString, mode: 'insensitive' } },
        ]
      }

      return prisma.post.findMany({
        ...query,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      })
    },
    totalCount: (_parent, args, _context) => {
      const whereClause: any = { published: true }

      if (args.searchString) {
        whereClause.OR = [
          { title: { contains: args.searchString, mode: 'insensitive' } },
          { content: { contains: args.searchString, mode: 'insensitive' } },
        ]
      }

      return prisma.post.count({ where: whereClause })
    },
  })
)

// User drafts query
builder.queryField('drafts', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Get draft posts for the authenticated user',
    grantScopes: ['authenticated'],
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
  })
)

// Get post by ID query
builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    description: 'Get a post by ID',
    // Use public scope since we check visibility in resolver
    grantScopes: ['public'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      const postId = parseGlobalId(args.id.toString(), 'Post')
      
      // Use enhanced scopes to check visibility
      if ('createScopes' in context && typeof context.createScopes === 'function') {
        const scopes = context.createScopes()
        const canView = await scopes.canViewContent('Post', args.id.toString())
        if (!canView) {
          return null // Post not visible to user
        }
      }

      return prisma.post.findUnique({
        ...query,
        where: { id: postId },
      })
    },
  })
)

// Moderate post mutation - requires moderation permission
builder.mutationField('moderatePost', (t) =>
  t.boolean({
    description: 'Moderate a post (approve, reject, or flag)',
    // Require authentication, check permission in resolver
    grantScopes: ['authenticated'],
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
      
      // Check moderation permission using enhanced scopes
      if ('createScopes' in context && typeof context.createScopes === 'function') {
        const scopes = context.createScopes()
        const hasPermission = await scopes.hasPermission('post:moderate')
        if (!hasPermission) {
          throw new AuthorizationError('You need moderation permission')
        }
      }
      
      const postId = parseGlobalId(args.id.toString(), 'Post')

      logger.info('Moderating post', { 
        postId, 
        action: args.action,
        moderatorId: context.userId?.value 
      })

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      })

      if (!post) {
        throw new NotFoundError('Post', args.id.toString())
      }

      // Update post with moderation status
      // This is a simplified example - you might want to create a separate moderation table
      await prisma.post.update({
        where: { id: postId },
        data: {
          // You would need to add these fields to your Post model
          // moderated: true,
          // moderatedAt: new Date(),
          // moderationStatus: args.action,
          // moderationReason: args.reason,
          // moderatorId: context.userId?.value,
        },
      })

      logger.info('Post moderated successfully', { 
        postId,
        action: args.action 
      })

      return true
    },
  })
)

// Create comment mutation with rate limiting
builder.mutationField('createComment', (t) =>
  t.string({
    description: 'Create a comment on a post with rate limiting',
    // Require authentication, check rate limit in resolver
    grantScopes: ['authenticated'],
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
      
      // Check rate limit using enhanced scopes
      if ('createScopes' in context && typeof context.createScopes === 'function') {
        const scopes = context.createScopes()
        const withinLimit = await scopes.withinRateLimit('createComment', 10, 3600000)
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
        throw new NotFoundError('Post', args.postId.toString())
      }

      if (!post.published) {
        throw new AuthorizationError('Cannot comment on unpublished posts')
      }

      logger.info('Creating comment', { 
        postId,
        userId: context.userId?.value 
      })

      // In a real implementation, you would create a comment record
      // For now, just return a success message
      return `Comment "${args.content}" created successfully on post ${args.postId}`
    },
  })
)