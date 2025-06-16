import { Context } from '../context'
import { AuthenticationError, AuthorizationError, ValidationError } from '../errors'
import { prisma } from '../prisma'

/**
 * Resource ownership check result
 */
export interface OwnershipCheckResult {
  isOwner: boolean
  resourceExists: boolean
  ownerId?: number
}

/**
 * Validates that a resource ID is valid
 * 
 * @param id - The ID to validate
 * @param resourceType - The type of resource for error messages
 * @throws ValidationError if ID is invalid
 */
export function validateResourceId(id: unknown, resourceType: string): asserts id is string {
  if (!id || typeof id !== 'string') {
    throw new ValidationError([`Valid ${resourceType} ID is required`])
  }
}

/**
 * Checks if a user owns a specific post
 * 
 * @param postId - The numeric post ID
 * @param userId - The user ID to check ownership against
 * @returns Ownership check result
 */
export async function checkPostOwnership(
  postId: number,
  userId: number
): Promise<OwnershipCheckResult> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })

  if (!post) {
    return {
      isOwner: false,
      resourceExists: false,
    }
  }

  return {
    isOwner: post.authorId === userId,
    resourceExists: true,
    ownerId: post.authorId ?? undefined,
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
  expectedType: string
): Promise<number> {
  const { parseGlobalId } = await import('../shared/infrastructure/graphql/relay-helpers')
  return parseGlobalId(globalId, expectedType)
}

/**
 * Creates a standardized authentication check
 * 
 * @param context - The GraphQL context
 * @returns True if authenticated, AuthenticationError otherwise
 */
export function createAuthenticationCheck(context: Context): true | AuthenticationError {
  if (!context.userId || typeof context.userId !== 'number') {
    return new AuthenticationError()
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
  context: Context,
  requiredRole: string,
  errorMessage?: string
): true | AuthenticationError | AuthorizationError {
  // First check authentication
  const authResult = createAuthenticationCheck(context)
  if (authResult !== true) {
    return authResult
  }

  // Check role
  const hasRequiredRole = context.security.roles?.includes(requiredRole) ?? false
  if (!hasRequiredRole) {
    return new AuthorizationError(errorMessage ?? `${requiredRole} privileges required`)
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
  context: Context,
  requiredPermission: string,
  errorMessage?: string
): true | AuthenticationError | AuthorizationError {
  // First check authentication
  const authResult = createAuthenticationCheck(context)
  if (authResult !== true) {
    return authResult
  }

  // Check permission
  const hasRequiredPermission = context.security.permissions?.includes(requiredPermission) ?? false
  if (!hasRequiredPermission) {
    return new AuthorizationError(
      errorMessage ?? `Permission denied: ${requiredPermission} required`
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
  fallbackMessage = 'Authorization failed'
): Error {
  return error instanceof Error ? error : new AuthorizationError(fallbackMessage)
}