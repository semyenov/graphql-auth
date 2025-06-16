import { graphql } from 'gql.tada'
import * as fragments from './fragments'

// =============================================================================
// GRAPHQL QUERIES
// =============================================================================

export const GetMeQuery = graphql(`
  query GetMe {
    me {
      ...UserInfo
      posts {
        ...PostInfo
      }
    }
  }
`, [fragments.UserInfoFragment, fragments.PostInfoFragment])

export const GetAllUsersQuery = graphql(`
  query GetAllUsers {
    users {
      edges {
        node {
          ...UserInfo
          posts { 
            ...PostInfo
          }
        }
      }
    }
  }
`, [fragments.UserInfoFragment, fragments.PostInfoFragment])

export const GetPostQuery = graphql(`
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment])

export const GetFeedQuery = graphql(`
  query GetFeed(
    $searchString: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    feed( 
      after: $after
      before: $before
      searchString: $searchString
      first: $first 
      last: $last
    ) {
      edges {
        cursor
        node {
          ...PostWithAuthor
        }
      }
    }
  }
`, [fragments.PostWithAuthorFragment, fragments.PostInfoFragment])

export const GetDraftsByUserQuery = graphql(`
  query GetDraftsByUser($userId: ID!) {
    drafts(userId: $userId) {
      edges {
        cursor
        node {
          ...PostWithAuthor
        }
      }
    }
  }
`, [fragments.PostWithAuthorFragment]) 