/**
 * GraphQL Context Module Exports
 *
 * Central barrel exports for all GraphQL context functionality following the
 * IMPROVED-FILE-STRUCTURE.md specification.
 */

// Authentication utilities
export {
  createAuthMetadata,
  extractBearerToken,
  getUserIdFromAuthHeaderAsync,
  getUserRole,
  hasPermission,
  isAuthenticated,
  requireAuthentication,
} from './context.auth'
// Main context factory
export { createContext } from './context.factory'
// Context types
export type {
  AuthContext,
  AuthenticationContext,
  Context,
  ContextCreationFunction,
  EnhancedContext,
  GraphQLIncomingMessage,
  GraphQLResponse,
  PostContext,
  RequestComponents,
  UserContext,
} from './context.types'

// Context utilities
export {
  createPerformanceMetadata,
  createRequestMetadata,
  createRequestObject,
  createSecurityContext,
  determineHttpMethod,
  enhanceContext,
  extractClientIp,
  extractContentType,
  extractHeaders,
  extractUserAgent,
  getUserId,
  isValidRequest,
  validateContext,
} from './context.utils'
