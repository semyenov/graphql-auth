/**
 * Test data factory functions for creating consistent test data
 */

import type { Post, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from './setup'

/**
 * Create a test user with hashed password
 */
export async function createTestUser(data?: {
  email?: string
  password?: string
  name?: string
}): Promise<User> {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substr(2, 9)

  return prisma.user.create({
    data: {
      email: data?.email || `test-${timestamp}-${randomId}@example.com`,
      password: await bcrypt.hash(data?.password || 'password123', 10),
      name: data?.name || `Test User ${timestamp}`,
    },
  })
}

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

/**
 * Seed test users with default credentials
 */
export async function seedTestUsers(): Promise<User[]> {
  const users = await Promise.all([
    createTestUser({
      email: 'alice@test.com',
      password: 'alice123',
      name: 'Alice Test',
    }),
    createTestUser({
      email: 'bob@test.com',
      password: 'bob123',
      name: 'Bob Test',
    }),
    createTestUser({
      email: 'charlie@test.com',
      password: 'charlie123',
      name: 'Charlie Test',
    }),
  ])

  return users
}