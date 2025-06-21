/**
 * Posts Module GraphQL Schema
 *
 * Defines GraphQL types, inputs, and schema elements specific to posts.
 * Follows the IMPROVED-FILE-STRUCTURE.md specification for module organization.
 */

import { z } from 'zod'
import { builder } from '../../graphql/schema/builder'

// Input types for post operations
export const CreatePostInput = builder.inputType('CreatePostInput', {
  description: 'Input for creating a new post',
  fields: (t) => ({
    title: t.string({
      required: true,
      description: 'Post title',
      validate: {
        schema: z.string().min(1).max(255),
      },
    }),
    content: t.string({
      required: false,
      description: 'Post content',
      validate: {
        schema: z.string().max(10000),
      },
    }),
    published: t.boolean({
      required: false,
      defaultValue: false,
      description: 'Whether the post should be published',
    }),
  }),
})

export const UpdatePostInput = builder.inputType('UpdatePostInput', {
  description: 'Input for updating an existing post',
  fields: (t) => ({
    title: t.string({
      required: false,
      description: 'Post title',
      validate: {
        schema: z.string().min(1).max(255),
      },
    }),
    content: t.string({
      required: false,
      description: 'Post content',
      validate: {
        schema: z.string().max(10000),
      },
    }),
    published: t.boolean({
      required: false,
      description: 'Whether the post should be published',
    }),
  }),
})

// Post filter input for queries
export const PostFilterInput = builder.inputType('PostFilterInput', {
  description: 'Filter options for post queries',
  fields: (t) => ({
    published: t.boolean({
      required: false,
      description: 'Filter by published status',
    }),
    authorId: t.id({
      required: false,
      description: 'Filter by author ID',
    }),
    searchString: t.string({
      required: false,
      description: 'Search in title and content',
      validate: {
        schema: z.string().min(1).max(100),
      },
    }),
    tags: t.stringList({
      required: false,
      description: 'Filter by tags',
    }),
  }),
})

// Post sort input
export const PostSortInput = builder.inputType('PostSortInput', {
  description: 'Sort options for post queries',
  fields: (t) => ({
    field: t.string({
      required: true,
      description: 'Field to sort by',
      validate: {
        schema: z.enum(['createdAt', 'updatedAt', 'title', 'viewCount']),
      },
    }),
    direction: t.string({
      required: false,
      defaultValue: 'desc',
      description: 'Sort direction',
      validate: {
        schema: z.enum(['asc', 'desc']),
      },
    }),
  }),
})

// Comment input types
export const CreateCommentInput = builder.inputType('CreateCommentInput', {
  description: 'Input for creating a comment',
  fields: (t) => ({
    postId: t.id({
      required: true,
      description: 'ID of the post to comment on',
    }),
    content: t.string({
      required: true,
      description: 'Comment content',
      validate: {
        schema: z.string().min(1).max(1000),
      },
    }),
    parentId: t.id({
      required: false,
      description: 'ID of parent comment for replies',
    }),
  }),
})

// Moderation input types
export const ModeratePostInput = builder.inputType('ModeratePostInput', {
  description: 'Input for moderating a post',
  fields: (t) => ({
    id: t.id({
      required: true,
      description: 'Post ID to moderate',
    }),
    action: t.string({
      required: true,
      description: 'Moderation action to take',
      validate: {
        schema: z.enum(['approve', 'reject', 'flag', 'warn']),
      },
    }),
    reason: t.string({
      required: false,
      description: 'Reason for moderation action',
      validate: {
        schema: z.string().max(500),
      },
    }),
  }),
})

// Note: Post stats and connection types should be defined in resolvers where they have access to resolve functions

// Batch operations input
export const BatchPostOperationInput = builder.inputType(
  'BatchPostOperationInput',
  {
    description: 'Input for batch operations on posts',
    fields: (t) => ({
      postIds: t.idList({
        required: true,
        description: 'List of post IDs to operate on',
      }),
      operation: t.string({
        required: true,
        description: 'Operation to perform',
        validate: {
          schema: z.enum(['publish', 'unpublish', 'delete', 'flag']),
        },
      }),
      reason: t.string({
        required: false,
        description: 'Reason for the batch operation',
        validate: {
          schema: z.string().max(500),
        },
      }),
    }),
  },
)

// Export schema types for use in resolvers
export const PostSchemaTypes = {
  CreatePostInput,
  UpdatePostInput,
  PostFilterInput,
  PostSortInput,
  CreateCommentInput,
  ModeratePostInput,
  BatchPostOperationInput,
}
