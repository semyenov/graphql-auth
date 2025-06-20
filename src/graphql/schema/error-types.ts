/**
 * Error type definitions for Pothos Errors plugin
 */

import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from '../../core/errors/types'
import { builder } from './builder'

// Register error types with the builder
builder.objectType(AuthenticationError, {
  name: 'AuthenticationError',
  fields: (t) => ({
    message: t.exposeString('message'),
    code: t.exposeString('code'),
    statusCode: t.exposeInt('statusCode'),
  }),
})

builder.objectType(AuthorizationError, {
  name: 'AuthorizationError',
  fields: (t) => ({
    message: t.exposeString('message'),
    code: t.exposeString('code'),
    statusCode: t.exposeInt('statusCode'),
  }),
})

builder.objectType(ConflictError, {
  name: 'ConflictError',
  fields: (t) => ({
    message: t.exposeString('message'),
    code: t.exposeString('code'),
    statusCode: t.exposeInt('statusCode'),
  }),
})

builder.objectType(NotFoundError, {
  name: 'NotFoundError',
  fields: (t) => ({
    message: t.exposeString('message'),
    code: t.exposeString('code'),
    statusCode: t.exposeInt('statusCode'),
  }),
})

builder.objectType(ValidationError, {
  name: 'ValidationError',
  fields: (t) => ({
    message: t.exposeString('message'),
    code: t.exposeString('code'),
    statusCode: t.exposeInt('statusCode'),
  }),
})

builder.objectType(RateLimitError, {
  name: 'RateLimitError',
  fields: (t) => ({
    message: t.exposeString('message'),
    code: t.exposeString('code'),
    statusCode: t.exposeInt('statusCode'),
    retryAfter: t.exposeInt('retryAfter', { nullable: true }),
  }),
})