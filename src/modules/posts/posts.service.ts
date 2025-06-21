/**
 * Posts Module Service
 *
 * Business logic for post operations following the IMPROVED-FILE-STRUCTURE.md specification.
 * This service contains reusable business logic that can be used by resolvers and other services.
 */

import type { Post, Prisma } from '@prisma/client'
import { container } from 'tsyringe'
import { AuthorizationError, NotFoundError } from '../../core/errors/types'
import type { ILogger } from '../../core/services/logger.interface'
import { parseGlobalId } from '../../core/utils/relay'
import type { UserId } from '../../core/value-objects/user-id.vo'
import { prisma } from '../../prisma'

// Get services from container
const getLogger = () => container.resolve<ILogger>('ILogger')

export interface CreatePostData {
  title: string
  content?: string
  published?: boolean
}

export interface UpdatePostData {
  title?: string
  content?: string
  published?: boolean
}

export interface PostFilter {
  published?: boolean
  authorId?: number
  searchString?: string
  tags?: string[]
}

export interface PostSort {
  field: 'createdAt' | 'updatedAt' | 'title' | 'viewCount'
  direction: 'asc' | 'desc'
}

export interface PostStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  averageViews: number
}

/**
 * Posts Service - handles business logic for post operations
 */
export class PostsService {
  private logger = getLogger().child({ service: 'PostsService' })

  /**
   * Create a new post
   */
  async createPost(data: CreatePostData, authorId: UserId): Promise<Post> {
    this.logger.info('Creating post', {
      authorId: authorId.value,
      title: data.title,
      published: data.published,
    })

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content || null,
        published: data.published ?? false,
        authorId: authorId.value,
      },
    })

    this.logger.info('Post created', { postId: post.id })
    return post
  }

  /**
   * Update an existing post
   */
  async updatePost(
    postId: string,
    data: UpdatePostData,
    userId: UserId,
  ): Promise<Post> {
    const numericPostId = parseGlobalId(postId, 'Post')

    this.logger.info('Updating post', {
      postId: numericPostId,
      userId: userId.value,
    })

    // Check ownership
    await this.checkPostOwnership(numericPostId, userId)

    // Build update data
    const updateData: Prisma.PostUpdateInput = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.content !== undefined) updateData.content = data.content
    if (data.published !== undefined) updateData.published = data.published

    const post = await prisma.post.update({
      where: { id: numericPostId },
      data: updateData,
    })

    this.logger.info('Post updated', { postId: numericPostId })
    return post
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string, userId: UserId): Promise<boolean> {
    const numericPostId = parseGlobalId(postId, 'Post')

    this.logger.info('Deleting post', {
      postId: numericPostId,
      userId: userId.value,
    })

    // Check ownership
    await this.checkPostOwnership(numericPostId, userId)

    await prisma.post.delete({
      where: { id: numericPostId },
    })

    this.logger.info('Post deleted', { postId: numericPostId })
    return true
  }

  /**
   * Toggle post publish status
   */
  async togglePublishPost(postId: string, userId: UserId): Promise<Post> {
    const numericPostId = parseGlobalId(postId, 'Post')

    this.logger.info('Toggling post publish status', { postId: numericPostId })

    // Check ownership
    const existingPost = await this.checkPostOwnership(numericPostId, userId)

    const post = await prisma.post.update({
      where: { id: numericPostId },
      data: { published: !existingPost.published },
    })

    this.logger.info('Post publish status toggled', {
      postId: numericPostId,
      newStatus: post.published,
    })

    return post
  }

  /**
   * Increment post view count
   */
  async incrementViewCount(postId: string): Promise<Post> {
    const numericPostId = parseGlobalId(postId, 'Post')

    this.logger.info('Incrementing view count', { postId: numericPostId })

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: numericPostId },
      select: { id: true },
    })

    if (!existingPost) {
      throw new NotFoundError('Post', postId)
    }

    const post = await prisma.post.update({
      where: { id: numericPostId },
      data: { viewCount: { increment: 1 } },
    })

    this.logger.info('View count incremented', {
      postId: numericPostId,
      newCount: post.viewCount,
    })

    return post
  }

  /**
   * Get posts with filtering and sorting
   */
  async getPosts(
    filter: PostFilter = {},
    sort: PostSort = { field: 'createdAt', direction: 'desc' },
    pagination: { skip?: number; take?: number } = {},
  ): Promise<
    (Post & {
      author: { id: number; name: string | null; email: string } | null
    })[]
  > {
    this.logger.debug('Getting posts', { filter, sort, pagination })

    const whereClause = this.buildWhereClause(filter)
    const orderBy = { [sort.field]: sort.direction }

    return prisma.post.findMany({
      where: whereClause,
      orderBy,
      skip: pagination.skip,
      take: pagination.take,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })
  }

  /**
   * Count posts with filtering
   */
  async countPosts(filter: PostFilter = {}): Promise<number> {
    const whereClause = this.buildWhereClause(filter)
    return prisma.post.count({ where: whereClause })
  }

  /**
   * Get post statistics
   */
  async getPostStats(authorId?: number): Promise<PostStats> {
    this.logger.debug('Getting post stats', { authorId })

    const baseWhere = authorId ? { authorId } : {}

    const [total, published, drafts, viewStats] = await Promise.all([
      prisma.post.count({ where: baseWhere }),
      prisma.post.count({ where: { ...baseWhere, published: true } }),
      prisma.post.count({ where: { ...baseWhere, published: false } }),
      prisma.post.aggregate({
        where: baseWhere,
        _sum: { viewCount: true },
        _avg: { viewCount: true },
      }),
    ])

    return {
      totalPosts: total,
      publishedPosts: published,
      draftPosts: drafts,
      totalViews: viewStats._sum.viewCount || 0,
      averageViews: viewStats._avg.viewCount || 0,
    }
  }

  /**
   * Get user's draft posts
   */
  async getUserDrafts(
    userId: UserId,
    pagination: { skip?: number; take?: number } = {},
  ): Promise<Post[]> {
    this.logger.debug('Getting user drafts', { userId: userId.value })

    return prisma.post.findMany({
      where: {
        authorId: userId.value,
        published: false,
      },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    })
  }

  /**
   * Search posts by text
   */
  async searchPosts(
    searchString: string,
    publishedOnly = true,
    pagination: { skip?: number; take?: number } = {},
  ): Promise<
    (Post & {
      author: { id: number; name: string | null; email: string } | null
    })[]
  > {
    this.logger.debug('Searching posts', { searchString, publishedOnly })

    const whereClause: Prisma.PostWhereInput = {
      OR: [
        { title: { contains: searchString } },
        { content: { contains: searchString } },
      ],
    }

    if (publishedOnly) {
      whereClause.published = true
    }

    return prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })
  }

  /**
   * Get post by ID with visibility check
   */
  async getPostById(
    postId: string,
    userId?: UserId,
  ): Promise<
    | (Post & {
        author: { id: number; name: string | null; email: string } | null
      })
    | null
  > {
    const numericPostId = parseGlobalId(postId, 'Post')

    this.logger.debug('Getting post by ID', {
      postId: numericPostId,
      userId: userId?.value,
    })

    const post = await prisma.post.findUnique({
      where: { id: numericPostId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!post) {
      return null
    }

    // Check visibility - unpublished posts can only be viewed by their author
    if (!post.published && (!userId || post.authorId !== userId.value)) {
      return null
    }

    // Ensure author is not null in the return type
    if (!post.author) {
      // This shouldn't happen due to foreign key constraints, but handle it safely
      return {
        ...post,
        author: null,
      }
    }

    return post
  }

  /**
   * Batch operations on posts
   */
  async batchOperation(
    postIds: string[],
    operation: 'publish' | 'unpublish' | 'delete' | 'flag',
    userId: UserId,
    reason?: string,
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    this.logger.info('Performing batch operation', {
      operation,
      postCount: postIds.length,
      userId: userId.value,
    })

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const postId of postIds) {
      try {
        const numericPostId = parseGlobalId(postId, 'Post')

        // Check ownership for non-admin operations
        await this.checkPostOwnership(numericPostId, userId)

        switch (operation) {
          case 'publish':
            await prisma.post.update({
              where: { id: numericPostId },
              data: { published: true },
            })
            break
          case 'unpublish':
            await prisma.post.update({
              where: { id: numericPostId },
              data: { published: false },
            })
            break
          case 'delete':
            await prisma.post.delete({
              where: { id: numericPostId },
            })
            break
          case 'flag':
            // In a real implementation, you might have a separate flags table
            this.logger.warn('Post flagged', { postId: numericPostId, reason })
            break
        }

        success++
      } catch (error) {
        failed++
        errors.push(
          `Post ${postId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
      }
    }

    this.logger.info('Batch operation completed', { success, failed })
    return { success, failed, errors }
  }

  /**
   * Private helper: Check post ownership
   */
  private async checkPostOwnership(
    postId: number,
    userId: UserId,
  ): Promise<{ authorId: number | null; published: boolean }> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, published: true },
    })

    if (!post) {
      throw new NotFoundError('Post', postId.toString())
    }

    if (!post.authorId || post.authorId !== userId.value) {
      throw new AuthorizationError(
        'You can only modify posts that you have created',
      )
    }

    return post
  }

  /**
   * Private helper: Build where clause for filtering
   */
  private buildWhereClause(filter: PostFilter): Prisma.PostWhereInput {
    const where: Prisma.PostWhereInput = {}

    if (filter.published !== undefined) {
      where.published = filter.published
    }

    if (filter.authorId !== undefined) {
      where.authorId = filter.authorId
    }

    if (filter.searchString) {
      where.OR = [
        { title: { contains: filter.searchString } },
        { content: { contains: filter.searchString } },
      ]
    }

    // Note: Tags functionality would require a separate tags table
    // This is a placeholder for future implementation
    if (filter.tags && filter.tags.length > 0) {
      // where.tags = { some: { name: { in: filter.tags } } }
      this.logger.warn('Tags filtering not implemented yet')
    }

    return where
  }
}
