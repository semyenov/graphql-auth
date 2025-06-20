/**
 * Enhanced Connection Types with Metadata
 * 
 * These connection types extend Relay connections with additional
 * metadata fields for better pagination UX and performance insights.
 */

import { builder } from './builder'
import type { Prisma } from '@prisma/client'

/**
 * EnhancedPostConnection - Post connection with metadata
 */
export const EnhancedPostConnection = builder.connectionObject({
  type: 'Post',
  name: 'EnhancedPostConnection',
  description: 'Post connection with enhanced metadata',
  fields: (t) => ({
    // Total count across all pages
    totalCount: t.int({
      description: 'Total number of posts matching the query',
      resolve: async (parent, args, { prisma }) => {
        // This would be set by the resolver
        return parent.totalCount || 0
      }
    }),
    
    // Aggregate statistics
    totalViews: t.int({
      description: 'Total views across all posts in this connection',
      resolve: async (parent, args, { prisma }) => {
        if (!parent.edges.length) return 0
        
        const postIds = parent.edges.map(edge => edge.node.id)
        const result = await prisma.post.aggregate({
          where: { id: { in: postIds } },
          _sum: { viewCount: true }
        })
        return result._sum.viewCount || 0
      }
    }),
    
    publishedCount: t.int({
      description: 'Number of published posts in this connection',
      resolve: async (parent, args, { prisma }) => {
        if (!parent.edges.length) return 0
        
        const postIds = parent.edges.map(edge => edge.node.id)
        return prisma.post.count({
          where: { 
            id: { in: postIds },
            published: true 
          }
        })
      }
    }),
    
    draftCount: t.int({
      description: 'Number of draft posts in this connection',
      resolve: async (parent, args, { prisma }) => {
        if (!parent.edges.length) return 0
        
        const postIds = parent.edges.map(edge => edge.node.id)
        return prisma.post.count({
          where: { 
            id: { in: postIds },
            published: false 
          }
        })
      }
    }),
    
    // Search metadata
    searchMetadata: t.field({
      type: 'SearchMetadata',
      nullable: true,
      description: 'Metadata about the search query if applicable',
      resolve: (parent) => parent.searchMetadata
    }),
    
    // Filter summary
    filterSummary: t.field({
      type: 'FilterSummary',
      description: 'Summary of applied filters',
      resolve: (parent) => parent.filterSummary || {
        hasFilters: false,
        filterCount: 0,
        activeFilters: []
      }
    })
  })
})

/**
 * EnhancedUserConnection - User connection with metadata
 */
export const EnhancedUserConnection = builder.connectionObject({
  type: 'User',
  name: 'EnhancedUserConnection',
  description: 'User connection with enhanced metadata',
  fields: (t) => ({
    totalCount: t.int({
      description: 'Total number of users matching the query',
      resolve: (parent) => parent.totalCount || 0
    }),
    
    // Aggregate post statistics
    totalPosts: t.int({
      description: 'Total posts by all users in this connection',
      resolve: async (parent, args, { prisma }) => {
        if (!parent.edges.length) return 0
        
        const userIds = parent.edges.map(edge => edge.node.id)
        return prisma.post.count({
          where: { authorId: { in: userIds } }
        })
      }
    }),
    
    activeUsers: t.int({
      description: 'Number of users with at least one post',
      resolve: async (parent, args, { prisma }) => {
        if (!parent.edges.length) return 0
        
        const userIds = parent.edges.map(edge => edge.node.id)
        const result = await prisma.post.groupBy({
          by: ['authorId'],
          where: { authorId: { in: userIds } },
          _count: true
        })
        return result.length
      }
    }),
    
    searchMetadata: t.field({
      type: 'SearchMetadata',
      nullable: true,
      description: 'Metadata about the search query if applicable',
      resolve: (parent) => parent.searchMetadata
    })
  })
})

/**
 * SearchMetadata - Information about search queries
 */
builder.objectType('SearchMetadata', {
  description: 'Metadata about a search query',
  fields: (t) => ({
    query: t.string({
      description: 'The search query string'
    }),
    searchTime: t.float({
      description: 'Time taken to execute the search in milliseconds',
      nullable: true
    }),
    matchedFields: t.stringList({
      description: 'Fields that were searched',
      nullable: true
    })
  })
})

/**
 * FilterSummary - Summary of applied filters
 */
builder.objectType('FilterSummary', {
  description: 'Summary of filters applied to a query',
  fields: (t) => ({
    hasFilters: t.boolean({
      description: 'Whether any filters are applied'
    }),
    filterCount: t.int({
      description: 'Number of active filters'
    }),
    activeFilters: t.field({
      type: ['FilterInfo'],
      description: 'List of active filters'
    })
  })
})

/**
 * FilterInfo - Information about a single filter
 */
builder.objectType('FilterInfo', {
  description: 'Information about an applied filter',
  fields: (t) => ({
    field: t.string({
      description: 'The field being filtered'
    }),
    operator: t.string({
      description: 'The filter operator (e.g., equals, contains)'
    }),
    value: t.string({
      description: 'The filter value as a string'
    })
  })
})

/**
 * ConnectionMetadata - Generic metadata interface
 */
export interface ConnectionMetadata {
  totalCount?: number
  searchMetadata?: {
    query: string
    searchTime?: number
    matchedFields?: string[]
  }
  filterSummary?: {
    hasFilters: boolean
    filterCount: number
    activeFilters: Array<{
      field: string
      operator: string
      value: string
    }>
  }
}

/**
 * Helper to create connection with metadata
 */
export function createEnhancedConnection<T>(
  nodes: T[],
  args: { first?: number | null, last?: number | null, after?: string | null, before?: string | null },
  metadata: ConnectionMetadata
) {
  // This is a simplified version - in production, use proper cursor pagination
  const edges = nodes.map((node, index) => ({
    cursor: Buffer.from(`arrayconnection:${index}`).toString('base64'),
    node
  }))
  
  return {
    edges,
    pageInfo: {
      hasNextPage: false, // Implement based on your pagination logic
      hasPreviousPage: false,
      startCursor: edges[0]?.cursor || null,
      endCursor: edges[edges.length - 1]?.cursor || null
    },
    ...metadata
  }
}

/**
 * Performance tracking helper
 */
export class PerformanceTracker {
  private startTime: number
  
  constructor() {
    this.startTime = performance.now()
  }
  
  getElapsedTime(): number {
    return performance.now() - this.startTime
  }
  
  reset(): void {
    this.startTime = performance.now()
  }
}