/**
 * Authentication Module Permissions
 *
 * Defines authorization rules and permission checks for authentication operations
 */

import { allow, rule, shield } from 'graphql-shield'
import { AuthenticationError, AuthorizationError } from '../../app/errors/types'
import type { IContext } from '../../graphql/context/context.types'
import {
  isAdmin,
  isAuthenticated,
  isModerator,
  isNotAuthenticated,
} from '../../graphql/middleware/shared-rules'

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

/**
 * Auth module permissions configuration
 */
export const authPermissions = {
  Query: {
    me: isAuthenticated,
    sessions: isAuthenticated,
    authStatus: allow,
  },
  Mutation: {
    // Public auth operations
    signup: isNotAuthenticated,
    login: isNotAuthenticated,
    loginWithTokens: isNotAuthenticated,
    forgotPassword: isNotAuthenticated,
    resetPassword: isNotAuthenticated,

    // Authenticated operations
    logout: isAuthenticated,
    refreshToken: allow, // Handled by token validation
    updateProfile: isAuthenticated,
    changePassword: isAuthenticated,
    deleteAccount: isAuthenticated,

    // Email verification
    sendVerificationEmail: isAuthenticated,
    verifyEmail: allow, // Token-based

    // Two-factor auth
    enableTwoFactor: isAuthenticated,
    disableTwoFactor: isAuthenticated,
    verifyTwoFactor: allow, // During login

    // Session management
    revokeSession: isAuthenticated,
    revokeAllSessions: isAuthenticated,

    // Admin operations
    updateUserRole: isAdmin,
    suspendUser: isModerator,
    banUser: isAdmin,
  },
  User: {
    // Sensitive fields
    email: isAccountOwner,
    sessions: isAccountOwner,
    permissions: isAccountOwner,
    twoFactorEnabled: isAccountOwner,
  },
}

/**
 * Create auth shield middleware
 */
export const createAuthShield = () =>
  shield(authPermissions, {
    allowExternalErrors: true,
    fallbackError: new AuthorizationError('Not authorized'),
  })
