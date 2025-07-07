/**
 * Posts Module Constants
 * Following modular monolith pattern - domain-specific constants isolated within module
 */

// Post validation constants
export const POST_CONSTANTS = {
  // Content limits
  TITLE_MAX_LENGTH: 200,
  TITLE_MIN_LENGTH: 3,
  CONTENT_MAX_LENGTH: 50000,
  EXCERPT_MAX_LENGTH: 500,

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // View count thresholds
  POPULAR_VIEW_THRESHOLD: 1000,
  TRENDING_VIEW_THRESHOLD: 100,

  // Publishing
  DEFAULT_PUBLISHED_STATE: false,

  // Rate limiting
  RATE_LIMITS: {
    CREATE_POST: {
      WINDOW_MS: 60 * 60 * 1000, // 1 hour
      MAX_ATTEMPTS: 10,
    },
    UPDATE_POST: {
      WINDOW_MS: 60 * 60 * 1000, // 1 hour
      MAX_ATTEMPTS: 50,
    },
    DELETE_POST: {
      WINDOW_MS: 60 * 60 * 1000, // 1 hour
      MAX_ATTEMPTS: 10,
    },
  },
} as const

// Post-specific error messages
export const POST_ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Post title is required and cannot be empty',
  TITLE_TOO_SHORT: `Post title must be at least ${POST_CONSTANTS.TITLE_MIN_LENGTH} characters long`,
  TITLE_TOO_LONG: `Post title must not exceed ${POST_CONSTANTS.TITLE_MAX_LENGTH} characters`,
  CONTENT_TOO_LONG: `Post content must not exceed ${POST_CONSTANTS.CONTENT_MAX_LENGTH} characters`,
  POST_NOT_FOUND:
    'The requested post could not be found. It may have been deleted or the ID is incorrect.',
  NOT_POST_OWNER: 'You can only modify posts that you have created',
  CANNOT_DELETE_PUBLISHED:
    'Cannot delete a published post. Unpublish it first.',
  DUPLICATE_TITLE: 'A post with this title already exists',
  INVALID_POST_STATUS: 'Invalid post status provided',
  INSUFFICIENT_PERMISSIONS:
    'You do not have the required permissions to perform this operation',
} as const

// Post success messages
export const POST_SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_PUBLISHED: 'Post published successfully',
  POST_UNPUBLISHED: 'Post unpublished successfully',
  VIEW_COUNT_INCREMENTED: 'Post view recorded',
} as const

// Post status enum
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

// Post ordering options
export const POST_ORDER_BY = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  VIEW_COUNT: 'viewCount',
  TITLE: 'title',
} as const

// Sort directions
export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type PostStatus = keyof typeof POST_STATUS
export type PostOrderBy = keyof typeof POST_ORDER_BY
export type SortDirection = keyof typeof SORT_DIRECTION
export type PostErrorMessage = keyof typeof POST_ERROR_MESSAGES
export type PostSuccessMessage = keyof typeof POST_SUCCESS_MESSAGES
