import { ERROR_MESSAGES } from '../../../constants'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { AuthenticationError } from '../../../errors'
import type { Context } from '../../../context/context-direct'

/**
 * Authentication and authorization utilities for GraphQL context
 * 
 * This module provides type-safe helpers for checking authentication status,
 * enforcing authentication requirements, and validating permissions/roles.
 */

/**
 * Checks if the current context represents an authenticated user
 * 
 * @param context - The GraphQL context to check
 * @returns True if the user is authenticated, false otherwise
 * 
 * @example
 * ```typescript
 * if (isAuthenticated(context)) {
 *   // User is authenticated, safe to access user data
 *   const userId = context.userId;
 * }
 * ```
 */
export function isAuthenticated(
    context: Context
): context is Context & { userId: UserId } {
    return context.security.isAuthenticated && Boolean(context.userId)
}

/**
 * Ensures the user is authenticated and returns their user ID
 * 
 * @param context - The GraphQL context to validate
 * @returns The authenticated user's ID
 * @throws Error if the user is not authenticated or user ID is invalid
 * 
 * @example
 * ```typescript
 * const userId = requireAuthentication(context);
 * // userId is guaranteed to be a valid number
 * ```
 */
export function requireAuthentication(
    context: Context
): UserId {
    if (!isAuthenticated(context)) {
        throw new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED)
    }

    // userId is already a UserId value object
    return context.userId
}

/**
 * Checks if the authenticated user has a specific permission
 * 
 * @param context - The GraphQL context to check
 * @param permission - The permission string to validate against
 * @returns True if the user has the permission, false otherwise
 * 
 * @example
 * ```typescript
 * if (hasPermission(context, 'write:posts')) {
 *   // User can create/edit posts
 * }
 * ```
 */
export function hasPermission(
    context: Context,
    permission: string
): boolean {
    if (!permission || typeof permission !== 'string') {
        return false
    }

    const userPermissions = context.security.permissions ?? []
    return userPermissions.includes(permission)
}

/**
 * Checks if the authenticated user has a specific role
 * 
 * @param context - The GraphQL context to check
 * @param role - The role string to validate against
 * @returns True if the user has the role, false otherwise
 * 
 * @example
 * ```typescript
 * if (hasRole(context, 'admin')) {
 *   // User has admin privileges
 * }
 * ```
 */
export function hasRole(
    context: Context,
    role: string
): boolean {
    if (!role || typeof role !== 'string') {
        return false
    }

    const userRoles = context.security.roles ?? []
    return userRoles.includes(role)
}

/**
 * Checks if the authenticated user has any of the specified permissions
 * 
 * @param context - The GraphQL context to check
 * @param permissions - Array of permission strings to check
 * @returns True if the user has at least one of the permissions
 * 
 * @example
 * ```typescript
 * if (hasAnyPermission(context, ['read:posts', 'write:posts'])) {
 *   // User can either read or write posts
 * }
 * ```
 */
export function hasAnyPermission(
    context: Context,
    permissions: string[]
): boolean {
    if (!Array.isArray(permissions) || permissions.length === 0) {
        return false
    }

    return permissions.some(permission => hasPermission(context, permission))
}

/**
 * Checks if the authenticated user has all of the specified permissions
 * 
 * @param context - The GraphQL context to check
 * @param permissions - Array of permission strings that must all be present
 * @returns True if the user has all of the specified permissions
 * 
 * @example
 * ```typescript
 * if (hasAllPermissions(context, ['read:posts', 'write:posts'])) {
 *   // User can both read and write posts
 * }
 * ```
 */
export function hasAllPermissions(
    context: Context,
    permissions: string[]
): boolean {
    if (!Array.isArray(permissions) || permissions.length === 0) {
        return false
    }

    return permissions.every(permission => hasPermission(context, permission))
} 