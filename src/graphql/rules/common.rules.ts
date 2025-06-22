/**
 * Common Shield Rules
 *
 * Shared authorization rules used across multiple modules.
 * These rules are designed to work with the Pothos Shield plugin.
 */

import { rule } from 'graphql-shield'
import type { DefaultContext } from '../context/context.types'

/**
 * Public access rule - allows unrestricted access
 */
export const isPublic = rule({ cache: 'no_cache' })(() => true)

/**
 * Basic authentication rule - ensures user is logged in
 */
export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  async (_parent, _args, context: DefaultContext) => {
    return Boolean(context.user)
  },
)

/**
 * Admin role rule - ensures user has admin privileges
 */
export const isAdmin = rule({ cache: 'contextual' })(
  async (_parent, _args, context: DefaultContext) => {
    if (!context.user) return false

    return context.user.role === 'admin'
  },
)

/**
 * Rate limiting rule for sensitive operations
 * Note: Actual rate limiting is handled by middleware
 * This serves as an additional check point
 */
export const rateLimitRule = rule({ cache: 'no_cache' })(
  async (_parent, _args, _context: DefaultContext) => {
    // Rate limiting is handled at the middleware level
    // This rule can be used for additional checks
    return true
  },
)

// Export logical operators for combining rules
export { and, not, or } from 'graphql-shield'
