/**
 * Re-export input types for easier imports
 */

export {
  BooleanFilter,
  DateTimeFilter,
  IntFilter,
  PostCreateInput,
  PostOrderByInput,
  PostOrderByUpdatedAtInput,
  PostUpdateInput,
  PostWhereInput,
  StringFilter,
  UserOrderByInput,
  UserSearchInput,
  UserUniqueInput,
  UserWhereInput,
} from './inputs'

// Re-export from posts-direct.resolver for consistency
export const CreatePostInput = 'CreatePostInput'
export const UpdatePostInput = 'UpdatePostInput'
