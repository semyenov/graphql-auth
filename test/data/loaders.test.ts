/**
 * DataLoader Tests
 *
 * Tests for DataLoader implementation and N+1 query prevention
 */

import * as argon2 from 'argon2'
import { beforeEach, describe, expect, it } from 'vitest'
import { createDataLoaders } from '../../src/data/loaders'
import { prisma } from '../helpers/db'

describe('DataLoaders', () => {
  let loaders: ReturnType<typeof createDataLoaders>
  let hashedPassword: string

  beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.post.deleteMany()
    loaders = createDataLoaders(prisma)
    hashedPassword = await argon2.hash('password123')
  })

  describe('userById loader', () => {
    it('should batch load users by ID', async () => {
      // Create test users
      const users = await Promise.all([
        prisma.user.create({
          data: {
            email: 'user1@test.com',
            name: 'User 1',
            password: hashedPassword,
          },
        }),
        prisma.user.create({
          data: {
            email: 'user2@test.com',
            name: 'User 2',
            password: hashedPassword,
          },
        }),
        prisma.user.create({
          data: {
            email: 'user3@test.com',
            name: 'User 3',
            password: hashedPassword,
          },
        }),
      ])

      // Load users using DataLoader
      const [loadedUser1, loadedUser2, loadedUser3] = await Promise.all([
        loaders.userById.load(users[0].id),
        loaders.userById.load(users[1].id),
        loaders.userById.load(users[2].id),
      ])

      expect(loadedUser1?.name).toBe('User 1')
      expect(loadedUser2?.name).toBe('User 2')
      expect(loadedUser3?.name).toBe('User 3')
    })

    it('should return null for non-existent users', async () => {
      const result = await loaders.userById.load(999999)
      expect(result).toBeNull()
    })

    it('should cache repeated requests', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'cached@test.com',
          name: 'Cached User',
          password: hashedPassword,
        },
      })

      // Load the same user multiple times
      const results = await Promise.all([
        loaders.userById.load(user.id),
        loaders.userById.load(user.id),
        loaders.userById.load(user.id),
      ])

      // All results should be the same cached instance
      expect(results[0]).toBe(results[1])
      expect(results[1]).toBe(results[2])
      expect(results[0]?.name).toBe('Cached User')
    })
  })

  describe('postsByAuthorId loader', () => {
    it('should batch load posts by author ID', async () => {
      // Create test users with posts
      const user1 = await prisma.user.create({
        data: {
          email: 'author1@test.com',
          password: hashedPassword,
          posts: {
            create: [
              { title: 'Post 1-1', published: true },
              { title: 'Post 1-2', published: false },
            ],
          },
        },
      })

      const user2 = await prisma.user.create({
        data: {
          email: 'author2@test.com',
          password: hashedPassword,
          posts: {
            create: [{ title: 'Post 2-1', published: true }],
          },
        },
      })

      // Load posts for both authors
      const [posts1, posts2] = await Promise.all([
        loaders.postsByAuthorId.load(user1.id),
        loaders.postsByAuthorId.load(user2.id),
      ])

      expect(posts1).toHaveLength(2)
      expect(posts2).toHaveLength(1)
      expect(posts1?.[0]?.title).toMatch(/Post 1-/)
      expect(posts2?.[0]?.title).toBe('Post 2-1')
    })

    it('should return empty array for users with no posts', async () => {
      const user = await prisma.user.create({
        data: { email: 'nopost@test.com', password: hashedPassword },
      })

      const posts = await loaders.postsByAuthorId.load(user.id)
      expect(posts).toEqual([])
    })
  })

  describe('count loaders', () => {
    it('should batch load published and draft post counts', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'counter@test.com',
          password: hashedPassword,
          posts: {
            create: [
              { title: 'Published 1', published: true },
              { title: 'Published 2', published: true },
              { title: 'Draft 1', published: false },
              { title: 'Draft 2', published: false },
              { title: 'Draft 3', published: false },
            ],
          },
        },
      })

      const [publishedCount, draftCount] = await Promise.all([
        loaders.publishedPostsCountByAuthor.load(user.id),
        loaders.draftPostsCountByAuthor.load(user.id),
      ])

      expect(publishedCount).toBe(2)
      expect(draftCount).toBe(3)
    })

    it('should batch load total views', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'viewer@test.com',
          password: hashedPassword,
          posts: {
            create: [
              { title: 'Post 1', viewCount: 100 },
              { title: 'Post 2', viewCount: 200 },
              { title: 'Post 3', viewCount: 50 },
            ],
          },
        },
      })

      const totalViews = await loaders.totalViewsByAuthor.load(user.id)
      expect(totalViews).toBe(350)
    })
  })

  describe('hasPostsByAuthor loader', () => {
    it('should correctly identify users with and without posts', async () => {
      const userWith = await prisma.user.create({
        data: {
          email: 'withposts@test.com',
          password: hashedPassword,
          posts: {
            create: { title: 'A Post' },
          },
        },
      })

      const userWithout = await prisma.user.create({
        data: { email: 'withoutposts@test.com', password: hashedPassword },
      })

      const [hasPosts1, hasPosts2] = await Promise.all([
        loaders.hasPostsByAuthor.load(userWith.id),
        loaders.hasPostsByAuthor.load(userWithout.id),
      ])

      expect(hasPosts1).toBe(true)
      expect(hasPosts2).toBe(false)
    })
  })

  describe('latestPostByAuthor loader', () => {
    it('should load the most recent post for each author', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'latest@test.com',
          password: hashedPassword,
          posts: {
            create: [
              {
                title: 'Old Post',
                createdAt: new Date('2023-01-01'),
              },
              {
                title: 'Latest Post',
                createdAt: new Date('2023-12-01'),
              },
              {
                title: 'Middle Post',
                createdAt: new Date('2023-06-01'),
              },
            ],
          },
        },
      })

      const latestPost = await loaders.latestPostByAuthor.load(user.id)
      expect(latestPost?.title).toBe('Latest Post')
    })

    it('should return null for users with no posts', async () => {
      const user = await prisma.user.create({
        data: { email: 'nolatest@test.com', password: hashedPassword },
      })

      const latestPost = await loaders.latestPostByAuthor.load(user.id)
      expect(latestPost).toBeNull()
    })
  })
})
