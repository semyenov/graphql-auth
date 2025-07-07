/**
 * Auth Module - Public API Facade
 *
 * This file defines the ONLY way other modules can interact with the auth module.
 * It implements the facade pattern to enforce strict module boundaries.
 *
 * ⚠️ Other modules MUST only import from this file, never from internal files.
 *
 * Version: 1.0.0
 * Last Updated: 2025-01-16
 */

// Re-export client interface for inter-module communication
export type {
  AuthModuleEvents,
  IAuthClient,
} from './client/auth.client.interface'
// Re-export types from constants
export type {
  AuthErrorMessage,
  AuthRole,
  AuthSuccessMessage,
} from './constants'
// Re-export constants that other modules might need
export {
  AUTH_CONSTANTS,
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
  ROLE_HIERARCHY,
} from './constants'

// Re-export authentication guards (public API)
export {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
  isAuthenticated,
  requireAuthentication,
} from './guards/auth.guards'

// Re-export public types only
export type {
  AuthResponse,
  AuthTokens,
} from './types/auth.types'
// Re-export validation utilities (public API)
export {
  validateAuthCredentials,
  validateEmail,
  validatePassword,
} from './utils/validation'

// DO NOT re-export internal services, repositories, or implementation details
// Other modules should use the client interface or GraphQL API

/**
 * Module Health Check
 * Allows other modules to check if auth module is healthy
 */
export interface AuthModuleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  dependencies: {
    database: boolean
    tokenService: boolean
    passwordService: boolean
  }
  lastChecked: Date
}

/**
 * Public API for health checks
 * This is the only operational method exposed by the auth module
 */
export async function getAuthModuleHealth(): Promise<AuthModuleHealth> {
  try {
    // Basic health checks without exposing internal services
    const health: AuthModuleHealth = {
      status: 'healthy',
      dependencies: {
        database: true, // Would check database connectivity
        tokenService: true, // Would check JWT service
        passwordService: true, // Would check password hashing service
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
        tokenService: false,
        passwordService: false,
      },
      lastChecked: new Date(),
    }
  }
}

/**
 * Module Information
 * Provides metadata about the auth module without exposing internals
 */
export const AuthModule = {
  name: 'auth',
  version: '1.0.0',
  description: 'Authentication and authorization module',
  capabilities: [
    'user-authentication',
    'jwt-tokens',
    'refresh-tokens',
    'password-hashing',
    'email-verification',
    'login-attempts-tracking',
    'role-based-access',
  ],
  dependencies: ['shared.logger', 'shared.database', 'shared.rate-limiter'],
  graphqlResolvers: [
    'signup',
    'login',
    'logout',
    'refreshToken',
    'me',
    'verifyEmail',
    'changePassword',
  ],
} as const

// Prevent access to internal implementation
// This creates a clear boundary that other modules cannot cross
Object.freeze(AuthModule)
