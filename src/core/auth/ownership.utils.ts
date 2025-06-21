/**
 * Resource Ownership Utilities
 *
 * Centralized utilities for checking resource ownership across the application.
 * Provides consistent ownership validation for different resource types.
 */

import { prisma } from '../../prisma'
import { AuthorizationError, NotFoundError } from '../errors/types'
import { parseAndValidateGlobalId } from '../utils/relay'

/**
 * Type-safe Prisma model access
 */
type PrismaModelDelegate = {
  findUnique: (args: {
    where: { id: number }
    select?: Record<string, boolean>
  }) => Promise<unknown>
  findMany: (args: {
    where?: Record<string, unknown>
    select?: Record<string, boolean>
    orderBy?: Record<string, unknown>
    take?: number
  }) => Promise<unknown[]>
  count: (args: { where?: Record<string, unknown> }) => Promise<number>
  update: (args: {
    where: Record<string, unknown>
    data: Record<string, unknown>
  }) => Promise<unknown>
  delete: (args: { where: { id: number } }) => Promise<unknown>
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>
}

/**
 * Resource ownership configuration
 */
export interface ResourceOwnershipConfig {
  resourceType: string
  ownerField?: string // defaults to 'authorId' or 'userId'
  resourceName?: string // for error messages, defaults to resourceType
}

/**
 * Check if a user owns a specific resource
 */
export async function checkResourceOwnership(
  userId: number,
  resourceId: string | number,
  config: ResourceOwnershipConfig,
): Promise<boolean> {
  const {
    resourceType,
    ownerField = 'authorId',
    resourceName = resourceType,
  } = config

  // Parse global ID if string
  const numericId =
    typeof resourceId === 'string'
      ? await parseAndValidateGlobalId(resourceId, resourceType)
      : resourceId

  // Get the appropriate model from Prisma
  const model = prisma[
    resourceType.toLowerCase() as keyof typeof prisma
  ] as unknown as PrismaModelDelegate
  if (!model || typeof model.findUnique !== 'function') {
    throw new Error(`Invalid resource type: ${resourceType}`)
  }

  // Check if resource exists and get owner
  const resource = await model.findUnique({
    where: { id: numericId },
    select: { [ownerField]: true },
  })

  if (!resource) {
    throw new NotFoundError(resourceName, resourceId.toString())
  }

  return resource[ownerField] === userId
}

/**
 * Require that a user owns a resource, throwing if not
 */
export async function requireResourceOwnership(
  userId: number,
  resourceId: string | number,
  config: ResourceOwnershipConfig,
): Promise<void> {
  const isOwner = await checkResourceOwnership(userId, resourceId, config)

  if (!isOwner) {
    const { resourceName = config.resourceType } = config
    throw new AuthorizationError(
      `You can only modify ${resourceName.toLowerCase()}s that you have created`,
    )
  }
}

/**
 * Check if user owns a post
 */
export async function checkPostOwnership(
  userId: number,
  postId: string | number,
): Promise<boolean> {
  return checkResourceOwnership(userId, postId, {
    resourceType: 'Post',
    ownerField: 'authorId',
    resourceName: 'post',
  })
}

/**
 * Require that user owns a post
 */
export async function requirePostOwnership(
  userId: number,
  postId: string | number,
): Promise<void> {
  return requireResourceOwnership(userId, postId, {
    resourceType: 'Post',
    ownerField: 'authorId',
    resourceName: 'post',
  })
}

/**
 * Check if user is accessing their own profile
 */
export async function checkUserOwnership(
  userId: number,
  targetUserId: string | number,
): Promise<boolean> {
  // For user resources, the owner is the user themselves
  const numericTargetId =
    typeof targetUserId === 'string'
      ? await parseAndValidateGlobalId(targetUserId, 'User')
      : targetUserId

  return userId === numericTargetId
}

/**
 * Require that user is accessing their own profile
 */
export async function requireUserOwnership(
  userId: number,
  targetUserId: string | number,
): Promise<void> {
  const isOwner = await checkUserOwnership(userId, targetUserId)

  if (!isOwner) {
    throw new AuthorizationError('You can only access your own data')
  }
}

/**
 * Batch check ownership for multiple resources
 */
export async function checkBatchOwnership(
  userId: number,
  resourceIds: (string | number)[],
  config: ResourceOwnershipConfig,
): Promise<Map<string | number, boolean>> {
  const results = new Map<string | number, boolean>()

  // Process in parallel for efficiency
  await Promise.all(
    resourceIds.map(async (resourceId) => {
      try {
        const isOwner = await checkResourceOwnership(userId, resourceId, config)
        results.set(resourceId, isOwner)
      } catch (error) {
        // If resource not found, consider as not owned
        results.set(resourceId, false)
      }
    }),
  )

  return results
}

/**
 * Get all resources owned by a user
 */
export async function getOwnedResources<T = unknown>(
  userId: number,
  resourceType: string,
  options?: {
    ownerField?: string
    select?: Record<string, boolean>
    where?: Record<string, unknown>
    orderBy?: Record<string, 'asc' | 'desc'>
    take?: number
  },
): Promise<T[]> {
  const {
    ownerField = 'authorId',
    select,
    where = {},
    orderBy,
    take,
  } = options || {}

  const model = prisma[
    resourceType.toLowerCase() as keyof typeof prisma
  ] as unknown as PrismaModelDelegate
  if (!model || typeof model.findMany !== 'function') {
    throw new Error(`Invalid resource type: ${resourceType}`)
  }

  return model.findMany({
    where: {
      ...where,
      [ownerField]: userId,
    },
    select,
    orderBy,
    take,
  }) as Promise<T[]>
}

/**
 * Count resources owned by a user
 */
export async function countOwnedResources(
  userId: number,
  resourceType: string,
  options?: {
    ownerField?: string
    where?: Record<string, unknown>
  },
): Promise<number> {
  const { ownerField = 'authorId', where = {} } = options || {}

  const model = prisma[
    resourceType.toLowerCase() as keyof typeof prisma
  ] as unknown as PrismaModelDelegate
  if (!model || typeof model.count !== 'function') {
    throw new Error(`Invalid resource type: ${resourceType}`)
  }

  return model.count({
    where: {
      ...where,
      [ownerField]: userId,
    },
  })
}

/**
 * Transfer ownership of a resource
 */
export async function transferResourceOwnership(
  resourceId: string | number,
  newOwnerId: number,
  config: ResourceOwnershipConfig & {
    currentOwnerId?: number // optional: verify current owner before transfer
  },
): Promise<void> {
  const { resourceType, ownerField = 'authorId', currentOwnerId } = config

  // Parse global ID if string
  const numericId =
    typeof resourceId === 'string'
      ? await parseAndValidateGlobalId(resourceId, resourceType)
      : resourceId

  const model = prisma[
    resourceType.toLowerCase() as keyof typeof prisma
  ] as unknown as PrismaModelDelegate
  if (!model || typeof model.update !== 'function') {
    throw new Error(`Invalid resource type: ${resourceType}`)
  }

  // Build where clause
  const where: Record<string, unknown> = { id: numericId }
  if (currentOwnerId !== undefined) {
    where[ownerField] = currentOwnerId
  }

  // Update ownership
  const updated = await model.update({
    where,
    data: { [ownerField]: newOwnerId },
  })

  if (!updated) {
    throw new NotFoundError(
      config.resourceName || resourceType,
      resourceId.toString(),
    )
  }
}
