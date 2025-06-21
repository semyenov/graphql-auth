/**
 * Users Module Validation Schemas
 *
 * Contains all validation schemas and rules specific to user management
 */

import { z } from 'zod'
import { VALIDATION_LIMITS } from '../../app/constants'
import { prisma } from '../../prisma'

/**
 * User search query validation
 */
export const userSearchSchema = z.object({
  query: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(50, 'Search query is too long')
    .transform((query) => query.trim()),
  role: z.enum(['admin', 'moderator', 'user']).optional(),
  isActive: z.boolean().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
})

/**
 * User profile update validation
 */
export const userProfileSchema = z
  .object({
    name: z
      .string()
      .min(VALIDATION_LIMITS.NAME_MIN_LENGTH, 'Name is too short')
      .max(VALIDATION_LIMITS.NAME_MAX_LENGTH, 'Name is too long')
      .optional()
      .transform((name) => name?.trim()),
    bio: z
      .string()
      .max(500, 'Bio must be less than 500 characters')
      .optional()
      .transform((bio) => bio?.trim()),
    website: z
      .string()
      .url('Please provide a valid URL')
      .optional()
      .refine((url) => {
        if (!url) return true
        try {
          const parsed = new URL(url)
          return ['http:', 'https:'].includes(parsed.protocol)
        } catch {
          return false
        }
      }, 'Website must use HTTP or HTTPS protocol'),
    location: z
      .string()
      .max(100, 'Location is too long')
      .optional()
      .transform((location) => location?.trim()),
    socialLinks: z
      .object({
        twitter: z
          .string()
          .regex(/^@?[A-Za-z0-9_]{1,15}$/, 'Invalid Twitter username')
          .optional()
          .transform((username) => username?.replace('@', '')),
        github: z
          .string()
          .regex(/^[A-Za-z0-9-]{1,39}$/, 'Invalid GitHub username')
          .optional(),
        linkedin: z
          .string()
          .regex(/^[A-Za-z0-9-]{3,100}$/, 'Invalid LinkedIn username')
          .optional(),
      })
      .optional(),
  })
  .refine((data) => {
    // At least one field must be provided
    return Object.values(data).some((value) => value !== undefined)
  }, 'At least one field must be provided for update')

/**
 * User preferences validation
 */
export const userPreferencesSchema = z.object({
  emailNotifications: z
    .object({
      newFollower: z.boolean().optional(),
      postLiked: z.boolean().optional(),
      postCommented: z.boolean().optional(),
      mentioned: z.boolean().optional(),
      newsletter: z.boolean().optional(),
    })
    .optional(),
  privacy: z
    .object({
      showEmail: z.boolean().optional(),
      showProfile: z.boolean().optional(),
      allowMessages: z.boolean().optional(),
    })
    .optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.enum(['en', 'es', 'fr', 'de', 'ja']).optional(),
})

/**
 * User role update validation (admin only)
 */
export const userRoleSchema = z.object({
  userId: z.number().positive(),
  role: z.enum(['admin', 'moderator', 'user']),
  reason: z
    .string()
    .min(10, 'Please provide a reason for role change')
    .max(500, 'Reason is too long'),
})

/**
 * User status update validation (admin/moderator only)
 */
export const userStatusSchema = z.object({
  userId: z.number().positive(),
  status: z.enum(['active', 'suspended', 'banned']),
  reason: z
    .string()
    .min(10, 'Please provide a reason for status change')
    .max(500, 'Reason is too long'),
  duration: z.number().positive().optional(), // Duration in hours for suspension
})

/**
 * Follow/unfollow user validation
 */
export const followUserSchema = z.object({
  userId: z.number().positive(),
})

/**
 * Block/unblock user validation
 */
export const blockUserSchema = z.object({
  userId: z.number().positive(),
  reason: z.string().max(200, 'Reason is too long').optional(),
})

/**
 * User report validation
 */
export const reportUserSchema = z.object({
  userId: z.number().positive(),
  reason: z.enum(['spam', 'harassment', 'inappropriate', 'other']),
  details: z
    .string()
    .min(10, 'Please provide more details')
    .max(1000, 'Details are too long'),
})

/**
 * Async validation for unique username
 */
export const uniqueUsernameSchema = (_userId: number) =>
  z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username is too long')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    )
    .transform((username) => username.toLowerCase())
    .refine(async (_username) => {
      // NOTE: Username field doesn't exist in User model yet
      // For now, just check if the username is available
      // This would need to be implemented when username field is added
      const existingUser = null
      return !existingUser
    }, 'Username is already taken')

/**
 * Validate user exists
 */
export async function validateUserExists(userId: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })
  return !!user
}

/**
 * Validate user is not self
 */
export function validateNotSelf(userId: number, targetUserId: number): boolean {
  return userId !== targetUserId
}

/**
 * Validate user has permission to update another user
 */
export async function validateUserUpdatePermission(
  userId: number,
  targetUserId: number,
  userRole?: string,
): Promise<boolean> {
  // Users can update themselves
  if (userId === targetUserId) return true

  // Admins can update anyone
  if (userRole === 'admin') return true

  // Moderators can update regular users
  if (userRole === 'moderator') {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { role: true },
    })
    return targetUser?.role === 'user'
  }

  return false
}

// Re-export shared validation helpers for backwards compatibility
export {
  safeValidateInput as safeValidateUserInput,
  validateInput as validateUserInput,
} from '../../validation/helpers'
