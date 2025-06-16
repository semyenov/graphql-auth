import { graphql } from 'gql.tada'
import * as fragments from './fragments'

// =============================================================================
// GRAPHQL MUTATIONS
// =============================================================================

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
      ...PostWithAuthor 
    }
  } 
`, [fragments.PostWithAuthorFragment])

export const DeletePostMutation = graphql(`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment])

export const TogglePublishPostMutation = graphql(`
  mutation TogglePublishPost($id: ID!) {
    togglePublishPost(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment])

export const IncrementPostViewCountMutation = graphql(`
  mutation IncrementPostViewCount($id: ID!) {
    incrementPostViewCount(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment]) 