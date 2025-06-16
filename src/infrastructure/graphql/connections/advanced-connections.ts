/**
 * Advanced Relay Connection Patterns for Pothos
 * 
 * Implements enhanced connection features with custom fields, metadata, and optimizations
 */

import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { builder } from '../../../schema/builder'

// Enhanced PageInfo with additional metadata
export const EnhancedPageInfo = builder.objectType('EnhancedPageInfo', {
  description: 'Enhanced pagination information with additional metadata',
  fields: (t) => ({
    hasNextPage: t.boolean({
      description: 'When paginating forwards, are there more items?',
    }),
    hasPreviousPage: t.boolean({
      description: 'When paginating backwards, are there more items?',
    }),
    startCursor: t.string({
      nullable: true,
      description: 'When paginating backwards, the cursor to continue.',
    }),
    endCursor: t.string({
      nullable: true,
      description: 'When paginating forwards, the cursor to continue.',
    }),
    // Custom metadata fields
    totalCount: t.int({
      nullable: true,
      description: 'Total number of items in the entire collection',
    }),
    pageNumber: t.int({
      nullable: true,
      description: 'Current page number (1-indexed)',
    }),
    pageSize: t.int({
      nullable: true,
      description: 'Number of items per page',
    }),
  }),
})

// Enhanced Post Connection with custom fields
export const EnhancedPostConnection = builder.connectionObject({
  type: 'Post',
  name: 'EnhancedPostConnection',
  fields: (t) => ({
    // Standard connection fields are added automatically
    
    // Custom aggregate fields
    totalCount: t.int({
      description: 'Total number of posts in this connection',
      resolve: async (connection, _args, context: EnhancedContext) => {
        // This should be provided by the resolver that creates the connection
        return (connection as any).totalCount || 0
      },
    }),
    
    totalViewCount: t.int({
      description: 'Sum of view counts for all posts in this connection',
      resolve: async (connection, _args, context: EnhancedContext) => {
        const posts = connection.edges.map(edge => edge.node)
        return posts.reduce((sum, post) => sum + (post.viewCount || 0), 0)
      },
    }),
    
    publishedCount: t.int({
      description: 'Number of published posts in this connection',
      resolve: async (connection, _args, context: EnhancedContext) => {
        const posts = connection.edges.map(edge => edge.node)
        return posts.filter(post => post.published).length
      },
    }),
    
    draftCount: t.int({
      description: 'Number of draft posts in this connection',
      resolve: async (connection, _args, context: EnhancedContext) => {
        const posts = connection.edges.map(edge => edge.node)
        return posts.filter(post => !post.published).length
      },
    }),
    
    // Metadata about the query
    searchTerm: t.string({
      nullable: true,
      description: 'Search term used to filter this connection',
      resolve: (connection) => (connection as any).searchTerm || null,
    }),
    
    filters: t.field({
      type: 'JSON',
      nullable: true,
      description: 'Active filters applied to this connection',
      resolve: (connection) => (connection as any).filters || null,
    }),
  }),
})

// Enhanced User Connection with custom fields
export const EnhancedUserConnection = builder.connectionObject({
  type: 'User',
  name: 'EnhancedUserConnection',
  fields: (t) => ({
    totalCount: t.int({
      description: 'Total number of users in this connection',
      resolve: async (connection, _args, context: EnhancedContext) => {
        return (connection as any).totalCount || 0
      },
    }),
    
    totalPostCount: t.int({
      description: 'Total number of posts by all users in this connection',
      resolve: async (connection, _args, context: EnhancedContext) => {
        const users = connection.edges.map(edge => edge.node)
        const userIds = users.map(user => user.id)
        
        // Use enhanced loader for efficient counting
        if (context.enhancedLoaders?.postCountByAuthor) {
          const counts = await Promise.all(
            userIds.map(id => context.enhancedLoaders!.postCountByAuthor.load(id))
          )
          return counts.reduce((sum, count) => sum + count, 0)
        }
        
        // Fallback to direct query
        const result = await context.prisma.post.aggregate({
          where: { authorId: { in: userIds } },
          _count: { id: true },
        })
        return result._count.id || 0
      },
    }),
    
    activeUsersCount: t.int({
      description: 'Number of users with at least one published post',
      resolve: async (connection, _args, context: EnhancedContext) => {
        const users = connection.edges.map(edge => edge.node)
        const userIds = users.map(user => user.id)
        
        // Use enhanced loader for efficient counting
        if (context.enhancedLoaders?.publishedPostCountByAuthor) {
          const counts = await Promise.all(
            userIds.map(id => context.enhancedLoaders!.publishedPostCountByAuthor.load(id))
          )
          return counts.filter(count => count > 0).length
        }
        
        // Fallback to direct query
        const activeUsers = await context.prisma.user.findMany({
          where: {
            id: { in: userIds },
            posts: {
              some: { published: true }
            }
          },
          select: { id: true },
        })
        return activeUsers.length
      },
    }),
  }),
})

// Connection helper for creating paginated queries with metadata
export interface ConnectionMetadata {
  totalCount?: number
  searchTerm?: string
  filters?: Record<string, any>
  pageNumber?: number
  pageSize?: number
}

export function createConnectionWithMetadata<T>(
  edges: Array<{ cursor: string; node: T }>,
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor?: string | null
    endCursor?: string | null
  },
  metadata: ConnectionMetadata = {}
) {
  return {
    edges,
    pageInfo: {
      ...pageInfo,
      ...metadata,
    },
    ...metadata,
  }
}

// Advanced connection query builder
export function buildAdvancedConnectionQuery(args: {
  first?: number | null
  last?: number | null
  before?: string | null
  after?: string | null
  searchTerm?: string | null
  filters?: Record<string, any>
}) {
  const { first, last, before, after, searchTerm, filters } = args
  
  // Calculate pagination parameters
  const limit = first || last || 20
  const isForward = first !== null && first !== undefined
  
  // Build where clause
  let where: any = {}
  
  // Add search functionality
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
    ]
  }
  
  // Add filters
  if (filters) {
    where = { ...where, ...filters }
  }
  
  // Add cursor-based pagination
  if (before || after) {
    const cursor = before || after
    const decodedCursor = Buffer.from(cursor!, 'base64').toString('ascii')
    const cursorId = parseInt(decodedCursor.split(':')[1])
    
    if (before) {
      where.id = { lt: cursorId }
    } else if (after) {
      where.id = { gt: cursorId }
    }
  }
  
  return {
    where,
    take: limit + 1, // Take one extra to determine hasNextPage/hasPreviousPage
    orderBy: { id: isForward ? 'asc' : 'desc' } as const,
    searchTerm,
    filters,
  }
}