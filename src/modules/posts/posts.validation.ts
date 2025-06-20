/**
 * Posts Module Validation Schemas
 * 
 * Contains all validation schemas and rules specific to posts
 */

import { z } from 'zod'
import { VALIDATION } from '../../constants'
import { prisma } from '../../prisma'

/**
 * Post title validation
 */
export const titleSchema = z
  .string()
  .min(VALIDATION.POST_TITLE_MIN_LENGTH, 'Title is too short')
  .max(VALIDATION.POST_TITLE_MAX_LENGTH, 'Title is too long')
  .transform(title => title.trim())

/**
 * Post content validation
 */
export const contentSchema = z
  .string()
  .max(VALIDATION.POST_CONTENT_MAX_LENGTH, 'Content is too long')
  .optional()
  .transform(content => content?.trim())

/**
 * Post tags validation
 */
export const tagsSchema = z
  .array(
    z.string()
      .min(2, 'Tag must be at least 2 characters')
      .max(20, 'Tag must be less than 20 characters')
      .regex(/^[a-zA-Z0-9-]+$/, 'Tags can only contain letters, numbers, and hyphens')
      .transform(tag => tag.toLowerCase())
  )
  .max(10, 'Maximum 10 tags allowed')
  .optional()
  .refine(
    (tags) => {
      if (!tags) return true
      return new Set(tags).size === tags.length
    },
    'Tags must be unique'
  )

/**
 * Create post input validation
 */
export const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  published: z.boolean().default(false),
  tags: tagsSchema,
})

/**
 * Update post input validation
 */
export const updatePostSchema = z.object({
  title: titleSchema.optional(),
  content: contentSchema,
  published: z.boolean().optional(),
  tags: tagsSchema,
}).refine(
  (data) => {
    // At least one field must be provided
    return Object.values(data).some(value => value !== undefined)
  },
  'At least one field must be provided for update'
)

/**
 * Post search/filter validation
 */
export const postSearchSchema = z.object({
  query: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query is too long')
    .optional(),
  published: z.boolean().optional(),
  authorId: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
})

/**
 * Post pagination validation
 */
export const postPaginationSchema = z.object({
  first: z.number()
    .min(1)
    .max(100, 'Cannot request more than 100 items')
    .optional(),
  after: z.string().optional(),
  last: z.number()
    .min(1)
    .max(100, 'Cannot request more than 100 items')
    .optional(),
  before: z.string().optional(),
}).refine(
  (data) => {
    // Can't use both forward and backward pagination
    if ((data.first || data.after) && (data.last || data.before)) {
      return false
    }
    return true
  },
  'Cannot use both forward and backward pagination'
)

/**
 * Post ordering validation
 */
export const postOrderingSchema = z.array(
  z.object({
    field: z.enum(['createdAt', 'updatedAt', 'title', 'viewCount', 'published']),
    direction: z.enum(['asc', 'desc']).default('desc'),
  })
).optional()

/**
 * Async validation for unique post title per user
 */
export const uniquePostTitleSchema = (userId: number, excludePostId?: number) =>
  titleSchema.refine(
    async (title) => {
      const existingPost = await prisma.post.findFirst({
        where: {
          title,
          authorId: userId,
          id: excludePostId ? { not: excludePostId } : undefined,
        },
        select: { id: true },
      })
      return !existingPost
    },
    'You already have a post with this title'
  )

/**
 * Post comment validation
 */
export const postCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long')
    .transform(content => content.trim()),
  parentId: z.number().positive().optional(), // For nested comments
})

/**
 * Post reaction validation
 */
export const postReactionSchema = z.object({
  type: z.enum(['like', 'love', 'wow', 'sad', 'angry']),
})

/**
 * Validate post ownership
 */
export async function validatePostOwnership(
  postId: number,
  userId: number
): Promise<boolean> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })
  return post?.authorId === userId
}

/**
 * Validate post exists
 */
export async function validatePostExists(postId: number): Promise<boolean> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  })
  return !!post
}

/**
 * Validate post input
 */
export function validatePostInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data)
}

/**
 * Safe validation that returns errors instead of throwing
 */
export function safeValidatePostInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}