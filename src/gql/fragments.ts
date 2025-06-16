import { graphql } from 'gql.tada'

// =============================================================================
// GRAPHQL FRAGMENTS
// =============================================================================

export const UserInfoFragment = graphql(`
  fragment UserInfo on User {
    id
    email
    name
  }
`)

export const PostInfoFragment = graphql(`
  fragment PostInfo on Post {
    id
    title
    content
    published 
    createdAt
    updatedAt
    viewCount
  }
`)

export const PostWithAuthorFragment = graphql(`
  fragment PostWithAuthor on Post {
    ...PostInfo
    author {
      ...UserInfo
    }
  }
`, [
  PostInfoFragment,
  UserInfoFragment
])

export const UserWithPostsFragment = graphql(`
  fragment UserWithPosts on User {
    ...UserInfo
    posts {
      edges {
        node {
          ...PostWithAuthor
        }
      }
    }
  }
`, [UserInfoFragment, PostWithAuthorFragment])  