import { graphql } from 'gql.tada'
import {
  PostInfoFragment,
  PostWithAuthorFragment,
  UserInfoFragment,
} from './fragments'

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
`, [UserInfoFragment, PostInfoFragment])

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
`, [UserInfoFragment, PostInfoFragment])

export const GetPostQuery = graphql(`
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostWithAuthor
    }
  }
`, [PostWithAuthorFragment])

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
`, [PostWithAuthorFragment, PostInfoFragment])

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
`, [PostWithAuthorFragment]) 