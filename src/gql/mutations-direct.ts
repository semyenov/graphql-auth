/**
 * Direct GraphQL Mutations
 * 
 * Simple GraphQL operation strings for direct resolver mutations
 */

import { graphql } from 'gql.tada'

// Authentication mutations
export const SignupDirectMutation = graphql(`
  mutation SignupDirect($email: String!, $password: String!, $name: String) {
    signupDirect(email: $email, password: $password, name: $name)
  }
`)

export const LoginDirectMutation = graphql(`
  mutation LoginDirect($email: String!, $password: String!) {
    loginDirect(email: $email, password: $password)
  }
`)

// Post mutations
export const CreatePostDirectMutation = graphql(`
  mutation CreatePostDirect($input: CreatePostInput!) {
    createPostDirect(input: $input) {
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

export const UpdatePostDirectMutation = graphql(`
  mutation UpdatePostDirect($id: ID!, $input: UpdatePostInput!) {
    updatePostDirect(id: $id, input: $input) {
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

export const DeletePostDirectMutation = graphql(`
  mutation DeletePostDirect($id: ID!) {
    deletePostDirect(id: $id)
  }
`)

export const TogglePublishPostDirectMutation = graphql(`
  mutation TogglePublishPostDirect($id: ID!) {
    togglePublishPostDirect(id: $id) {
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

export const IncrementPostViewCountDirectMutation = graphql(`
  mutation IncrementPostViewCountDirect($id: ID!) {
    incrementPostViewCountDirect(id: $id) {
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