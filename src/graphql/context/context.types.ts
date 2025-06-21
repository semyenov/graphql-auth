/**
 * GraphQL Context Type Definitions
 *
 * Comprehensive, type-safe interfaces for GraphQL contexts following the
 * IMPROVED-FILE-STRUCTURE.md specification.
 */

import type {
  HTTPGraphQLRequest as ApolloHTTPGraphQLRequest,
  BaseContext,
  HeaderMap,
} from '@apollo/server'
import type { Endpoint, HTTPMethod, MimeType } from 'fetchdts'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Loaders } from '../../data/loaders/loaders'
import type { RequestMetadata, SecurityContext, User } from '../../types.d'
import type { UserId } from '../../value-objects/user-id.vo'

// Note: These types would normally be imported from a types module
// For now, we'll define them inline to avoid import issues
export type GraphQLRequestBody<TVariables extends Record<string, unknown>> = {
  query: string
  operationName?: string
  variables?: TVariables
}

// ============================================================================
// GRAPHQL RESPONSE TYPES
// ============================================================================

/**
 * Enhanced GraphQL response type with better error handling
 */
export interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: GraphQLError[]
  extensions?: Record<string, unknown>
}

/**
 * GraphQL error type with location and path information
 */
export interface GraphQLError extends Error {
  name: string
  message: string
  locations?: Array<{ line: number; column: number }>
  path?: Array<string | number>
  extensions?: Record<string, unknown>
}

/**
 * GraphQL operation metadata
 */
export interface GraphQLOperationMeta {
  operationName?: string
  operationType: 'query' | 'mutation' | 'subscription'
  variables?: Record<string, unknown>
}

// ============================================================================
// API SCHEMA FOR FETCHDTS
// ============================================================================

/**
 * API schema definition for fetchdts type safety
 */
export interface GraphQLAPISchema<TVariables extends Record<string, unknown>> {
  '/graphql': {
    [Endpoint]: {
      POST: {
        body: GraphQLRequestBody<TVariables>
        headers: {
          'content-type': 'application/json'
          authorization?: string
        }
        response: GraphQLResponse
        responseHeaders: {
          'content-type': 'application/json'
        }
      }
    }
  }
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Enhanced HTTP request interface with properly typed GraphQL body
 */
export type HTTPGraphQLRequest<TVariables extends Record<string, unknown>> =
  ApolloHTTPGraphQLRequest & {
    readonly body?: GraphQLRequestBody<TVariables>
  }

/**
 * Base GraphQL context interface with comprehensive typing
 *
 * @template TVariables - The type of GraphQL variables for the operation
 * @template TOperationName - The specific operation name as a string literal
 */
export interface IContext<TVariables extends Record<string, unknown>>
  extends BaseContext {
  // Operation-specific information
  operationName?: string
  variables?: TVariables

  // Request information
  req: {
    readonly url: string
    readonly method: HTTPMethod
    readonly headers: Record<string, string>
    readonly body?: GraphQLRequestBody<TVariables>
  }

  // Additional request information for rate limiting
  request?: {
    ip?: string
    headers?: Record<string, string | string[] | undefined>
    connection?: {
      remoteAddress?: string
    }
  }

  headers: HeaderMap
  method: HTTPMethod
  contentType: MimeType | string
  metadata: RequestMetadata

  // Security and authentication
  security: SecurityContext
  userId?: UserId
  user?: User

  // Client information
  ipAddress?: string
}

// ============================================================================
// CONTEXT CREATION HELPERS
// ============================================================================

/**
 * Interface for request components during context creation
 */
export interface RequestComponents<TVariables extends Record<string, unknown>> {
  headers: HeaderMap
  method: HTTPMethod
  contentType: MimeType | string
  operationName?: string
  variables?: TVariables
  metadata: RequestMetadata
  requestObject: IContext<TVariables>['req']
}

/**
 * Interface for authentication context components
 */
export interface IAuthenticationContext<
  TVariables extends Record<string, unknown>,
> extends IContext<TVariables> {
  userId?: UserId
  security: SecurityContext
}

/**
 * Type utility for context creation functions
 */
export type IContextCreationFunction<
  TVariables extends Record<string, unknown>,
  T extends IContext<TVariables> = IContext<TVariables>,
> = (params: { req: IncomingMessage; res: ServerResponse }) => Promise<T>

// ============================================================================
// ENHANCED CONTEXT TYPES
// ============================================================================

/**
 * Enhanced context with additional features
 * This is what gets returned after context enhancement
 */
export interface Context<TVariables extends Record<string, unknown>>
  extends IContext<TVariables> {
  // DataLoader instances would be added here
  loaders: Loaders

  // Performance tracking
  performance?: {
    startTime: number
    requestId: string
  }

  // Scope creation functions for enhanced authorization
  createScopes?: () => Record<string, unknown>
}

// ============================================================================
// OPERATION-SPECIFIC CONTEXT TYPES
// ============================================================================

/**
 * Context for authentication operations
 */
export interface IAuthContext<TVariables extends Record<string, unknown>>
  extends IContext<TVariables> {
  operationName: 'signup' | 'login' | 'me' | 'logout' | 'refreshToken'
}

/**
 * Context for post operations
 */
export interface IPostContext<TVariables extends Record<string, unknown>>
  extends IContext<TVariables> {
  operationName:
    | 'createPost'
    | 'updatePost'
    | 'deletePost'
    | 'feed'
    | 'post'
    | 'drafts'
}

/**
 * Context for user operations
 */
export interface IUserContext<TVariables extends Record<string, unknown>>
  extends IContext<TVariables> {
  operationName: 'searchUsers' | 'updateUserProfile' | 'deleteUser'
}
