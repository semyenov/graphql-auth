import type { Endpoint, TypedFetchInput, TypedFetchRequestInit } from 'fetchdts'
import { graphql, type ResultOf, type VariablesOf } from 'gql.tada'
import { GraphQLError } from 'graphql'

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
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`)

export const SignupMutation = graphql(`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
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

// Enhanced API Schema for fetchdts with GraphQL Tada integration
export interface GraphQLAPISchema {
  '/graphql': {
    [Endpoint]: {
      POST: {
        body: {
          query: string
          variables?: Record<string, unknown>
          operationName?: string
        }
        headers?: {
          authorization?: string
          'content-type': string
        }
        response: {
          data?: Record<string, unknown>
          errors?: Array<{
            message: string
            locations?: Array<{ line: number; column: number }>
            path?: Array<string | number>
          }>
        }
      }
    }
  }

  // Authentication endpoints
  '/mutation/login': {
    [Endpoint]: {
      POST: {
        body: LoginVariables
        response: { data: LoginResult }
      }
    }
  }
  '/mutation/signup': {
    [Endpoint]: {
      POST: {
        body: SignupVariables
        response: { data: SignupResult }
      }
    }
  }
  '/mutation/createDraft': {
    [Endpoint]: {
      POST: {
        body: CreateDraftVariables
        headers?: { authorization?: string }
        response: { data: CreateDraftResult }
      }
    }
  }
}

// Type the request using fetchdts with GraphQL Tada integration
export type TypedRequest<T extends TypedFetchInput<GraphQLAPISchema> = TypedFetchInput<GraphQLAPISchema>> = {
  url: T
  method?: string
  headers?: Record<string, string>
  body?: TypedFetchRequestInit<GraphQLAPISchema, T>['body']
} & TypedFetchRequestInit<GraphQLAPISchema, T>

export interface Context {
  req: TypedRequest // Typed with both fetchdts and GraphQL Tada
}

export async function createContext({ req }: { req: TypedRequest }): Promise<Context> {
  return { req }
}

// Helper function for type-safe GraphQL execution
export async function executeGraphQL<TData = Record<string, unknown>, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  headers?: Record<string, string>
): Promise<{ data?: TData; errors?: GraphQLError[] }> {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return response.json() as Promise<{ data?: TData; errors?: GraphQLError[] }>
}
