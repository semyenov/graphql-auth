/**
 * Direct GraphQL Queries
 * 
 * Simple GraphQL operation strings for direct resolver queries
 */

import { graphql } from 'gql.tada'

// Authentication queries
export const MeDirectQuery = graphql(`
  query MeDirect {  
    meDirect {
      id
      email
      name
    }
  }
`)

// Post queries
export const FeedDirectQuery = graphql(`
  query FeedDirect($first: Int, $after: String, $searchString: String) {
    feedDirect(first: $first, after: $after, searchString: $searchString) {
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

export const DraftsDirectQuery = graphql(`
  query DraftsDirect($first: Int, $after: String) {
    draftsDirect(first: $first, after: $after) {
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

export const PostDirectQuery = graphql(`
  query PostDirect($id: ID!) {
    postDirect(id: $id) {
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
export const UserDirectQuery = graphql(`
  query UserDirect($id: ID!) {
    userDirect(id: $id) {
      id
      email
      name
      postCount
      publishedPostCount
    }
  }
`)

export const UsersDirectQuery = graphql(`
  query UsersDirect($first: Int, $after: String, $where: UserWhereInput, $orderBy: UserOrderByInput) {
    usersDirect(first: $first, after: $after, where: $where, orderBy: $orderBy) {
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

export const SearchUsersDirectQuery = graphql(`
  query SearchUsersDirect($search: String!, $first: Int, $after: String) {
    searchUsersDirect(search: $search, first: $first, after: $after) {
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