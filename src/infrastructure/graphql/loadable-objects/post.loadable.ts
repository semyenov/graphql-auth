/**
 * Pothos Loadable Post Object
 * 
 * Uses DataLoader plugin for efficient batch loading and N+1 prevention
 */

import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { builder } from '../../../schema/builder'
import { prisma } from '../../../prisma'

// Loadable Post object using Pothos DataLoader plugin
export const LoadablePost = builder.loadableObject('LoadablePost', {
  name: 'LoadablePost',
  description: 'Post loaded via DataLoader for optimal performance',
  load: async (ids: number[], context: EnhancedContext) => {
    // Batch load posts by IDs
    const posts = await prisma.post.findMany({
      where: { id: { in: ids } },
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

    // Return posts in the same order as requested IDs
    return ids.map(id => posts.find(post => post.id === id)!)
  },
  toKey(value) {
    return value.id
  },
  fields: (t) => ({
    title: t.exposeString('title'),
    content: t.exposeString('content', { nullable: true }),
    published: t.exposeBoolean('published'),
    viewCount: t.exposeInt('viewCount'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // Loadable author relation with enhanced loaders
    author: t.loadable({
      type: 'LoadableUser',
      load: async (ids: number[], context: EnhancedContext) => {
        if (!ids) return null

        // Use enhanced loader first, then fallback to original loader
        if (context.enhancedLoaders?.user) {
          return context.enhancedLoaders.user.load(ids)
        }

        // Fallback to original loader or direct query
        return context.loaders?.userById?.load(id) ||
          prisma.user.findUnique({ where: { id } })
      },
      resolve: (author) => author,
    }),

    // Computed fields with caching
    excerpt: t.string({
      description: 'First 150 characters of the post content',
      nullable: true,
      resolve: (post) => {
        if (!post.content) return null
        return post.content.length > 150
          ? post.content.substring(0, 150) + '...'
          : post.content
      },
    }),

    readingTime: t.int({
      description: 'Estimated reading time in minutes',
      resolve: (post) => {
        const wordsPerMinute = 200
        const wordCount = post.content?.split(/\s+/).length || 0
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
      },
    }),

    isOwnedBy: t.boolean({
      description: 'Whether the current user owns this post',
      grantScopes: ['authenticated'],
      resolve: (post, _args, context: EnhancedContext) => {
        return context.userId?.value === post.authorId
      },
    }),
  }),
})