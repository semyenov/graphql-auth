import { ROLE_HIERARCHY } from '../../constants'
import type { Context } from '../../graphql/context/context.types'
import {
  hasPermission,
  hasRole,
  isAuthenticated,
  requireAuthentication,
} from '../../modules/auth/guards/auth.guards'
import { prisma } from '../../prisma'

/**
 * Permission utility type definition
 */
export type PermissionUtilsType = {
  canAccessUserData: (context: Context, targetUserId: number) => boolean
  canModifyPost: (context: Context, postId: number) => Promise<boolean>
  canPublishPost: (context: Context) => boolean
  hasRoleOrHigher: (
    context: Context,
    role: keyof typeof ROLE_HIERARCHY | string,
  ) => boolean
  validateOperation: (context: Context, operation: string) => boolean
}

/**
 * Check if user can access specific user data
 */
function canAccessUserData(context: Context, targetUserId: number): boolean {
  if (!context.userId) return false
  return context.userId.value === targetUserId || hasRole(context, 'admin')
}

/**
 * Check if user can modify specific post
 */
async function canModifyPost(
  context: Context,
  postId: number,
): Promise<boolean> {
  try {
    const userId = requireAuthentication(context)

    // Check post ownership directly through Prisma
    // We can't use the GetPostUseCase here because it enforces viewing permissions
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) return false

    return post.authorId === userId.value || hasRole(context, 'admin')
  } catch {
    return false
  }
}

/**
 * Check if user can publish posts
 */
function canPublishPost(context: Context): boolean {
  return (
    isAuthenticated(context) &&
    (hasPermission(context, 'write:posts') || hasRole(context, 'admin'))
  )
}

/**
 * Enhanced role checking with hierarchy
 */
function hasRoleOrHigher(
  context: Context,
  role: keyof typeof ROLE_HIERARCHY | string,
): boolean {
  const normalizedRole = role.toUpperCase() as keyof typeof ROLE_HIERARCHY
  const requiredLevel = ROLE_HIERARCHY[normalizedRole]

  if (requiredLevel === undefined) {
    return false
  }

  // Check each role in the hierarchy
  for (const [roleKey, level] of Object.entries(ROLE_HIERARCHY)) {
    if (hasRole(context, roleKey.toLowerCase()) && level >= requiredLevel) {
      return true
    }
  }

  return false
}

/**
 * Operation-specific permission checks
 */
function validateOperation(context: Context, operation: string): boolean {
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

/**
 * Permission utility functions for use in resolvers
 */
export const PermissionUtils: PermissionUtilsType = {
  canAccessUserData,
  canModifyPost,
  canPublishPost,
  hasRoleOrHigher,
  validateOperation,
}
