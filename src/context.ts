// Main context exports - re-exporting from semantic modules for backward compatibility

// GraphQL Types
export type {
  GraphQLMutation, GraphQLPost, GraphQLQuery, GraphQLRequestBody,
  GraphQLResponse, GraphQLUser, HTTPMethod,
  MimeType, PostCreateInput,
  PostOrderByUpdatedAtInput, SortOrder, UserUniqueInput
} from './graphql/types'

// GraphQL Operations
export {
  CreateDraftMutation,
  GetMeQuery,
  GetPostsQuery, LoginMutation,
  SignupMutation
} from './graphql/operations'

export type {
  CreateDraftResult,
  CreateDraftVariables,
  GetMeResult,
  GetPostsResult,
  GetPostsVariables, LoginResult,
  LoginVariables,
  SignupResult,
  SignupVariables
} from './graphql/operations'

// GraphQL Utils
export {
  createPostInput,
  createPostOrderBy, createTypedRequest, createUserUniqueInput, executeGraphQL
} from './graphql/utils'

// Context Types
export type {
  AuthenticatedContext,
  AuthorizedContext,
  Context,
  ContextForOperation,
  CreateDraftContext,
  GetMeContext,
  GetPostsContext,
  GraphQLIncomingMessage,
  LoginContext,
  OperationName,
  SignupContext,
  TypedContext,
  VariablesForOperation
} from './context/types'

// Context Creation
export { createContext } from './context/creation'

// Context Constants
export {
  ALLOWED_HTTP_METHODS,
  DEFAULT_VALUES,
  ERROR_MESSAGES,
  HEADER_KEYS,
  OPERATION_NAMES,
  PERMISSIONS,
  SECURITY_ROLES
} from './context/constants'

// Context Utilities
export {
  createRequestMetadata,
  createRequestObject,
  createSecurityContext,
  determineHttpMethod,
  extractClientIp,
  extractContentType,
  extractHeaders,
  extractUserAgent,
  isValidRequest
} from './context/utils'

// Authentication Helpers
export {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
  isAuthenticated,
  requireAuthentication
} from './context/auth'

// Validation Helpers
export {
  isCreateDraftContext,
  isGetMeContext,
  isGetPostsContext,
  isLoginContext,
  isSignupContext,
  isValidOperationName,
  validateAuthentication,
  validateContext,
  validateContextComprehensive,
  validateOperationContext
} from './context/validation'

export type { ValidationResult } from './context/validation'

