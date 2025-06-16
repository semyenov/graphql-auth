import { graphql } from 'gql.tada'
import * as fragments from './fragments'

// =============================================================================
// GRAPHQL MUTATIONS
// =============================================================================

export const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    loginDirect(email: $email, password: $password)
  } 
`)

export const SignupMutation = graphql(`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signupDirect(email: $email, password: $password, name: $name)
  }
`)

export const CreatePostMutation = graphql(`
  mutation CreatePost($input: CreatePostInput!) {
    createPostDirect(input: $input) {
      ...PostWithAuthor 
    }
  } 
`, [fragments.PostWithAuthorFragment])

export const DeletePostMutation = graphql(`
  mutation DeletePost($id: ID!) {
    deletePostDirect(id: $id)
  }
`, [fragments.PostWithAuthorFragment])

export const TogglePublishPostMutation = graphql(`
  mutation TogglePublishPost($id: ID!) {
    togglePublishPostDirect(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment])

export const IncrementPostViewCountMutation = graphql(`
  mutation IncrementPostViewCount($id: ID!) {
    incrementPostViewCountDirect(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment]) 