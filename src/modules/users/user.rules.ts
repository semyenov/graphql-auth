/**
 * User Module Shield Rules
 *
 * Authorization rules specific to user operations.
 */

import { rule } from 'graphql-shield'
import { AuthorizationError } from '@/app/errors/types'
import type { DefaultContext } from '@/graphql/context/context.types'

/**
 * Own profile rule
 * Ensures users can only modify their own profile
 */
export const isOwnProfile = rule({ cache: 'contextual' })(
  async (_parent, args: { id?: number | string }, context: DefaultContext) => {
    if (!context.user) {
      throw new AuthorizationError('Authentication required')
    }

    // If no ID provided, assume it's the current user
    if (!args.id) return true

    // Parse ID if it's a string (global ID)
    const userId =
      typeof args.id === 'string'
        ? parseInt(args.id.replace(/^User:/, ''))
        : args.id

    if (userId !== context.user.id) {
      throw new AuthorizationError('You can only modify your own profile')
    }

    return true
  },
)

/**
 * Can view user profile
 * Public profiles are viewable by all, private profiles only by owner
 */
export const canViewUserProfile = rule({ cache: 'contextual' })(
  async (_parent, _args, _context: DefaultContext) => {
    // In a real app, you might check profile privacy settings
    // For now, all profiles are public
    return true
  },
)

/**
 * Can search users
 * Might want to restrict this to authenticated users in production
 */
export const canSearchUsers = rule({ cache: 'no_cache' })(
  async (_parent, _args, _context: DefaultContext) => {
    // For now, allow all users to search
    // In production, you might want to restrict this
    return true
  },
)
