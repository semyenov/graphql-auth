import { shield } from 'graphql-shield'
import { Context } from '../../context/context-direct'
import { isDevelopment } from '../../app/config/environment'
import { AuthorizationError } from '../../errors'
import * as rules from './rules-clean'

/**
 * GraphQL Shield permissions configuration
 * Maps GraphQL operations to permission rules
 */
export const permissions = shield<any, Context, any>({
  Query: {
    // User-related queries
    me: rules.isAuthenticatedUser,
    user: rules.isPublic,
    users: rules.isPublic,
    searchUsers: rules.isPublic,

    // Post-related queries
    feed: rules.isPublic,
    post: rules.isPublic,
    drafts: rules.isAuthenticatedUser,

    // Node queries disabled in builder config
  },

  Mutation: {
    // Authentication mutations (public)
    login: rules.isPublic,
    signup: rules.rateLimitSensitiveOperations,
    loginWithTokens: rules.isPublic,
    refreshToken: rules.isPublic,
    logout: rules.isAuthenticatedUser,

    // Post mutations
    createPost: rules.canCreateDraft,
    updatePost: rules.isPostOwner,
    deletePost: rules.isPostOwner,
    togglePublishPost: rules.isPostOwner,
    incrementPostViewCount: rules.isPublic,

    // User mutations
    updateUserProfile: rules.isAuthenticatedUser,
  },
}, {
  allowExternalErrors: true,
  debug: isDevelopment,
  fallbackRule: rules.isPublic,
  fallbackError: new AuthorizationError('Authorization failed'),
})