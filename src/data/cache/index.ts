/**
 * Cache Layer Index
 * 
 * Central export point for all cache implementations
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

export type { ICache, CacheOptions, CacheMetrics } from './cache.interface'
export { MemoryCache } from './memory-cache'
export { RedisCache } from './redis-cache'

// Import ICache type for local use
import type { ICache } from './cache.interface'
import { MemoryCache } from './memory-cache'
import { RedisCache } from './redis-cache'

/**
 * Cache factory function
 */
export function createCache(type: 'memory' | 'redis', options?: {
  keyPrefix?: string
  defaultTtl?: number
  client?: any
}): ICache {
  const { keyPrefix = '', defaultTtl = 300, client } = options || {}
  
  switch (type) {
    case 'memory':
      return new MemoryCache(defaultTtl, keyPrefix)
    case 'redis':
      if (!client) {
        throw new Error('Redis client is required for Redis cache')
      }
      return new RedisCache(client, keyPrefix, defaultTtl)
    default:
      throw new Error(`Unsupported cache type: ${type}`)
  }
}

/**
 * Default cache instance (memory cache for development)
 */
export const defaultCache = createCache('memory', {
  keyPrefix: 'graphql-auth',
  defaultTtl: 300, // 5 minutes
})