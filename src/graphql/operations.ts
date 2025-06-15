import { graphql, type ResultOf, type VariablesOf } from 'gql.tada'

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