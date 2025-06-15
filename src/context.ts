import { ContextFunction } from '@apollo/server'
import type {
  Endpoint,
  HTTPMethod,
  TypedFetchResponseBody
} from 'fetchdts'
import { graphql, type ResultOf, type VariablesOf } from 'gql.tada'
import { IncomingMessage } from 'http'

// Define types for GraphQL operations
interface User {
  id: number
  email: string
  name?: string
  posts: Post[]
}

interface Post {
  id: number
  title: string
  content?: string
  published: boolean
  author: User
  createdAt: string
  updatedAt: string
  viewCount: number
}

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

// Type aliases for easy access to query types
export type LoginResult = ResultOf<typeof LoginMutation>
export type LoginVariables = VariablesOf<typeof LoginMutation>
export type SignupResult = ResultOf<typeof SignupMutation>
export type SignupVariables = VariablesOf<typeof SignupMutation>
export type CreateDraftResult = ResultOf<typeof CreateDraftMutation>
export type CreateDraftVariables = VariablesOf<typeof CreateDraftMutation>

// GraphQL request body type
interface GraphQLRequestBody {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

// GraphQL response type
export interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
  }>
}

// Enhanced API Schema for fetchdts with proper endpoint typing
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

// Enhanced context interface with proper typing
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

// Update the context function to handle Apollo Server's context with better typing
export const createContext: ContextFunction<[{ req: IncomingMessage }], Context> = async ({ req }) => {
  // Convert IncomingMessage headers to record
  const headers: Record<string, string> = {}
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      headers[key] = Array.isArray(value) ? value.join(', ') : String(value)
    }
  })

  // Create context with proper typing
  const context: Context = {
    req: {
      url: req.url || '/graphql',
      method: (req.method as HTTPMethod) || 'POST',
      headers,
      body: (req as any).body
    },
    headers,
    method: (req.method as HTTPMethod) || 'POST',
    contentType: headers['content-type'] || 'application/json',
  }

  return context
}

// Type-safe GraphQL execution with fetchdts integration
export async function executeGraphQL<TData = unknown, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  headers?: Record<string, string>
): Promise<GraphQLResponse<TData>> {
  const requestBody = JSON.stringify({
    query,
    variables,
  })

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: requestBody,
  })

  return response.json() as Promise<GraphQLResponse<TData>>
}

// Helper type for GraphQL endpoint response
export type GraphQLEndpointResponse<T> = TypedFetchResponseBody<GraphQLAPISchema, '/graphql', 'POST'> & {
  data?: T
}

// Type-safe request helper using fetchdts types
export function createTypedRequest<T extends keyof GraphQLAPISchema>(
  endpoint: T,
  method: HTTPMethod,
  body?: GraphQLRequestBody,
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
