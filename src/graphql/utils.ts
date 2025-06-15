import type {
    GraphQLRequestBody,
    GraphQLResponse,
    HTTPMethod,
    PostCreateInput,
    PostOrderByUpdatedAtInput,
    SortOrder,
    UserUniqueInput
} from './types'

// Type-safe GraphQL execution with enhanced error handling
export async function executeGraphQL<
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TData = unknown,
>(
    query: string,
    variables?: TVariables,
    headers?: Record<string, string>,
): Promise<GraphQLResponse<TData>> {
    try {
        const requestBody: GraphQLRequestBody<TVariables> = {
            query,
            variables,
        }

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = (await response.json()) as GraphQLResponse<TData>
        return result
    } catch (error) {
        // Return a properly formatted GraphQL error response
        return {
            errors: [
                {
                    name: 'GraphQLError',
                    message:
                        error instanceof Error ? error.message : 'Unknown error occurred',
                    extensions: {
                        code: 'NETWORK_ERROR',
                        timestamp: new Date().toISOString(),
                    },
                },
            ],
        }
    }
}

// Type-safe request helper
export function createTypedRequest(
    method: HTTPMethod,
    body?: GraphQLRequestBody,
    headers?: Record<string, string>,
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

// Helper functions for working with GraphQL schema types
export function createPostInput(title: string, content?: string): PostCreateInput {
    return {
        title,
        content: content || null,
    }
}

export function createPostOrderBy(direction: SortOrder = 'desc'): PostOrderByUpdatedAtInput {
    return {
        updatedAt: direction,
    }
}

export function createUserUniqueInput(identifier: { id?: number; email?: string }): UserUniqueInput {
    return {
        id: identifier.id ?? null,
        email: identifier.email ?? null,
    }
} 