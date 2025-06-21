/**
 * Example Usage of Resolver Factory Functions
 *
 * This file demonstrates how to use the factory functions to create
 * common resolver patterns with minimal code duplication.
 */

import { z } from 'zod'
import { RateLimitPresets } from '../../app/auth/types'
import { prisma } from '../../prisma'
import {
  batchOperationFactory,
  computedFieldFactory,
  createMutationFactory,
  deleteMutationFactory,
  paginatedQueryFactory,
  rateLimitedMutationFactory,
  singleQueryFactory,
  updateMutationFactory,
  validatedInputFactory,
} from './factories'

// Example: Creating a complete CRUD API for a "Comment" entity

// 1. Define input types using the factory
const CreateCommentInput = validatedInputFactory('CreateCommentInput', {
  content: {
    type: 'String',
    required: true,
    description: 'The comment content',
    validation: z.string().min(1).max(1000),
  },
  postId: {
    type: 'ID',
    required: true,
    description: 'The post to comment on',
  },
})

const UpdateCommentInput = validatedInputFactory('UpdateCommentInput', {
  content: {
    type: 'String',
    required: true,
    description: 'The updated comment content',
    validation: z.string().min(1).max(1000),
  },
})

// 2. Create CRUD mutations using factories
// This single line creates a complete create mutation with:
// - Authentication check
// - Input validation
// - Automatic owner assignment
// - Error handling
createMutationFactory({
  model: 'comment',
  typeName: 'Comment',
  createInput: CreateCommentInput,
  ownerField: 'authorId',
  hooks: {
    beforeCreate: async (data, _context) => {
      // Example: Check if post exists and is published
      const post = await prisma.post.findUnique({
        where: { id: data.postId },
        select: { published: true },
      })
      if (!post?.published) {
        throw new Error('Cannot comment on unpublished posts')
      }
      return data
    },
  },
})

// Update mutation with ownership check
updateMutationFactory({
  model: 'comment',
  typeName: 'Comment',
  updateInput: UpdateCommentInput,
  ownerField: 'authorId',
})

// Delete mutation with ownership check
deleteMutationFactory({
  model: 'comment',
  typeName: 'Comment',
  ownerField: 'authorId',
})

// 3. Create queries using factories
// Paginated list of comments
paginatedQueryFactory('comments', {
  model: 'comment',
  typeName: 'Comment',
  defaultWhere: { deleted: false },
  defaultOrderBy: { createdAt: 'desc' },
})

// Single comment query
singleQueryFactory('comment', {
  model: 'comment',
  typeName: 'Comment',
  additionalChecks: async (comment, context) => {
    // Example: Check if user can view this comment
    if (comment.deleted && comment.authorId !== context.userId?.value) {
      return false
    }
    return true
  },
})

// 4. Create rate-limited operations
rateLimitedMutationFactory('reportComment', {
  type: 'Boolean',
  args: {
    commentId: 'ID',
    reason: 'String',
  },
  rateLimitPreset: RateLimitPresets.report,
  rateLimitKey: (args, context) => `${context.userId?.value}:${args.commentId}`,
  resolve: async (args, context) => {
    // Implementation for reporting a comment
    await prisma.report.create({
      data: {
        commentId: args.commentId,
        reason: args.reason,
        reporterId: context.userId?.value || 0,
      },
    })
    return true
  },
})

// 5. Create batch operations
batchOperationFactory('DeleteComments', {
  model: 'comment',
  typeName: 'Comment',
  operation: 'delete',
  ownerField: 'authorId',
})

// 6. Add computed fields
computedFieldFactory('Comment', 'likesCount', {
  type: 'Int',
  description: 'Number of likes on this comment',
  resolve: async (comment) => {
    return prisma.like.count({
      where: { commentId: comment.id },
    })
  },
})

computedFieldFactory('Comment', 'isLikedByMe', {
  type: 'Boolean',
  description: 'Whether the current user has liked this comment',
  nullable: true,
  resolve: async (comment, context) => {
    if (!context.userId) return null

    const like = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId: context.userId.value,
          commentId: comment.id,
        },
      },
    })
    return !!like
  },
})

// Example: Complex factory usage with all features
createMutationFactory({
  model: 'article',
  typeName: 'Article',
  createInput: validatedInputFactory('CreateArticleInput', {
    title: {
      type: 'String',
      required: true,
      validation: z.string().min(1).max(200),
    },
    content: {
      type: 'String',
      required: true,
      validation: z.string().min(100).max(50000),
    },
    tags: {
      type: 'String',
      required: false,
      validation: z.array(z.string()).max(10).optional(),
    },
    published: {
      type: 'Boolean',
      defaultValue: false,
    },
  }),
  ownerField: 'authorId',
  scopes: {
    create: ['authenticated', 'verified_email'],
  },
  hooks: {
    beforeCreate: async (data, _context) => {
      // Check if user has reached article limit
      const articleCount = await prisma.article.count({
        where: {
          authorId: _context.userId?.value || 0,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      })

      if (articleCount >= 5) {
        throw new Error('You can only create 5 articles per day')
      }

      // Process tags
      if (data.tags) {
        data.tags = {
          connectOrCreate: data.tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        }
      }

      return data
    },
    afterCreate: async (article, context) => {
      // Send notification or trigger other side effects
      await prisma.notification.create({
        data: {
          userId: context.userId?.value || 0,
          type: 'ARTICLE_CREATED',
          content: `Your article "${article.title}" has been created`,
        },
      })
    },
  },
})

/**
 * Benefits of using factory functions:
 *
 * 1. Consistency: All CRUD operations follow the same patterns
 * 2. Less code: A complete CRUD API in ~20 lines instead of ~200
 * 3. Type safety: Full TypeScript support with Pothos
 * 4. Built-in features: Auth, validation, rate limiting, ownership checks
 * 5. Extensibility: Hooks allow customization without breaking the pattern
 * 6. Maintainability: Changes to common patterns only need updates in one place
 */
