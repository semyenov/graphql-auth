import type { ResultOf, VariablesOf } from 'gql.tada'
import type { introspection_types } from '../graphql-env'
import type {
    PostInfoFragment,
    PostWithAuthorFragment,
    UserInfoFragment
} from './fragments'
import type {
    CreateDraftMutation,
    DeletePostMutation,
    IncrementPostViewCountMutation,
    LoginMutation,
    SignupMutation,
    TogglePublishPostMutation
} from './mutations'
import type {
    GetAllUsersQuery,
    GetDraftsByUserQuery,
    GetFeedQuery,
    GetMeQuery,
    GetPostQuery
} from './queries'

// =============================================================================
// HTTP AND GRAPHQL BASE TYPES
// =============================================================================

// HTTP method types
export type HTTPMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE'

export type MimeType =
    | 'application/json'
    | 'application/xml'
    | 'text/plain'
    | 'text/html'
    | string

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

// GraphQL operation metadata
export interface GraphQLOperationMeta {
    operationName?: string
    operationType: 'query' | 'mutation' | 'subscription'
    variables?: Record<string, unknown>
}

// GraphQL Schema Types from introspection (for reference)
export type GraphQLPost = introspection_types['Post']
export type GraphQLUser = introspection_types['User']
export type GraphQLMutation = introspection_types['Mutation']
export type GraphQLQuery = introspection_types['Query']

// GraphQL input types
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

// =============================================================================
// TYPE EXPORTS (gql.tada generated types)
// =============================================================================

// Fragment Types
export type UserInfo = ResultOf<typeof UserInfoFragment>
export type PostInfo = ResultOf<typeof PostInfoFragment>
export type PostWithAuthor = ResultOf<typeof PostWithAuthorFragment>

// Query Types
export type GetMeResult = ResultOf<typeof GetMeQuery>
export type GetAllUsersResult = ResultOf<typeof GetAllUsersQuery>
export type GetPostResult = ResultOf<typeof GetPostQuery>
export type GetPostVariables = VariablesOf<typeof GetPostQuery>
export type GetFeedResult = ResultOf<typeof GetFeedQuery>
export type GetFeedVariables = VariablesOf<typeof GetFeedQuery>
export type GetDraftsByUserResult = ResultOf<typeof GetDraftsByUserQuery>
export type GetDraftsByUserVariables = VariablesOf<typeof GetDraftsByUserQuery>

// Mutation Types
export type LoginResult = ResultOf<typeof LoginMutation>
export type LoginVariables = VariablesOf<typeof LoginMutation>
export type SignupResult = ResultOf<typeof SignupMutation>
export type SignupVariables = VariablesOf<typeof SignupMutation>
export type CreateDraftResult = ResultOf<typeof CreateDraftMutation>
export type CreateDraftVariables = VariablesOf<typeof CreateDraftMutation>
export type DeletePostResult = ResultOf<typeof DeletePostMutation>
export type DeletePostVariables = VariablesOf<typeof DeletePostMutation>
export type TogglePublishPostResult = ResultOf<typeof TogglePublishPostMutation>
export type TogglePublishPostVariables = VariablesOf<typeof TogglePublishPostMutation>
export type IncrementPostViewCountResult = ResultOf<typeof IncrementPostViewCountMutation>
export type IncrementPostViewCountVariables = VariablesOf<typeof IncrementPostViewCountMutation> 