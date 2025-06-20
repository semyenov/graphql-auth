/**
 * GraphQL Error Handler
 * 
 * Converts domain errors to appropriate GraphQL errors.
 */

import { GraphQLError } from 'graphql'
import {
  BusinessRuleViolationError,
  DomainError,
  EntityNotFoundError,
  EntityValidationError,
  ForbiddenError,
  UnauthorizedError,
  ValueObjectValidationError,
} from '../../../core/errors/domain.errors'

export function normalizeGraphQLError(error: unknown): GraphQLError {
  // If it's already a GraphQL error, return it
  if (error instanceof GraphQLError) {
    return error
  }

  // Handle domain errors
  if (error instanceof DomainError) {
    return domainErrorToGraphQLError(error)
  }

  // Handle regular Error instances
  if (error instanceof Error) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    })
  }
  
  // Handle unknown errors
  console.error('Unexpected error:', error)
  return new GraphQLError('Internal server error', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  })
}

function domainErrorToGraphQLError(error: DomainError): GraphQLError {
  if (error instanceof EntityNotFoundError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'NOT_FOUND',
        statusCode: 404,
      },
    })
  }

  if (error instanceof UnauthorizedError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        statusCode: 401,
      },
    })
  }

  if (error instanceof ForbiddenError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'FORBIDDEN',
        statusCode: 403,
      },
    })
  }

  if (error instanceof BusinessRuleViolationError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'BUSINESS_RULE_VIOLATION',
        statusCode: 400,
      },
    })
  }

  if (error instanceof EntityValidationError || error instanceof ValueObjectValidationError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      },
    })
  }

  // Default domain error handling
  return new GraphQLError(error.message, {
    extensions: {
      code: error.code,
      statusCode: 400,
    },
  })
}