import { graphql } from 'gql.tada'
import * as fragments from './fragments'

// =============================================================================
// DIRECT GRAPHQL MUTATIONS (Without Use Cases)
// =============================================================================

export const LoginDirectMutation = graphql(`
  mutation LoginDirect($email: String!, $password: String!) {
    loginDirect(email: $email, password: $password)
  } 
`)

export const SignupDirectMutation = graphql(`
  mutation SignupDirect($email: String!, $password: String!, $name: String) {
    signupDirect(email: $email, password: $password, name: $name)
  }
`)

export const CreatePostDirectMutation = graphql(`
  mutation CreatePostDirect($input: CreatePostInput!) {
    createPostDirect(input: $input) {
      ...PostWithAuthor 
    }
  } 
`, [fragments.PostWithAuthorFragment])

export const UpdatePostDirectMutation = graphql(`
  mutation UpdatePostDirect($id: ID!, $input: UpdatePostInput!) {
    updatePostDirect(id: $id, input: $input) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment])

export const DeletePostDirectMutation = graphql(`
  mutation DeletePostDirect($id: ID!) {
    deletePostDirect(id: $id)
  }
`)

export const TogglePublishPostDirectMutation = graphql(`
  mutation TogglePublishPostDirect($id: ID!) {
    togglePublishPostDirect(id: $id) {
      ...PostInfo
      author {
        ...UserInfo
      }
    }
  }
`, [fragments.PostInfoFragment, fragments.UserInfoFragment])

export const IncrementPostViewCountDirectMutation = graphql(`
  mutation IncrementPostViewCountDirect($id: ID!) {
    incrementPostViewCountDirect(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment])

export const UpdateUserProfileMutation = graphql(`
  mutation UpdateUserProfile($input: UpdateUserInput!) {
    updateUserProfile(input: $input) {
      ...UserInfo
    }
  }
`, [fragments.UserInfoFragment])