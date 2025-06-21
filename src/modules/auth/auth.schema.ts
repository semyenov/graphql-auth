/**
 * Authentication Module GraphQL Schema
 *
 * Defines GraphQL types, inputs, and schema elements specific to authentication.
 * Follows the IMPROVED-FILE-STRUCTURE.md specification for module organization.
 */

import { z } from 'zod'
import { builder } from '../graphql/schema/builder'
import { commonValidations } from '../graphql/schema/helpers'

// Input types for authentication operations
export const LoginInput = builder.inputType('LoginInput', {
  description: 'Input for user login',
  fields: (t) => ({
    email: t.string({
      required: true,
      description: 'User email address',
      validate: {
        schema: commonValidations.email,
      },
    }),
    password: t.string({
      required: true,
      description: 'User password',
      validate: {
        schema: z.string().min(1),
      },
    }),
  }),
})

export const SignupInput = builder.inputType('SignupInput', {
  description: 'Input for user registration',
  fields: (t) => ({
    email: t.string({
      required: true,
      description: 'User email address',
      validate: {
        schema: commonValidations.email,
      },
    }),
    password: t.string({
      required: true,
      description: 'User password',
      validate: {
        schema: commonValidations.password,
      },
    }),
    name: t.string({
      required: false,
      description: 'User display name',
      validate: {
        schema: z.string().min(1).max(100),
      },
    }),
  }),
})

// Token refresh input type
export const RefreshTokenInput = builder.inputType('RefreshTokenInput', {
  description: 'Input for token refresh',
  fields: (t) => ({
    refreshToken: t.string({
      required: true,
      description: 'Refresh token',
    }),
  }),
})

// User profile update input
export const UpdateProfileInput = builder.inputType('UpdateProfileInput', {
  description: 'Input for updating user profile',
  fields: (t) => ({
    name: t.string({
      required: false,
      description: 'User display name',
      validate: {
        schema: z.string().min(1).max(100),
      },
    }),
    email: t.string({
      required: false,
      description: 'User email address',
      validate: {
        schema: commonValidations.email,
      },
    }),
  }),
})

// Password change input
export const ChangePasswordInput = builder.inputType('ChangePasswordInput', {
  description: 'Input for changing user password',
  fields: (t) => ({
    currentPassword: t.string({
      required: true,
      description: 'Current password',
    }),
    newPassword: t.string({
      required: true,
      description: 'New password',
      validate: {
        schema: commonValidations.password,
      },
    }),
  }),
})

// Export schema types for use in resolvers
export const AuthSchemaTypes = {
  LoginInput,
  SignupInput,
  RefreshTokenInput,
  UpdateProfileInput,
  ChangePasswordInput,
}
