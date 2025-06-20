/**
 * Direct GraphQL Queries
 * 
 * Simple GraphQL operation strings for direct resolver queries
 */

import { graphql } from 'gql.tada'

// Authentication queries
export const MeQuery = graphql(`
  query Me {  
    me {
      id
      email
      name
    }
  }
`)

// Post queries
export const FeedQuery = graphql(`
  query Feed($first: Int, $after: String, $searchString: String) {
    feed(first: $first, after: $after, searchString: $searchString) {
      edges {
        cursor
        node {
          id
          title
          content
          published
          viewCount
          createdAt
          updatedAt
          author {
            id
            email
            name
          }
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
`)

export const DraftsQuery = graphql(`
  query Drafts($first: Int, $after: String) {
    drafts(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          content
          published
          viewCount
          createdAt
          updatedAt
          author {
            id
            email
            name
          }
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
`)

export const PostQuery = graphql(`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      content
      published
      viewCount
      createdAt
      updatedAt
      author {
        id
        email
        name
      }
    }
  }
`)

// User queries
export const UserQuery = graphql(`
  query User($id: ID!) {
    user(id: $id) {
      id
      email
      name
      postCount
      publishedPostCount
    }
  }
`)

export const UsersQuery = graphql(`
  query Users($first: Int, $after: String, $where: UserWhereInput, $orderBy: UserOrderByInput) {
    users(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          id
          email
          name
          postCount
          publishedPostCount
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
`)

export const SearchUsersQuery = graphql(`
  query SearchUsers($search: String!, $first: Int, $after: String) {
    searchUsers(search: $search, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          email
          name
          postCount
          publishedPostCount
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
`)