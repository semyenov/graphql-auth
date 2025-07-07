/**
 * Users Module Constants
 * Following modular monolith pattern - domain-specific constants isolated within module
 */

// User validation constants
export const USER_CONSTANTS = {
  // Name validation
  NAME_MAX_LENGTH: 100,
  NAME_MIN_LENGTH: 2,

  // Email validation
  EMAIL_MAX_LENGTH: 255,

  // Profile limits
  BIO_MAX_LENGTH: 1000,

  // Search and pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
  SEARCH_MIN_QUERY_LENGTH: 2,
  SEARCH_MAX_QUERY_LENGTH: 100,

  // Rate limiting
  RATE_LIMITS: {
    UPDATE_PROFILE: {
      WINDOW_MS: 60 * 60 * 1000, // 1 hour
      MAX_ATTEMPTS: 10,
    },
    SEARCH_USERS: {
      WINDOW_MS: 60 * 1000, // 1 minute
      MAX_ATTEMPTS: 60,
    },
  },
} as const

// User-specific error messages
export const USER_ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_USER_ID: 'Invalid user ID provided',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: `Name must be at least ${USER_CONSTANTS.NAME_MIN_LENGTH} characters long`,
  NAME_TOO_LONG: `Name must not exceed ${USER_CONSTANTS.NAME_MAX_LENGTH} characters`,
  EMAIL_INVALID: 'Please provide a valid email address',
  EMAIL_TOO_LONG: `Email must not exceed ${USER_CONSTANTS.EMAIL_MAX_LENGTH} characters`,
  BIO_TOO_LONG: `Bio must not exceed ${USER_CONSTANTS.BIO_MAX_LENGTH} characters`,
  CANNOT_UPDATE_OTHER_USER: 'You can only update your own profile',
  CANNOT_DELETE_SELF:
    'You cannot delete your own account through this operation',
  SEARCH_QUERY_TOO_SHORT: `Search query must be at least ${USER_CONSTANTS.SEARCH_MIN_QUERY_LENGTH} characters long`,
  SEARCH_QUERY_TOO_LONG: `Search query must not exceed ${USER_CONSTANTS.SEARCH_MAX_QUERY_LENGTH} characters`,
  INSUFFICIENT_PERMISSIONS:
    'You do not have the required permissions to perform this operation',
} as const

// User success messages
export const USER_SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  USER_DELETED: 'User deleted successfully',
  USERS_FOUND: 'Users retrieved successfully',
} as const

// User status enum
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification',
} as const

// User roles (specific to user module context)
export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
} as const

// User ordering options
export const USER_ORDER_BY = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  NAME: 'name',
  EMAIL: 'email',
} as const

// User search fields
export const USER_SEARCH_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  BIO: 'bio',
} as const

export type UserStatus = keyof typeof USER_STATUS
export type UserRole = keyof typeof USER_ROLES
export type UserOrderBy = keyof typeof USER_ORDER_BY
export type UserSearchField = keyof typeof USER_SEARCH_FIELDS
export type UserErrorMessage = keyof typeof USER_ERROR_MESSAGES
export type UserSuccessMessage = keyof typeof USER_SUCCESS_MESSAGES
