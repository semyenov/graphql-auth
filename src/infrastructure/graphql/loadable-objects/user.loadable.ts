/**
 * Pothos Loadable User Object
 * 
 * Uses DataLoader plugin for efficient batch loading and N+1 prevention
 */

import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { builder } from '../../../schema/builder'
import { LoadablePost } from './post.loadable'
import { prisma } from '../../../prisma'

// Loadable User object using Pothos DataLoader plugin
export const LoadableUser = builder.loadableObject('LoadableUser', {
  description: 'User loaded via DataLoader for optimal performance',
  load: async (ids: number[], context: EnhancedContext) => {
    // Batch load users by IDs
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      // Select only needed fields to optimize query
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Return users in the same order as requested IDs
    return ids.map(id => users.find(user => user.id === id)!)
  },
  toKey(value) {
    return value.id
  },
  fields: (t) => ({
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // Loadable posts relation with advanced options
    posts: t.loadableList({
      type: LoadablePost,
      load: async (ids: number[], context: EnhancedContext) => {
        const userIds = ids

        const posts = await prisma.post.findMany({
          where: { authorId: { in: userIds } },
          orderBy: { createdAt: 'desc' },
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

        // Group posts by authorId
        return users.map(user =>
          posts.filter(post => post.authorId === user.id)
        )
      },
      // Add connection support for pagination
      resolve: (posts) => posts,
    }),

    // Efficient post counts using enhanced loaders
    postCount: t.int({
      description: 'Total number of posts by this user',
      resolve: async (user, _args, context: EnhancedContext) => {
        // Use enhanced DataLoader if available, otherwise fallback
        if (context.enhancedLoaders?.postCountByAuthor) {
          return context.enhancedLoaders.postCountByAuthor.load(user.id)
        }

        // Fallback to original loader or direct query
        if (context.loaders?.postCountByAuthor) {
          return context.loaders.postCountByAuthor.load(user.id)
        }

        return prisma.post.count({
          where: { authorId: user.id }
        })
      },
    }),

    publishedPostCount: t.int({
      description: 'Number of published posts by this user',
      resolve: async (user, _args, context: EnhancedContext) => {
        if (context.enhancedLoaders?.publishedPostCountByAuthor) {
          return context.enhancedLoaders.publishedPostCountByAuthor.load(user.id)
        }

        if (context.loaders?.publishedPostCountByAuthor) {
          return context.loaders.publishedPostCountByAuthor.load(user.id)
        }

        return prisma.post.count({
          where: { authorId: user.id, published: true }
        })
      },
    }),

    draftCount: t.int({
      description: 'Number of draft posts by this user',
      resolve: async (user, _args, context: EnhancedContext) => {
        if (context.enhancedLoaders?.draftPostsCountByAuthor) {
          return context.enhancedLoaders.draftPostsCountByAuthor.load(user.id)
        }

        if (context.loaders?.draftPostsCountByAuthor) {
          return context.loaders.draftPostsCountByAuthor.load(user.id)
        }

        return prisma.post.count({
          where: { authorId: user.id, published: false }
        })
      },
    }),
  }),
})