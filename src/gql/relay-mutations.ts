import { graphql } from 'gql.tada'
import * as relayQueries from './relay-queries'

// =============================================================================
// RELAY GRAPHQL MUTATIONS
// =============================================================================

// Auth mutations (unchanged - they don't return nodes)
export const SignupMutation = graphql(`
  mutation Signup($email: String!, $password: String!, $name: String) {
    signupDirect(email: $email, password: $password, name: $name)
  }
`)

export const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    loginDirect(email: $email, password: $password)
  }
`)

// Post mutations using global IDs
export const CreateDraftMutation = graphql(`
  mutation CreateDraft($input: CreatePostInput!) {
    createPostDirect(input: $input) {
      ...RelayPost
    }
  }
`, [relayQueries.RelayPostFragment])

export const DeletePostMutation = graphql(`
  mutation DeletePost($id: ID!) {
    deletePostDirect(id: $id)
  }
`, [relayQueries.RelayPostFragment])

export const TogglePublishPostMutation = graphql(`
  mutation TogglePublishPost($id: ID!) {
    togglePublishPostDirect(id: $id) {
      ...RelayPost
    }
  }
`, [relayQueries.RelayPostFragment])

export const IncrementPostViewCountMutation = graphql(`
  mutation IncrementPostViewCount($id: ID!) {
    incrementPostViewCountDirect(id: $id) {
      ...RelayPost
    }
  }
`, [relayQueries.RelayPostFragment])