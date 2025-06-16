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
    users: rules.isAdmin,
    user: rules.isPublic,

    // Post-related queries
    feed: rules.isPublic,
    post: rules.isPublic, // Authorization handled by use case
    drafts: rules.isAuthenticatedUser, // User ownership checked in resolver

    // Node queries disabled in builder config
  },

  Mutation: {
    // Authentication mutations (public)
    login: rules.isPublic,
    signup: rules.rateLimitSensitiveOperations,

    // Post mutations
    createDraft: rules.canCreateDraft,
    updatePost: rules.isPostOwner,
    deletePost: rules.isPostOwner,
    togglePublishPost: rules.isPostOwner,
    incrementPostViewCount: rules.isPublic,
  },
}, {
  allowExternalErrors: true,
  debug: isDevelopment,
  fallbackRule: rules.isPublic,
  fallbackError: new AuthorizationError('Authorization failed'),
})