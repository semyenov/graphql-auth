/**
 * Users Module GraphQL Schema
 *
 * Defines GraphQL types, inputs, and schema elements specific to users.
 * Follows the IMPROVED-FILE-STRUCTURE.md specification for module organization.
 */

import { z } from 'zod'
import { builder } from '../../graphql/schema/builder'
import { commonValidations } from '../../graphql/schema/helpers'

// User filter input for queries
export const UserFilterInput = builder.inputType('UserFilterInput', {
  description: 'Filter options for user queries',
  fields: (t) => ({
    searchString: t.string({
      required: false,
      description: 'Search in name and email',
      validate: {
        schema: z.string().min(1).max(100),
      },
    }),
    role: t.string({
      required: false,
      description: 'Filter by user role',
      validate: {
        schema: z.enum(['user', 'admin', 'moderator']),
      },
    }),
    verified: t.boolean({
      required: false,
      description: 'Filter by verification status',
    }),
    active: t.boolean({
      required: false,
      description: 'Filter by active status',
    }),
    createdAfter: t.string({
      required: false,
      description: 'Filter users created after this date',
    }),
    createdBefore: t.string({
      required: false,
      description: 'Filter users created before this date',
    }),
  }),
})

// User sort input
export const UserSortInput = builder.inputType('UserSortInput', {
  description: 'Sort options for user queries',
  fields: (t) => ({
    field: t.string({
      required: true,
      description: 'Field to sort by',
      validate: {
        schema: z.enum([
          'createdAt',
          'updatedAt',
          'name',
          'email',
          'lastLoginAt',
        ]),
      },
    }),
    direction: t.string({
      required: false,
      defaultValue: 'desc',
      description: 'Sort direction',
      validate: {
        schema: z.enum(['asc', 'desc']),
      },
    }),
  }),
})

// User profile update input
export const UpdateUserProfileInput = builder.inputType(
  'UpdateUserProfileInput',
  {
    description: 'Input for updating user profile',
    fields: (t) => ({
      name: t.string({
        required: false,
        description: 'User display name',
        validate: {
          schema: z.string().min(1).max(100),
        },
      }),
      bio: t.string({
        required: false,
        description: 'User biography',
        validate: {
          schema: z.string().max(500),
        },
      }),
      avatar: t.string({
        required: false,
        description: 'Avatar URL',
        validate: {
          schema: z.string().url(),
        },
      }),
      website: t.string({
        required: false,
        description: 'Personal website URL',
        validate: {
          schema: z.string().url(),
        },
      }),
      location: t.string({
        required: false,
        description: 'User location',
        validate: {
          schema: z.string().max(100),
        },
      }),
    }),
  },
)

// Admin user management input
export const AdminUpdateUserInput = builder.inputType('AdminUpdateUserInput', {
  description: 'Input for admin user management',
  fields: (t) => ({
    role: t.string({
      required: false,
      description: 'User role',
      validate: {
        schema: z.enum(['user', 'admin', 'moderator']),
      },
    }),
    verified: t.boolean({
      required: false,
      description: 'Email verification status',
    }),
    active: t.boolean({
      required: false,
      description: 'Account active status',
    }),
    bannedUntil: t.string({
      required: false,
      description: 'Banned until date (ISO string)',
    }),
    banReason: t.string({
      required: false,
      description: 'Reason for ban',
      validate: {
        schema: z.string().max(500),
      },
    }),
  }),
})

// Note: User stats, profile, and connection types should be defined in resolvers where they have access to resolve functions

// Batch user operations input
export const BatchUserOperationInput = builder.inputType(
  'BatchUserOperationInput',
  {
    description: 'Input for batch operations on users',
    fields: (t) => ({
      userIds: t.idList({
        required: true,
        description: 'List of user IDs to operate on',
      }),
      operation: t.string({
        required: true,
        description: 'Operation to perform',
        validate: {
          schema: z.enum(['activate', 'deactivate', 'verify', 'ban', 'unban']),
        },
      }),
      reason: t.string({
        required: false,
        description: 'Reason for the batch operation',
        validate: {
          schema: z.string().max(500),
        },
      }),
      duration: t.string({
        required: false,
        description: 'Duration for temporary operations (ISO duration)',
      }),
    }),
  },
)

// Email verification input
export const EmailVerificationInput = builder.inputType(
  'EmailVerificationInput',
  {
    description: 'Input for email verification',
    fields: (t) => ({
      token: t.string({
        required: true,
        description: 'Verification token',
      }),
    }),
  },
)

// Password reset input
export const PasswordResetInput = builder.inputType('PasswordResetInput', {
  description: 'Input for password reset',
  fields: (t) => ({
    email: t.string({
      required: true,
      description: 'User email address',
      validate: {
        schema: commonValidations.email,
      },
    }),
  }),
})

export const PasswordResetConfirmInput = builder.inputType(
  'PasswordResetConfirmInput',
  {
    description: 'Input for confirming password reset',
    fields: (t) => ({
      token: t.string({
        required: true,
        description: 'Password reset token',
      }),
      newPassword: t.string({
        required: true,
        description: 'New password',
        validate: {
          schema: commonValidations.password,
        },
      }),
    }),
  },
)

// Export schema types for use in resolvers
export const UserSchemaTypes = {
  UserFilterInput,
  UserSortInput,
  UpdateUserProfileInput,
  AdminUpdateUserInput,
  BatchUserOperationInput,
  EmailVerificationInput,
  PasswordResetInput,
  PasswordResetConfirmInput,
}
