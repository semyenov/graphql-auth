/**
 * In-Memory Cache Implementation
 * 
 * Simple in-memory cache for development and testing
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

import type { ICache, CacheOptions, CacheMetrics } from './cache.interface'

interface CacheEntry<T = unknown> {
  value: T
  expiresAt?: number
  createdAt: number
}

export class MemoryCache implements ICache {
  private cache = new Map<string, CacheEntry>()
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
  }
  
  private defaultTtl: number
  private keyPrefix: string
  private cleanupInterval: NodeJS.Timeout
  
  constructor(
    defaultTtl = 300, // 5 minutes default
    keyPrefix = '',
    cleanupIntervalMs = 60000 // 1 minute cleanup interval
  ) {
    this.defaultTtl = defaultTtl
    this.keyPrefix = keyPrefix
    
    // Start cleanup interval to remove expired entries
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, cleanupIntervalMs)
  }
  
  private getFullKey(key: string): string {
    return this.keyPrefix ? `${this.keyPrefix}:${key}` : key
  }
  
  private isExpired(entry: CacheEntry): boolean {
    return entry.expiresAt !== undefined && entry.expiresAt < Date.now()
  }
  
  private cleanup(): void {
    const now = Date.now()
    let removed = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        removed++
      }
    }
    
    this.metrics.size = this.cache.size
    
    if (removed > 0) {
      console.debug(`MemoryCache: Cleaned up ${removed} expired entries`)
    }
  }
  
  async get<T = unknown>(key: string): Promise<T | null> {
    const fullKey = this.getFullKey(key)
    const entry = this.cache.get(fullKey) as CacheEntry<T> | undefined
    
    if (!entry || this.isExpired(entry)) {
      this.metrics.misses++
      if (entry) {
        this.cache.delete(fullKey)
        this.metrics.size = this.cache.size
      }
      return null
    }
    
    this.metrics.hits++
    return entry.value
  }
  
  async set<T = unknown>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const fullKey = this.getFullKey(key)
    const ttl = options?.ttl ?? this.defaultTtl
    
    const entry: CacheEntry<T> = {
      value,
      createdAt: Date.now(),
      expiresAt: ttl > 0 ? Date.now() + (ttl * 1000) : undefined,
    }
    
    this.cache.set(fullKey, entry)
    this.metrics.sets++
    this.metrics.size = this.cache.size
  }
  
  async delete(key: string): Promise<boolean> {
    const fullKey = this.getFullKey(key)
    const deleted = this.cache.delete(fullKey)
    
    if (deleted) {
      this.metrics.deletes++
      this.metrics.size = this.cache.size
    }
    
    return deleted
  }
  
  async has(key: string): Promise<boolean> {
    const fullKey = this.getFullKey(key)
    const entry = this.cache.get(fullKey)
    
    if (!entry || this.isExpired(entry)) {
      if (entry) {
        this.cache.delete(fullKey)
        this.metrics.size = this.cache.size
      }
      return false
    }
    
    return true
  }
  
  async clear(): Promise<void> {
    const size = this.cache.size
    this.cache.clear()
    this.metrics.deletes += size
    this.metrics.size = 0
  }
  
  async getMetrics(): Promise<CacheMetrics> {
    return { ...this.metrics }
  }
  
  async mget<T = unknown>(keys: string[]): Promise<Array<T | null>> {
    return Promise.all(keys.map(key => this.get<T>(key)))
  }
  
  async mset<T = unknown>(entries: Array<[string, T]>, options?: CacheOptions): Promise<void> {
    await Promise.all(entries.map(([key, value]) => this.set(key, value, options)))
  }
  
  async mdel(keys: string[]): Promise<number> {
    const results = await Promise.all(keys.map(key => this.delete(key)))
    return results.filter(Boolean).length
  }
  
  async increment(key: string, amount = 1): Promise<number> {
    const current = await this.get<number>(key)
    const newValue = (current || 0) + amount
    await this.set(key, newValue)
    return newValue
  }
  
  async decrement(key: string, amount = 1): Promise<number> {
    return this.increment(key, -amount)
  }
  
  async expire(key: string, ttl: number): Promise<boolean> {
    const fullKey = this.getFullKey(key)
    const entry = this.cache.get(fullKey)
    
    if (!entry || this.isExpired(entry)) {
      return false
    }
    
    entry.expiresAt = Date.now() + (ttl * 1000)
    return true
  }
  
  async ttl(key: string): Promise<number> {
    const fullKey = this.getFullKey(key)
    const entry = this.cache.get(fullKey)
    
    if (!entry || this.isExpired(entry)) {
      return -1
    }
    
    if (entry.expiresAt === undefined) {
      return -1 // No expiration
    }
    
    return Math.ceil((entry.expiresAt - Date.now()) / 1000)
  }
  
  /**
   * Destroy the cache and cleanup resources
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.cache.clear()
  }
}