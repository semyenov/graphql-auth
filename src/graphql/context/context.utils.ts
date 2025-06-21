/**
 * GraphQL Context Utilities
 *
 * Helper functions for creating and processing GraphQL context components
 * following the IMPROVED-FILE-STRUCTURE.md specification.
 */

import { HeaderMap } from '@apollo/server'
import type { HTTPMethod } from 'fetchdts'
import type { IncomingMessage } from 'http'
import { DEFAULT_VALUES, HEADER_KEYS } from '../../app/constants/context'
import { ValidationError } from '../../app/errors/types'
import { prisma } from '../../data/database'
import { createEnhancedLoaders } from '../../data/loaders/loaders'
import type { RequestMetadata, SecurityContext } from '../../types.d'
import { getUserIdFromAuthHeader } from '../../utils/jwt'
import { UserId } from '../../value-objects/user-id.vo'
import type { Context, GraphQLRequestBody, IContext } from './context.types'

/**
 * Extracts and normalizes HTTP headers from the incoming request
 *
 * @param req - The incoming GraphQL request
 * @returns Normalized headers object with string values
 */
export function extractHeaders(req: IncomingMessage): HeaderMap {
  const headers: HeaderMap = new HeaderMap()

  for (const [key, value] of Object.entries(req.headers || {})) {
    headers.set(
      key.toLowerCase(),
      Array.isArray(value) ? value.join(', ') : String(value || ''),
    )
  }
  return headers
}

/**
 * Determines the HTTP method with fallback to default
 *
 * @param req - The incoming GraphQL request
 * @returns The HTTP method as HTTPMethod type
 */
export function determineHttpMethod(req: IncomingMessage): HTTPMethod {
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
export function extractContentType(headers: HeaderMap): string {
  return headers.get(HEADER_KEYS.CONTENT_TYPE) || DEFAULT_VALUES.CONTENT_TYPE
}

/**
 * Extracts the client IP address from various header sources
 *
 * @param headers - The normalized headers object
 * @returns The client IP address or default value
 */
export function extractClientIp(headers: HeaderMap): string {
  return (
    headers.get(HEADER_KEYS.X_FORWARDED_FOR) ||
    headers.get(HEADER_KEYS.X_REAL_IP) ||
    DEFAULT_VALUES.IP_ADDRESS
  )
}

/**
 * Extracts the user agent from headers
 *
 * @param headers - The normalized headers object
 * @returns The user agent string or default value
 */
export function extractUserAgent(headers: HeaderMap): string {
  return headers.get(HEADER_KEYS.USER_AGENT) || DEFAULT_VALUES.USER_AGENT
}

/**
 * Creates request metadata from the incoming request
 *
 * @param headers - The normalized headers object
 * @param operationName - The GraphQL operation name (optional)
 * @param variables - The GraphQL variables (optional)
 * @returns Complete request metadata object
 */
export function createRequestMetadata<
  TVariables extends Record<string, unknown>,
>(req: IncomingMessage): RequestMetadata {
  const headers = extractHeaders(req)
  const body = req.read() as GraphQLRequestBody<TVariables> | undefined
  if (!body) {
    throw new ValidationError({
      body: ['No body found in request'],
    })
  }

  const operationName = getOperationName(body)
  const variables = getVariables(body) as Record<string, unknown>
  const query = getQuery(body)
  if (!query) {
    throw new ValidationError({
      body: ['No query found in request'],
    })
  }
  if (!operationName) {
    throw new ValidationError({
      body: ['No operation name found in request'],
    })
  }
  if (!variables) {
    throw new ValidationError({
      body: ['No variables found in request'],
    })
  }
  return {
    ip: extractClientIp(headers),
    userAgent: extractUserAgent(headers),
    operationName,
    query,
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
export function createRequestObject<TVariables extends Record<string, unknown>>(
  req: IncomingMessage,
) {
  const userId = UserId.create(1)
  const headers = extractHeaders(req)
  const method = determineHttpMethod(req)
  const contentType = extractContentType(headers)
  const ipAddress = extractClientIp(headers)
  const metadata = createRequestMetadata(req)
  const security = createSecurityContext(true, userId.value)
  const requestObject = {
    ...req,
    metadata,
    security,
    userId,
    req: req,
    method,
    contentType,
    ipAddress,
  }
  return requestObject as unknown as IContext<TVariables>['req']
}

/**
 * Validates the incoming request structure
 *
 * @param req - The incoming GraphQL request
 * @returns True if the request structure is valid
 */
export function isValidRequest(req: IncomingMessage): boolean {
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
export function getUserId(
  context: IContext<Record<string, unknown>>,
): number | null {
  const authHeader = context.headers.get(HEADER_KEYS.AUTHORIZATION)
  return getUserIdFromAuthHeader(authHeader)
}

/**
 * Enhances the base context with additional features like DataLoaders
 *
 * @param context - The base context
 * @returns Enhanced context with additional features
 */
export function enhanceContext<TVariables extends Record<string, unknown>>(
  context: IContext<TVariables>,
): Context<TVariables> {
  const enhanced = context as unknown as Context<TVariables>

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
export function validateContext<TVariables extends Record<string, unknown>>(
  context: IContext<TVariables>,
): boolean {
  return !!(
    context.headers &&
    context.method &&
    context.metadata &&
    context.security &&
    context.security.isAuthenticated &&
    context.userId &&
    context.user
  )
}

function getOperationName<TVariables extends Record<string, unknown>>(
  body: GraphQLRequestBody<TVariables>,
): string | undefined {
  return body?.operationName as string | undefined
}

function getVariables<TVariables extends Record<string, unknown>>(
  body: GraphQLRequestBody<TVariables>,
): Record<string, unknown> | undefined {
  return body?.variables as Record<string, unknown> | undefined
}

function getQuery<TVariables extends Record<string, unknown>>(
  body: GraphQLRequestBody<TVariables>,
): string | undefined {
  return body?.query as string | undefined
}
