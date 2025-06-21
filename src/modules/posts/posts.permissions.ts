/**
 * Posts Module Permissions
 *
 * Defines authorization rules and permission checks for post operations
 */

import { rule } from 'graphql-shield'
import {
  checkPostOwnership,
  requirePostOwnership,
} from '../../app/auth/ownership.utils'
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '../../app/errors/types'
import { prisma } from '../../prisma'
import { parseAndValidateGlobalId } from '../../utils/relay'

/**
 * Check if user owns the post
 */
export const isPostOwner = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    try {
      await requirePostOwnership(context.userId.value, args.id)
      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid post ID')
    }
  },
)

/**
 * Check if user can view the post
 */
export const canViewPost = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context) => {
    try {
      const postId = await parseAndValidateGlobalId(args.id, 'Post')

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
          published: true,
          authorId: true,
        },
      })

      if (!post) {
        return new NotFoundError('Post', args.id)
      }

      // Published posts are public
      if (post.published) return true

      // Draft posts can only be viewed by the author
      if (!context.userId) {
        return new AuthorizationError(
          'You must be logged in to view draft posts',
        )
      }

      if (post.authorId !== context.userId.value) {
        return new AuthorizationError('You can only view your own draft posts')
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid post ID')
    }
  },
)

/**
 * Check if user can moderate posts
 */
export const canModeratePost = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    // Check if user is moderator
    const user = await prisma.user.findUnique({
      where: { id: context.userId.value },
      select: { role: true },
    })

    if (user?.role === 'admin' || user?.role === 'moderator') {
      return true
    }

    // Otherwise, must be post owner
    try {
      return await checkPostOwnership(context.userId.value, args.id)
    } catch (error) {
      if (error instanceof Error) return error
      return new Error('Failed to check post ownership')
    }
  },
)

/**
 * Check if post is editable (time-based restriction)
 */
export const isPostEditable = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, _context) => {
    try {
      const postId = await parseAndValidateGlobalId(args.id, 'Post')

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
          createdAt: true,
          published: true,
        },
      })

      if (!post) {
        return new NotFoundError('Post', args.id)
      }

      // Draft posts are always editable
      if (!post.published) return true

      // Published posts can only be edited within 24 hours
      const hoursSinceCreation =
        (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60)
      if (hoursSinceCreation > 24) {
        return new AuthorizationError(
          'Published posts can only be edited within 24 hours of creation',
        )
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid post ID')
    }
  },
)

/**
 * Check if user has reached post creation limit
 */
export const withinPostLimit = rule({ cache: 'contextual' })(
  async (_parent, _args, context) => {
    if (!context.userId) return false

    // Check posts created in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const postCount = await prisma.post.count({
      where: {
        authorId: context.userId.value,
        createdAt: { gte: oneDayAgo },
      },
    })

    const MAX_POSTS_PER_DAY = 10
    if (postCount >= MAX_POSTS_PER_DAY) {
      return new AuthorizationError(
        `You can only create ${MAX_POSTS_PER_DAY} posts per day`,
      )
    }

    return true
  },
)
