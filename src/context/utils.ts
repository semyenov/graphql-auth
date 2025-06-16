import type { HTTPMethod } from '../gql/types.d'
import { RequestMetadata, SecurityContext } from '../types.d'
import { getUserIdFromAuthHeader } from '../utils/jwt'
import { DEFAULT_VALUES, HEADER_KEYS } from './constants'
import type { Context, GraphQLIncomingMessage } from './types.d'

/**
 * Context creation utilities
 * 
 * This module contains helper functions for creating and processing
 * GraphQL context components in a clean, testable way.
 */

/**
 * Extracts and normalizes HTTP headers from the incoming request
 * 
 * @param req - The incoming GraphQL request
 * @returns Normalized headers object with string values
 */
export function extractHeaders(req: GraphQLIncomingMessage): Record<string, string> {
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
  const supportedMethods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

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
  return headers[HEADER_KEYS.X_FORWARDED_FOR] ||
    headers[HEADER_KEYS.X_REAL_IP] ||
    DEFAULT_VALUES.IP_ADDRESS
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
  variables?: Record<string, unknown>
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
  userId?: number
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
  method: HTTPMethod
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
export function getUserId(context: Context): number | null {
  const authHeader = context.headers[HEADER_KEYS.AUTHORIZATION]
  return getUserIdFromAuthHeader(authHeader)
} 