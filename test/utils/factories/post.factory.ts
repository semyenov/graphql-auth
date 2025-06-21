/**
 * Post factory functions for creating test posts
 */

import type { Post, User } from '@prisma/client'
import { prisma } from '../database/prisma'
import { createTestUser } from './user.factory'

/**
 * Create a test post
 */
export async function createTestPost(data: {
  authorId: number
  title?: string
  content?: string
  published?: boolean
  viewCount?: number
}): Promise<Post> {
  const timestamp = Date.now()

  return prisma.post.create({
    data: {
      title: data.title || `Test Post ${timestamp}`,
      content: data.content || `Test content ${timestamp}`,
      published: data.published ?? false,
      viewCount: data.viewCount ?? 0,
      authorId: data.authorId,
    },
  })
}

/**
 * Create a user with posts
 */
export async function createUserWithPosts(options?: {
  postCount?: number
  publishedPosts?: number
}): Promise<{ user: User; posts: Post[] }> {
  const user = await createTestUser()
  const posts: Post[] = []

  const postCount = options?.postCount ?? 3
  const publishedPosts = options?.publishedPosts ?? 1

  for (let i = 0; i < postCount; i++) {
    const post = await createTestPost({
      authorId: user.id,
      title: `Post ${i + 1} by ${user.name}`,
      published: i < publishedPosts,
    })
    posts.push(post)
  }

  return { user, posts }
}