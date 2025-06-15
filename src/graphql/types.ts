import type { introspection_types } from '../graphql-env.d'

// HTTP method types
export type HTTPMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'

export type MimeType =
    | 'application/json'
    | 'application/xml'
    | 'text/plain'
    | 'text/html'
    | string

// GraphQL Schema Types from introspection (for reference)
export type GraphQLPost = introspection_types['Post']
export type GraphQLUser = introspection_types['User']
export type GraphQLMutation = introspection_types['Mutation']
export type GraphQLQuery = introspection_types['Query']

// Actual TypeScript interfaces for GraphQL inputs/outputs
export interface PostCreateInput {
    title: string
    content?: string | null
}

export interface PostOrderByUpdatedAtInput {
    updatedAt: 'asc' | 'desc'
}

export interface UserUniqueInput {
    id?: number | null
    email?: string | null
}

export type SortOrder = 'asc' | 'desc'

// GraphQL request body type with proper validation
export interface GraphQLRequestBody<TVariables = Record<string, unknown>> {
    query: string
    variables?: TVariables
    operationName?: string
}

export interface GraphQLError extends Error {
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
    extensions?: {
        code?: string
        field?: string
        timestamp?: string
    }
}

// Enhanced GraphQL response type
export interface GraphQLResponse<T = unknown, E extends GraphQLError = GraphQLError> {
    data?: T
    errors?: Array<E>
} 