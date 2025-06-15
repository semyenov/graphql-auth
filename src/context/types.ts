import { BaseContext } from '@apollo/server'
import type { Endpoint, HTTPMethod } from 'fetchdts'
import { IncomingMessage } from 'http'
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
