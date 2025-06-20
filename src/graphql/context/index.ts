/**
 * GraphQL Context Module Exports
 * 
 * Central barrel exports for all GraphQL context functionality following the
 * IMPROVED-FILE-STRUCTURE.md specification.
 */

// Main context factory
export { createContext } from './context.factory'

// Context types
export type {
    Context,
    EnhancedContext,
    GraphQLIncomingMessage,
    GraphQLResponse,
    AuthContext,
    PostContext,
    UserContext,
    RequestComponents,
    AuthenticationContext,
    ContextCreationFunction
} from './context.types'

// Authentication utilities
export {
    extractBearerToken,
    getUserIdFromAuthHeaderAsync,
    isAuthenticated,
    requireAuthentication,
    getUserRole,
    hasPermission,
    createAuthMetadata
} from './context.auth'

// Context utilities
export {
    extractHeaders,
    determineHttpMethod,
    extractContentType,
    extractClientIp,
    extractUserAgent,
    createRequestMetadata,
    createSecurityContext,
    createRequestObject,
    isValidRequest,
    getUserId,
    enhanceContext,
    createPerformanceMetadata,
    validateContext
} from './context.utils'