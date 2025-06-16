import { print } from 'graphql'
import type {
    GraphQLResponse
} from '../context/types.d'
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
    IncrementPostViewCountResult,
    IncrementPostViewCountVariables,
    LoginResult,
    LoginVariables,
    SignupResult,
    SignupVariables,
    TogglePublishPostResult,
    TogglePublishPostVariables
} from './types.d'
import { GraphQLRequestBody } from './types.d'
import { executeGraphQL } from './utils'

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

// Query execution helpers
export const queryMe = (headers?: Record<string, string>) =>
    executeGraphQL<Record<string, unknown>, GetMeResult>(print(GetMeQuery), undefined, headers)

export const queryAllUsers = (headers?: Record<string, string>) =>
    executeGraphQL<Record<string, unknown>, GetAllUsersResult>(print(GetAllUsersQuery), undefined, headers)

export const queryFeed = (variables?: GetFeedVariables, headers?: Record<string, string>) =>
    executeGraphQL<GetFeedVariables, GetFeedResult>(print(GetFeedQuery), variables, headers)

export const queryDraftsByUser = (variables: GetDraftsByUserVariables, headers?: Record<string, string>) =>
    executeGraphQL<GetDraftsByUserVariables, GetDraftsByUserResult>(print(GetDraftsByUserQuery), variables, headers)

// Mutation execution helpers
export const mutateLogin = (variables: LoginVariables, headers?: Record<string, string>) =>
    executeGraphQL<LoginVariables, LoginResult>(print(LoginMutation), variables, headers)

export const mutateSignup = (variables: SignupVariables, headers?: Record<string, string>) =>
    executeGraphQL<SignupVariables, SignupResult>(print(SignupMutation), variables, headers)

export const mutateCreateDraft = (variables: CreateDraftVariables, headers?: Record<string, string>) =>
    executeGraphQL<CreateDraftVariables, CreateDraftResult>(print(CreateDraftMutation), variables, headers)

export const mutateDeletePost = (variables: DeletePostVariables, headers?: Record<string, string>) =>
    executeGraphQL<DeletePostVariables, DeletePostResult>(print(DeletePostMutation), variables, headers)

export const mutateTogglePublishPost = (variables: TogglePublishPostVariables, headers?: Record<string, string>) =>
    executeGraphQL<TogglePublishPostVariables, TogglePublishPostResult>(print(TogglePublishPostMutation), variables, headers)

export const mutateIncrementPostViewCount = (variables: IncrementPostViewCountVariables, headers?: Record<string, string>) =>
    executeGraphQL<IncrementPostViewCountVariables, IncrementPostViewCountResult>(print(IncrementPostViewCountMutation), variables, headers) 