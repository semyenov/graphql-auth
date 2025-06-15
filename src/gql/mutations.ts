import { graphql } from 'gql.tada'
import { PostWithAuthorFragment } from './fragments'

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
`, [PostWithAuthorFragment])

export const DeletePostMutation = graphql(`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id) {
      ...PostWithAuthor
    }
  }
`, [PostWithAuthorFragment])

export const TogglePublishPostMutation = graphql(`
  mutation TogglePublishPost($id: Int!) {
    togglePublishPost(id: $id) {
      ...PostWithAuthor
    }
  }
`, [PostWithAuthorFragment])

export const IncrementPostViewCountMutation = graphql(`
  mutation IncrementPostViewCount($id: Int!) {
    incrementPostViewCount(id: $id) {
      ...PostWithAuthor
    }
  }
`, [PostWithAuthorFragment]) 