import { BaseContext } from '@apollo/server'
import type { Endpoint, HTTPMethod } from 'fetchdts'
import { IncomingMessage } from 'http'
import type {
    CreateDraftVariables,
    GetFeedVariables,
    LoginVariables,
    SignupVariables
} from '../gql'
import type {
    GraphQLRequestBody,
    MimeType
} from '../gql/types'
import type { RequestMetadata, SecurityContext, User } from '../types'

/**
 * GraphQL Context Type Definitions
 * 
 * This module defines comprehensive, type-safe interfaces for GraphQL contexts
 * with operation-specific typing and enhanced request handling.
 */

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
export interface GraphQLAPISchema {
    '/graphql': {
        [Endpoint]: {
            POST: {
                body: GraphQLRequestBody
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
export interface GraphQLIncomingMessage extends IncomingMessage {
    readonly body?: GraphQLRequestBody
}

/**
 * Base GraphQL context interface with comprehensive typing
 * 
 * @template TVariables - The type of GraphQL variables for the operation
 * @template TOperationName - The specific operation name as a string literal
 */
export interface Context<
    TVariables = Record<string, unknown>,
    TOperationName extends string = string
> extends BaseContext {
    // Operation-specific information
    operationName?: TOperationName
    variables?: TVariables

    // Request information
    req: {
        readonly url: string
        readonly method: HTTPMethod
        readonly headers: Record<string, string>
        readonly body?: GraphQLRequestBody<TVariables>
    }
    headers: Record<string, string>
    method: HTTPMethod
    contentType: MimeType | string
    metadata: RequestMetadata

    // Security and authentication
    security: SecurityContext
    userId?: number
    user?: User
}

// ============================================================================
// OPERATION-SPECIFIC CONTEXT TYPES
// ============================================================================

/**
 * Context type for Login operations
 */
export interface LoginContext extends Context<LoginVariables, 'Login'> {
    readonly operationName: 'Login'
}

/**
 * Context type for Signup operations
 */
export interface SignupContext extends Context<SignupVariables, 'Signup'> {
    readonly operationName: 'Signup'
}

/**
 * Context type for CreateDraft operations
 */
export interface CreateDraftContext extends Context<CreateDraftVariables, 'CreateDraft'> {
    readonly operationName: 'CreateDraft'
}

/**
 * Context type for GetMe operations (no variables required)
 */
export interface GetMeContext extends Context<never, 'GetMe'> {
    readonly operationName: 'GetMe'
}

/**
 * Context type for GetPosts operations
 */
export interface GetPostsContext extends Context<GetFeedVariables, 'GetPosts'> {
    readonly operationName: 'GetPosts'
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Union type of all supported GraphQL operation names
 */
export type OperationName =
    | 'Login'
    | 'Signup'
    | 'CreateDraft'
    | 'GetMe'
    | 'GetPosts'

/**
 * Union type encompassing all possible typed contexts
 * 
 * This provides type safety when working with contexts where the specific
 * operation is not known at compile time.
 */
export type TypedContext =
    | LoginContext
    | SignupContext
    | CreateDraftContext
    | GetMeContext
    | GetPostsContext

/**
 * Helper type to extract the context type for a specific operation
 * 
 * @template TOperationName - The operation name to get the context for
 */
export type ContextForOperation<TOperationName extends OperationName> =
    TOperationName extends 'Login' ? LoginContext :
    TOperationName extends 'Signup' ? SignupContext :
    TOperationName extends 'CreateDraft' ? CreateDraftContext :
    TOperationName extends 'GetMe' ? GetMeContext :
    TOperationName extends 'GetPosts' ? GetPostsContext :
    never

/**
 * Helper type to extract variables type for a specific operation
 * 
 * @template TOperationName - The operation name to get variables for
 */
export type VariablesForOperation<TOperationName extends OperationName> =
    TOperationName extends 'Login' ? LoginVariables :
    TOperationName extends 'Signup' ? SignupVariables :
    TOperationName extends 'CreateDraft' ? CreateDraftVariables :
    TOperationName extends 'GetMe' ? never :
    TOperationName extends 'GetPosts' ? GetFeedVariables :
    Record<string, unknown>

// ============================================================================
// AUTHENTICATION-SPECIFIC TYPES
// ============================================================================

/**
 * Context type for operations that require authentication
 */
export interface AuthenticatedContext<TVariables = Record<string, unknown>>
    extends Context<TVariables> {
    readonly security: SecurityContext & {
        readonly isAuthenticated: true
        readonly userId: number
    }
    readonly userId: number
}

/**
 * Context type for operations that require specific permissions
 */
export interface AuthorizedContext<
    TVariables = Record<string, unknown>,
    TPermissions extends string = string
> extends AuthenticatedContext<TVariables> {
    security: SecurityContext & {
        readonly isAuthenticated: true
        readonly userId: number
        readonly permissions: readonly TPermissions[]
    }
} 