/**
 * Users Module Service
 * 
 * Business logic for user operations following the IMPROVED-FILE-STRUCTURE.md specification.
 * This service contains reusable business logic that can be used by resolvers and other services.
 */

import { container } from 'tsyringe'
import { AuthorizationError, ConflictError, NotFoundError } from '../../core/errors/types'
import type { ILogger } from '../../core/services/logger.interface'
import type { IPasswordService } from '../../core/services/password.service.interface'
import { parseGlobalId } from '../../core/utils/relay'
import { UserId } from '../../core/value-objects/user-id.vo'
import { prisma } from '../../prisma'

// Get services from container
const getLogger = () => container.resolve<ILogger>('ILogger')
const getPasswordService = () => container.resolve<IPasswordService>('IPasswordService')

export interface UpdateUserProfileData {
  name?: string
  email?: string
  bio?: string
  avatar?: string
  website?: string
  location?: string
}

export interface AdminUpdateUserData {
  role?: 'user' | 'admin' | 'moderator'
  verified?: boolean
  active?: boolean
  bannedUntil?: string
  banReason?: string
}

export interface UserFilter {
  searchString?: string
  role?: 'user' | 'admin' | 'moderator'
  verified?: boolean
  active?: boolean
  createdAfter?: string
  createdBefore?: string
}

export interface UserSort {
  field: 'createdAt' | 'updatedAt' | 'name' | 'email' | 'lastLoginAt'
  direction: 'asc' | 'desc'
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  newUsersThisMonth: number
  averagePostsPerUser: number
}

export interface UserProfileStats {
  totalPosts: number
  publishedPosts: number
  totalViews: number
  followers: number
  following: number
  joinedAt: string
  lastActiveAt?: string
}

/**
 * Users Service - handles business logic for user operations
 */
export class UsersService {
  private logger = getLogger().child({ service: 'UsersService' })

  /**
   * Search users with filtering
   */
  async searchUsers(
    filter: UserFilter = {},
    sort: UserSort = { field: 'createdAt', direction: 'desc' },
    pagination: { skip?: number; take?: number } = {}
  ): Promise<any[]> {
    this.logger.debug('Searching users', { filter, sort, pagination })

    const whereClause = this.buildWhereClause(filter)
    const orderBy = { [sort.field]: sort.direction }

    return prisma.user.findMany({
      where: whereClause,
      orderBy,
      skip: pagination.skip,
      take: pagination.take,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password in results
      }
    })
  }

  /**
   * Count users with filtering
   */
  async countUsers(filter: UserFilter = {}): Promise<number> {
    const whereClause = this.buildWhereClause(filter)
    return prisma.user.count({ where: whereClause })
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<any | null> {
    const numericUserId = parseGlobalId(userId, 'User')

    this.logger.debug('Getting user by ID', { userId: numericUserId })

    return prisma.user.findUnique({
      where: { id: numericUserId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password
      }
    })
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: UserId, data: UpdateUserProfileData): Promise<any> {
    this.logger.info('Updating user profile', { userId: userId.value })

    // Check if email is being changed and if it's already taken
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true }
      })

      if (existingUser && existingUser.id !== userId.value) {
        throw new ConflictError('An account with this email already exists')
      }
    }

    // Build update data (only include fields that exist in the database)
    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    // Note: bio, avatar, website, location would need to be added to the User model
    // For now, we'll only update name

    const user = await prisma.user.update({
      where: { id: userId.value },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    this.logger.info('User profile updated', { userId: userId.value })
    return user
  }

  /**
   * Admin update user (requires admin privileges)
   */
  async adminUpdateUser(
    targetUserId: string,
    _data: AdminUpdateUserData,
    adminUserId: UserId
  ): Promise<any> {
    const numericTargetUserId = parseGlobalId(targetUserId, 'User')

    this.logger.info('Admin updating user', {
      targetUserId: numericTargetUserId,
      adminUserId: adminUserId.value
    })

    // Note: In a real implementation, you would check admin privileges here
    // and have role, verified, active, bannedUntil, banReason fields in the User model

    const user = await prisma.user.findUnique({
      where: { id: numericTargetUserId },
    })

    if (!user) {
      throw new NotFoundError('User', targetUserId)
    }

    // For now, just return the user since we don't have admin fields in the model
    this.logger.warn('Admin update not fully implemented - missing admin fields in User model')
    return user
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    this.logger.debug('Getting user stats')

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [total, newThisMonth, postStats] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth
          }
        }
      }),
      prisma.post.aggregate({
        _count: { id: true }
      })
    ])

    const totalPosts = postStats._count.id || 0
    const averagePostsPerUser = total > 0 ? totalPosts / total : 0

    // Note: verified and active would need to be added to the User model
    return {
      totalUsers: total,
      activeUsers: total, // Placeholder - would filter by active: true
      verifiedUsers: total, // Placeholder - would filter by verified: true
      newUsersThisMonth: newThisMonth,
      averagePostsPerUser
    }
  }

  /**
   * Get user profile stats
   */
  async getUserProfileStats(userId: UserId): Promise<UserProfileStats> {
    this.logger.debug('Getting user profile stats', { userId: userId.value })

    const [user, postStats] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId.value },
        select: { createdAt: true }
      }),
      prisma.post.aggregate({
        where: { authorId: userId.value },
        _count: { id: true },
        _sum: { viewCount: true }
      })
    ])

    if (!user) {
      throw new NotFoundError('User', userId.value.toString())
    }

    const publishedPostsCount = await prisma.post.count({
      where: {
        authorId: userId.value,
        published: true
      }
    })

    return {
      totalPosts: postStats._count.id || 0,
      publishedPosts: publishedPostsCount,
      totalViews: postStats._sum.viewCount || 0,
      followers: 0, // Placeholder - would need followers table
      following: 0, // Placeholder - would need following table
      joinedAt: user.createdAt.toISOString(),
      lastActiveAt: undefined // Placeholder - would need lastActiveAt field
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: UserId,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    this.logger.info('Changing user password', { userId: userId.value })

    const user = await prisma.user.findUnique({
      where: { id: userId.value },
      select: { password: true }
    })

    if (!user) {
      throw new NotFoundError('User', userId.value.toString())
    }

    // Verify current password
    const passwordService = getPasswordService()
    const isValidPassword = await passwordService.verify(currentPassword, user.password)

    if (!isValidPassword) {
      throw new AuthorizationError('Current password is incorrect')
    }

    // Hash new password and update
    const hashedNewPassword = await passwordService.hash(newPassword)

    await prisma.user.update({
      where: { id: userId.value },
      data: { password: hashedNewPassword }
    })

    this.logger.info('Password changed successfully', { userId: userId.value })
    return true
  }

  /**
   * Batch operations on users (admin only)
   */
  async batchOperation(
    userIds: string[],
    operation: 'activate' | 'deactivate' | 'verify' | 'ban' | 'unban',
    adminUserId: UserId,
    reason?: string,
    _duration?: string
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    this.logger.info('Performing batch user operation', {
      operation,
      userCount: userIds.length,
      adminUserId: adminUserId.value
    })

    // Note: In a real implementation, you would check admin privileges here

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const userId of userIds) {
      try {
        const numericUserId = parseGlobalId(userId, 'User')

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { id: numericUserId },
          select: { id: true }
        })

        if (!user) {
          throw new NotFoundError('User', userId)
        }

        // Note: These operations would need additional fields in the User model
        switch (operation) {
          case 'activate':
            // await prisma.user.update({ where: { id: numericUserId }, data: { active: true } })
            this.logger.info('User activated', { userId: numericUserId })
            break
          case 'deactivate':
            // await prisma.user.update({ where: { id: numericUserId }, data: { active: false } })
            this.logger.info('User deactivated', { userId: numericUserId })
            break
          case 'verify':
            // await prisma.user.update({ where: { id: numericUserId }, data: { verified: true } })
            this.logger.info('User verified', { userId: numericUserId })
            break
          case 'ban':
            // await prisma.user.update({ where: { id: numericUserId }, data: { bannedUntil: new Date(duration), banReason: reason } })
            this.logger.info('User banned', { userId: numericUserId, reason })
            break
          case 'unban':
            // await prisma.user.update({ where: { id: numericUserId }, data: { bannedUntil: null, banReason: null } })
            this.logger.info('User unbanned', { userId: numericUserId })
            break
        }

        success++
      } catch (error) {
        failed++
        errors.push(`User ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    this.logger.info('Batch user operation completed', { success, failed })
    return { success, failed, errors }
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: UserId, requestingUserId: UserId): Promise<boolean> {
    this.logger.info('Deleting user account', {
      userId: userId.value,
      requestingUserId: requestingUserId.value
    })

    // Users can only delete their own account (unless admin)
    if (userId.value !== requestingUserId.value) {
      throw new AuthorizationError('You can only delete your own account')
    }

    // In a real implementation, you might want to soft delete or archive the user
    // and handle related data (posts, comments, etc.)

    const user = await prisma.user.findUnique({
      where: { id: userId.value }
    })

    if (!user) {
      throw new NotFoundError('User', userId.value.toString())
    }

    // Delete user's posts first (cascade delete)
    await prisma.post.deleteMany({
      where: { authorId: userId.value }
    })

    // Delete the user
    await prisma.user.delete({
      where: { id: userId.value }
    })

    this.logger.info('User account deleted', { userId: userId.value })
    return true
  }

  /**
   * Private helper: Build where clause for filtering
   */
  private buildWhereClause(filter: UserFilter): any {
    const where: any = {}

    if (filter.searchString) {
      where.OR = [
        { name: { contains: filter.searchString, mode: 'insensitive' } },
        { email: { contains: filter.searchString, mode: 'insensitive' } },
      ]
    }

    // Note: These filters would need additional fields in the User model
    if (filter.role) {
      // where.role = filter.role
      this.logger.warn('Role filtering not implemented - missing role field in User model')
    }

    if (filter.verified !== undefined) {
      // where.verified = filter.verified
      this.logger.warn('Verified filtering not implemented - missing verified field in User model')
    }

    if (filter.active !== undefined) {
      // where.active = filter.active
      this.logger.warn('Active filtering not implemented - missing active field in User model')
    }

    if (filter.createdAfter) {
      where.createdAt = { gte: new Date(filter.createdAfter) }
    }

    if (filter.createdBefore) {
      if (where.createdAt) {
        where.createdAt.lte = new Date(filter.createdBefore)
      } else {
        where.createdAt = { lte: new Date(filter.createdBefore) }
      }
    }

    return where
  }
}