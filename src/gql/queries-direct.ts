import { graphql } from 'gql.tada'
import * as fragments from './fragments'

// =============================================================================
// DIRECT GRAPHQL QUERIES (Without Use Cases)
// =============================================================================

export const MeDirectQuery = graphql(`
  query MeDirect {
    meDirect {
      ...UserInfo
      posts {
        edges {
          node {
            ...PostWithAuthor
          }
        }
      }
    }
  }
`, [fragments.UserInfoFragment, fragments.PostWithAuthorFragment])

export const FeedDirectQuery = graphql(`
  query FeedDirect($first: Int, $after: String) {
    feedDirect(first: $first, after: $after) {
      edges {
        cursor
        node {
          ...PostWithAuthor
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`, [fragments.PostWithAuthorFragment])

export const PostDirectQuery = graphql(`
  query PostDirect($id: ID!) {
    postDirect(id: $id) {
      ...PostWithAuthor
    }
  }
`, [fragments.PostWithAuthorFragment])

export const DraftsDirectQuery = graphql(`
  query DraftsDirect($first: Int, $after: String) {
    draftsDirect(first: $first, after: $after) {
      edges {
        cursor
        node {
          ...PostWithAuthor
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`, [fragments.PostWithAuthorFragment])

export const UserDirectQuery = graphql(`
  query UserDirect($id: ID!) {
    userDirect(id: $id) {
      ...UserWithPosts
    }
  }
`, [fragments.UserWithPostsFragment])

export const UsersDirectQuery = graphql(`
  query UsersDirect($first: Int, $after: String, $where: UserWhereInput, $orderBy: UserOrderByInput) {
    usersDirect(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...UserInfo
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`, [fragments.UserInfoFragment])

export const SearchUsersDirectQuery = graphql(`
  query SearchUsersDirect($search: String!, $first: Int, $after: String) {
    searchUsersDirect(search: $search, first: $first, after: $after) {
      edges {
        cursor
        node {
          ...UserInfo
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`, [fragments.UserInfoFragment])