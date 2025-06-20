/**
 * Data Layer Index
 * 
 * Central export point for all data-related functionality
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

// Cache layer exports
export * from './cache'

// Loaders (if moved here in the future)
// export * from './loaders'

// Database helpers and utilities
// export * from './database'

/**
 * Data layer configuration
 */
export const DATA_LAYER_CONFIG = {
  CACHE_PREFIX: 'graphql-auth',
  DEFAULT_TTL: 300,
  CLEANUP_INTERVAL: 60000,
} as const