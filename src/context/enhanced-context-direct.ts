/**
 * Enhanced Context for Direct Pothos Resolvers
 * 
 * This simplified context is used with direct Pothos resolvers that don't need use cases.
 */

import type { PrismaClient } from '@prisma/client'
import { DatabaseClient } from '../infrastructure/database'
import { createDataLoaders, type DataLoaders } from '../infrastructure/graphql/dataloaders'
import type { Context } from './types.d'

export interface EnhancedContext extends Context {
  // Prisma client for direct database access in Pothos resolvers
  prisma: PrismaClient
  // DataLoaders for batch loading (optional for tests)
  loaders?: DataLoaders
}

/**
 * Create enhanced context for direct Pothos resolvers
 */
export function enhanceContext(baseContext: Context): EnhancedContext {
  try {
    // Create enhanced context
    const enhancedContext: EnhancedContext = {
      ...baseContext,
      prisma: DatabaseClient.getClient(),
    }
    
    // Create DataLoaders with the enhanced context (only if available)
    try {
      enhancedContext.loaders = createDataLoaders(enhancedContext)
    } catch (error) {
      // DataLoaders are optional for tests
      console.debug('DataLoaders not available:', error)
    }
    
    return enhancedContext
  } catch (error) {
    console.error('Error enhancing context:', error)
    throw error
  }
}