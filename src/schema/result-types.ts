/**
 * Union Result Types for Safe Error Handling
 * 
 * These types enable GraphQL clients to handle both success and error
 * cases explicitly, improving error handling and type safety.
 */

import { builder } from './builder'
import { 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError
} from '../errors'

/**
 * AuthSuccess - Successful authentication result
 */
const AuthSuccess = builder.objectType('AuthSuccess', {
  description: 'Successful authentication result',
  fields: (t) => ({
    token: t.string({
      description: 'JWT authentication token'
    }),
    user: t.field({
      type: 'User',
      description: 'The authenticated user',
      resolve: async (parent, args, { prisma }) => {
        return prisma.user.findUniqueOrThrow({
          where: { id: parent.userId }
        })
      }
    }),
    expiresAt: t.field({
      type: 'DateTime',
      description: 'Token expiration time',
      resolve: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })
  })
})

/**
 * AuthResult - Union type for authentication operations
 */
export const AuthResult = builder.unionType('AuthResult', {
  description: 'Result of authentication operations (signup/login)',
  types: [AuthSuccess, ValidationError, ConflictError, AuthenticationError, RateLimitError],
  resolveType: (value) => {
    if (value instanceof ValidationError) return 'ValidationError'
    if (value instanceof ConflictError) return 'ConflictError'
    if (value instanceof AuthenticationError) return 'AuthenticationError'
    if (value instanceof RateLimitError) return 'RateLimitError'
    return 'AuthSuccess'
  }
})

/**
 * PostSuccess - Successful post operation result
 */
const PostSuccess = builder.objectType('PostSuccess', {
  description: 'Successful post operation result',
  fields: (t) => ({
    post: t.field({
      type: 'Post',
      description: 'The post that was created/updated'
    }),
    message: t.string({
      description: 'Success message',
      nullable: true
    })
  })
})

/**
 * PostResult - Union type for post mutations
 */
export const PostResult = builder.unionType('PostResult', {
  description: 'Result of post mutations',
  types: [PostSuccess, ValidationError, AuthenticationError, AuthorizationError, NotFoundError],
  resolveType: (value) => {
    if (value instanceof ValidationError) return 'ValidationError'
    if (value instanceof AuthenticationError) return 'AuthenticationError'
    if (value instanceof AuthorizationError) return 'AuthorizationError'
    if (value instanceof NotFoundError) return 'NotFoundError'
    return 'PostSuccess'
  }
})

/**
 * DeleteSuccess - Successful deletion result
 */
const DeleteSuccess = builder.objectType('DeleteSuccess', {
  description: 'Successful deletion result',
  fields: (t) => ({
    success: t.boolean({
      description: 'Whether the deletion was successful',
      resolve: () => true
    }),
    message: t.string({
      description: 'Deletion confirmation message'
    }),
    deletedId: t.string({
      description: 'ID of the deleted resource'
    })
  })
})

/**
 * DeleteResult - Union type for delete operations
 */
export const DeleteResult = builder.unionType('DeleteResult', {
  description: 'Result of delete operations',
  types: [DeleteSuccess, AuthenticationError, AuthorizationError, NotFoundError],
  resolveType: (value) => {
    if (value instanceof AuthenticationError) return 'AuthenticationError'
    if (value instanceof AuthorizationError) return 'AuthorizationError'
    if (value instanceof NotFoundError) return 'NotFoundError'
    return 'DeleteSuccess'
  }
})

/**
 * UserSuccess - Successful user operation result
 */
const UserSuccess = builder.objectType('UserSuccess', {
  description: 'Successful user operation result',
  fields: (t) => ({
    user: t.field({
      type: 'User',
      description: 'The user that was created/updated'
    }),
    message: t.string({
      description: 'Success message',
      nullable: true
    })
  })
})

/**
 * UserResult - Union type for user mutations
 */
export const UserResult = builder.unionType('UserResult', {
  description: 'Result of user mutations',
  types: [UserSuccess, ValidationError, AuthenticationError, ConflictError],
  resolveType: (value) => {
    if (value instanceof ValidationError) return 'ValidationError'
    if (value instanceof AuthenticationError) return 'AuthenticationError'
    if (value instanceof ConflictError) return 'ConflictError'
    return 'UserSuccess'
  }
})

/**
 * TokenRefreshSuccess - Successful token refresh result
 */
const TokenRefreshSuccess = builder.objectType('TokenRefreshSuccess', {
  description: 'Successful token refresh result',
  fields: (t) => ({
    accessToken: t.string({
      description: 'New JWT access token'
    }),
    refreshToken: t.string({
      description: 'New refresh token'
    }),
    expiresAt: t.field({
      type: 'DateTime',
      description: 'Access token expiration time',
      resolve: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    })
  })
})

/**
 * TokenRefreshResult - Union type for token refresh operations
 */
export const TokenRefreshResult = builder.unionType('TokenRefreshResult', {
  description: 'Result of token refresh operations',
  types: [TokenRefreshSuccess, AuthenticationError, ValidationError],
  resolveType: (value) => {
    if (value instanceof AuthenticationError) return 'AuthenticationError'
    if (value instanceof ValidationError) return 'ValidationError'
    return 'TokenRefreshSuccess'
  }
})

/**
 * Helper function to create success results
 */
export const createAuthSuccess = (token: string, userId: string) => ({
  __typename: 'AuthSuccess' as const,
  token,
  userId
})

export const createPostSuccess = (post: any, message?: string) => ({
  __typename: 'PostSuccess' as const,
  post,
  message
})

export const createDeleteSuccess = (deletedId: string, message: string) => ({
  __typename: 'DeleteSuccess' as const,
  success: true,
  message,
  deletedId
})

export const createUserSuccess = (user: any, message?: string) => ({
  __typename: 'UserSuccess' as const,
  user,
  message
})

export const createTokenRefreshSuccess = (accessToken: string, refreshToken: string) => ({
  __typename: 'TokenRefreshSuccess' as const,
  accessToken,
  refreshToken
})