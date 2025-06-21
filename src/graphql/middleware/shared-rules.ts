/**
 * Shared Authorization Rules
 *
 * Common authorization rules used across multiple modules to reduce duplication
 */

import { rule } from 'graphql-shield'
import {
  AuthenticationError,
  AuthorizationError,
} from '../../core/errors/types'
import { prisma } from '../../prisma'
import type { Context } from '../context/context.types'

/**
 * Check if user is authenticated
 */
export const isAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    return !!context.userId
  },
)

/**
 * Check if user is not authenticated (for signup/login)
 */
export const isNotAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    return !context.userId
  },
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
  },
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
  },
)

/**
 * Check if user's account is active
 */
export const isActiveAccount = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    if (!context.userId) return false

    const user = await prisma.user.findUnique({
      where: { id: context.userId.value },
      select: { status: true },
    })

    if (user?.status === 'BANNED') {
      return new AuthorizationError('Your account has been banned')
    }

    if (user?.status === 'SUSPENDED') {
      return new AuthorizationError('Your account is suspended')
    }

    return true
  },
)

/**
 * Check if email verification is required
 */
export const isEmailVerified = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    if (!context.userId) return false

    const user = await prisma.user.findUnique({
      where: { id: context.userId.value },
      select: { emailVerified: true },
    })

    if (!user?.emailVerified) {
      return new AuthorizationError('Please verify your email address')
    }

    return true
  },
)

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission: string) =>
  rule({ cache: 'contextual' })(async (_parent, _args, context: Context) => {
    if (!context.userId) return false

    const user = await prisma.user.findUnique({
      where: { id: context.userId.value },
      select: { role: true },
    })

    if (!user) return false

    // Admin has all permissions
    if (user.role === 'admin') return true

    // Check specific permissions (assuming permissions field exists)
    // This is a simplified example - in real app, you'd have a proper permission system
    const rolePermissions: Record<string, string[]> = {
      moderator: ['user:suspend', 'post:moderate', 'comment:moderate'],
      user: ['profile:edit', 'post:create', 'comment:create'],
    }

    const userPermissions = rolePermissions[user.role || 'user'] || []
    return userPermissions.includes(permission)
  })

/**
 * Require authentication with helpful error message
 */
export const requireAuthentication = rule({ cache: 'contextual' })(
  async (_parent, _args, context: Context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }
    return true
  },
)

/**
 * Rate limiting check (integrates with rate limiter)
 */
export const withinRateLimit = (_operation: string) =>
  rule({ cache: 'no_cache' })(async (_parent, _args, _context: Context) => {
    // This is handled by the rate limiter plugin
    // This rule is just for documentation/type safety
    return true
  })
