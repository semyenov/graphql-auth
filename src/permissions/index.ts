import { IRules, rule, shield } from 'graphql-shield'
import {
  Context,
  GraphQLMutation,
  GraphQLQuery,
  hasPermission,
  hasRole,
  isAuthenticated,
  isCreateDraftContext,
  requireAuthentication,
  TypedContext
} from '../context'
import { prisma } from '../prisma'
import { getUserId } from '../utils'

// Enhanced permission rules with better type safety
const rules = {
  // Basic authentication rule
  isAuthenticatedUser: rule({ cache: 'contextual' })((_parent, _args, context: Context) => {
    return isAuthenticated(context) ? true : new Error('User is not authenticated')
  }),

  // Enhanced post ownership rule with better error handling
  isPostOwner: rule({ cache: 'strict' })(async (_parent, args: { id: number }, context: Context) => {
    try {
      if (!args.id || typeof args.id !== 'number') {
        return new Error('Valid post ID is required')
      }

      const userId = requireAuthentication(context)

      const post = await prisma.post.findUnique({
        where: { id: args.id },
        select: { authorId: true, title: true }
      })

      if (!post) {
        return new Error('Post not found')
      }

      if (post.authorId !== userId) {
        return new Error('User is not the owner of the post')
      }

      return true
    } catch (error) {
      return error instanceof Error ? error : new Error('Authorization failed')
    }
  }),

  // User ownership rule for accessing user-specific data
  isUserOwner: rule({ cache: 'strict' })((_parent, args: { userUniqueInput?: { id?: number; email?: string } }, context: Context) => {
    try {
      const userId = requireAuthentication(context)

      if (args.userUniqueInput?.id && args.userUniqueInput.id !== userId) {
        return new Error('Access denied: cannot access other user\'s data')
      }

      return true
    } catch (error) {
      return error instanceof Error ? error : new Error('Authorization failed')
    }
  }),

  // Admin role rule (placeholder for future admin functionality)
  isAdmin: rule({ cache: 'contextual' })((_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new Error('Authentication required')
    }

    if (!hasRole(context, 'admin')) {
      return new Error('Admin privileges required')
    }

    return true
  }),

  // Moderator rule for content moderation
  isModerator: rule({ cache: 'contextual' })((_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new Error('Authentication required')
    }

    if (!hasRole(context, 'moderator') && !hasRole(context, 'admin')) {
      return new Error('Moderator privileges required')
    }

    return true
  }),

  // Rate limiting rule for sensitive operations
  rateLimitSensitiveOperations: rule({ cache: 'no_cache' })(async (_parent, _args, _context: Context) => {
    // This is a placeholder for rate limiting logic
    // In a real application, you'd check against a rate limiting store
    // const userId = getUserId(_context)
    // const ip = _context.metadata.ip

    // For now, just return true, but you could implement actual rate limiting here
    return true
  }),

  // Permission-based rule for fine-grained access control
  hasCreatePostPermission: rule({ cache: 'contextual' })((_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new Error('Authentication required')
    }

    if (!hasPermission(context, 'create:post')) {
      return new Error('Permission denied: cannot create posts')
    }

    return true
  }),

  // Context-aware rule for create draft operations
  canCreateDraft: rule({ cache: 'contextual' })((_parent, _args, context: Context) => {
    if (!isAuthenticated(context)) {
      return new Error('Authentication required')
    }

    // Additional business logic for draft creation
    // For example, check if user has reached their draft limit
    if (isCreateDraftContext(context)) {
      // Specific validation for create draft context
      return true
    }

    return true
  }),
} satisfies IRules

// Enhanced permissions schema with comprehensive coverage
export const permissions = shield<GraphQLQuery & GraphQLMutation, Context, TypedContext>({
  Query: {
    // User-related queries
    me: rules.isAuthenticatedUser,
    allUsers: rules.isAdmin, // Only admins can see all users

    // Post-related queries
    feed: rule()(() => true), // Public access to published posts
    postById: rules.isAuthenticatedUser, // Authenticated users can view individual posts
    draftsByUser: rules.isUserOwner, // Users can only see their own drafts
  },

  Mutation: {
    // Authentication mutations (public)
    login: rule()(() => true),
    signup: rules.rateLimitSensitiveOperations, // Rate limit signups

    // Post mutations
    createDraft: rules.canCreateDraft,
    deletePost: rules.isPostOwner,
    togglePublishPost: rules.isPostOwner,
    incrementPostViewCount: rule()(() => true), // Public operation for analytics
  },
}, {
  allowExternalErrors: true,
  debug: process.env.NODE_ENV === 'development',
  fallbackRule: rule({ cache: 'no_cache' })((_parent, _args, context: Context) => {
    // Default fallback: require authentication for any unspecified operation
    return isAuthenticated(context) ? true : new Error('Authentication required for this operation')
  })
})

// Permission utility functions for use in resolvers
export const PermissionUtils = {
  // Check if user can access specific user data
  canAccessUserData: (context: Context, targetUserId: number): boolean => {
    const currentUserId = getUserId(context)
    return currentUserId === targetUserId || hasRole(context, 'admin')
  },

  // Check if user can modify specific post
  canModifyPost: async (context: Context, postId: number): Promise<boolean> => {
    try {
      const userId = requireAuthentication(context)

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true }
      })

      return post?.authorId === userId || hasRole(context, 'admin')
    } catch {
      return false
    }
  },

  // Check if user can publish posts
  canPublishPost: (context: Context): boolean => {
    return isAuthenticated(context) &&
      (hasPermission(context, 'publish:post') || hasRole(context, 'admin'))
  },

  // Enhanced role checking with inheritance
  hasRoleOrHigher: (context: Context, role: 'user' | 'moderator' | 'admin'): boolean => {
    const roleHierarchy = { user: 0, moderator: 1, admin: 2 }
    const requiredLevel = roleHierarchy[role]

    for (const [userRole, level] of Object.entries(roleHierarchy)) {
      if (hasRole(context, userRole) && level >= requiredLevel) {
        return true
      }
    }

    return false
  },

  // Operation-specific permission checks
  validateOperation: (context: Context, operation: string): boolean => {
    switch (operation) {
      case 'createPost':
        return isAuthenticated(context)
      case 'deletePost':
      case 'editPost':
        return isAuthenticated(context) // Additional checks done in resolvers
      case 'viewUserProfiles':
        return hasRoleOrHigher(context, 'moderator')
      case 'manageUsers':
        return hasRole(context, 'admin')
      default:
        return false
    }
  }
}

// Helper function to extract the validateOperation method
const { hasRoleOrHigher } = PermissionUtils

// Export individual rules for use in custom resolvers
export { rules }

// Export types for external use
export type PermissionRule = typeof rules[keyof typeof rules]
export type PermissionRuleName = keyof typeof rules
