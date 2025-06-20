/**
 * Cache Interface
 * 
 * Generic caching interface for different cache implementations
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string // Key prefix for namespacing
}

export interface CacheMetrics {
  hits: number
  misses: number
  sets: number
  deletes: number
  size: number
}

/**
 * Generic cache interface
 */
export interface ICache {
  /**
   * Get a value from cache
   */
  get<T = unknown>(key: string): Promise<T | null>
  
  /**
   * Set a value in cache
   */
  set<T = unknown>(key: string, value: T, options?: CacheOptions): Promise<void>
  
  /**
   * Delete a value from cache
   */
  delete(key: string): Promise<boolean>
  
  /**
   * Check if a key exists in cache
   */
  has(key: string): Promise<boolean>
  
  /**
   * Clear all cache entries
   */
  clear(): Promise<void>
  
  /**
   * Get cache metrics
   */
  getMetrics(): Promise<CacheMetrics>
  
  /**
   * Get multiple values at once
   */
  mget<T = unknown>(keys: string[]): Promise<Array<T | null>>
  
  /**
   * Set multiple values at once
   */
  mset<T = unknown>(entries: Array<[string, T]>, options?: CacheOptions): Promise<void>
  
  /**
   * Delete multiple keys at once
   */
  mdel(keys: string[]): Promise<number>
  
  /**
   * Increment a numeric value
   */
  increment(key: string, amount?: number): Promise<number>
  
  /**
   * Decrement a numeric value
   */
  decrement(key: string, amount?: number): Promise<number>
  
  /**
   * Set expiration for a key
   */
  expire(key: string, ttl: number): Promise<boolean>
  
  /**
   * Get time to live for a key
   */
  ttl(key: string): Promise<number>
}