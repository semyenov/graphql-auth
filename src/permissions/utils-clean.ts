import { ROLE_HIERARCHY } from '../constants'
import { hasPermission, hasRole, isAuthenticated, requireAuthentication } from '../context/auth'
import type { EnhancedContext } from '../context/enhanced-context'

/**
 * Permission utility type definition
 */
export type PermissionUtilsType = {
  canAccessUserData: (context: EnhancedContext, targetUserId: number) => boolean
  canModifyPost: (context: EnhancedContext, postId: number) => Promise<boolean>
  canPublishPost: (context: EnhancedContext) => boolean
  hasRoleOrHigher: (context: EnhancedContext, role: keyof typeof ROLE_HIERARCHY | string) => boolean
  validateOperation: (context: EnhancedContext, operation: string) => boolean
}

/**
 * Check if user can access specific user data
 */
function canAccessUserData(context: EnhancedContext, targetUserId: number): boolean {
  if (!context.userId) return false
  return context.userId.value === targetUserId || hasRole(context, 'admin')
}

/**
 * Check if user can modify specific post
 */
async function canModifyPost(context: EnhancedContext, postId: number): Promise<boolean> {
  try {
    const userId = requireAuthentication(context)

    // Check post ownership directly through Prisma
    // We can't use the GetPostUseCase here because it enforces viewing permissions
    const post = await context.prisma.post.findUnique({
      where: { id: postId }
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
function canPublishPost(context: EnhancedContext): boolean {
  return isAuthenticated(context) &&
    (hasPermission(context, 'write:posts') || hasRole(context, 'admin'))
}

/**
 * Enhanced role checking with hierarchy
 */
function hasRoleOrHigher(context: EnhancedContext, role: keyof typeof ROLE_HIERARCHY | string): boolean {
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
function validateOperation(context: EnhancedContext, operation: string): boolean {
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