/**
 * Context-related constants
 */

export const ALLOWED_HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
] as const

export const DEFAULT_VALUES = {
  HTTP_METHOD: 'POST',
  GRAPHQL_ENDPOINT: '/graphql',
  CONTENT_TYPE: 'application/json',
  IP_ADDRESS: 'unknown',
  USER_AGENT: 'unknown',
} as const

export const CONTEXT_ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: 'Authentication is required to access this resource',
  INVALID_USER_ID: 'Invalid or missing user ID in authentication context',
  HTTP_METHOD_REQUIRED: 'HTTP method is required',
  CONTENT_TYPE_REQUIRED: 'Content-Type header is required',
  REQUEST_BODY_REQUIRED: 'Request body is required for POST requests',
  INVALID_OPERATION_NAME: 'Invalid or unsupported operation name',
  VALIDATION_ERROR: 'Validation error',
} as const

export const CONTEXT_ERROR_CODES = {
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  INVALID_USER_ID: 'INVALID_USER_ID',
  HTTP_METHOD_REQUIRED: 'HTTP_METHOD_REQUIRED',
  CONTENT_TYPE_REQUIRED: 'CONTENT_TYPE_REQUIRED',
  REQUEST_BODY_REQUIRED: 'REQUEST_BODY_REQUIRED',
  INVALID_OPERATION_NAME: 'INVALID_OPERATION_NAME',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const

export type ContextErrorCode = keyof typeof CONTEXT_ERROR_CODES
export type ContextErrorMessage = keyof typeof CONTEXT_ERROR_MESSAGES

export const OPERATION_NAMES = {
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  CREATE_DRAFT: 'CreateDraft',
  GET_ME: 'GetMe',
  GET_POSTS: 'GetPosts',
} as const

export const HEADER_KEYS = {
  X_FORWARDED_FOR: 'x-forwarded-for',
  X_REAL_IP: 'x-real-ip',
  USER_AGENT: 'user-agent',
  CONTENT_TYPE: 'content-type',
  AUTHORIZATION: 'authorization',
} as const

export const SECURITY_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const

export const PERMISSIONS = {
  READ_POSTS: 'read:posts',
  WRITE_POSTS: 'write:posts',
  DELETE_POSTS: 'delete:posts',
  MANAGE_USERS: 'manage:users',
} as const
