/**
 * Users Module Permissions
 * 
 * Defines authorization rules and permission checks for user operations
 */

import { allow, rule, shield } from 'graphql-shield'
import type { Context } from '../../graphql/context/context.types'
import { parseAndValidateGlobalId } from '../../core/utils/relay'
import { AuthenticationError, AuthorizationError, NotFoundError } from '../../core/errors/types'
import { prisma } from '../../prisma'

/**
 * Check if user is authenticated
 */
export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    return !!context.userId
  }
)

/**
 * Check if user is viewing their own profile
 */
export const isSelf = rule({ cache: 'strict' })(
  async (_parent, args: { id?: string; userId?: string }, context: Context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    const targetId = args.id || args.userId
    if (!targetId) return false

    try {
      const userId = await parseAndValidateGlobalId(targetId, 'User')
      return userId === context.userId.value
    } catch {
      // If not a global ID, try parsing as number
      const userId = parseInt(targetId, 10)
      return userId === context.userId.value
    }
  }
)

/**
 * Check if user is admin
 */
export const isAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    if (!context.userId) return false

    const user = await prisma.user.findUnique({
      where: { id: context.userId.value },
      select: { role: true },
    })

    return user?.role === 'admin'
  }
)

/**
 * Check if user is moderator or admin
 */
export const isModerator = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    if (!context.userId) return false

    const user = await prisma.user.findUnique({
      where: { id: context.userId.value },
      select: { role: true },
    })

    return user?.role === 'admin' || user?.role === 'moderator'
  }
)

/**
 * Check if user can view another user's profile
 */
export const canViewProfile = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context: Context) => {
    try {
      const userId = await parseAndValidateGlobalId(args.id, 'User')

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          privacy: true,
          status: true,
        },
      })

      if (!user) {
        return new NotFoundError('User', args.id)
      }

      // Banned users are not visible
      if (user.status === 'banned') {
        return new NotFoundError('User', args.id)
      }

      // Check privacy settings
      if (user.privacy?.showProfile === false) {
        // Only the user themselves or admins can view private profiles
        if (!context.userId) {
          return new AuthorizationError('This profile is private')
        }

        if (context.userId.value !== userId) {
          const viewer = await prisma.user.findUnique({
            where: { id: context.userId.value },
            select: { role: true },
          })

          if (viewer?.role !== 'admin') {
            return new AuthorizationError('This profile is private')
          }
        }
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid user ID')
    }
  }
)

/**
 * Check if user can edit another user's data
 */
export const canEditUser = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context: Context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    try {
      const targetUserId = await parseAndValidateGlobalId(args.id, 'User')

      // Users can edit their own data
      if (targetUserId === context.userId.value) {
        return true
      }

      // Check if user is admin or moderator
      const user = await prisma.user.findUnique({
        where: { id: context.userId.value },
        select: { role: true },
      })

      if (user?.role === 'admin') {
        return true
      }

      if (user?.role === 'moderator') {
        // Moderators can edit regular users
        const targetUser = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { role: true },
        })

        if (targetUser?.role === 'user') {
          return true
        }
      }

      return new AuthorizationError('You do not have permission to edit this user')
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid user ID')
    }
  }
)

/**
 * Check if user is blocked by target user
 */
export const notBlocked = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context: Context) => {
    if (!context.userId) return true // Anonymous users can't be blocked

    try {
      const targetUserId = await parseAndValidateGlobalId(args.id, 'User')

      // Check if current user is blocked by target user
      const block = await prisma.userBlock.findFirst({
        where: {
          blockerId: targetUserId,
          blockedId: context.userId.value,
        },
      })

      if (block) {
        return new AuthorizationError('You cannot interact with this user')
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid user ID')
    }
  }
)

/**
 * Check if user can send messages
 */
export const canSendMessage = rule({ cache: 'strict' })(
  async (_parent, args: { recipientId: string }, context: Context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in to send messages')
    }

    try {
      const recipientId = await parseAndValidateGlobalId(args.recipientId, 'User')

      // Can't message yourself
      if (recipientId === context.userId.value) {
        return new AuthorizationError('You cannot send messages to yourself')
      }

      // Check recipient's privacy settings
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
        select: {
          privacy: true,
          status: true,
        },
      })

      if (!recipient) {
        return new NotFoundError('User', args.recipientId)
      }

      if (recipient.status === 'banned') {
        return new AuthorizationError('Cannot send messages to this user')
      }

      if (recipient.privacy?.allowMessages === false) {
        return new AuthorizationError('This user does not accept messages')
      }

      // Check if blocked
      return notBlocked.resolve(_parent, { id: args.recipientId }, context)
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid recipient ID')
    }
  }
)

/**
 * Users module permissions configuration
 */
export const usersPermissions = {
  Query: {
    // Public queries
    searchUsers: allow,
    user: canViewProfile,
    userByUsername: allow,

    // Authenticated queries
    suggestedUsers: isAuthenticated,
    blockedUsers: isAuthenticated,
    following: allow,
    followers: allow,
  },
  Mutation: {
    // Profile management
    updateUserProfile: rule()(async (parent, args, context) => {
      return canEditUser.resolve(parent, { id: context.userId?.value.toString() || '' }, context)
    }),
    updateUserPreferences: isAuthenticated,
    uploadAvatar: isAuthenticated,
    deleteAvatar: isAuthenticated,

    // Social features
    followUser: isAuthenticated,
    unfollowUser: isAuthenticated,
    blockUser: isAuthenticated,
    unblockUser: isAuthenticated,

    // Messaging
    sendMessage: canSendMessage,

    // Reporting
    reportUser: isAuthenticated,

    // Admin operations
    updateUserRole: isAdmin,
    updateUserStatus: isModerator,
    deleteUser: isAdmin,
    impersonateUser: isAdmin,
  },
  User: {
    // Public fields
    id: allow,
    name: allow,
    username: allow,
    avatar: allow,
    bio: allow,
    createdAt: allow,

    // Private fields
    email: rule()(async (parent: any, args, context) => {
      // User can see their own email
      if (context.userId?.value === parent.id) return true

      // Check privacy settings
      if (parent.privacy?.showEmail === false) {
        return null
      }

      return true
    }),

    // Stats (visible based on privacy)
    postsCount: allow,
    followersCount: allow,
    followingCount: allow,

    // Private data
    role: isSelf,
    status: isSelf,
    preferences: isSelf,
    privacy: isSelf,
    sessions: isSelf,
    twoFactorEnabled: isSelf,
  },
}

/**
 * Create users shield middleware
 */
export const createUsersShield = () => shield(usersPermissions, {
  allowExternalErrors: true,
  fallbackError: new AuthorizationError('Not authorized to perform this action'),
})