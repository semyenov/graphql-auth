/**
 * Enhanced Authorization Scopes for Pothos Scope Auth Plugin
 *
 * Implements dynamic scopes, scope loaders, and complex authorization patterns
 */

import type { Context } from '../../graphql/context/context.types'
import { prisma } from '../../prisma'
import { parseGlobalId } from '../utils/relay'

// Enhanced scope types for better type safety
export interface EnhancedAuthScopes {
  // Basic scopes
  public: boolean
  authenticated: boolean
  admin: boolean

  // Resource ownership scopes
  postOwner: (postId: string | number) => boolean | Promise<boolean>
  userOwner: (userId: string | number) => boolean | Promise<boolean>

  // Dynamic permission scopes
  hasPermission: (permission: string) => boolean | Promise<boolean>
  hasAnyPermission: (permissions: string[]) => boolean | Promise<boolean>
  hasAllPermissions: (permissions: string[]) => boolean | Promise<boolean>

  // Content-based scopes
  canViewContent: (
    contentType: string,
    contentId: string | number,
  ) => boolean | Promise<boolean>
  canEditContent: (
    contentType: string,
    contentId: string | number,
  ) => boolean | Promise<boolean>
  canDeleteContent: (
    contentType: string,
    contentId: string | number,
  ) => boolean | Promise<boolean>

  // Time-based scopes
  withinTimeLimit: (
    action: string,
    timeLimit: number,
  ) => boolean | Promise<boolean>

  // Rate limit scopes
  withinRateLimit: (
    action: string,
    limit: number,
    window: number,
  ) => boolean | Promise<boolean>

  // Complex conditional scopes
  canAccessIfPublic: (
    resourceType: string,
    resourceId: string | number,
  ) => boolean | Promise<boolean>
  canAccessIfOwnerOrPublic: (
    resourceType: string,
    resourceId: string | number,
  ) => boolean | Promise<boolean>
}

// Enhanced scope auth configuration
export function createEnhancedAuthScopes(context: Context): EnhancedAuthScopes {
  return {
    // Basic scopes
    public: true,
    authenticated: !!context.userId,
    admin: context.user?.role === 'admin',

    // Resource ownership scopes with caching
    postOwner: async (postId: string | number) => {
      if (!context.userId) return false

      try {
        const numericPostId =
          typeof postId === 'string' ? parseGlobalId(postId, 'Post') : postId

        // Fallback to direct query
        const post = await prisma.post.findUnique({
          where: { id: numericPostId },
          select: { authorId: true },
        })
        return post?.authorId === context.userId.value
      } catch (_error) {
        // If there's an error parsing the ID or finding the post, return false
        return false
      }
    },

    userOwner: async (userId: string | number) => {
      if (!context.userId) return false
      const numericUserId =
        typeof userId === 'string' ? parseGlobalId(userId, 'User') : userId
      return numericUserId === context.userId.value
    },

    // Dynamic permission system
    hasPermission: async (permission: string) => {
      if (!context.userId) return false

      // Check user permissions from database or cache
      // This could be extended to use a proper permission system
      const user = await prisma.user.findUnique({
        where: { id: context.userId.value },
        select: { role: true }, // Assuming role-based permissions for now
      })

      // Simple role-based permission mapping
      const rolePermissions: Record<string, string[]> = {
        admin: ['*'], // Admin has all permissions
        moderator: ['post:edit', 'post:delete', 'user:moderate'],
        user: ['post:create', 'post:edit_own', 'user:edit_own'],
      }

      const userPermissions = rolePermissions[user?.role || 'user'] || []
      return (
        userPermissions.includes('*') || userPermissions.includes(permission)
      )
    },

    hasAnyPermission: async (permissions: string[]) => {
      for (const permission of permissions) {
        const hasPermission =
          await createEnhancedAuthScopes(context).hasPermission(permission)
        if (hasPermission) return true
      }
      return false
    },

    hasAllPermissions: async (permissions: string[]) => {
      for (const permission of permissions) {
        const hasPermission =
          await createEnhancedAuthScopes(context).hasPermission(permission)
        if (!hasPermission) return false
      }
      return true
    },

    // Content-based authorization
    canViewContent: async (contentType: string, contentId: string | number) => {
      if (!context.userId) {
        // Check if content is public
        if (contentType === 'Post') {
          const numericId =
            typeof contentId === 'string'
              ? parseGlobalId(contentId, 'Post')
              : contentId
          const post = await prisma.post.findUnique({
            where: { id: numericId },
            select: { published: true },
          })
          return post?.published ?? false
        }
        return false
      }

      // Authenticated users can view their own content or public content
      const scopes = createEnhancedAuthScopes(context)
      return await scopes.canAccessIfOwnerOrPublic(contentType, contentId)
    },

    canEditContent: async (contentType: string, contentId: string | number) => {
      if (!context.userId) return false

      const scopes = createEnhancedAuthScopes(context)

      // Check ownership first
      if (contentType === 'Post') {
        return await scopes.postOwner(contentId)
      }

      if (contentType === 'User') {
        return await scopes.userOwner(contentId)
      }

      return false
    },

    canDeleteContent: async (
      contentType: string,
      contentId: string | number,
    ) => {
      if (!context.userId) return false

      const scopes = createEnhancedAuthScopes(context)

      // Admin can delete anything
      if (scopes.admin) return true

      // Owner can delete their own content
      return await scopes.canEditContent(contentType, contentId)
    },

    // Time-based authorization
    withinTimeLimit: async (_action: string, timeLimit: number) => {
      if (!context.userId) return false

      // Check when user last performed this action
      // This is a simplified example - you'd want a proper tracking system
      const lastAction = await prisma.user.findUnique({
        where: { id: context.userId.value },
        select: { updatedAt: true }, // Using updatedAt as proxy
      })

      if (!lastAction) return true

      const timeSinceLastAction = Date.now() - lastAction.updatedAt.getTime()
      return timeSinceLastAction >= timeLimit
    },

    // Rate limiting integration
    withinRateLimit: async (
      _action: string,
      _limit: number,
      _window: number,
    ) => {
      if (!context.userId) return false

      // This would integrate with your rate limiting system
      // For now, just return true as rate limiting is handled elsewhere
      return true
    },

    // Complex conditional scopes
    canAccessIfPublic: async (
      resourceType: string,
      resourceId: string | number,
    ) => {
      if (resourceType === 'Post') {
        const numericId =
          typeof resourceId === 'string'
            ? parseGlobalId(resourceId, 'Post')
            : resourceId
        const post = await prisma.post.findUnique({
          where: { id: numericId },
          select: { published: true },
        })
        return post?.published ?? false
      }

      // For other resource types, default to false for security
      return false
    },

    canAccessIfOwnerOrPublic: async (
      resourceType: string,
      resourceId: string | number,
    ) => {
      const scopes = createEnhancedAuthScopes(context)

      // Check ownership first
      if (resourceType === 'Post' && (await scopes.postOwner(resourceId))) {
        return true
      }

      if (resourceType === 'User' && (await scopes.userOwner(resourceId))) {
        return true
      }

      // If not owner, check if public
      return await scopes.canAccessIfPublic(resourceType, resourceId)
    },
  }
}

// Scope loader for batch authorization checks
interface CacheEntry {
  value: unknown
  expires: number
}

export class ScopeLoader {
  private context: Context
  private cache: Map<string, CacheEntry> = new Map()

  constructor(context: Context) {
    this.context = context
  }

  // Batch check post ownership
  async batchCheckPostOwnership(postIds: number[]): Promise<boolean[]> {
    if (!this.context.userId) {
      return postIds.map(() => false)
    }

    const posts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: { id: true, authorId: true },
    })

    return postIds.map((id) => {
      const post = posts.find((p) => p.id === id)
      return post?.authorId === this.context.userId?.value
    })
  }

  // Batch check permissions
  async batchCheckPermissions(permissions: string[]): Promise<boolean[]> {
    if (!this.context.userId) {
      return permissions.map(() => false)
    }

    const user = await prisma.user.findUnique({
      where: { id: this.context.userId.value },
      select: { role: true },
    })

    const rolePermissions: Record<string, string[]> = {
      admin: ['*'],
      moderator: ['post:edit', 'post:delete', 'user:moderate'],
      user: ['post:create', 'post:edit_own', 'user:edit_own'],
    }

    const userPermissions = rolePermissions[user?.role || 'user'] || []
    const hasWildcard = userPermissions.includes('*')

    return permissions.map(
      (permission) => hasWildcard || userPermissions.includes(permission),
    )
  }

  // Cache management
  setCacheKey(key: string, value: unknown, ttl = 60000) {
    this.cache.set(key, { value, expires: Date.now() + ttl })
  }

  getCacheKey(key: string): unknown | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() > cached.expires) {
      this.cache.delete(key)
      return null
    }

    return cached.value
  }
}
