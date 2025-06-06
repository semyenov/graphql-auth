import { PrismaClient } from '@prisma/client'
import type { DynamicParam, Endpoint, TypedFetchInput, TypedFetchRequestInit } from 'fetchdts'
import { graphql, type ResultOf, type VariablesOf } from 'gql.tada'

const prisma = new PrismaClient()

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

interface AuthPayload {
  token?: string
  user: User
}

interface PostCreateInput {
  title: string
  content?: string
}

interface UserUniqueInput {
  id?: number
  email?: string
}

interface PostOrderByUpdatedAtInput {
  updatedAt: 'asc' | 'desc'
}

// GraphQL Tada typed queries - fully type-safe with your schema
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
      }
    }
  }
`)

export const GetFeedQuery = graphql(`
  query GetFeed($searchString: String, $skip: Int, $take: Int, $orderBy: PostOrderByUpdatedAtInput) {
    feed(searchString: $searchString, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      title
      content
      published
      createdAt
      updatedAt
      viewCount
      author {
        id
        name
        email
      }
    }
  }
`)

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
export type GetMeResult = ResultOf<typeof GetMeQuery>
export type GetFeedResult = ResultOf<typeof GetFeedQuery>
export type GetFeedVariables = VariablesOf<typeof GetFeedQuery>
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
          variables?: any
          operationName?: string
        }
        headers?: {
          authorization?: string
          'content-type': string
        }
        response: {
          data?: any
          errors?: Array<{
            message: string
            locations?: Array<{ line: number; column: number }>
            path?: Array<string | number>
          }>
        }
      }
    }
  }
  // Typed endpoints using GraphQL Tada types
  '/query/me': {
    [Endpoint]: {
      GET: {
        headers?: { authorization?: string }
        response: { data: GetMeResult }
      }
    }
  }
  '/query/feed': {
    [Endpoint]: {
      GET: {
        query?: GetFeedVariables
        headers?: { authorization?: string }
        response: { data: GetFeedResult }
      }
    }
  }
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
  body?: any
} & TypedFetchRequestInit<GraphQLAPISchema, T>

export interface Context {
  prisma: PrismaClient
  req: TypedRequest // Typed with both fetchdts and GraphQL Tada
}

export function createContext({ req }: { req: TypedRequest }): Context {
  return {
    req,
    prisma,
  }
}

// Helper function for type-safe GraphQL execution
export async function executeGraphQL<TData = any, TVariables = any>(
  query: string,
  variables?: TVariables,
  headers?: Record<string, string>
): Promise<{ data?: TData; errors?: any[] }> {
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

  return response.json() as Promise<{ data?: TData; errors?: any[] }>
}
