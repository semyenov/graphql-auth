/**
 * Enhanced Query Resolvers with Advanced Features
 * 
 * These resolvers demonstrate advanced Pothos patterns including:
 * - DataLoader integration for N+1 prevention
 * - Enhanced connections with metadata
 * - Complex filtering and search
 * - Performance tracking
 */

import { requireAuthentication } from '../../../context/auth'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { builder } from '../../../schema/builder'
import { createEnhancedConnection, EnhancedPostConnection, EnhancedUserConnection, PerformanceTracker } from '../../../schema/enhanced-connections'
import { LoadablePost, LoadableUser } from '../../../schema/loadable-objects'
import { transformOrderBy, transformPostWhereInput } from '../../../schema/utils/filter-transform'
import { parseAndValidateGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import { prisma } from '../../../prisma'

// Enhanced feed query with metadata and performance tracking
builder.queryField('enhancedFeed', (t) =>
  t.field({
    type: EnhancedPostConnection,
    description: 'Advanced feed with metadata, search, and filtering',
    grantScopes: ['public'],
    args: {
      first: t.arg.int(),
      after: t.arg.string(),
      where: t.arg({ type: 'PostWhereInput' }),
      orderBy: t.arg({ type: ['PostOrderByInput'] }),
      searchTerm: t.arg.string({
        description: 'Search posts by title or content'
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const tracker = new PerformanceTracker()

      // Build where clause
      let where = transformPostWhereInput(args.where) || { published: true }

      // Add search if provided
      if (args.searchTerm) {
        where = {
          ...where,
          OR: [
            { title: { contains: args.searchTerm, mode: 'insensitive' } },
            { content: { contains: args.searchTerm, mode: 'insensitive' } },
          ]
        }
      }

      const orderBy = args.orderBy?.map(transformOrderBy) || [{ createdAt: 'desc' }]

      // Get total count
      const totalCount = await prisma.post.count({ where })

      // Get posts with cursor pagination
      const limit = args.first || 10
      const posts = await prisma.post.findMany({
        where,
        orderBy,
        take: limit + 1, // Take one extra to check hasNextPage
        cursor: args.after ? { id: args.after } : undefined,
        skip: args.after ? 1 : 0, // Skip the cursor
      })

      const hasNextPage = posts.length > limit
      if (hasNextPage) {
        posts.pop() // Remove the extra item
      }

      const searchTime = tracker.getElapsedTime()

      // Create enhanced connection with metadata
      return createEnhancedConnection(posts, args, {
        totalCount,
        searchMetadata: args.searchTerm ? {
          query: args.searchTerm,
          searchTime,
          matchedFields: ['title', 'content']
        } : undefined,
        filterSummary: {
          hasFilters: !!args.where || !!args.searchTerm,
          filterCount: (args.where ? Object.keys(args.where).length : 0) + (args.searchTerm ? 1 : 0),
          activeFilters: [
            ...(args.where?.published !== undefined ? [{
              field: 'published',
              operator: 'equals',
              value: String(args.where.published)
            }] : []),
            ...(args.searchTerm ? [{
              field: 'search',
              operator: 'contains',
              value: args.searchTerm
            }] : [])
          ]
        }
      })
    },
  })
)

// Enhanced user search with aggregated data
builder.queryField('enhancedUserSearch', (t) =>
  t.field({
    type: EnhancedUserConnection,
    description: 'User search with aggregated metadata',
    grantScopes: ['authenticated'],
    args: {
      first: t.arg.int(),
      after: t.arg.string(),
      searchTerm: t.arg.string({
        description: 'Search users by name or email',
        required: true
      }),
      includePostStats: t.arg.boolean({
        description: 'Include post statistics in results',
        defaultValue: false
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      requireAuthentication(context)
      const tracker = new PerformanceTracker()

      // Search users
      const where = {
        OR: [
          { name: { contains: args.searchTerm, mode: 'insensitive' as const } },
          { email: { contains: args.searchTerm, mode: 'insensitive' as const } },
        ]
      }

      const totalCount = await prisma.user.count({ where })

      const limit = args.first || 10
      const users = await prisma.user.findMany({
        where,
        take: limit + 1,
        cursor: args.after ? { id: args.after } : undefined,
        skip: args.after ? 1 : 0,
        orderBy: { createdAt: 'desc' },
        ...(args.includePostStats && {
          include: {
            _count: {
              select: { posts: true }
            }
          }
        })
      })

      const hasNextPage = users.length > limit
      if (hasNextPage) {
        users.pop()
      }

      const searchTime = tracker.getElapsedTime()

      return createEnhancedConnection(users, args, {
        totalCount,
        searchMetadata: {
          query: args.searchTerm,
          searchTime,
          matchedFields: ['name', 'email']
        }
      })
    },
  })
)

// Loadable post query - demonstrates DataLoader usage
builder.queryField('loadablePost', (t) =>
  t.field({
    type: LoadablePost,
    nullable: true,
    description: 'Get a post using DataLoader for efficient loading',
    grantScopes: ['public'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      const numericId = await parseAndValidateGlobalId(args.id, 'Post')
      return numericId
    },
  })
)

// Loadable user query
builder.queryField('loadableUser', (t) =>
  t.field({
    type: LoadableUser,
    nullable: true,
    description: 'Get a user using DataLoader for efficient loading',
    grantScopes: ['authenticated'],
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      requireAuthentication(context)
      const numericId = await parseAndValidateGlobalId(args.id, 'User')
      return numericId
    },
  })
)

// Batch user query - demonstrates loading multiple users efficiently
builder.queryField('batchUsers', (t) =>
  t.field({
    type: [LoadableUser],
    description: 'Load multiple users efficiently with DataLoader',
    grantScopes: ['authenticated'],
    args: {
      ids: t.arg.idList({ required: true }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      requireAuthentication(context)

      // Parse all IDs
      const numericIds = await Promise.all(
        args.ids.map(id => parseAndValidateGlobalId(id, 'User'))
      )

      return numericIds
    },
  })
)

// Advanced post analytics query
builder.queryField('postAnalytics', (t) =>
  t.field({
    type: 'PostAnalytics',
    description: 'Get aggregated analytics for posts',
    grantScopes: ['authenticated'],
    args: {
      authorId: t.arg.id(),
      published: t.arg.boolean(),
      dateRange: t.arg({
        type: 'DateRangeInput',
        description: 'Filter by date range'
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      requireAuthentication(context)

      const where: any = {}

      if (args.authorId) {
        const userId = await parseAndValidateGlobalId(args.authorId, 'User')
        where.authorId = userId
      }

      if (args.published !== undefined) {
        where.published = args.published
      }

      if (args.dateRange) {
        where.createdAt = {
          gte: args.dateRange.start,
          lte: args.dateRange.end
        }
      }

      // Aggregate data
      const [totalPosts, totalViews, avgViews, topPosts] = await Promise.all([
        prisma.post.count({ where }),
        prisma.post.aggregate({
          where,
          _sum: { viewCount: true }
        }),
        prisma.post.aggregate({
          where,
          _avg: { viewCount: true }
        }),
        prisma.post.findMany({
          where,
          orderBy: { viewCount: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            viewCount: true
          }
        })
      ])

      return {
        totalPosts,
        totalViews: totalViews._sum.viewCount || 0,
        averageViews: Math.round(avgViews._avg.viewCount || 0),
        topPostsByViews: topPosts,
        dateRange: args.dateRange
      }
    },
  })
)

// Define analytics types for the post analytics query
builder.objectRef('PostAnalytics').implement({
  description: 'Aggregated post analytics',
  fields: (t) => ({
    totalPosts: t.int({
      description: 'Total number of posts',
      resolve: (parent: any) => parent.totalPosts
    }),
    totalViews: t.int({
      description: 'Total views across all posts',
      resolve: (parent: any) => parent.totalViews
    }),
    averageViews: t.int({
      description: 'Average views per post',
      resolve: (parent: any) => parent.averageViews
    }),
    topPostsByViews: t.field({
      type: ['PostSummary'],
      description: 'Top posts by view count',
      resolve: (parent: any) => parent.topPostsByViews
    }),
    dateRange: t.field({
      type: 'DateRange',
      nullable: true,
      description: 'The date range for this analytics data',
      resolve: (parent: any) => parent.dateRange
    })
  })
})

builder.objectRef('PostSummary').implement({
  description: 'Summary information about a post',
  fields: (t) => ({
    id: t.id({
      description: 'Post ID',
      resolve: (parent: any) => parent.id
    }),
    title: t.string({
      description: 'Post title',
      resolve: (parent: any) => parent.title
    }),
    viewCount: t.int({
      description: 'Number of views',
      resolve: (parent: any) => parent.viewCount
    })
  })
})

// Output type for date range
builder.objectRef('DateRange').implement({
  description: 'Date range',
  fields: (t) => ({
    start: t.field({
      type: 'DateTime',
      description: 'Start date',
      resolve: (parent: any) => parent.start
    }),
    end: t.field({
      type: 'DateTime',
      description: 'End date',
      resolve: (parent: any) => parent.end
    })
  })
})

// Input type for date range filtering
builder.inputType('DateRangeInput', {
  description: 'Date range for filtering',
  fields: (t) => ({
    start: t.field({ type: 'DateTime', required: true }),
    end: t.field({ type: 'DateTime', required: true })
  })
})