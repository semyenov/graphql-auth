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

// Enhanced authentication mutations
export const SignupWithVerificationMutation = graphql(`
  mutation SignupWithVerification($email: String!, $password: String!, $name: String) {
    signupWithVerification(email: $email, password: $password, name: $name) {
      success
      message
      requiresEmailVerification
    }
  }
`)

export const LoginSecureMutation = graphql(`
  mutation LoginSecure($email: String!, $password: String!) {
    loginSecure(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        emailVerified
      }
      requiresEmailVerification
      message
    }
  }
`)

export const VerifyEmailMutation = graphql(`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`)

export const ResendVerificationEmailMutation = graphql(`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email) {
      success
      message
    }
  }
`)

export const RequestPasswordResetMutation = graphql(`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`)

export const ResetPasswordMutation = graphql(`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
    }
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
