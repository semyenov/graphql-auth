import { rule } from 'graphql-shield'
import { ERROR_MESSAGES } from '../constants'
import { Context, requireAuthentication } from '../context'
import { AuthorizationError, NotFoundError } from '../errors'
import {
  checkPostOwnership,
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
  (_parent, _args, context: Context) => createAuthenticationCheck(context)
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
      const userId = requireAuthentication(context)
      
      // Parse the global ID
      const postId = await parseAndValidateGlobalId(args.id, 'Post')

      // Check ownership
      const ownership = await checkPostOwnership(postId, userId)

      if (!ownership.resourceExists) {
        throw new NotFoundError('Post', args.id)
      }

      if (!ownership.isOwner) {
        throw new AuthorizationError(ERROR_MESSAGES.NOT_POST_OWNER)
      }

      return true
    } catch (error) {
      return handleRuleError(error)
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
      return handleRuleError(error)
    }
  }
)

/**
 * Admin role rule
 * Ensures the user has admin privileges
 */
export const isAdmin = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => createRoleCheck(context, 'admin')
)

/**
 * Moderator rule
 * Ensures the user has moderator or admin privileges
 */
export const isModerator = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    // Check for either moderator or admin role
    const moderatorCheck = createRoleCheck(context, 'moderator', 'Moderator privileges required')
    if (moderatorCheck === true) return true
    
    const adminCheck = createRoleCheck(context, 'admin', 'Moderator privileges required')
    if (adminCheck === true) return true
    
    return moderatorCheck // Return the first error
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
  (_parent, _args, context: Context) => 
    createPermissionCheck(context, 'write:posts', 'Permission denied: cannot create posts')
)

/**
 * Create draft permission rule
 * Ensures the user can create draft posts
 */
export const canCreateDraft = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => createAuthenticationCheck(context)
)

/**
 * Public access rule
 * Allows unrestricted access
 */
export const isPublic = rule()(() => true)