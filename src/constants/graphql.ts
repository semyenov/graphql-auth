/**
 * GraphQL-specific constants
 */

export const GRAPHQL_TYPES = {
  POST: 'Post',
  USER: 'User',
  QUERY: 'Query',
  MUTATION: 'Mutation',
  SUBSCRIPTION: 'Subscription',
} as const

export const RELAY_CONSTANTS = {
  NODE_INTERFACE: 'Node',
  CURSOR_PREFIX: 'cursor:',
  DEFAULT_FIRST: 10,
  MAX_FIRST: 100,
} as const

export const GRAPHQL_SCALARS = {
  ID: 'ID',
  STRING: 'String',
  INT: 'Int',
  FLOAT: 'Float',
  BOOLEAN: 'Boolean',
  DATE_TIME: 'DateTime',
} as const

export const GRAPHQL_DIRECTIVES = {
  DEPRECATED: '@deprecated',
  SKIP: '@skip',
  INCLUDE: '@include',
} as const

export const GRAPHQL_OPERATIONS = {
  // Queries
  ME: 'me',
  USER: 'user',
  USERS: 'users',
  POST: 'post',
  POSTS: 'posts',
  FEED: 'feed',
  DRAFTS: 'drafts',
  
  // Mutations
  SIGNUP: 'signup',
  LOGIN: 'login',
  CREATE_DRAFT: 'createDraft',
  UPDATE_POST: 'updatePost',
  DELETE_POST: 'deletePost',
  TOGGLE_PUBLISH_POST: 'togglePublishPost',
  INCREMENT_POST_VIEW_COUNT: 'incrementPostViewCount',
} as const

export const GRAPHQL_ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_USER_INPUT: 'BAD_USER_INPUT',
} as const