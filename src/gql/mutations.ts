/**
 * Direct GraphQL Mutations
 *
 * Simple GraphQL operation strings for direct resolver mutations
 */

import { graphql } from 'gql.tada'

// Authentication mutations
export const SignupMutation = graphql(`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signup(email: $email, password: $password, name: $name)
  }
`)

export const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`)

// Post mutations
export const CreatePostMutation = graphql(`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      published
      viewCount
      createdAt
      updatedAt
      author {
        id
        email
        name
      }
    }
  }
`)

export const UpdatePostMutation = graphql(`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      published
      viewCount
      createdAt
      updatedAt
      author {
        id
        email
        name
      }
    }
  }
`)

export const DeletePostMutation = graphql(`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`)

export const TogglePublishPostMutation = graphql(`
  mutation TogglePublishPost($id: ID!) {
    togglePublishPost(id: $id) {
      id
      title
      content
      published
      viewCount
      createdAt
      updatedAt
      author {
        id
        email
        name
      }
    }
  }
`)

export const IncrementPostViewCountMutation = graphql(`
  mutation IncrementPostViewCount($id: ID!) {
    incrementPostViewCount(id: $id) {
      id
      title
      content
      published
      viewCount
      createdAt
      updatedAt
      author {
        id
        email
        name
      }
    }
  }
`)

// User mutations
export const UpdateUserProfileMutation = graphql(`
  mutation UpdateUserProfile($input: UpdateUserInput!) {
    updateUserProfile(input: $input) {
      id
      email
      name
    }
  }
`)
