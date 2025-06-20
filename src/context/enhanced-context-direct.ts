/**
 * Enhanced Context for Direct Pothos Resolvers
 * 
 * This simplified context is used with direct Pothos resolvers.
 * Following Pothos best practices, Prisma client is NOT included in context
 * to improve TypeScript performance and developer experience.
 */

import { prisma } from '../prisma'
import { createDataLoaders, type DataLoaders } from '../infrastructure/graphql/dataloaders'
import { createEnhancedLoaders, type EnhancedLoaders } from '../infrastructure/graphql/dataloaders/enhanced-loaders'
import type { Context } from './types.d'

export interface EnhancedContext extends Context {
  // Original DataLoaders for batch loading (optional for tests)
  loaders?: DataLoaders
  // Enhanced DataLoaders for Pothos loadable objects
  enhancedLoaders?: EnhancedLoaders
}

/**
 * Create enhanced context for direct Pothos resolvers
 */
export function enhanceContext(baseContext: Context): EnhancedContext {
  try {
    // Create enhanced context without Prisma
    const enhancedContext: EnhancedContext = {
      ...baseContext,
    }
    
    // Create DataLoaders (only if available)
    try {
      // Pass enhanced context for loaders that need user context
      enhancedContext.loaders = createDataLoaders(enhancedContext)
      // Create enhanced loaders with direct Prisma reference
      enhancedContext.enhancedLoaders = createEnhancedLoaders(prisma)
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