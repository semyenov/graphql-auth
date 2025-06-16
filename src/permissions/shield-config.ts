import { shield } from 'graphql-shield'
import { isDevelopment } from '../environment'
import { AuthorizationError } from '../errors'
import * as rules from './rules-clean'

/**
 * GraphQL Shield permissions configuration
 * Maps GraphQL operations to permission rules
 */
export const permissions = shield({
  Query: {
    // User-related queries
    meDirect: rules.isAuthenticatedUser,
    userDirect: rules.isPublic,
    usersDirect: rules.isPublic,
    searchUsersDirect: rules.isPublic,

    // Post-related queries
    feedDirect: rules.isPublic,
    postDirect: rules.isPublic,
    draftsDirect: rules.isAuthenticatedUser,

    // Node queries disabled in builder config
  },

  Mutation: {
    // Authentication mutations (public)
    loginDirect: rules.isPublic,
    signupDirect: rules.rateLimitSensitiveOperations,
    loginWithTokens: rules.isPublic,
    loginWithTokensDirect: rules.isPublic,
    refreshToken: rules.isPublic,
    refreshTokenDirect: rules.isPublic,
    logout: rules.isAuthenticatedUser,
    logoutDirect: rules.isAuthenticatedUser,

    // Post mutations
    createPostDirect: rules.canCreateDraft,
    updatePostDirect: rules.isPostOwner,
    deletePostDirect: rules.isPostOwner,
    togglePublishPostDirect: rules.isPostOwner,
    incrementPostViewCountDirect: rules.isPublic,
    
    // User mutations
    updateUserProfile: rules.isAuthenticatedUser,
  },
}, {
  allowExternalErrors: true,
  debug: isDevelopment,
  fallbackRule: rules.isPublic,
  fallbackError: new AuthorizationError('Authorization failed'),
})