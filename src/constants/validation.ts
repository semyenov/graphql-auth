/**
 * Validation-related constants
 */

export const VALIDATION_LIMITS = {
  // Email
  EMAIL_MIN_LENGTH: 1,
  EMAIL_MAX_LENGTH: 255,

  // Password
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,

  // Name
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,

  // Post
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 255,
  CONTENT_MAX_LENGTH: 10000,

  // Search
  SEARCH_MIN_LENGTH: 1,
  SEARCH_MAX_LENGTH: 255,

  // Pagination
  TAKE_MIN: 1,
  TAKE_MAX: 100,
  SKIP_MIN: 0,
} as const

export const VALIDATION_PATTERNS = {
  // Strong password: at least one uppercase, one lowercase, and one number
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,

  // Basic email pattern (more permissive than HTML5)
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

export const VALIDATION_MESSAGES = {
  // Email
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  EMAIL_TOO_LONG: 'Email must be less than 255 characters',

  // Password
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORD_TOO_LONG: 'Password must be less than 128 characters',
  PASSWORD_WEAK:
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',

  // Name
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must be less than 100 characters',

  // Post
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_LONG: 'Title must be less than 255 characters',
  CONTENT_TOO_LONG: 'Content must be less than 10,000 characters',

  // Search
  SEARCH_EMPTY: 'Search string must not be empty',
  SEARCH_TOO_LONG: 'Search string must be less than 255 characters',

  // Pagination
  SKIP_NEGATIVE: 'Skip must be non-negative',
  TAKE_TOO_SMALL: 'Take must be at least 1',
  TAKE_TOO_LARGE: 'Take must be at most 100',

  // IDs
  ID_INVALID: 'ID must be an integer',
  ID_NEGATIVE: 'ID must be positive',

  // Generic
  FIELD_REQUIRED: 'This field is required',
  EITHER_ID_OR_EMAIL: 'Either id or email must be provided',
} as const
