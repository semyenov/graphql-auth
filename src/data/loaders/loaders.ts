/**
 * Enhanced DataLoaders for Pothos Integration
 *
 * Provides efficient batch loading for common queries to prevent N+1 problems
 */

import type { Post, PrismaClient, User } from '@prisma/client'
import DataLoader from 'dataloader'

export interface Loaders {
  // Entity loaders
  user: DataLoader<number, User | null>
  post: DataLoader<number, Post | null>

  // Count loaders for aggregations
  postCountByAuthor: DataLoader<number, number>
  publishedPostCountByAuthor: DataLoader<number, number>
  draftPostsCountByAuthor: DataLoader<number, number>

  // Relation loaders
  postsByAuthor: DataLoader<number, Post[]>
  publishedPostsByAuthor: DataLoader<number, Post[]>
  draftPostsByAuthor: DataLoader<number, Post[]>
}

export function createEnhancedLoaders(prisma: PrismaClient): Loaders {
  // Entity loaders
  const user = new DataLoader<number, User | null>(async (userIds) => {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds as number[] } },
    });

    return userIds.map((id) => users.find((user) => user.id === id) || null);
  });

  const post = new DataLoader<number, Post | null>(async (postIds) => {
    const posts = await prisma.post.findMany({
      where: { id: { in: postIds as number[] } },
    });

    return postIds.map((id) => posts.find((post) => post.id === id) || null);
  });

  // Count loaders for aggregations
  const postCountByAuthor = new DataLoader<number, number>(
    async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: { authorId: { in: authorIds as number[] } },
        _count: { id: true },
      })

      return authorIds.map((authorId) => {
        const found = counts.find((c) => c.authorId === authorId)
        return found?._count.id || 0
      })
    },
    {
      maxBatchSize: 50,
      cacheKeyFn: (key) => key,
    },
  )

  const publishedPostCountByAuthor = new DataLoader<number, number>(
    async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: {
          authorId: { in: authorIds as number[] },
          published: true,
        },
        _count: { id: true },
      })

      return authorIds.map((authorId) => {
        const found = counts.find((c) => c.authorId === authorId)
        return found?._count.id || 0
      })
    },
    {
      maxBatchSize: 50,
      cacheKeyFn: (key) => key,
    },
  )

  const draftPostsCountByAuthor = new DataLoader<number, number>(
    async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: {
          authorId: { in: authorIds as number[] },
          published: false,
        },
        _count: { id: true },
      })

      return authorIds.map((authorId) => {
        const found = counts.find((c) => c.authorId === authorId)
        return found?._count.id || 0
      })
    },
    {
      maxBatchSize: 50,
      cacheKeyFn: (key) => key,
    },
  )

  // Relation loaders
  const postsByAuthor = new DataLoader<number, Post[]>(async (authorIds) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds as number[] } },
      orderBy: { createdAt: 'desc' },
    });

    return authorIds.map((authorId) =>
      posts.filter((post) => post.authorId === authorId),
    );
  });

  const publishedPostsByAuthor = new DataLoader<number, Post[]>(
    async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: authorIds as number[] },
          published: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return authorIds.map((authorId) =>
        posts.filter((post) => post.authorId === authorId),
      );
    },
    {
      maxBatchSize: 30,
      cacheKeyFn: (key) => key,
    },
  );

  const draftPostsByAuthor = new DataLoader<number, Post[]>(
    async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: authorIds as number[] },
          published: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      return authorIds.map((authorId) =>
        posts.filter((post) => post.authorId === authorId),
      );
    },
    {
      maxBatchSize: 30,
      cacheKeyFn: (key) => key,
    },
  );

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
