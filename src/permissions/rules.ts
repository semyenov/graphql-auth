import { rule } from 'graphql-shield'
import { ERROR_MESSAGES } from '../constants'
import {
  Context,
  hasPermission,
  hasRole,
  isAuthenticated,
  requireAuthentication,
} from '../context'
import { AuthenticationError, AuthorizationError, NotFoundError, ValidationError } from '../errors'
import { prisma } from '../prisma'

/**
 * Basic authentication rule
 * Ensures the user is authenticated
 */
export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    return isAuthenticated(context)
      ? true
      : new AuthenticationError()
  }
)

/**
 * Post ownership rule
 * Ensures the user owns the post they're trying to modify
 */
export const isPostOwner = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context: Context) => {
    try {
      if (!args.id || typeof args.id !== 'string') {
        throw new ValidationError(['Valid post ID is required'])
      }

      const userId = requireAuthentication(context)
      
      // Parse the global ID to get numeric ID
      const { parseGlobalID } = await import('../schema/utils')
      const { id: postId } = parseGlobalID(args.id, 'Post')

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, title: true }
      })

      if (!post) {
        throw new NotFoundError('Post', args.id)
      }

      if (post.authorId !== userId) {
        throw new AuthorizationError(ERROR_MESSAGES.NOT_POST_OWNER)
      }

      return true
    } catch (error) {
      return error instanceof Error ? error : new AuthorizationError('Authorization failed')
    }
  }
)

/**
 * User ownership rule
 * Ensures users can only access their own data
 */
export const isUserOwner = rule({ cache: 'strict' })(
  (_parent, args: { userUniqueInput?: { id?: number; email?: string } }, context: Context) => {
    try {
      const userId = requireAuthentication(context)

      if (args.userUniqueInput?.id && args.userUniqueInput.id !== userId) {
        throw new AuthorizationError('Access denied: cannot access other user\'s data')
      }

      return true
    } catch (error) {
      return error instanceof Error ? error : new AuthorizationError('Authorization failed')
    }
  }
)

/**
 * Admin role rule
 * Ensures the user has admin privileges
 */
export const isAdmin = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new AuthenticationError()
    }

    if (!hasRole(context, 'admin')) {
      return new AuthorizationError('Admin privileges required')
    }

    return true
  }
)

/**
 * Moderator rule
 * Ensures the user has moderator or admin privileges
 */
export const isModerator = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new AuthenticationError()
    }

    if (!hasRole(context, 'moderator') && !hasRole(context, 'admin')) {
      return new AuthorizationError('Moderator privileges required')
    }

    return true
  }
)

/**
 * Rate limiting rule
 * Placeholder for rate limiting implementation
 */
export const rateLimitSensitiveOperations = rule({ cache: 'no_cache' })(
  async (_parent, _args, _context: Context) => {
    // TODO: Implement actual rate limiting
    // This would check against a rate limiting store (Redis, etc.)
    // const userId = getUserId(_context)
    // const ip = _context.metadata.ip
    // const key = `rate_limit:${userId || ip}`
    // const attempts = await rateLimitStore.increment(key)
    // if (attempts > RATE_LIMIT.MAX_REQUESTS.AUTH) {
    //   throw new RateLimitError()
    // }
    return true
  }
)

/**
 * Create post permission rule
 * Ensures the user has permission to create posts
 */
export const hasCreatePostPermission = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new AuthenticationError()
    }

    if (!hasPermission(context, 'write:posts')) {
      return new AuthorizationError('Permission denied: cannot create posts')
    }

    return true
  }
)

/**
 * Create draft permission rule
 * Ensures the user can create draft posts
 */
export const canCreateDraft = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new AuthenticationError()
    }

    return true
  }
)

/**
 * Public access rule
 * Allows unrestricted access
 */
export const isPublic = rule()(() => true)