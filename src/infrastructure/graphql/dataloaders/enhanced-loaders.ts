/**
 * Enhanced DataLoaders for Pothos Integration
 * 
 * Provides efficient batch loading for common queries to prevent N+1 problems
 */

import type { PrismaClient } from '@prisma/client'
import DataLoader from 'dataloader'

export interface EnhancedLoaders {
  // Entity loaders
  user: DataLoader<number, any | null>
  post: DataLoader<number, any | null>

  // Count loaders for aggregations
  postCountByAuthor: DataLoader<number, number>
  publishedPostCountByAuthor: DataLoader<number, number>
  draftPostsCountByAuthor: DataLoader<number, number>

  // Relation loaders
  postsByAuthor: DataLoader<number, any[]>
  publishedPostsByAuthor: DataLoader<number, any[]>
  draftPostsByAuthor: DataLoader<number, any[]>
}

export function createEnhancedLoaders(prisma: PrismaClient): EnhancedLoaders {
  // Entity loaders
  const user = new DataLoader<number, any | null>(
    async (userIds) => {
      const users = await prisma.user.findMany({
        where: { id: { in: userIds as number[] } },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return userIds.map(id => users.find(user => user.id === id) || null)
    },
    {
      maxBatchSize: 100,
      cacheKeyFn: (key) => key,
    }
  )

  const post = new DataLoader<number, any | null>(
    async (postIds) => {
      const posts = await prisma.post.findMany({
        where: { id: { in: postIds as number[] } },
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

      return postIds.map(id => posts.find(post => post.id === id) || null)
    },
    {
      maxBatchSize: 100,
      cacheKeyFn: (key) => key,
    }
  )

  // Count loaders for efficient aggregations
  const postCountByAuthor = new DataLoader<number, number>(
    async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: { authorId: { in: authorIds as number[] } },
        _count: { id: true },
      })

      return authorIds.map(authorId => {
        const found = counts.find(c => c.authorId === authorId)
        return found?._count.id || 0
      })
    },
    {
      maxBatchSize: 50,
      cacheKeyFn: (key) => key,
    }
  )

  const publishedPostCountByAuthor = new DataLoader<number, number>(
    async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: {
          authorId: { in: authorIds as number[] },
          published: true
        },
        _count: { id: true },
      })

      return authorIds.map(authorId => {
        const found = counts.find(c => c.authorId === authorId)
        return found?._count.id || 0
      })
    },
    {
      maxBatchSize: 50,
      cacheKeyFn: (key) => key,
    }
  )

  const draftPostsCountByAuthor = new DataLoader<number, number>(
    async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: {
          authorId: { in: authorIds as number[] },
          published: false
        },
        _count: { id: true },
      })

      return authorIds.map(authorId => {
        const found = counts.find(c => c.authorId === authorId)
        return found?._count.id || 0
      })
    },
    {
      maxBatchSize: 50,
      cacheKeyFn: (key) => key,
    }
  )

  // Relation loaders
  const postsByAuthor = new DataLoader<number, any[]>(
    async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: authorIds as number[] } },
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

      return authorIds.map(authorId =>
        posts.filter(post => post.authorId === authorId)
      )
    },
    {
      maxBatchSize: 30,
      cacheKeyFn: (key) => key,
    }
  )

  const publishedPostsByAuthor = new DataLoader<number, any[]>(
    async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: authorIds as number[] },
          published: true
        },
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

      return authorIds.map(authorId =>
        posts.filter(post => post.authorId === authorId)
      )
    },
    {
      maxBatchSize: 30,
      cacheKeyFn: (key) => key,
    }
  )

  const draftPostsByAuthor = new DataLoader<number, any[]>(
    async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: authorIds as number[] },
          published: false
        },
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

      return authorIds.map(authorId =>
        posts.filter(post => post.authorId === authorId)
      )
    },
    {
      maxBatchSize: 30,
      cacheKeyFn: (key) => key,
    }
  )

  return {
    user,
    post,
    postCountByAuthor,
    publishedPostCountByAuthor,
    draftPostsCountByAuthor,
    postsByAuthor,
    publishedPostsByAuthor,
    draftPostsByAuthor,
  }
}