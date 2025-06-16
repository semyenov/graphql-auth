import { Post, Prisma, PrismaClient } from '@prisma/client'
import { BaseRepository } from './base'

// Types for post operations
export type PostCreateData = {
  title: string
  content?: string | null
  published?: boolean
  authorId: number
}

export type PostUpdateData = Partial<Omit<PostCreateData, 'authorId'>>

export type PostWithAuthor = Post & {
  author: {
    id: number
    name: string | null
    email: string
  }
}

/**
 * Repository for post data access operations
 * Handles all database interactions for Post entities
 */
export class PostRepository extends BaseRepository {
  constructor(dbClient?: PrismaClient) {
    super(dbClient)
  }

  /**
   * Find post by ID
   */
  async findById(id: number, includeAuthor = false): Promise<Post | PostWithAuthor | null> {
    return this.db.post.findUnique({
      where: { id },
      include: includeAuthor ? {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      } : undefined,
    })
  }

  /**
   * Find multiple posts with advanced filtering
   */
  async findMany(options: {
    skip?: number
    take?: number
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[]
    includeAuthor?: boolean
  } = {}): Promise<Post[] | PostWithAuthor[]> {
    const { includeAuthor = false, ...queryOptions } = options

    return this.db.post.findMany({
      ...queryOptions,
      include: includeAuthor ? {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      } : undefined,
    })
  }

  /**
   * Find published posts with pagination (for public feed)
   */
  async findPublished(options: {
    skip?: number
    take?: number
    searchString?: string
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[]
    includeAuthor?: boolean
  } = {}): Promise<Post[] | PostWithAuthor[]> {
    const { searchString, includeAuthor = false, ...queryOptions } = options

    const where: Prisma.PostWhereInput = {
      published: true,
      ...(searchString && {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }),
    }

    return this.db.post.findMany({
      where,
      ...queryOptions,
      include: includeAuthor ? {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      } : undefined,
    })
  }

  /**
   * Find drafts by user
   */
  async findDraftsByUser(userId: number, options: {
    skip?: number
    take?: number
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[]
  } = {}): Promise<Post[]> {
    return this.db.post.findMany({
      where: {
        authorId: userId,
        published: false,
      },
      ...options,
    })
  }

  /**
   * Find posts by user
   */
  async findByUser(userId: number, options: {
    skip?: number
    take?: number
    includeUnpublished?: boolean
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[]
  } = {}): Promise<Post[]> {
    const { includeUnpublished = false, ...queryOptions } = options

    return this.db.post.findMany({
      where: {
        authorId: userId,
        ...(includeUnpublished ? {} : { published: true }),
      },
      ...queryOptions,
    })
  }

  /**
   * Create a new post
   */
  async create(data: PostCreateData): Promise<Post> {
    return this.db.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published ?? false,
        authorId: data.authorId,
      },
    })
  }

  /**
   * Update a post
   */
  async update(id: number, data: PostUpdateData): Promise<Post> {
    return this.db.post.update({
      where: { id },
      data,
    })
  }

  /**
   * Toggle post publication status
   */
  async togglePublication(id: number): Promise<Post> {
    const post = await this.findById(id)
    if (!post) {
      throw new Error('Post not found')
    }

    return this.db.post.update({
      where: { id },
      data: { published: !post.published },
    })
  }

  /**
   * Increment post view count
   */
  async incrementViewCount(id: number): Promise<Post> {
    return this.db.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }

  /**
   * Delete a post
   */
  async delete(id: number): Promise<Post> {
    return this.db.post.delete({
      where: { id },
    })
  }

  /**
   * Count posts matching criteria
   */
  async count(where?: Prisma.PostWhereInput): Promise<number> {
    return this.db.post.count({ where })
  }

  /**
   * Count published posts
   */
  async countPublished(searchString?: string): Promise<number> {
    const where: Prisma.PostWhereInput = {
      published: true,
      ...(searchString && {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }),
    }

    return this.db.post.count({ where })
  }

  /**
   * Check if user owns post
   */
  async isOwner(postId: number, userId: number): Promise<boolean> {
    const post = await this.db.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    return post?.authorId === userId
  }

  /**
   * Bulk update posts
   */
  async bulkUpdate(postIds: number[], data: PostUpdateData, userId?: number): Promise<number> {
    const where: Prisma.PostWhereInput = {
      id: { in: postIds },
      ...(userId && { authorId: userId }),
    }

    const result = await this.db.post.updateMany({
      where,
      data,
    })

    return result.count
  }
}