import { ERROR_MESSAGES } from '../../app/constants'
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from '../../app/errors/types'
import type { IContext } from '../context/context.types'

/**
 * Validates that a resource ID is valid
 *
 * @param id - The ID to validate
 * @param resourceType - The type of resource for error messages
 * @throws ValidationError if ID is invalid
 */
export function validateResourceId(
  id: unknown,
  resourceType: string,
): asserts id is string {
  if (!id || typeof id !== 'string') {
    throw new ValidationError({ id: [`Valid ${resourceType} ID is required`] })
  }
}

/**
 * Parses and validates a global ID for a specific resource type
 *
 * @param globalId - The global ID to parse
 * @param expectedType - The expected resource type
 * @returns The numeric ID
 * @throws ValidationError if parsing fails
 */
export async function parseAndValidateGlobalId(
  globalId: string,
  expectedType: string,
): Promise<number> {
  const { parseGlobalId } = await import('../../utils/relay')
  return parseGlobalId(globalId, expectedType)
}

/**
 * Creates a standardized authentication check
 *
 * @param context - The GraphQL context
 * @returns True if authenticated, AuthenticationError otherwise
 */
export function createAuthenticationCheck(
  context: IContext,
): true | AuthenticationError {
  if (!context.userId) {
    return new AuthenticationError(
      `${ERROR_MESSAGES.AUTHENTICATION_REQUIRED}. Please authenticate and try again.`,
    )
  }
  return true
}

/**
 * Creates a standardized role check
 *
 * @param context - The GraphQL context
 * @param requiredRole - The role required
 * @param errorMessage - Custom error message
 * @returns True if has role, AuthorizationError otherwise
 */
export function createRoleCheck(
  context: IContext,
  requiredRole: string,
  errorMessage?: string,
): true | AuthenticationError | AuthorizationError {
  // First check authentication
  const authResult = createAuthenticationCheck(context)
  if (authResult !== true) {
    return authResult
  }

  // Check role
  const hasRequiredRole =
    context.security.roles?.includes(requiredRole) ?? false
  if (!hasRequiredRole) {
    return new AuthorizationError(
      errorMessage ?? `${requiredRole} privileges required`,
    )
  }

  return true
}

/**
 * Creates a standardized permission check
 *
 * @param context - The GraphQL context
 * @param requiredPermission - The permission required
 * @param errorMessage - Custom error message
 * @returns True if has permission, error otherwise
 */
export function createPermissionCheck(
  context: IContext,
  requiredPermission: string,
  errorMessage?: string,
): true | AuthenticationError | AuthorizationError {
  // First check authentication
  const authResult = createAuthenticationCheck(context)
  if (authResult !== true) {
    return authResult
  }

  // Check permission
  const hasRequiredPermission =
    context.security.permissions?.includes(requiredPermission) ?? false
  if (!hasRequiredPermission) {
    return new AuthorizationError(
      errorMessage ?? `Permission denied: ${requiredPermission} required`,
    )
  }

  return true
}

/**
 * Standard error handler for rules
 *
 * @param error - The error to handle
 * @param fallbackMessage - Fallback message if error is not an Error instance
 * @returns The error or a new AuthorizationError
 */
export function handleRuleError(
  error: unknown,
  fallbackMessage = 'Authorization failed',
): Error {
  return error instanceof Error
    ? error
    : new AuthorizationError(fallbackMessage)
}
