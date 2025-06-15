/**
 * Context-related constants to avoid magic values throughout the codebase
 */

// HTTP Methods that are allowed for GraphQL operations
export const ALLOWED_HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const

// Default values for context creation
export const DEFAULT_VALUES = {
    HTTP_METHOD: 'POST',
    GRAPHQL_ENDPOINT: '/graphql',
    CONTENT_TYPE: 'application/json',
    IP_ADDRESS: 'unknown',
    USER_AGENT: 'unknown',
} as const

// Error messages for better consistency
export const ERROR_MESSAGES = {
    AUTHENTICATION_REQUIRED: 'Authentication is required to access this resource',
    INVALID_USER_ID: 'Invalid or missing user ID in authentication context',
    HTTP_METHOD_REQUIRED: 'HTTP method is required',
    CONTENT_TYPE_REQUIRED: 'Content-Type header is required',
    REQUEST_BODY_REQUIRED: 'Request body is required for POST requests',
    INVALID_OPERATION_NAME: 'Invalid or unsupported operation name',
} as const

// GraphQL operation names for type safety
export const OPERATION_NAMES = {
    LOGIN: 'Login',
    SIGNUP: 'Signup',
    CREATE_DRAFT: 'CreateDraft',
    GET_ME: 'GetMe',
    GET_POSTS: 'GetPosts',
} as const

// Header keys for consistent access
export const HEADER_KEYS = {
    X_FORWARDED_FOR: 'x-forwarded-for',
    X_REAL_IP: 'x-real-ip',
    USER_AGENT: 'user-agent',
    CONTENT_TYPE: 'content-type',
} as const

// Security roles and permissions (if needed for future use)
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