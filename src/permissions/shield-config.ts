import { shield } from 'graphql-shield'
import { isDevelopment } from '../environment'
import * as rules from './rules'
import { AuthorizationError } from '../errors'

/**
 * GraphQL Shield permissions configuration
 * Maps GraphQL operations to permission rules
 */
export const permissions = shield({
  Query: {
    // User-related queries
    me: rules.isAuthenticatedUser,
    allUsers: rules.isAdmin,

    // Post-related queries
    feed: rules.isPublic,
    postById: rules.isAuthenticatedUser,
    draftsByUser: rules.isUserOwner,
  },

  Mutation: {
    // Authentication mutations (public)
    login: rules.isPublic,
    signup: rules.rateLimitSensitiveOperations,

    // Post mutations
    createDraft: rules.canCreateDraft,
    deletePost: rules.isPostOwner,
    togglePublishPost: rules.isPostOwner,
    incrementPostViewCount: rules.isPublic,
  },
}, {
  allowExternalErrors: true,
  debug: isDevelopment,
  fallbackRule: rules.isPublic,
  fallbackError: new AuthorizationError('Access denied'),
})