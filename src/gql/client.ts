import type { HTTPMethod } from 'fetchdts'
import { print } from 'graphql'
import type {
    GraphQLAPISchema,
    GraphQLResponse,
} from '../context/types'
import { GraphQLRequestBody } from '../graphql/types'
import {
    CreateDraftMutation,
    DeletePostMutation,
    IncrementPostViewCountMutation,
    LoginMutation,
    SignupMutation,
    TogglePublishPostMutation
} from './mutations'
import {
    GetAllUsersQuery,
    GetDraftsByUserQuery,
    GetFeedQuery,
    GetMeQuery,
    GetPostByIdQuery
} from './queries'
import type {
    CreateDraftResult,
    CreateDraftVariables,
    DeletePostResult,
    DeletePostVariables,
    GetAllUsersResult,
    GetDraftsByUserResult,
    GetDraftsByUserVariables,
    GetFeedResult,
    GetFeedVariables,
    GetMeResult,
    GetPostByIdResult,
    GetPostByIdVariables,
    IncrementPostViewCountResult,
    IncrementPostViewCountVariables,
    LoginResult,
    LoginVariables,
    SignupResult,
    SignupVariables,
    TogglePublishPostResult,
    TogglePublishPostVariables
} from './types'

// =============================================================================
// GRAPHQL CLIENT
// =============================================================================

export class GraphQLClient {
    private endpoint: string
    private defaultHeaders: Record<string, string>

    constructor(endpoint: string = '/graphql', defaultHeaders: Record<string, string> = {}) {
        this.endpoint = endpoint
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        }
    }

    async execute<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
        query: string,
        variables?: TVariables,
        headers?: Record<string, string>,
        operationName?: string
    ): Promise<GraphQLResponse<TData>> {
        const requestBody: GraphQLRequestBody<TVariables> = {
            query,
            variables,
            operationName
        }

        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                ...headers,
            },
            body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response.json() as Promise<GraphQLResponse<TData>>
    }

    // Type-safe query execution
    async query<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
        query: string,
        variables?: TVariables,
        headers?: Record<string, string>
    ): Promise<GraphQLResponse<TData>> {
        return this.execute<TData, TVariables>(query, variables, headers, 'query')
    }

    // Type-safe mutation execution
    async mutate<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
        mutation: string,
        variables?: TVariables,
        headers?: Record<string, string>
    ): Promise<GraphQLResponse<TData>> {
        return this.execute<TData, TVariables>(mutation, variables, headers, 'mutation')
    }

    // Helper method to print GraphQL documents
    printQuery(query: any): string {
        return print(query)
    }
}

// Default client instance
export const graphqlClient = new GraphQLClient()

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

// Type-safe GraphQL execution with automatic query printing
export async function executeGraphQL<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    query: string | any, // Support both string and GraphQL document
    variables?: TVariables,
    headers?: Record<string, string>
): Promise<GraphQLResponse<TData>> {
    const queryString = typeof query === 'string' ? query : print(query)
    return graphqlClient.execute<TData, TVariables>(queryString, variables, headers)
}

// Query execution helpers
export const queryMe = (headers?: Record<string, string>) =>
    executeGraphQL<GetMeResult>(GetMeQuery, undefined, headers)

export const queryAllUsers = (headers?: Record<string, string>) =>
    executeGraphQL<GetAllUsersResult>(GetAllUsersQuery, undefined, headers)

export const queryPostById = (variables: GetPostByIdVariables, headers?: Record<string, string>) =>
    executeGraphQL<GetPostByIdResult, GetPostByIdVariables>(GetPostByIdQuery, variables, headers)

export const queryFeed = (variables?: GetFeedVariables, headers?: Record<string, string>) =>
    executeGraphQL<GetFeedResult, GetFeedVariables>(GetFeedQuery, variables, headers)

export const queryDraftsByUser = (variables: GetDraftsByUserVariables, headers?: Record<string, string>) =>
    executeGraphQL<GetDraftsByUserResult, GetDraftsByUserVariables>(GetDraftsByUserQuery, variables, headers)

// Mutation execution helpers
export const mutateLogin = (variables: LoginVariables, headers?: Record<string, string>) =>
    executeGraphQL<LoginResult, LoginVariables>(LoginMutation, variables, headers)

export const mutateSignup = (variables: SignupVariables, headers?: Record<string, string>) =>
    executeGraphQL<SignupResult, SignupVariables>(SignupMutation, variables, headers)

export const mutateCreateDraft = (variables: CreateDraftVariables, headers?: Record<string, string>) =>
    executeGraphQL<CreateDraftResult, CreateDraftVariables>(CreateDraftMutation, variables, headers)

export const mutateDeletePost = (variables: DeletePostVariables, headers?: Record<string, string>) =>
    executeGraphQL<DeletePostResult, DeletePostVariables>(DeletePostMutation, variables, headers)

export const mutateTogglePublishPost = (variables: TogglePublishPostVariables, headers?: Record<string, string>) =>
    executeGraphQL<TogglePublishPostResult, TogglePublishPostVariables>(TogglePublishPostMutation, variables, headers)

export const mutateIncrementPostViewCount = (variables: IncrementPostViewCountVariables, headers?: Record<string, string>) =>
    executeGraphQL<IncrementPostViewCountResult, IncrementPostViewCountVariables>(IncrementPostViewCountMutation, variables, headers)

// =============================================================================
// TYPE-SAFE REQUEST HELPER
// =============================================================================

// Type-safe request helper using fetchdts types
export function createTypedRequest<T extends keyof GraphQLAPISchema, TVariables extends Record<string, unknown> = Record<string, unknown>>(
    endpoint: T,
    method: HTTPMethod,
    body?: GraphQLRequestBody<TVariables>,
    headers?: Record<string, string>
): RequestInit {
    return {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    }
} 