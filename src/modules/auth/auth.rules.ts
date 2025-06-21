/**
 * Authentication Module Shield Rules
 *
 * Authorization rules specific to authentication operations.
 */

import { rule } from 'graphql-shield'
import type { DefaultContext } from '../../graphql/context/context.types'

/**
 * Rate limit rule for authentication operations
 * Prevents brute force attacks on login/signup
 */
export const rateLimitAuth = rule({ cache: 'no_cache' })(
  async (_parent, _args, _context: DefaultContext) => {
    // Rate limiting is handled by middleware
    // This rule serves as a marker for auth-specific rate limiting
    return true
  },
)

/**
 * Ensure user is not already authenticated
 * Used for login/signup operations
 */
export const isNotAuthenticated = rule({ cache: 'contextual' })(
  async (_parent, _args, context: DefaultContext) => {
    // Allow login/signup only for non-authenticated users
    return !context.user
  },
)

/**
 * Ensure refresh token operations are allowed
 * Can be extended with additional checks
 */
export const canRefreshToken = rule({ cache: 'no_cache' })(
  async (_parent, _args, _context: DefaultContext) => {
    // Additional checks can be added here
    // For example: check if refresh token is not blacklisted
    return true
  },
)
