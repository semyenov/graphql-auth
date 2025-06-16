/**
 * Enhanced Query Resolvers with Advanced Pothos Features
 * 
 * Demonstrates advanced Pothos patterns including enhanced connections,
 * loadable objects, and optimized queries.
 */

import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { builder } from '../../../schema/builder'
import { 
  buildAdvancedConnectionQuery, 
  createConnectionWithMetadata,
  type ConnectionMetadata 
} from '../connections/advanced-connections'

// Enhanced search and filter input types
const PostSearchInput = builder.inputType('PostSearchInput', {
  description: 'Advanced search and filter options for posts',
  fields: (t) => ({
    searchTerm: t.string({
      required: false,
      description: 'Search in title and content',
      validate: { schema: z.string().min(1).max(100) },
    }),
    published: t.boolean({
      required: false,
      description: 'Filter by published status',
    }),
    authorId: t.id({
      required: false,
      description: 'Filter by specific author (global ID)',
    }),
    viewCountMin: t.int({
      required: false,
      description: 'Minimum view count',
      validate: { schema: z.number().min(0) },
    }),
    viewCountMax: t.int({
      required: false,
      description: 'Maximum view count',
      validate: { schema: z.number().min(0) },
    }),
    createdAfter: t.field({
      type: 'DateTime',
      required: false,
      description: 'Filter posts created after this date',
    }),
    createdBefore: t.field({
      type: 'DateTime',
      required: false,
      description: 'Filter posts created before this date',
    }),
  }),
})

// Enhanced feed query using loadable objects and advanced connections
builder.queryField('enhancedFeed', (t) =>
  t.field({
    type: 'EnhancedPostConnection',
    description: 'Get posts with enhanced pagination and metadata',
    grantScopes: ['public'],
    args: {
      first: t.arg.int({ required: false }),
      last: t.arg.int({ required: false }),
      before: t.arg.string({ required: false }),
      after: t.arg.string({ required: false }),
      search: t.arg({ 
        type: PostSearchInput, 
        required: false,
        description: 'Advanced search and filter options',
      }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      // Build query using advanced connection builder
      const { where, take, orderBy, searchTerm, filters } = buildAdvancedConnectionQuery({
        first: args.first,
        last: args.last,
        before: args.before,
        after: args.after,
        searchTerm: args.search?.searchTerm,
        filters: {
          ...(args.search?.published !== undefined && { published: args.search.published }),
          ...(args.search?.viewCountMin !== undefined && { 
            viewCount: { gte: args.search.viewCountMin } 
          }),
          ...(args.search?.viewCountMax !== undefined && { 
            viewCount: { lte: args.search.viewCountMax } 
          }),
          ...(args.search?.createdAfter && { 
            createdAt: { gte: args.search.createdAfter } 
          }),
          ...(args.search?.createdBefore && { 
            createdAt: { lte: args.search.createdBefore } 
          }),
        },
      })

      // Get total count for metadata
      const totalCount = await context.prisma.post.count({ where })

      // Execute main query
      const posts = await context.prisma.post.findMany({
        where,
        take,
        orderBy,
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
        },
      })

      // Handle pagination
      const hasNextPage = posts.length > (args.first || 20)
      const hasPreviousPage = !!args.after || !!args.before
      
      if (hasNextPage) {
        posts.pop() // Remove the extra item used for pagination detection
      }

      // Create edges with cursors
      const edges = posts.map(post => ({
        cursor: Buffer.from(`Post:${post.id}`).toString('base64'),
        node: post,
      }))

      // Create metadata
      const metadata: ConnectionMetadata = {
        totalCount,
        searchTerm,
        filters,
        pageSize: args.first || args.last || 20,
      }

      // Return enhanced connection
      return createConnectionWithMetadata(
        edges,
        {
          hasNextPage,
          hasPreviousPage,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        metadata
      )
    },
  })
)

// Enhanced user search with loadable objects
builder.queryField('enhancedUserSearch', (t) =>
  t.field({
    type: 'EnhancedUserConnection',
    description: 'Search users with enhanced metadata and efficient loading',
    grantScopes: ['public'],
    args: {
      first: t.arg.int({ required: false }),
      last: t.arg.int({ required: false }),
      before: t.arg.string({ required: false }),
      after: t.arg.string({ required: false }),
      searchTerm: t.arg.string({ 
        required: false,
        validate: { schema: z.string().min(1).max(100) },
      }),
      hasPublishedPosts: t.arg.boolean({ required: false }),
    },
    resolve: async (_parent, args, context: EnhancedContext) => {
      // Build where clause
      let where: any = {}
      
      if (args.searchTerm) {
        where.OR = [
          { name: { contains: args.searchTerm, mode: 'insensitive' } },
          { email: { contains: args.searchTerm, mode: 'insensitive' } },
        ]
      }
      
      if (args.hasPublishedPosts !== undefined) {
        if (args.hasPublishedPosts) {
          where.posts = { some: { published: true } }
        } else {
          where.posts = { none: { published: true } }
        }
      }

      // Handle cursor pagination
      const limit = args.first || args.last || 20
      if (args.before || args.after) {
        const cursor = args.before || args.after
        const decodedCursor = Buffer.from(cursor!, 'base64').toString('ascii')
        const cursorId = parseInt(decodedCursor.split(':')[1])
        
        if (args.before) {
          where.id = { lt: cursorId }
        } else if (args.after) {
          where.id = { gt: cursorId }
        }
      }

      // Get total count
      const totalCount = await context.prisma.user.count({ where })

      // Execute main query
      const users = await context.prisma.user.findMany({
        where,
        take: limit + 1,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      // Handle pagination
      const hasNextPage = users.length > limit
      if (hasNextPage) {
        users.pop()
      }

      // Create edges
      const edges = users.map(user => ({
        cursor: Buffer.from(`User:${user.id}`).toString('base64'),
        node: user,
      }))

      // Return enhanced connection
      return createConnectionWithMetadata(
        edges,
        {
          hasNextPage,
          hasPreviousPage: !!args.after || !!args.before,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        {
          totalCount,
          searchTerm: args.searchTerm,
          filters: { hasPublishedPosts: args.hasPublishedPosts },
        }
      )
    },
  })
)

// Loadable post by ID using enhanced loaders
builder.queryField('loadablePost', (t) =>
  t.loadable({
    type: 'LoadablePost',
    description: 'Load a post efficiently using DataLoader',
    grantScopes: ['public'],
    args: {
      id: t.arg.id({ 
        required: true,
        description: 'Global ID of the post to load',
      }),
    },
    load: async (args, context: EnhancedContext) => {
      // Parse global ID to get numeric ID
      const globalId = args.id.toString()
      const decodedId = Buffer.from(globalId, 'base64').toString('ascii')
      const [type, numericId] = decodedId.split(':')
      
      if (type !== 'Post') {
        throw new Error(`Expected Post ID, got ${type}`)
      }
      
      const postId = parseInt(numericId)
      
      // Use enhanced loader if available
      if (context.enhancedLoaders?.post) {
        return context.enhancedLoaders.post.load(postId)
      }
      
      // Fallback to direct query
      return context.prisma.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
        },
      })
    },
    resolve: (post) => post,
  })
)

// Loadable user by ID using enhanced loaders
builder.queryField('loadableUser', (t) =>
  t.loadable({
    type: 'LoadableUser',
    description: 'Load a user efficiently using DataLoader',
    grantScopes: ['public'],
    args: {
      id: t.arg.id({ 
        required: true,
        description: 'Global ID of the user to load',
      }),
    },
    load: async (args, context: EnhancedContext) => {
      // Parse global ID to get numeric ID
      const globalId = args.id.toString()
      const decodedId = Buffer.from(globalId, 'base64').toString('ascii')
      const [type, numericId] = decodedId.split(':')
      
      if (type !== 'User') {
        throw new Error(`Expected User ID, got ${type}`)
      }
      
      const userId = parseInt(numericId)
      
      // Use enhanced loader if available
      if (context.enhancedLoaders?.user) {
        return context.enhancedLoaders.user.load(userId)
      }
      
      // Fallback to direct query
      return context.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    },
    resolve: (user) => user,
  })
)