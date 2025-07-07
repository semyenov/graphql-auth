/**
 * Post Module Shield Rules
 *
 * Authorization rules specific to post operations.
 */

import { rule } from 'graphql-shield'
import { AuthorizationError, NotFoundError } from '@/app/errors/types'
import type { DefaultContext } from '@/graphql/context/context.types'
import { prisma } from '@/modules/shared/database'
import { parseGlobalId } from '../shared/connections'

/**
 * Post ownership rule
 * Ensures the user owns the post they're trying to modify
 */
export const isPostOwner = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context: DefaultContext) => {
    if (!context.user) {
      throw new AuthorizationError('Authentication required')
    }

    // Decode the global ID
    let postId: number
    try {
      postId = parseGlobalId(args.id, 'Post')
    } catch (error) {
      throw new NotFoundError(`Post with identifier '${args.id}' not found`)
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    if (!post) {
      throw new NotFoundError(`Post with identifier '${args.id}' not found`)
    }

    if (post.authorId !== context.user.id) {
      throw new AuthorizationError(
        'You can only modify posts that you have created',
      )
    }

    return true
  },
)

/**
 * Can view post rule
 * Checks if user can view a specific post (published or own draft)
 */
export const canViewPost = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context: DefaultContext) => {
    // Decode the global ID
    const postId = parseGlobalId(args.id, 'Post')

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { published: true, authorId: true },
    })

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    // Published posts are viewable by all
    if (post.published) return true

    // Drafts only viewable by author
    if (!context.user || context.user.id !== post.authorId) {
      throw new AuthorizationError('Cannot view unpublished posts')
    }

    return true
  },
)

/**
 * Can increment view count
 * Only allow incrementing view count for published posts
 */
export const canIncrementViewCount = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, _context: DefaultContext) => {
    // Decode the global ID
    const postId = parseGlobalId(args.id, 'Post')

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { published: true },
    })

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    if (!post.published) {
      throw new AuthorizationError(
        'Cannot increment view count on unpublished posts',
      )
    }

    return true
  },
)
