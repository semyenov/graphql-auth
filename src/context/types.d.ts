import { BaseContext } from '@apollo/server'
import type { Endpoint, HTTPMethod, TypedFetchResponseBody } from 'fetchdts'
import { IncomingMessage } from 'http'
import type {
    CreateDraftVariables,
    GetDraftsByUserVariables,
    GetFeedVariables,
    GetPostByIdVariables,
    LoginVariables,
    SignupVariables
} from '../gql/types'

// =============================================================================
// GRAPHQL TYPES
// =============================================================================

// GraphQL request body type
export interface GraphQLRequestBody<TVariables = Record<string, unknown>> {
    query: string
    variables?: TVariables
    operationName?: string
}

// Enhanced GraphQL response type with better error handling
export interface GraphQLResponse<T = unknown> {
    data?: T
    errors?: GraphQLError[]
    extensions?: Record<string, unknown>
}

export interface GraphQLError {
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
    extensions?: Record<string, unknown>
}

// GraphQL operation metadata
export interface GraphQLOperationMeta {
    operationName?: string
    operationType: 'query' | 'mutation' | 'subscription'
    variables?: Record<string, unknown>
}

// =============================================================================
// API SCHEMA FOR FETCHDTS
// =============================================================================

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

// =============================================================================
// CONTEXT INTERFACES
// =============================================================================

// Enhanced request interface to properly type the parsed body
export interface GraphQLIncomingMessage extends IncomingMessage {
    body?: GraphQLRequestBody
}

// Request metadata interface
export interface RequestMetadata {
    ip: string
    userAgent: string
    operationName?: string
    query?: string
    variables?: Record<string, unknown>
    startTime: number
}

// Security context interface
export interface SecurityContext {
    isAuthenticated: boolean
    userId?: number
    userEmail?: string
    roles: string[]
    permissions: string[]
}

// User interface
export interface User {
    id: number
    email: string
    name?: string
    roles?: string[]
}

// Enhanced context interface with comprehensive typing
export interface Context<TVariables = Record<string, unknown>, TOperationName = string> extends BaseContext {
    operationName?: TOperationName
    variables?: TVariables
    req: {
        url: string
        method: HTTPMethod
        headers: Record<string, string>
        body?: GraphQLRequestBody<TVariables>
    }
    headers: Record<string, string>
    method: HTTPMethod
    contentType: string
    metadata: RequestMetadata
    security: SecurityContext
    userId?: number
    user?: User
}

// =============================================================================
// OPERATION-SPECIFIC CONTEXT TYPES
// =============================================================================

// Note: Operation variable types are now defined in ../gql/types.ts
// and re-exported from ../gql/index.ts for consistency with gql.tada generated types

// Specific context types for different operations
export interface LoginContext<TOperationName = 'Login'> extends Context<LoginVariables, TOperationName> {
    operationName: TOperationName
}

export interface SignupContext<TOperationName = 'Signup'> extends Context<SignupVariables, TOperationName> {
    operationName: TOperationName
}

export interface CreateDraftContext<TOperationName = 'CreateDraft'> extends Context<CreateDraftVariables, TOperationName> {
    operationName: TOperationName
}

export interface GetMeContext<TOperationName = 'GetMe'> extends Context<never, TOperationName> {
    operationName: TOperationName
}

export interface GetPostByIdContext<TOperationName = 'GetPostById'> extends Context<GetPostByIdVariables, TOperationName> {
    operationName: TOperationName
}

export interface GetFeedContext<TOperationName = 'GetFeed'> extends Context<GetFeedVariables, TOperationName> {
    operationName: TOperationName
}

export interface GetDraftsByUserContext<TOperationName = 'GetDraftsByUser'> extends Context<GetDraftsByUserVariables, TOperationName> {
    operationName: TOperationName
}

export type OperationName =
    | 'Login'
    | 'Signup'
    | 'CreateDraft'
    | 'GetMe'
    | 'GetPostById'
    | 'GetFeed'
    | 'GetDraftsByUser'
    | 'GetAllUsers'
    | 'DeletePost'
    | 'TogglePublishPost'
    | 'IncrementPostViewCount'

// Union type for all possible contexts
export type TypedContext<TOperationName extends OperationName = OperationName> =
    | LoginContext<TOperationName>
    | SignupContext<TOperationName>
    | CreateDraftContext<TOperationName>
    | GetMeContext<TOperationName>
    | GetPostByIdContext<TOperationName>
    | GetFeedContext<TOperationName>
    | GetDraftsByUserContext<TOperationName>
    | Context<Record<string, unknown>, TOperationName>

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Helper type for GraphQL endpoint response
export type GraphQLEndpointResponse<T> = TypedFetchResponseBody<GraphQLAPISchema, '/graphql', 'POST'> & {
    data?: T
} 