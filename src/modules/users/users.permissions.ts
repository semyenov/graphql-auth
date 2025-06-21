/**
 * Users Module Permissions
 *
 * Defines authorization rules and permission checks for user operations
 */

import { rule } from 'graphql-shield'
import { checkUserOwnership } from '../../app/auth/ownership.utils'
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '../../app/errors/types'
import { prisma } from '../../prisma'
import { parseAndValidateGlobalId } from '../../utils/relay'

/**
 * Check if user is viewing their own profile
 */
export const isSelf = rule({ cache: 'strict' })(
  async (_parent, args: { id?: string; userId?: string }, context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    const targetId = args.id || args.userId
    if (!targetId) return false

    try {
      return await checkUserOwnership(context.userId.value, targetId)
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return false
    }
  },
)

/**
 * Check if user can view another user's profile
 */
export const canViewProfile = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, _context) => {
    try {
      const userId = await parseAndValidateGlobalId(args.id, 'User')

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          status: true,
        },
      })

      if (!user) {
        return new NotFoundError('User', args.id)
      }

      // Banned users are not visible
      if (user.status === 'BANNED') {
        return new NotFoundError('User', args.id)
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid user ID')
    }
  },
)

/**
 * Check if user can edit another user's data
 */
export const canEditUser = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    try {
      // Users can edit their own data
      const isOwner = await checkUserOwnership(context.userId.value, args.id)
      if (isOwner) {
        return true
      }

      const targetUserId = await parseAndValidateGlobalId(args.id, 'User')

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

      return new AuthorizationError(
        'You do not have permission to edit this user',
      )
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid user ID')
    }
  },
)

/**
 * Check if user is blocked by target user
 */
export const notBlocked = rule({ cache: 'strict' })(
  async (_parent, args: { id: string }, context) => {
    if (!context.userId) return true // Anonymous users can't be blocked

    try {
      await parseAndValidateGlobalId(args.id, 'User')

      // NOTE: userBlock table doesn't exist yet
      // This would check if current user is blocked by target user
      // For now, allow all interactions

      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid user ID')
    }
  },
)

/**
 * Check if user can send messages
 */
export const canSendMessage = rule({ cache: 'strict' })(
  async (_parent, args: { recipientId: string }, context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in to send messages')
    }

    try {
      const recipientId = await parseAndValidateGlobalId(
        args.recipientId,
        'User',
      )

      // Can't message yourself
      if (recipientId === context.userId.value) {
        return new AuthorizationError('You cannot send messages to yourself')
      }

      // Check recipient's status
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
        select: {
          status: true,
        },
      })

      if (!recipient) {
        return new NotFoundError('User', args.recipientId)
      }

      if (recipient.status === 'BANNED') {
        return new AuthorizationError('Cannot send messages to this user')
      }

      // NOTE: Privacy settings and blocking functionality not yet implemented
      return true
    } catch (error) {
      if (error instanceof Error) {
        return error
      }
      return new Error('Invalid recipient ID')
    }
  },
)
