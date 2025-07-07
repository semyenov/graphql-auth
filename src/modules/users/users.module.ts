/**
 * Users Module - Public API Facade
 *
 * This file defines the ONLY way other modules can interact with the users module.
 * It implements the facade pattern to enforce strict module boundaries.
 *
 * ⚠️ Other modules MUST only import from this file, never from internal files.
 *
 * Version: 1.0.0
 * Last Updated: 2025-01-16
 */

// Re-export client interface for inter-module communication
export type {
  IUsersClient,
  UsersModuleEvents,
} from './client/users.client.interface'
// Re-export types from constants
export type {
  UserErrorMessage,
  UserOrderBy,
  UserRole,
  UserSearchField,
  UserStatus,
  UserSuccessMessage,
} from './constants'
// Re-export constants that other modules might need
export {
  USER_CONSTANTS,
  USER_ERROR_MESSAGES,
  USER_ORDER_BY,
  USER_ROLES,
  USER_SEARCH_FIELDS,
  USER_STATUS,
  USER_SUCCESS_MESSAGES,
} from './constants'

// Note: User types are defined as Pothos GraphQL types in ./user.types.ts
// They're automatically available through GraphQL schema, not as direct TypeScript exports

// DO NOT re-export internal services, repositories, or implementation details
// Other modules should use the client interface or GraphQL API

/**
 * Module Health Check
 * Allows other modules to check if users module is healthy
 */
export interface UsersModuleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  dependencies: {
    database: boolean
    authModule: boolean
  }
  lastChecked: Date
}

/**
 * Public API for health checks
 * This is the only operational method exposed by the users module
 */
export async function getUsersModuleHealth(): Promise<UsersModuleHealth> {
  try {
    // Basic health checks without exposing internal services
    const health: UsersModuleHealth = {
      status: 'healthy',
      dependencies: {
        database: true, // Would check database connectivity
        authModule: true, // Would check auth module availability
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
        authModule: false,
      },
      lastChecked: new Date(),
    }
  }
}

/**
 * Module Information
 * Provides metadata about the users module without exposing internals
 */
export const UsersModule = {
  name: 'users',
  version: '1.0.0',
  description: 'User management and profile module',
  capabilities: [
    'user-profiles',
    'user-search',
    'profile-management',
    'user-relationships',
    'user-statistics',
    'profile-privacy',
    'user-moderation',
  ],
  dependencies: ['auth.module', 'shared.database', 'shared.logger'],
  graphqlResolvers: [
    'user',
    'users',
    'userProfile',
    'updateProfile',
    'searchUsers',
    'userStats',
  ],
} as const

// Prevent access to internal implementation
// This creates a clear boundary that other modules cannot cross
Object.freeze(UsersModule)
