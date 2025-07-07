/**
 * DataLoader definitions for N+1 query prevention
 * Minimal implementation to support existing tests and functionality
 */

import type { Post, PrismaClient, User } from '@prisma/client'
import DataLoader from 'dataloader'

export interface Loaders {
  userById: DataLoader<number, User | null>
  postsByAuthorId: DataLoader<number, Post[]>
  publishedPostsCountByAuthor: DataLoader<number, number>
  draftPostsCountByAuthor: DataLoader<number, number>
  totalViewsByAuthor: DataLoader<number, number>
  hasPostsByAuthor: DataLoader<number, boolean>
  latestPostByAuthor: DataLoader<number, Post | null>
}

export function createDataLoaders(prisma: PrismaClient): Loaders {
  return {
    userById: new DataLoader(async (userIds) => {
      const users = await prisma.user.findMany({
        where: { id: { in: [...userIds] } },
      })
      const userMap = new Map(users.map((user) => [user.id, user]))
      return userIds.map((id) => userMap.get(id) || null)
    }),

    postsByAuthorId: new DataLoader(async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...authorIds] } },
        orderBy: { createdAt: 'desc' },
      })
      const postMap = new Map<number, Post[]>()
      for (const post of posts) {
        if (post.authorId !== null) {
          if (!postMap.has(post.authorId)) {
            postMap.set(post.authorId, [])
          }
          postMap.get(post.authorId)?.push(post)
        }
      }
      return authorIds.map((id) => postMap.get(id) || [])
    }),

    publishedPostsCountByAuthor: new DataLoader(async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: {
          authorId: { in: [...authorIds] },
          published: true,
        },
        _count: true,
      })
      const countMap = new Map(counts.map((c) => [c.authorId, c._count]))
      return authorIds.map((id) => countMap.get(id) || 0)
    }),

    draftPostsCountByAuthor: new DataLoader(async (authorIds) => {
      const counts = await prisma.post.groupBy({
        by: ['authorId'],
        where: {
          authorId: { in: [...authorIds] },
          published: false,
        },
        _count: true,
      })
      const countMap = new Map(counts.map((c) => [c.authorId, c._count]))
      return authorIds.map((id) => countMap.get(id) || 0)
    }),

    totalViewsByAuthor: new DataLoader(async (authorIds) => {
      const sums = await prisma.post.groupBy({
        by: ['authorId'],
        where: { authorId: { in: [...authorIds] } },
        _sum: { viewCount: true },
      })
      const sumMap = new Map(
        sums.map((s) => [s.authorId, s._sum.viewCount ?? 0]),
      )
      return authorIds.map((id) => sumMap.get(id) || 0)
    }),

    hasPostsByAuthor: new DataLoader(async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...authorIds] } },
        select: { authorId: true },
        distinct: ['authorId'],
      })
      const hasPostsSet = new Set(posts.map((p) => p.authorId))
      return authorIds.map((id) => hasPostsSet.has(id))
    }),

    latestPostByAuthor: new DataLoader(async (authorIds) => {
      const latestPosts = await Promise.all(
        authorIds.map((authorId) =>
          prisma.post.findFirst({
            where: { authorId },
            orderBy: { createdAt: 'desc' },
          }),
        ),
      )
      return latestPosts
    }),
  }
}

export type { Loaders as DataLoaders }
