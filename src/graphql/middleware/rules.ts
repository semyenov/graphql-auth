import { and, not, or, rule } from 'graphql-shield'
import { ERROR_MESSAGES } from '../../constants'
import { AuthorizationError, NotFoundError } from '../../core/errors/types'
import { prisma } from '../../prisma'
import { requireAuthentication } from '../context/context.auth'
import type { Context } from '../context/context.types'
import {
  createAuthenticationCheck,
  createPermissionCheck,
  createRoleCheck,
  handleRuleError,
  parseAndValidateGlobalId,
  validateResourceId,
} from './rule-utils'

/**
 * Basic authentication rule
 * Ensures the user is authenticated
 */
export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  (_parent, _args, context) => createAuthenticationCheck(context),
)

/**
 * Post ownership rule
 * Ensures the user owns the post they're trying to modify
 */
export const isPostOwner = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context: Context) => {
    try {
      // Validate the post ID
      validateResourceId(args.id, 'post')

      // Ensure user is authenticated
      const userId = requireAuthentication(context.userId)

      // Parse the global ID
      const postId = await parseAndValidateGlobalId(args.id, 'Post')

      // Check post ownership directly through Prisma
      // We can't use the GetPostUseCase here because it enforces viewing permissions
      // which would prevent checking ownership of unpublished posts
      const post = await prisma.post.findUnique({
        where: { id: postId },
      })

      if (!post) {
        throw new NotFoundError('Post', args.id)
      }

      if (post.authorId !== userId.value) {
        throw new AuthorizationError(ERROR_MESSAGES.NOT_POST_OWNER)
      }

      return true
    } catch (error) {
      return handleRuleError(error)
    }
  },
)

/**
 * User ownership rule
 * Ensures users can only access their own data
 */
export const isUserOwner = rule({ cache: 'strict' })(
  async (
    _parent,
    args: {
      userUniqueInput?: { id?: number; email?: string }
      userId?: string
    },
    context: Context,
  ) => {
    try {
      const currentUserId = requireAuthentication(context.userId)

      // Handle drafts query with userId parameter
      if (args.userId) {
        const requestedUserId = await parseAndValidateGlobalId(
          args.userId,
          'User',
        )
        if (requestedUserId !== currentUserId.value) {
          throw new AuthorizationError('You can only access your own drafts')
        }
        return true
      }

      // Handle other queries with userUniqueInput
      if (
        args.userUniqueInput?.id &&
        args.userUniqueInput.id !== Number.parseInt(currentUserId.toString())
      ) {
        throw new AuthorizationError(
          "Access denied: cannot access other user's data",
        )
      }

      return true
    } catch (error) {
      return handleRuleError(error)
    }
  },
)

/**
 * Admin role rule
 * Ensures the user has admin privileges
 */
export const isAdmin = rule({ cache: 'contextual' })(
  (_parent, _args, context) => createRoleCheck(context, 'admin'),
)

/**
 * Moderator rule
 * Ensures the user has moderator or admin privileges
 */
export const isModerator = rule({ cache: 'contextual' })(
  (_parent, _args, context) => {
    // Check for either moderator or admin role
    const moderatorCheck = createRoleCheck(
      context,
      'moderator',
      'Moderator privileges required',
    )
    if (moderatorCheck === true) return true

    const adminCheck = createRoleCheck(
      context,
      'admin',
      'Moderator privileges required',
    )
    if (adminCheck === true) return true

    return moderatorCheck // Return the first error
  },
)

/**
 * Rate limiting rule
 * Checks rate limits for sensitive operations using the rate limiter service
 */
export const rateLimitSensitiveOperations = rule({ cache: 'no_cache' })(
  async (_parent, _args, context: Context) => {
    try {
      // Note: Rate limiting is handled at the middleware level in this application
      // This rule serves as an additional check for sensitive operations
      // The actual rate limiting configuration is in src/app/middleware/rate-limiting.ts

      // Could be used to implement additional per-user rate limiting:
      // const identifier = context.userId?.value.toString() || context.req?.ip || 'anonymous'

      return true
    } catch (error) {
      return handleRuleError(error)
    }
  },
)

/**
 * Create post permission rule
 * Ensures the user has permission to create posts
 */
export const hasCreatePostPermission = rule({ cache: 'contextual' })(
  (_parent, _args, context) =>
    createPermissionCheck(
      context,
      'write:posts',
      'Permission denied: cannot create posts',
    ),
)

/**
 * Create draft permission rule
 * Ensures the user can create draft posts
 */
export const canCreateDraft = rule({ cache: 'contextual' })(
  (_parent, _args, context) => createAuthenticationCheck(context),
)

/**
 * Public access rule
 * Allows unrestricted access
 */
export const isPublic = rule()(() => true)

// Export logical operators for use in resolvers
export { and, or, not }
