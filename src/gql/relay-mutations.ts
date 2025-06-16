import { graphql } from 'gql.tada'
import { RelayPostFragment } from './relay-queries'

// =============================================================================
// RELAY GRAPHQL MUTATIONS
// =============================================================================

// Auth mutations (unchanged - they don't return nodes)
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

// Post mutations using global IDs
export const CreateDraftMutation = graphql(`
  mutation CreateDraft($data: PostCreateInput!) {
    createDraft(data: $data) {
      ...RelayPost
    }
  }
`, [RelayPostFragment])

export const DeletePostMutation = graphql(`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      ...RelayPost
    }
  }
`, [RelayPostFragment])

export const TogglePublishPostMutation = graphql(`
  mutation TogglePublishPost($id: ID!) {
    togglePublishPost(id: $id) {
      ...RelayPost
    }
  }
`, [RelayPostFragment])

export const IncrementPostViewCountMutation = graphql(`
  mutation IncrementPostViewCount($id: ID!) {
    incrementPostViewCount(id: $id) {
      ...RelayPost
    }
  }
`, [RelayPostFragment])