import { graphql } from 'gql.tada'

// =============================================================================
// RELAY GRAPHQL QUERIES  
// =============================================================================

// Fragment for Post fields in Relay
export const RelayPostFragment = graphql(`
  fragment RelayPost on Post {
    id
    title
    content
    published
    viewCount
    createdAt
    updatedAt
    published
    author {
      id
      name
      email
    }
  }
`)

// Fragment for User fields in Relay
export const RelayUserFragment = graphql(`
  fragment RelayUser on User {
    id
    name
    email
  }
`)

// Get current user
export const GetMeQuery = graphql(`
  query GetMe {
    meDirect {
      ...RelayUser
    }
  }
`, [RelayUserFragment])

// Get user by ID (global ID)
export const GetUserQuery = graphql(`
  query GetUser($id: ID!) {
    userDirect(id: $id) {
      ...RelayUser
    }
  }
`, [RelayUserFragment])

// Get all users with pagination
export const GetUsersQuery = graphql(`
  query GetUsers($first: Int, $after: String) {
    usersDirect(first: $first, after: $after) {
      edges {
        cursor
        node {
          ...RelayUser
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`, [RelayUserFragment])

// Get post by ID (global ID)
export const GetPostQuery = graphql(`
  query GetPost($id: ID!) {
    postDirect(id: $id) {
      ...RelayPost
    }
  }
`, [RelayPostFragment])

// Get feed with pagination
export const GetFeedQuery = graphql(`
  query GetFeed(
    $first: Int
    $after: String
    $searchString: String
  ) {
    feedDirect(
      first: $first
      after: $after
      searchString: $searchString
    ) {
      edges {
        cursor
        node {
          ...RelayPost
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`, [RelayPostFragment])

// Get user drafts with pagination
export const GetDraftsQuery = graphql(`
  query GetDrafts($first: Int, $after: String) {
    draftsDirect(first: $first, after: $after) {
      edges {
        cursor
        node {
          ...RelayPost
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`, [RelayPostFragment])