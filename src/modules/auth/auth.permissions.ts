/**
 * Authentication Module Permissions
 *
 * Defines authorization rules and permission checks for authentication operations
 */

import { allow, rule, shield } from 'graphql-shield'
import {
  AuthenticationError,
  AuthorizationError,
} from '../../core/errors/types'
import type { Context } from '../../graphql/context/context.types'
import { prisma } from '../../prisma'

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
 * Check if user owns the account
 */
export const isAccountOwner = rule({ cache: 'strict' })(
  async (_parent, args: { userId: string }, context: Context) => {
    if (!context.userId) {
      return new AuthenticationError('You must be logged in')
    }

    const targetUserId = parseInt(args.userId, 10)
    if (context.userId.value !== targetUserId) {
      return new AuthorizationError('You can only modify your own account')
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
 * Rate limiting check (integrates with rate limiter)
 */
export const withinRateLimit = (_operation: string) =>
  rule({ cache: 'no_cache' })(async (_parent, _args, _context: Context) => {
    // This is handled by the rate limiter plugin
    // This rule is just for documentation/type safety
    return true
  })

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
 * Auth module permissions configuration
 */
export const authPermissions = {
  Query: {
    me: isAuthenticated,
    sessions: isAuthenticated,
    authStatus: allow,
  },
  Mutation: {
    // Public auth operations
    signup: isNotAuthenticated,
    login: isNotAuthenticated,
    loginWithTokens: isNotAuthenticated,
    forgotPassword: isNotAuthenticated,
    resetPassword: isNotAuthenticated,

    // Authenticated operations
    logout: isAuthenticated,
    refreshToken: allow, // Handled by token validation
    updateProfile: isAuthenticated,
    changePassword: isAuthenticated,
    deleteAccount: isAuthenticated,

    // Email verification
    sendVerificationEmail: isAuthenticated,
    verifyEmail: allow, // Token-based

    // Two-factor auth
    enableTwoFactor: isAuthenticated,
    disableTwoFactor: isAuthenticated,
    verifyTwoFactor: allow, // During login

    // Session management
    revokeSession: isAuthenticated,
    revokeAllSessions: isAuthenticated,

    // Admin operations
    updateUserRole: isAdmin,
    suspendUser: isModerator,
    banUser: isAdmin,
  },
  User: {
    // Sensitive fields
    email: isAccountOwner,
    sessions: isAccountOwner,
    permissions: isAccountOwner,
    twoFactorEnabled: isAccountOwner,
  },
}

/**
 * Create auth shield middleware
 */
export const createAuthShield = () =>
  shield(authPermissions, {
    allowExternalErrors: true,
    fallbackError: new AuthorizationError('Not authorized'),
  })
