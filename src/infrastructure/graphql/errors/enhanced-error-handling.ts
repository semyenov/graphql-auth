/**
 * Enhanced Error Handling with Pothos Errors Plugin
 * 
 * Implements union types and result patterns for comprehensive error handling
 */

import { 
  AuthenticationError, 
  AuthorizationError, 
  ConflictError, 
  NotFoundError, 
  RateLimitError, 
  ValidationError 
} from '../../../errors'
import { builder } from '../../../schema/builder'

// Base Error interface for all custom errors
export const ErrorInterface = builder.interfaceType('Error', {
  description: 'Base interface for all errors',
  fields: (t) => ({
    message: t.exposeString('message'),
    code: t.exposeString('code'),
    statusCode: t.exposeInt('statusCode'),
  }),
})

// Note: Error types are already defined in schema/error-types.ts
// We'll use references to existing types for union types

// Field error type for validation errors
export const FieldError = builder.objectType('FieldError', {
  description: 'Field-specific validation error',
  fields: (t) => ({
    field: t.string({
      description: 'Name of the field with validation error',
    }),
    message: t.string({
      description: 'Validation error message for this field',
    }),
    code: t.string({
      description: 'Error code for this validation error',
    }),
  }),
})

// Result types using existing error types for unions
export const AuthResult = builder.unionType('AuthResult', {
  types: ['AuthSuccess', 'ValidationError', 'AuthenticationError', 'ConflictError'],
  resolveType: (obj) => {
    if ('token' in obj) return 'AuthSuccess'
    return obj.constructor.name
  },
})

export const PostResult = builder.unionType('PostResult', {
  types: ['Post', 'ValidationError', 'AuthenticationError', 'AuthorizationError', 'NotFoundError'],
  resolveType: (obj) => {
    if ('title' in obj) return 'Post'
    return obj.constructor.name
  },
})

export const UserResult = builder.unionType('UserResult', {
  types: ['User', 'ValidationError', 'AuthenticationError', 'ConflictError'],
  resolveType: (obj) => {
    if ('email' in obj) return 'User'
    return obj.constructor.name
  },
})

// Success types for union results
export const AuthSuccess = builder.objectType('AuthSuccess', {
  description: 'Successful authentication result',
  fields: (t) => ({
    token: t.string({
      description: 'JWT access token',
    }),
    user: t.field({
      type: 'User',
      nullable: true,
      description: 'Authenticated user information',
      resolve: async (result, _args, context) => {
        // Could load user from token if needed
        return null
      },
    }),
    expiresAt: t.field({
      type: 'DateTime',
      nullable: true,
      description: 'Token expiration time',
      resolve: () => {
        // Calculate expiration based on token
        const now = new Date()
        return new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes
      },
    }),
  }),
})

// Enhanced mutation types using error unions
export function createSafeMutation<T>(
  name: string,
  resultType: any,
  implementation: any
) {
  return builder.mutationField(name, (t) =>
    t.field({
      type: resultType,
      ...implementation,
      resolve: async (...args) => {
        try {
          return await implementation.resolve(...args)
        } catch (error) {
          // Return the error as part of the union
          return error
        }
      },
    })
  )
}