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
    me: rules.isAuthenticatedUser,
    meDirect: rules.isAuthenticatedUser,
    users: rules.isAdmin,
    user: rules.isPublic,
    userDirect: rules.isPublic,
    usersDirect: rules.isPublic,
    searchUsers: rules.isPublic,
    searchUsersDirect: rules.isPublic,

    // Post-related queries
    feed: rules.isPublic,
    feedDirect: rules.isPublic,
    post: rules.isPublic,
    postDirect: rules.isPublic,
    drafts: rules.isAuthenticatedUser,
    draftsDirect: rules.isAuthenticatedUser,

    // Node queries disabled in builder config
  },

  Mutation: {
    // Authentication mutations (public)
    login: rules.isPublic,
    loginDirect: rules.isPublic,
    signup: rules.rateLimitSensitiveOperations,
    signupDirect: rules.rateLimitSensitiveOperations,
    loginWithTokens: rules.isPublic,
    refreshToken: rules.isPublic,
    logout: rules.isAuthenticatedUser,

    // Post mutations
    createDraft: rules.canCreateDraft,
    createPostDirect: rules.canCreateDraft,
    updatePost: rules.isPostOwner,
    updatePostDirect: rules.isPostOwner,
    deletePost: rules.isPostOwner,
    deletePostDirect: rules.isPostOwner,
    togglePublishPost: rules.isPostOwner,
    togglePublishPostDirect: rules.isPostOwner,
    incrementPostViewCount: rules.isPublic,
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