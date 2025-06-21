/**
 * Authentication Module Permissions
 *
 * Defines authorization rules and permission checks for authentication operations
 */

import { rule } from 'graphql-shield'
import { AuthenticationError, AuthorizationError } from '../../app/errors/types'
import type { IContext } from '../../graphql/context/context.types'

/**
 * Check if user owns the account
 */
export const isAccountOwner = rule({ cache: 'strict' })(
  async (_parent, args: { userId: string }, context: IContext) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    const targetUserId = Number.parseInt(args.userId, 10)
    if (context.userId.value !== targetUserId) {
      return new AuthorizationError('You can only modify your own account')
    }

    return true
  },
)
