import { BaseContext } from '@apollo/server'
import type { Endpoint, HTTPMethod } from 'fetchdts'
import { IncomingMessage } from 'http'

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
