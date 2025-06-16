/**
 * Posts GraphQL Resolvers (Direct Implementation)
 * 
 * Implements post operations directly in Pothos resolvers without use cases.
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { AuthorizationError, NotFoundError, ValidationError } from '../../../errors'
import { builder } from '../../../schema/builder'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import { requireAuthentication } from '../../../context/auth'
import type { ILogger } from '../../../core/services/logger.interface'

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
        schema: z.string().max(10000).optional(),
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
builder.mutationField('createPostDirect', (t) =>
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
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'createPostDirect' })
      const userId = requireAuthentication(context)
      
      logger.info('Creating new post', { 
        authorId: userId.value, 
        title: args.input.title,
        published: args.input.published 
      })

      const post = await context.prisma.post.create({
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
builder.mutationField('updatePostDirect', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Update an existing post',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({
        type: UpdatePostInput,
        required: true,
      }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'updatePostDirect' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Check if post exists and user owns it
      const existingPost = await context.prisma.post.findUnique({
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

      const post = await context.prisma.post.update({
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
builder.mutationField('deletePostDirect', (t) =>
  t.boolean({
    description: 'Delete a post',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'deletePostDirect' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Check if post exists and user owns it
      const existingPost = await context.prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      })

      if (!existingPost) {
        throw new NotFoundError('Post', args.id.toString())
      }

      if (existingPost.authorId !== userId.value) {
        throw new AuthorizationError('You can only modify posts that you have created')
      }

      logger.info('Deleting post', { postId, userId: userId.value })

      await context.prisma.post.delete({
        where: { id: postId },
      })

      logger.info('Post deleted successfully', { postId })

      return true
    },
  })
)

// Toggle publish post mutation
builder.mutationField('togglePublishPostDirect', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Toggle the publish status of a post',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'togglePublishPostDirect' })
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Check if post exists and user owns it
      const existingPost = await context.prisma.post.findUnique({
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

      const post = await context.prisma.post.update({
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
builder.mutationField('incrementPostViewCountDirect', (t) =>
  t.prismaField({
    type: 'Post',
    description: 'Increment the view count of a post',
    grantScopes: ['public'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'incrementPostViewCountDirect' })
      const postId = parseGlobalId(args.id.toString(), 'Post')

      // Check if post exists
      const existingPost = await context.prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      })

      if (!existingPost) {
        throw new NotFoundError('Post', args.id.toString())
      }

      logger.info('Incrementing post view count', { postId })

      const post = await context.prisma.post.update({
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
builder.queryField('feedDirect', (t) =>
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
    resolve: (query, _parent, args, context) => {
      const whereClause: any = { published: true }
      
      if (args.searchString) {
        whereClause.OR = [
          { title: { contains: args.searchString, mode: 'insensitive' } },
          { content: { contains: args.searchString, mode: 'insensitive' } },
        ]
      }

      return context.prisma.post.findMany({
        ...query,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
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

// User drafts query
builder.queryField('draftsDirect', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    description: 'Get draft posts for the authenticated user',
    grantScopes: ['authenticated'],
    resolve: (query, _parent, _args, context) => {
      const userId = requireAuthentication(context)
      
      return context.prisma.post.findMany({
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
      
      return context.prisma.post.count({
        where: {
          authorId: userId.value,
          published: false,
        },
      })
    },
  })
)

// Get post by ID query
builder.queryField('postDirect', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    description: 'Get a post by ID',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      const postId = parseGlobalId(args.id.toString(), 'Post')
      
      return context.prisma.post.findUnique({
        ...query,
        where: { id: postId },
      })
    },
  })
)