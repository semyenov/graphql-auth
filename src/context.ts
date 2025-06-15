import { BaseContext, ContextFunction } from '@apollo/server'
import { graphql, type ResultOf, type VariablesOf } from 'gql.tada'
import { IncomingMessage } from 'http'
import type { introspection_types } from './graphql-env.d'
import type { RequestMetadata, SecurityContext, User } from './types'
import { getUserId } from './utils'

// Enhanced request interface to properly type the parsed body
interface GraphQLIncomingMessage extends IncomingMessage {
  body?: GraphQLRequestBody
}

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

// Enhanced GraphQL operations with proper type safety
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

export const CreateDraftMutation = graphql(`
  mutation CreateDraft($data: PostCreateInput!) {
    createDraft(data: $data) {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`)

export const GetMeQuery = graphql(`
  query GetMe {
    me {
      id
      email
      name
      posts {
        id
        title
        published
        createdAt
      }
    }
  }
`)

export const GetPostsQuery = graphql(`
  query GetPosts(
    $orderBy: PostOrderByUpdatedAtInput!
    $searchString: String
    $skip: Int
    $take: Int
  ) {
    feed(
      orderBy: $orderBy,
      searchString: $searchString,
      skip: $skip,
      take: $take
    ) {
      id
      title
      content
      published
      viewCount
      createdAt
      author {
        id
        name
      }
    }
  }
`)

// Type aliases for easy access to query types
export type LoginResult = ResultOf<typeof LoginMutation>
export type LoginVariables = VariablesOf<typeof LoginMutation>
export type SignupResult = ResultOf<typeof SignupMutation>
export type SignupVariables = VariablesOf<typeof SignupMutation>
export type CreateDraftResult = ResultOf<typeof CreateDraftMutation>
export type CreateDraftVariables = VariablesOf<typeof CreateDraftMutation>
export type GetMeResult = ResultOf<typeof GetMeQuery>
export type GetPostsResult = ResultOf<typeof GetPostsQuery>
export type GetPostsVariables = VariablesOf<typeof GetPostsQuery>

// GraphQL request body type with proper validation
export interface GraphQLRequestBody<TVariables = Record<string, unknown>> {
  query: string
  variables?: TVariables
  operationName?: string
}

// Enhanced GraphQL response type
export interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
    extensions?: {
      code?: string
      field?: string
      timestamp?: string
    }
  }>
}

// Enhanced context interface with comprehensive typing
export interface Context<TVariables = Record<string, unknown>> extends BaseContext {
  operationName?: string
  variables?: TVariables
  req: {
    url: string
    method: HTTPMethod
    headers: Record<string, string>
    body?: GraphQLRequestBody<TVariables>
  }
  headers: Record<string, string>
  method: HTTPMethod
  contentType: MimeType | string
  metadata: RequestMetadata
  security: SecurityContext
  userId?: number
  user?: User
}

// Specific context types for different operations
export interface LoginContext extends Context<LoginVariables> {
  operationName: 'Login'
}

export interface SignupContext extends Context<SignupVariables> {
  operationName: 'Signup'
}

export interface CreateDraftContext extends Context<CreateDraftVariables> {
  operationName: 'CreateDraft'
}

export interface GetMeContext extends Context<never> {
  operationName: 'GetMe'
}

export interface GetPostsContext extends Context<GetPostsVariables> {
  operationName: 'GetPosts'
}

// Union type for all possible contexts
export type TypedContext =
  | LoginContext
  | SignupContext
  | CreateDraftContext
  | GetMeContext
  | GetPostsContext
  | Context<Record<string, unknown>>

// Create enhanced context with proper error handling and type safety
export const createContext: ContextFunction<[{ req: GraphQLIncomingMessage }], Context> = async ({ req }) => {
  // Access the properly typed request body
  const body = req.body;

  const operationName = body?.operationName;
  const variables = body?.variables;

  const headers = Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : String(value)]));

  // Extract method and URL with defaults
  const method = (req.method as HTTPMethod) || 'POST'
  const url = req.url || '/graphql'
  const contentType = headers['content-type'] || 'application/json'

  // Create request metadata
  const metadata: RequestMetadata = {
    ip: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
    userAgent: headers['user-agent'] || 'unknown',
    operationName: undefined, // Will be set later from GraphQL request
    query: undefined, // Will be set later from GraphQL request
    variables: undefined, // Will be set later from GraphQL request
    startTime: Date.now(),
  }

  // Create basic context structure
  const basicContext = {
    req: {
      url,
      method,
      headers,
      body: req.body,
    },
    headers,
    method,
    contentType,
    metadata,
  }

  // Get user ID and create security context
  const userId = getUserId(basicContext as Context)
  const isAuthenticated = Boolean(userId)

  const security: SecurityContext = {
    isAuthenticated,
    userId: userId || undefined,
    userEmail: undefined, // Will be populated if needed
    roles: [], // Will be populated based on user data
    permissions: [], // Will be populated based on user roles
  }

  // Create final enhanced context
  const context: Context = {
    ...basicContext,
    security,
    userId: userId || undefined,
    user: undefined, // Will be populated by resolvers if needed
    operationName,
    variables,
  }

  return context
}

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

// Enhanced context helpers with better typing
export function isAuthenticated<TVariables = Record<string, unknown>>(context: Context<TVariables>): boolean {
  return context.security.isAuthenticated
}

export function requireAuthentication<TVariables = Record<string, unknown>>(context: Context<TVariables>): number {
  if (!context.security.isAuthenticated || !context.userId) {
    throw new Error('Authentication required')
  }
  return context.userId
}

export function hasPermission<TVariables = Record<string, unknown>>(context: Context<TVariables>, permission: string): boolean {
  return context.security.permissions?.includes(permission) || false
}

export function hasRole<TVariables = Record<string, unknown>>(
  context: Context<TVariables>,
  role: string,
): boolean {
  return context.security.roles?.includes(role) || false
}

// Context validation helpers
export function validateContext<TVariables = Record<string, unknown>>(context: Context<TVariables>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!context.method) {
    errors.push('HTTP method is required')
  }

  if (!context.contentType) {
    errors.push('Content-Type header is required')
  }

  if (context.method === 'POST' && !context.req.body) {
    errors.push('Request body is required for POST requests')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Type guards for specific operation contexts
export function isLoginContext(context: Context): context is LoginContext {
  return context.operationName === 'Login'
}

export function isSignupContext(context: Context): context is SignupContext {
  return context.operationName === 'Signup'
}

export function isCreateDraftContext(context: Context): context is CreateDraftContext {
  return context.operationName === 'CreateDraft'
}

export function isGetMeContext(context: Context): context is GetMeContext {
  return context.operationName === 'GetMe'
}

export function isGetPostsContext(context: Context): context is GetPostsContext {
  return context.operationName === 'GetPosts'
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
