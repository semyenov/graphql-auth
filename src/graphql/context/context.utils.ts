/**
 * GraphQL Context Utilities
 *
 * Helper functions for creating and processing GraphQL context components
 * following the IMPROVED-FILE-STRUCTURE.md specification.
 */

import type { HTTPMethod } from 'fetchdts'
import { DEFAULT_VALUES, HEADER_KEYS } from '../../app/constants/context'
import { prisma } from '../../data/database'
import { createEnhancedLoaders } from '../../data/loaders/loaders'
import type { RequestMetadata, SecurityContext } from '../../types.d'
import { getUserIdFromAuthHeader } from '../../utils/jwt'
import type {
  EnhancedContext,
  GraphQLIncomingMessage,
  IContext,
} from './context.types'

/**
 * Extracts and normalizes HTTP headers from the incoming request
 *
 * @param req - The incoming GraphQL request
 * @returns Normalized headers object with string values
 */
export function extractHeaders(
  req: GraphQLIncomingMessage,
): Record<string, string> {
  const headers: Record<string, string> = {}

  for (const [key, value] of Object.entries(req.headers || {})) {
    // Normalize header values to strings
    headers[key.toLowerCase()] = Array.isArray(value)
      ? value.join(', ')
      : String(value || '')
  }

  return headers
}

/**
 * Determines the HTTP method with fallback to default
 *
 * @param req - The incoming GraphQL request
 * @returns The HTTP method as HTTPMethod type
 */
export function determineHttpMethod(req: GraphQLIncomingMessage): HTTPMethod {
  const method = req.method?.toUpperCase()

  // Validate that it's a supported HTTP method
  const supportedMethods: HTTPMethod[] = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'HEAD',
    'OPTIONS',
  ]

  if (method && supportedMethods.includes(method as HTTPMethod)) {
    return method as HTTPMethod
  }

  return DEFAULT_VALUES.HTTP_METHOD as HTTPMethod
}

/**
 * Extracts the content type from headers with fallback
 *
 * @param headers - The normalized headers object
 * @returns The content type string
 */
export function extractContentType(headers: Record<string, string>): string {
  return headers[HEADER_KEYS.CONTENT_TYPE] || DEFAULT_VALUES.CONTENT_TYPE
}

/**
 * Extracts the client IP address from various header sources
 *
 * @param headers - The normalized headers object
 * @returns The client IP address or default value
 */
export function extractClientIp(headers: Record<string, string>): string {
  return (
    headers[HEADER_KEYS.X_FORWARDED_FOR] ||
    headers[HEADER_KEYS.X_REAL_IP] ||
    DEFAULT_VALUES.IP_ADDRESS
  )
}

/**
 * Extracts the user agent from headers
 *
 * @param headers - The normalized headers object
 * @returns The user agent string or default value
 */
export function extractUserAgent(headers: Record<string, string>): string {
  return headers[HEADER_KEYS.USER_AGENT] || DEFAULT_VALUES.USER_AGENT
}

/**
 * Creates request metadata from the incoming request
 *
 * @param headers - The normalized headers object
 * @param operationName - The GraphQL operation name (optional)
 * @param variables - The GraphQL variables (optional)
 * @returns Complete request metadata object
 */
export function createRequestMetadata(
  headers: Record<string, string>,
  operationName?: string,
  variables?: Record<string, unknown>,
): RequestMetadata {
  return {
    ip: extractClientIp(headers),
    userAgent: extractUserAgent(headers),
    operationName,
    query: undefined, // Will be set later from GraphQL request if needed
    variables,
    startTime: Date.now(),
  }
}

/**
 * Creates a basic security context structure
 *
 * @param isAuthenticated - Whether the user is authenticated
 * @param userId - The authenticated user's ID (optional)
 * @returns Basic security context object
 */
export function createSecurityContext(
  isAuthenticated: boolean,
  userId?: number,
): SecurityContext {
  return {
    isAuthenticated,
    userId,
    userEmail: undefined, // Will be populated if needed
    roles: [], // Will be populated based on user data
    permissions: [], // Will be populated based on user roles
  }
}

/**
 * Creates the basic request object for the context
 *
 * @param req - The incoming GraphQL request
 * @param headers - The normalized headers object
 * @param method - The determined HTTP method
 * @returns Basic request object for context
 */
export function createRequestObject(
  req: GraphQLIncomingMessage,
  headers: Record<string, string>,
  method: HTTPMethod,
) {
  return {
    url: req.url || DEFAULT_VALUES.GRAPHQL_ENDPOINT,
    method,
    headers,
    body: req.body,
  }
}

/**
 * Validates the incoming request structure
 *
 * @param req - The incoming GraphQL request
 * @returns True if the request structure is valid
 */
export function isValidRequest(req: GraphQLIncomingMessage): boolean {
  if (!req) {
    return false
  }

  // Basic validation - can be extended based on requirements
  return typeof req === 'object'
}

/**
 * Extracts the user ID from the JWT token in the Authorization header
 *
 * @param context - The GraphQL context
 * @returns The user ID if authenticated, null otherwise
 */
export function getUserId(context: IContext): number | null {
  const authHeader = context.headers[HEADER_KEYS.AUTHORIZATION]
  return getUserIdFromAuthHeader(authHeader)
}

/**
 * Enhances the base context with additional features like DataLoaders
 *
 * @param context - The base context
 * @returns Enhanced context with additional features
 */
export function enhanceContext(context: IContext): EnhancedContext {
  const enhanced = context as EnhancedContext

  // Add performance tracking
  enhanced.performance = {
    startTime: Date.now(),
    requestId: generateRequestId(),
  }

  // Add DataLoader instances
  enhanced.loaders = createEnhancedLoaders(prisma)

  // Add scope creation function (placeholder for enhanced authorization)
  enhanced.createScopes = () => {
    // This would return an object with scope-checking methods
    return {
      canViewContent: async (_type: string, _id: string) => {
        // Implementation would check content visibility
        return true
      },
      hasPermission: async (_permission: string) => {
        // Implementation would check user permissions
        return false
      },
      withinRateLimit: async (
        _operation: string,
        _limit: number,
        _window: number,
      ) => {
        // Implementation would check rate limits
        return true
      },
    }
  }

  return enhanced
}

/**
 * Generates a unique request ID for tracking
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Creates performance metadata for request tracking
 */
export function createPerformanceMetadata() {
  return {
    startTime: process.hrtime.bigint(),
    requestId: generateRequestId(),
    phase: 'context_creation',
  }
}

/**
 * Validates context completeness
 */
export function validateContext(context: IContext): boolean {
  return !!(
    context.headers &&
    context.method &&
    context.metadata &&
    context.security
  )
}
