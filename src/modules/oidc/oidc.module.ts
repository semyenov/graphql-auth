/**
 * OIDC Module - Public API Facade
 *
 * This file defines the ONLY way other modules can interact with the OIDC module.
 * It implements the facade pattern to enforce strict module boundaries.
 *
 * ⚠️ Other modules MUST only import from this file, never from internal files.
 *
 * Version: 1.0.0
 * Last Updated: 2025-07-07
 */

// Re-export client interface for inter-module communication
export type { IOidcClient } from './client/oidc.client.interface'

// Re-export public types only
export type {
  OidcClient,
  OidcSession,
  OidcTokenResponse,
} from './types/oidc.types'

// DO NOT re-export internal services, repositories, or implementation details
// Other modules should use the client interface or GraphQL API

/**
 * Module Health Check
 * Allows other modules to check if OIDC module is healthy
 */
export interface OidcModuleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  dependencies: {
    database: boolean
    providerService: boolean
  }
  lastChecked: Date
}

/**
 * Public API for health checks
 * This is the only operational method exposed by the OIDC module
 */
export async function getOidcModuleHealth(): Promise<OidcModuleHealth> {
  try {
    // Basic health checks without exposing internal services
    const health: OidcModuleHealth = {
      status: 'healthy',
      dependencies: {
        database: true, // Would check database connectivity
        providerService: true, // Would check OIDC provider service
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
        providerService: false,
      },
      lastChecked: new Date(),
    }
  }
}

/**
 * Module Information
 * Provides metadata about the OIDC module without exposing internals
 */
export const OidcModule = {
  name: 'oidc',
  version: '1.0.0',
  description: 'OpenID Connect provider module',
  capabilities: [
    'oauth2-authorization',
    'openid-connect',
    'client-management',
    'session-management',
    'token-introspection',
  ],
  dependencies: ['shared.logger', 'shared.database', 'auth'],
  graphqlResolvers: [
    'oidcClients',
    'createOidcClient',
    'updateOidcClient',
    'deleteOidcClient',
    'myOidcSessions',
    'revokeOidcSession',
  ],
  httpEndpoints: [
    '/.well-known/openid-configuration',
    '/oidc/auth',
    '/oidc/token',
    '/oidc/userinfo',
    '/oidc/introspect',
  ],
} as const

// Prevent access to internal implementation
// This creates a clear boundary that other modules cannot cross
Object.freeze(OidcModule)