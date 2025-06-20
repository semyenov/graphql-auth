/**
 * Loadable Objects for DataLoader Integration
 * 
 * These objects automatically batch and cache database queries
 * to prevent N+1 query problems in GraphQL resolvers.
 */

import type { Post, User } from '@prisma/client'
import DataLoader from 'dataloader'
import { NotFoundError } from '../errors'
import { builder } from './builder'

/**
 * LoadableUser - User object with automatic batch loading
 * 
 * Features:
 * - Automatic batching of user queries
 * - Request-level caching
 * - N+1 query prevention for user lookups
 */
export const LoadableUser = builder.loadableObject('LoadableUser', {
  description: 'User with automatic batch loading and caching',
  load: async (ids: number[], context) => {
    // Batch load users by IDs
    const users = await context.prisma.user.findMany({
      where: { id: { in: ids } }
    })

    // Map results maintaining order and handling missing users
    const userMap = new Map(users.map(user => [user.id, user]))
    return ids.map(id =>
      userMap.get(id) || new NotFoundError('User', id)
    )
  },
  toKey(value) {
    return value.id
  },
  fields: (t) => ({
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // Loadable list for posts - automatically batches post queries by author
    posts: t.loadableList({
      type: 'Post',
      load: async (authorIds: number[], { prisma }) => {
        // Batch load all posts for multiple authors
        const posts = await prisma.post.findMany({
          where: { authorId: { in: authorIds } },
          orderBy: { createdAt: 'desc' }
        })

        // Group posts by author
        const postsByAuthor = new Map<number, Post[]>()
        for (const post of posts) {
          const authorPosts = postsByAuthor.get(post.authorId) || []
          authorPosts.push(post)
          postsByAuthor.set(post.authorId, authorPosts)
        }

        // Return posts grouped by author ID
        return authorIds.map(id => postsByAuthor.get(id) || [])
      },
      args: {
        published: t.arg.boolean({
          description: 'Filter posts by published status'
        })
      },
      resolve: (posts, args) => {
        // Apply client-side filtering if needed
        if (args.published !== undefined) {
          return posts.filter(post => post.published === args.published)
        }
        return posts
      }
    }),

    // Post count with batch loading
    postCount: t.int({
      description: 'Total number of posts by this user',
      resolve: async (parent, _args, { prisma }) => {
        // This could be optimized with a DataLoader too
        return prisma.post.count({
          where: { authorId: parent.id }
        })
      }
    }),

    // Draft count with efficient loading
    draftCount: t.int({
      description: 'Number of draft posts',
      resolve: async (parent, _args, { prisma }) => {
        return prisma.post.count({
          where: {
            authorId: parent.id,
            published: false
          }
        })
      }
    })
  })
})

/**
 * LoadablePost - Post object with automatic batch loading
 * 
 * Features:
 * - Automatic batching of post queries
 * - Efficient author loading
 * - View count tracking
 */
export const LoadablePost = builder.loadableObject('LoadablePost', {
  description: 'Post with automatic batch loading and caching',
  load: async (ids: number[], context) => {
    // Batch load posts by IDs
    const posts = await context.prisma.post.findMany({
      where: { id: { in: ids } }
    })

    // Map results maintaining order
    const postMap = new Map(posts.map(post => [post.id, post]))
    return ids.map(id =>
      postMap.get(id) || new NotFoundError('Post', id)
    )
  },
  toKey(value) {
    return value.id
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    content: t.exposeString('content', { nullable: true }),
    published: t.exposeBoolean('published'),
    viewCount: t.exposeInt('viewCount'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // Efficient author loading using DataLoader
    author: t.loadable({
      type: 'User',
      load: (authorId: number) => authorId,
      resolve: (parent) => parent.authorId
    }),

    // Enhanced metadata
    metadata: t.field({
      type: 'PostMetadata',
      resolve: (parent) => ({
        wordCount: parent.content ? parent.content.split(/\s+/).length : 0,
        readingTime: parent.content ? Math.ceil(parent.content.split(/\s+/).length / 200) : 0,
        hasContent: !!parent.content && parent.content.length > 0
      })
    })
  })
})

/**
 * PostMetadata - Additional computed fields for posts
 */
builder.objectType('PostMetadata', {
  description: 'Computed metadata for a post',
  fields: (t) => ({
    wordCount: t.int({
      description: 'Number of words in the post content'
    }),
    readingTime: t.int({
      description: 'Estimated reading time in minutes'
    }),
    hasContent: t.boolean({
      description: 'Whether the post has any content'
    })
  })
})

/**
 * Helper to create DataLoader instances for the context
 */
export function createDataLoaders(prisma: any) {
  return {
    userById: new DataLoader<string, User>(
      async (ids) => {
        const users = await prisma.user.findMany({
          where: { id: { in: ids as string[] } }
        })
        const userMap = new Map(users.map((u: User) => [u.id, u]))
        return ids.map(id => userMap.get(id) || new Error(`User ${id} not found`))
      }
    ),

    postsByAuthor: new DataLoader<string, Post[]>(
      async (authorIds) => {
        const posts = await prisma.post.findMany({
          where: { authorId: { in: authorIds as string[] } },
          orderBy: { createdAt: 'desc' }
        })

        const postsByAuthor = new Map<string, Post[]>()
        for (const post of posts) {
          const authorPosts = postsByAuthor.get(post.authorId) || []
          authorPosts.push(post)
          postsByAuthor.set(post.authorId, authorPosts)
        }

        return authorIds.map(id => postsByAuthor.get(id) || [])
      }
    ),

    postCount: new DataLoader<{ authorId: string, published?: boolean }, number>(
      async (keys) => {
        const counts = await Promise.all(
          keys.map(key =>
            prisma.post.count({
              where: {
                authorId: key.authorId,
                ...(key.published !== undefined && { published: key.published })
              }
            })
          )
        )
        return counts
      },
      {
        cacheKeyFn: (key) => `${key.authorId}-${key.published ?? 'all'}`
      }
    )
  }
}

// Re-export DataLoader for convenience
export { default as DataLoader } from 'dataloader'
