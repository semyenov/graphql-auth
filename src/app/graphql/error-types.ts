/**
 * GraphQL Error Type Definitions for Pothos
 *
 * Implements error types for the Pothos Errors plugin
 */

import {
  AuthenticationError,
  AuthorizationError,
  type BaseError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../core/errors/types'
import { builder } from '../../graphql/schema/builder'

// Base error interface
const BaseErrorInterface = builder
  .interfaceRef<BaseError>('BaseError')
  .implement({
    name: 'BaseError',
    fields: (t) => ({
      message: t.exposeString('message'),
      code: t.exposeString('code'),
      statusCode: t.exposeInt('statusCode', { nullable: true }),
    }),
  })

// Implement ValidationError
builder.objectType(ValidationError, {
  name: 'ValidationError',
  interfaces: [BaseErrorInterface],
})

// Implement AuthenticationError
builder.objectType(AuthenticationError, {
  name: 'AuthenticationError',
  interfaces: [BaseErrorInterface],
})

// Implement AuthorizationError
builder.objectType(AuthorizationError, {
  name: 'AuthorizationError',
  interfaces: [BaseErrorInterface],
})

// Implement NotFoundError
builder.objectType(NotFoundError, {
  name: 'NotFoundError',
  interfaces: [BaseErrorInterface],
})

// Implement ConflictError
builder.objectType(ConflictError, {
  name: 'ConflictError',
  interfaces: [BaseErrorInterface],
})
