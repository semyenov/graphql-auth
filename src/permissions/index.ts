import type { IRules } from 'graphql-shield'
import { allow, and, deny, not, or, rule, shield } from 'graphql-shield'
import type { Context } from '../context/types.d'
import { getUserId } from '../context/utils'
import { prisma } from '../prisma'

// =============================================================================
// SHIELD RULES
// =============================================================================

const rules = {
  // Authentication rule with contextual caching
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (_parent, _args, context: Context) => {
      const userId = getUserId(context)
      return userId ? true : new Error('User is not authenticated')
    }
  ),

  // Post ownership rule with strict caching based on post ID (for mutations/queries with id in args)
  isPostOwner: rule({
    cache: 'strict',
    fragment: 'fragment PostOwnershipCheck on Post { id authorId }'
  })(
    async (_parent, args: { id: string | number }, context: Context) => {
      if (!args.id) {
        return new Error('No post ID provided')
      }

      const userId = getUserId(context)
      if (!userId) {
        return new Error('User is not authenticated')
      }

      const post = await prisma.post.findUnique({
        where: {
          id: Number(args.id),
        },
        select: {
          id: true,
          authorId: true,
        }
      })

      if (!post) {
        return new Error('Post not found')
      }

      return Number(userId) === post.authorId
        ? true
        : new Error('User is not the owner of the post')
    }
  ),

  // Field-level post ownership rule (for field resolvers where parent contains post data)
  isPostOwnerField: rule({ cache: 'strict' })(
    (_parent: { authorId: number }, _args, context: Context) => {
      const userId = getUserId(context)
      if (!userId) {
        return new Error('User is not authenticated')
      }

      return Number(userId) === _parent.authorId
        ? true
        : new Error('User is not the owner of the post')
    }
  ),

  // Admin role rule (for future use)
  isAdmin: rule({ cache: 'contextual' })(
    (_parent, _args, context: Context) => {
      const userId = getUserId(context)
      if (!userId) {
        return new Error('User is not authenticated')
      }

      // Check if user has admin role from context
      const isAdmin = context.security.roles.includes('admin')
      return isAdmin ? true : new Error('User is not an admin')
    }
  ),

  // User can access their own data
  isOwnerOrAdmin: or(
    rule({ cache: 'contextual' })(
      async (_parent, args: { userUniqueInput: { id?: number; email?: string } }, context: Context) => {
        const userId = getUserId(context)
        if (!userId) {
          return new Error('User is not authenticated')
        }

        // Check if accessing own data
        if (args.userUniqueInput?.id) {
          return Number(userId) === args.userUniqueInput.id
            ? true
            : new Error('Can only access your own data')
        }

        if (args.userUniqueInput?.email) {
          return context.security.userEmail === args.userUniqueInput.email
            ? true
            : new Error('Can only access your own data')
        }

        return new Error('Invalid user identifier')
      }
    )
  ),
} satisfies IRules

// =============================================================================
// PERMISSION MIDDLEWARE
// =============================================================================

export const permissions = shield<any, Context, any>(
  {
    Query: {
      // Public queries
      feed: allow,
      allUsers: allow,

      // Protected queries
      me: rules.isAuthenticatedUser,
      draftsByUser: and(rules.isAuthenticatedUser, rules.isOwnerOrAdmin),
      postById: allow, // Posts are generally viewable, but drafts have field-level protection
    },

    Mutation: {
      // Authentication mutations (public)
      login: allow,
      signup: allow,

      // Protected mutations
      createDraft: rules.isAuthenticatedUser,
      deletePost: and(rules.isAuthenticatedUser, rules.isPostOwner),
      togglePublishPost: and(rules.isAuthenticatedUser, rules.isPostOwner),

      // Public mutations
      incrementPostViewCount: allow,
    },

    // Type-level permissions
    User: {
      // Basic fields are public
      id: allow,
      email: allow,
      name: allow,

      // Sensitive fields require authentication or ownership
      posts: rules.isAuthenticatedUser,
    },

    Post: {
      // Public fields
      id: allow,
      title: allow,
      published: allow,
      createdAt: allow,
      updatedAt: allow,
      viewCount: allow,
      author: allow,

      // Content is visible if post is published OR if user is the author
      content: or(
        // Content is visible if post is published
        rule({ cache: 'strict' })(
          (parent: { published: boolean }) => {
            return parent.published ? true : new Error('Draft content is private')
          }
        ),
        // Or if user is the author (for draft content)
        rules.isPostOwnerField
      ),
    },
  },
  {
    // Shield options
    allowExternalErrors: true,
    fallbackRule: deny,
    debug: process.env.NODE_ENV === 'development',
  }
)

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

// Export individual rules for potential reuse
export { rules }

// Export Shield utilities for external use
export { allow, and, deny, not, or, rule }

