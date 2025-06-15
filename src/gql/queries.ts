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
    allUsers {
      ...UserInfo
      posts {
        ...PostInfo
      }
    }
  }
`, [UserInfoFragment, PostInfoFragment])

export const GetPostByIdQuery = graphql(`
  query GetPostById($id: Int!) {
    postById(id: $id) {
      ...PostWithAuthor
    }
  }
`, [PostWithAuthorFragment])

export const GetFeedQuery = graphql(`
  query GetFeed(
    $searchString: String
    $skip: Int
    $take: Int
    $orderBy: PostOrderByUpdatedAtInput
  ) {
    feed(
      searchString: $searchString
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      ...PostWithAuthor
    }
  }
`, [PostWithAuthorFragment])

export const GetDraftsByUserQuery = graphql(`
  query GetDraftsByUser($userUniqueInput: UserUniqueInput!) {
    draftsByUser(userUniqueInput: $userUniqueInput) {
      ...PostWithAuthor
    }
  }
`, [PostWithAuthorFragment]) 