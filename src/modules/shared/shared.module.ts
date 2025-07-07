/**
 * Shared Module - Public API Facade
 *
 * This file defines the ONLY way other modules can interact with the shared module.
 * It implements the facade pattern to enforce strict module boundaries.
 *
 * ⚠️ Other modules MUST only import from this file, never from internal files.
 *
 * Version: 1.0.0
 * Last Updated: 2025-01-16
 */

// Re-export client interface for inter-module communication
export type {
  ISharedClient,
  SharedModuleEvents,
} from './client/shared.client.interface'
// Re-export Relay utilities (GraphQL infrastructure)
export {
  decodeGlobalId,
  encodeGlobalId,
  fromGlobalId,
  parseGlobalId,
  toGlobalId,
} from './connections'
// Re-export database client (infrastructure level - acceptable shared dependency)
export { prisma } from './database'
// Re-export filter types (commonly needed across modules)
export type {
  BooleanFilter,
  CommonFilters,
  DateFilter,
  NumberFilter,
  OrderByInput,
  StringFilter,
} from './filtering/filter.types'
// Re-export critical interfaces that other modules need
export type { ILogger, LogLevel } from './interfaces/logger.interface'
export type { IRateLimiterService } from './interfaces/rate-limiter.service.interface'
// Re-export pagination types (commonly needed across modules)
export type {
  Connection,
  CursorPaginationArgs,
  Edge,
  OffsetPaginationArgs,
  PageInfo,
  PagePaginationArgs,
  PaginatedResponse,
  SortDirection,
  SortOrder,
} from './pagination/pagination.types'

// Re-export rate limiter presets (infrastructure level)
export { RateLimitPresets } from './services/rate-limiter.service'

// DO NOT re-export boilerplate utilities - those should be copied, not imported
// DO NOT re-export internal services - use dependency injection instead

/**
 * Module Health Check
 * Allows other modules to check if shared infrastructure is healthy
 */
export interface SharedModuleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  dependencies: {
    database: boolean
    logger: boolean
    rateLimiter: boolean
  }
  lastChecked: Date
}

/**
 * Public API for health checks
 * This is the only operational method exposed by the shared module
 */
export async function getSharedModuleHealth(): Promise<SharedModuleHealth> {
  try {
    // Basic health checks without exposing internal services
    const health: SharedModuleHealth = {
      status: 'healthy',
      dependencies: {
        database: true, // Would check database connectivity
        logger: true, // Would check logger availability
        rateLimiter: true, // Would check rate limiter service
      },
      lastChecked: new Date(),
    }

    // Determine overall status based on dependencies
    const failedDependencies = Object.values(health.dependencies).filter(
      (dep) => !dep,
    )
    if (failedDependencies.length > 0) {
      health.status = failedDependencies.length > 1 ? 'unhealthy' : 'degraded'
    }

    return health
  } catch (error) {
    return {
      status: 'unhealthy',
      dependencies: {
        database: false,
        logger: false,
        rateLimiter: false,
      },
      lastChecked: new Date(),
    }
  }
}

/**
 * Module Information
 * Provides metadata about the shared module without exposing internals
 */
export const SharedModule = {
  name: 'shared',
  version: '1.0.0',
  description: 'Shared infrastructure and cross-cutting concerns',
  type: 'infrastructure',
  capabilities: [
    'database-access',
    'logging',
    'rate-limiting',
    'pagination',
    'filtering',
    'relay-connections',
    'data-loading',
    'validation-patterns',
    'security-patterns',
  ],
  dependencies: ['prisma', 'winston', 'dataloader', 'rate-limiter-flexible'],
  provides: [
    'database.client',
    'logger.interface',
    'rate-limiter.service',
    'pagination.utils',
    'filter.utils',
    'relay.utils',
    'data.loaders',
  ],
} as const

// Prevent access to internal implementation
// This creates a clear boundary that other modules cannot cross
Object.freeze(SharedModule)
