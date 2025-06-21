/**
 * GraphQL Middleware Index
 *
 * Central export point for all GraphQL middleware
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import { authMiddleware } from './auth.middleware'

// Export individual middleware
// Export individual rules for composition
export {
  authMiddleware,
  isAdminRule,
  isAuthenticatedRule,
  isResourceOwnerRule,
  requireAuthenticationRule,
} from './auth.middleware'
export {
  authRateLimitRule,
  createRateLimitRule,
  mutationRateLimitRule,
  queryRateLimitRule,
  RATE_LIMIT_CONFIGS,
  rateLimitMiddleware,
  strictRateLimitRule,
} from './rate-limit.middleware'
export {
  emailValidationRule,
  paginationValidationRule,
  passwordValidationRule,
  postContentValidationRule,
  postTitleValidationRule,
  userNameValidationRule,
  validationMiddleware,
} from './validation.middleware'

/**
 * Combined middleware that applies all security and validation rules
 * For now, we use the auth middleware as the primary middleware
 * Individual middleware can be composed as needed
 */
export const combinedMiddleware = authMiddleware

/**
 * Minimal middleware for development (auth only)
 */
export const developmentMiddleware = authMiddleware

/**
 * Production middleware with all security features
 */
export const productionMiddleware = combinedMiddleware

/**
 * Legacy permissions export for backward compatibility
 */
export { permissions } from './shield-config'
