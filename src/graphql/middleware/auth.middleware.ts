/**
 * Authentication Middleware
 *
 * GraphQL middleware for handling authentication checks
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import { and, rule, shield } from 'graphql-shield'
import {
  AuthenticationError,
  AuthorizationError,
} from '../../core/errors/types'
import { isAuthenticated, requireAuthentication } from '../context/context.auth'
import type { Context } from '../context/context.types'

/**
 * Rule to check if user is authenticated
 */
export const isAuthenticatedRule = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    try {
      return isAuthenticated(context.userId)
    } catch (_error) {
      return new AuthenticationError(
        'You must be logged in to perform this action',
      )
    }
  },
)

/**
 * Rule to require authentication and throw error if not authenticated
 */
export const requireAuthenticationRule = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    try {
      requireAuthentication(context.userId)
      return true
    } catch (_error) {
      return new AuthenticationError(
        'You must be logged in to perform this action',
      )
    }
  },
)

/**
 * Rule to check if user owns the resource (for posts, comments, etc.)
 */
export const isResourceOwnerRule = rule({ cache: 'strict' })(
  async (_parent, _args, context: Context) => {
    try {
      requireAuthentication(context.userId)

      // This would need to be implemented based on the specific resource
      // For now, return true as a placeholder
      return true
    } catch (_error) {
      return new AuthorizationError('You can only access your own resources')
    }
  },
)

/**
 * Rule to check if user has admin role
 */
export const isAdminRule = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    try {
      requireAuthentication(context.userId)

      // Placeholder for admin check - would need to implement role system
      // For now, return false since we don't have admin roles implemented
      return new AuthorizationError('Admin access required')
    } catch (_error) {
      return new AuthenticationError('Authentication required for admin access')
    }
  },
)

/**
 * Combined authentication middleware using GraphQL Shield
 */
export const authMiddleware = shield(
  {
    Query: {
      me: requireAuthenticationRule,
      drafts: requireAuthenticationRule,
      // feed and searchUsers are public
    },
    Mutation: {
      createPost: requireAuthenticationRule,
      updatePost: and(requireAuthenticationRule, isResourceOwnerRule),
      deletePost: and(requireAuthenticationRule, isResourceOwnerRule),
      togglePublishPost: and(requireAuthenticationRule, isResourceOwnerRule),
      updateUserProfile: requireAuthenticationRule,
      // signup, login, refreshToken, logout are public or handle auth internally
    },
  },
  {
    allowExternalErrors: true,
    fallbackRule: rule()(async () => true), // Allow by default
  },
)

/**
 * Fallback error rule for unhandled cases
 */
export const fallbackErrorRule = rule()(
  async () => new AuthenticationError('Access denied'),
)
