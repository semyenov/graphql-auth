/**
 * Permissions module
 * 
 * This module provides GraphQL Shield-based authorization for the API.
 * It's organized into:
 * - rules.ts: Individual permission rules
 * - utils.ts: Helper functions for permission checks
 * - shield-config.ts: Shield configuration mapping rules to operations
 */

export * as rules from './rules'
export { permissions } from './shield-config'
export { PermissionUtils } from './utils'
export type { PermissionUtilsType } from './utils'

// Export rule types for external use
export type { IRule as Rule } from 'graphql-shield'
