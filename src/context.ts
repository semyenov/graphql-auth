import { ContextFunction } from '@apollo/server'
import type { Endpoint, HTTPMethod, TypedFetchResponseBody } from 'fetchdts'
import { graphql, type ResultOf, type VariablesOf } from 'gql.tada'
import { print } from 'graphql'
import { IncomingMessage } from 'http'

// =============================================================================
// GRAPHQL FRAGMENTS
// =============================================================================

export const UserFragment = graphql(`
  fragment UserInfo on User {
    id
    email
    name
  }
`)

export const PostFragment = graphql(`
  fragment PostInfo on Post {
    id
    title
    content
    published
    createdAt
    updatedAt
    viewCount
  }
`)

export const PostWithAuthorFragment = graphql(
  `
    fragment PostWithAuthor on Post {
      ...PostInfo
      author {
        ...UserInfo
      }
    }
  `,
  [PostFragment, UserFragment],
)

// =============================================================================
// GRAPHQL QUERIES
// =============================================================================

export const GetMeQuery = graphql(
  `
    query GetMe {
      me {
        ...UserInfo
        posts {
          ...PostInfo
        }
      }
    }
  `,
  [UserFragment, PostFragment],
)

export const GetAllUsersQuery = graphql(
  `
    query GetAllUsers {
      allUsers {
        ...UserInfo
        posts {
          ...PostInfo
        }
      }
    }
  `,
  [UserFragment, PostFragment],
)

export const GetPostByIdQuery = graphql(
  `
    query GetPostById($id: Int!) {
      postById(id: $id) {
        ...PostWithAuthor
      }
    }
  `,
  [PostWithAuthorFragment],
)

export const GetFeedQuery = graphql(
  `
    query GetFeed(
      $searchString: String
      $skip: Int
      $take: Int
      $orderBy: PostOrderByUpdatedAtInput
    ) {
      feed(
        searchString: $searchString
        skip: $skip
        take: $take
        orderBy: $orderBy
      ) {
        ...PostWithAuthor
      }
    }
  `,
  [PostWithAuthorFragment],
)

export const GetDraftsByUserQuery = graphql(
  `
    query GetDraftsByUser($userUniqueInput: UserUniqueInput!) {
      draftsByUser(userUniqueInput: $userUniqueInput) {
        ...PostWithAuthor
      }
    }
  `,
  [PostWithAuthorFragment],
)

// =============================================================================
// GRAPHQL MUTATIONS
// =============================================================================

export const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`)

export const SignupMutation = graphql(`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(email: $email, password: $password, name: $name)
  }
`)

export const CreateDraftMutation = graphql(
  `
    mutation CreateDraft($data: PostCreateInput!) {
      createDraft(data: $data) {
        ...PostWithAuthor
      }
    }
  `,
  [PostWithAuthorFragment],
)

export const DeletePostMutation = graphql(
  `
    mutation DeletePost($id: Int!) {
      deletePost(id: $id) {
        ...PostWithAuthor
      }
    }
  `,
  [PostWithAuthorFragment],
)

export const TogglePublishPostMutation = graphql(
  `
    mutation TogglePublishPost($id: Int!) {
      togglePublishPost(id: $id) {
        ...PostWithAuthor
      }
    }
  `,
  [PostWithAuthorFragment],
)

export const IncrementPostViewCountMutation = graphql(
  `
    mutation IncrementPostViewCount($id: Int!) {
      incrementPostViewCount(id: $id) {
        ...PostWithAuthor
      }
    }
  `,
  [PostWithAuthorFragment],
)

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Fragment Types
export type UserInfo = ResultOf<typeof UserFragment>
export type PostInfo = ResultOf<typeof PostFragment>
export type PostWithAuthor = ResultOf<typeof PostWithAuthorFragment>

// Query Types
export type GetMeResult = ResultOf<typeof GetMeQuery>
export type GetAllUsersResult = ResultOf<typeof GetAllUsersQuery>
export type GetPostByIdResult = ResultOf<typeof GetPostByIdQuery>
export type GetPostByIdVariables = VariablesOf<typeof GetPostByIdQuery>
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
export type TogglePublishPostVariables = VariablesOf<
  typeof TogglePublishPostMutation
>
export type IncrementPostViewCountResult = ResultOf<
  typeof IncrementPostViewCountMutation
>
export type IncrementPostViewCountVariables = VariablesOf<
  typeof IncrementPostViewCountMutation
>

// =============================================================================
// GRAPHQL CLIENT UTILITIES
// =============================================================================

// GraphQL request body type
interface GraphQLRequestBody {
  query: string
  variables?: Record<string, unknown>
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
// CONTEXT INTERFACE
// =============================================================================

export interface Context {
  req: {
    url: string
    method: HTTPMethod
    headers: Record<string, string>
    body?: GraphQLRequestBody
  }
  headers: Record<string, string>
  method: HTTPMethod
  contentType: string
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

export const createContext: ContextFunction<
  [{ req: IncomingMessage }],
  Context
> = async ({ req }) => {
  const headers: Record<string, string> = {}
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      headers[key] = Array.isArray(value) ? value.join(', ') : String(value)
    }
  })

  const context: Context = {
    req: {
      url: req.url || '/graphql',
      method: (req.method as HTTPMethod) || 'POST',
      headers,
      body: (req as any).body,
    },
    headers,
    method: (req.method as HTTPMethod) || 'POST',
    contentType: headers['content-type'] || 'application/json',
  }

  return context
}

// =============================================================================
// GRAPHQL CLIENT
// =============================================================================

export class GraphQLClient {
  private endpoint: string
  private defaultHeaders: Record<string, string>

  constructor(
    endpoint: string = '/graphql',
    defaultHeaders: Record<string, string> = {},
  ) {
    this.endpoint = endpoint
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  async execute<
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    query: string,
    variables?: TVariables,
    headers?: Record<string, string>,
    operationName?: string,
  ): Promise<GraphQLResponse<TData>> {
    const requestBody: GraphQLRequestBody = {
      query,
      variables,
      operationName,
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
  async query<
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    query: string,
    variables?: TVariables,
    headers?: Record<string, string>,
  ): Promise<GraphQLResponse<TData>> {
    return this.execute<TData, TVariables>(query, variables, headers, 'query')
  }

  // Type-safe mutation execution
  async mutate<
    TData = unknown,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
  >(
    mutation: string,
    variables?: TVariables,
    headers?: Record<string, string>,
  ): Promise<GraphQLResponse<TData>> {
    return this.execute<TData, TVariables>(
      mutation,
      variables,
      headers,
      'mutation',
    )
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
export async function executeGraphQL<
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  query: string | any, // Support both string and GraphQL document
  variables?: TVariables,
  headers?: Record<string, string>,
): Promise<GraphQLResponse<TData>> {
  const queryString = typeof query === 'string' ? query : print(query)
  return graphqlClient.execute<TData, TVariables>(
    queryString,
    variables,
    headers,
  )
}

// Query execution helpers
export const queryMe = (headers?: Record<string, string>) =>
  executeGraphQL<GetMeResult>(GetMeQuery, undefined, headers)

export const queryAllUsers = (headers?: Record<string, string>) =>
  executeGraphQL<GetAllUsersResult>(GetAllUsersQuery, undefined, headers)

export const queryPostById = (
  variables: GetPostByIdVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<GetPostByIdResult, GetPostByIdVariables>(
    GetPostByIdQuery,
    variables,
    headers,
  )

export const queryFeed = (
  variables?: GetFeedVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<GetFeedResult, GetFeedVariables>(
    GetFeedQuery,
    variables,
    headers,
  )

export const queryDraftsByUser = (
  variables: GetDraftsByUserVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<GetDraftsByUserResult, GetDraftsByUserVariables>(
    GetDraftsByUserQuery,
    variables,
    headers,
  )

// Mutation execution helpers
export const mutateLogin = (
  variables: LoginVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<LoginResult, LoginVariables>(LoginMutation, variables, headers)

export const mutateSignup = (
  variables: SignupVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<SignupResult, SignupVariables>(
    SignupMutation,
    variables,
    headers,
  )

export const mutateCreateDraft = (
  variables: CreateDraftVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<CreateDraftResult, CreateDraftVariables>(
    CreateDraftMutation,
    variables,
    headers,
  )

export const mutateDeletePost = (
  variables: DeletePostVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<DeletePostResult, DeletePostVariables>(
    DeletePostMutation,
    variables,
    headers,
  )

export const mutateTogglePublishPost = (
  variables: TogglePublishPostVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<TogglePublishPostResult, TogglePublishPostVariables>(
    TogglePublishPostMutation,
    variables,
    headers,
  )

export const mutateIncrementPostViewCount = (
  variables: IncrementPostViewCountVariables,
  headers?: Record<string, string>,
) =>
  executeGraphQL<IncrementPostViewCountResult, IncrementPostViewCountVariables>(
    IncrementPostViewCountMutation,
    variables,
    headers,
  )

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Helper type for GraphQL endpoint response
export type GraphQLEndpointResponse<T> = TypedFetchResponseBody<
  GraphQLAPISchema,
  '/graphql',
  'POST'
> & {
  data?: T
}

// Type-safe request helper using fetchdts types
export function createTypedRequest<T extends keyof GraphQLAPISchema>(
  endpoint: T,
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

// =============================================================================
// DEVELOPMENT UTILITIES
// =============================================================================

export const devUtils = {
  // Print any GraphQL document for debugging
  print: (query: any) => print(query),

  // Log GraphQL operations for debugging
  logOperation: (operation: GraphQLOperationMeta, result: GraphQLResponse) => {
    console.log(
      `[GraphQL ${operation.operationType.toUpperCase()}] ${
        operation.operationName || 'Anonymous'
      }`,
    )
    if (operation.variables) {
      console.log('Variables:', JSON.stringify(operation.variables, null, 2))
    }
    if (result.errors) {
      console.error('Errors:', result.errors)
    }
    if (result.data) {
      console.log('Data:', JSON.stringify(result.data, null, 2))
    }
  },

  // Validate GraphQL response
  validateResponse: <T>(response: GraphQLResponse<T>): T => {
    if (response.errors && response.errors.length > 0) {
      throw new Error(
        `GraphQL Error: ${response.errors.map((e) => e.message).join(', ')}`,
      )
    }
    if (!response.data) {
      throw new Error('GraphQL response contains no data')
    }
    return response.data
  },
}
