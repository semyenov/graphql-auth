/**
 * Validation Middleware
 *
 * GraphQL middleware for input validation and sanitization
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import { and, rule, shield } from 'graphql-shield'
import { ValidationError } from '../../app/errors/types'
import type { IContext } from '../context/context.types'

/**
 * Rule to validate email format
 */
interface EmailArgs {
  email?: string
  input?: {
    email?: string
  }
}

export const emailValidationRule = rule({ cache: 'strict' })(
  async (_parent, args: EmailArgs, _context: IContext) => {
    try {
      const email = args.email || args.input?.email
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return new ValidationError([], 'Invalid email format')
        }
      }
      return true
    } catch (_error) {
      return new ValidationError([], 'Email validation failed')
    }
  },
)

/**
 * Rule to validate password strength
 */
interface PasswordArgs {
  password?: string
  input?: {
    password?: string
  }
}

export const passwordValidationRule = rule({ cache: 'strict' })(
  async (_parent, args: PasswordArgs, _context: IContext) => {
    try {
      const password = args.password || args.input?.password
      if (password) {
        if (password.length < 8) {
          return new ValidationError([
            'Password must be at least 8 characters long',
          ])
        }
        if (!/(?=.*[a-z])/.test(password)) {
          return new ValidationError([
            'Password must contain at least one lowercase letter',
          ])
        }
        if (!/(?=.*[A-Z])/.test(password)) {
          return new ValidationError([
            'Password must contain at least one uppercase letter',
          ])
        }
        if (!/(?=.*\d)/.test(password)) {
          return new ValidationError([
            'Password must contain at least one number',
          ])
        }
      }
      return true
    } catch (_error) {
      return new ValidationError(['Password validation failed'])
    }
  },
)

/**
 * Rule to validate post title
 */
interface PostTitleArgs {
  title?: string
  input?: {
    title?: string
  }
}

export const postTitleValidationRule = rule({ cache: 'strict' })(
  async (_parent, args: PostTitleArgs, _context: IContext) => {
    try {
      const title = args.title || args.input?.title
      if (title) {
        if (title.length < 1) {
          return new ValidationError(['Post title cannot be empty'])
        }
        if (title.length > 200) {
          return new ValidationError([
            'Post title cannot exceed 200 characters',
          ])
        }
      }
      return true
    } catch (_error) {
      return new ValidationError(['Post title validation failed'])
    }
  },
)

/**
 * Rule to validate post content
 */
interface PostContentArgs {
  content?: string
  input?: {
    content?: string
  }
}

export const postContentValidationRule = rule({ cache: 'strict' })(
  async (_parent, args: PostContentArgs, _context: IContext) => {
    try {
      const content = args.content || args.input?.content
      if (content) {
        if (content.length > 50000) {
          return new ValidationError([
            'Post content cannot exceed 50,000 characters',
          ])
        }
      }
      return true
    } catch (_error) {
      return new ValidationError(['Post content validation failed'])
    }
  },
)

/**
 * Rule to validate user name
 */
interface UserNameArgs {
  name?: string
  input?: {
    name?: string
  }
}

export const userNameValidationRule = rule({ cache: 'strict' })(
  async (_parent, args: UserNameArgs, _context: IContext) => {
    try {
      const name = args.name || args.input?.name
      if (name) {
        if (name.length < 1) {
          return new ValidationError(['Name cannot be empty'])
        }
        if (name.length > 100) {
          return new ValidationError(['Name cannot exceed 100 characters'])
        }
        // Basic sanitization - no HTML tags
        if (/<[^>]*>/.test(name)) {
          return new ValidationError(['Name cannot contain HTML tags'])
        }
      }
      return true
    } catch (_error) {
      return new ValidationError(['Name validation failed'])
    }
  },
)

/**
 * Rule to validate pagination arguments
 */
interface PaginationArgs {
  first?: number
  last?: number
  take?: number
  skip?: number
  after?: string
  before?: string
}

export const paginationValidationRule = rule({ cache: 'strict' })(
  async (_parent, args: PaginationArgs, _context: IContext) => {
    try {
      const { first, last, take, skip } = args

      // Validate cursor-based pagination
      if (first !== undefined) {
        if (first < 0) {
          return new ValidationError(['first must be non-negative'])
        }
        if (first > 100) {
          return new ValidationError(['first cannot exceed 100'])
        }
      }

      if (last !== undefined) {
        if (last < 0) {
          return new ValidationError(['last must be non-negative'])
        }
        if (last > 100) {
          return new ValidationError(['last cannot exceed 100'])
        }
      }

      // Validate offset-based pagination
      if (take !== undefined) {
        if (take < 0) {
          return new ValidationError(['take must be non-negative'])
        }
        if (take > 100) {
          return new ValidationError(['take cannot exceed 100'])
        }
      }

      if (skip !== undefined) {
        if (skip < 0) {
          return new ValidationError(['skip must be non-negative'])
        }
      }

      return true
    } catch (_error) {
      return new ValidationError(['Pagination validation failed'])
    }
  },
)

/**
 * Combined validation middleware using GraphQL Shield
 */
export const validationMiddleware = shield<Record<string, unknown>, IContext>(
  {
    Mutation: {
      signup: and(
        emailValidationRule,
        passwordValidationRule,
        userNameValidationRule,
      ),
      login: emailValidationRule,
      createPost: and(postTitleValidationRule, postContentValidationRule),
      updatePost: and(postTitleValidationRule, postContentValidationRule),
      updateUserProfile: userNameValidationRule,
    },
    Query: {
      feed: paginationValidationRule,
      searchUsers: paginationValidationRule,
      drafts: paginationValidationRule,
    },
  },
  {
    allowExternalErrors: true,
    fallbackRule: rule()(async () => true), // Allow by default
  },
)
