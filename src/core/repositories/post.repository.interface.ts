/**
 * Post Repository Interface
 * 
 * Defines the contract for post data access.
 */

import { Post } from '../entities/post.entity'
import { PostId } from '../value-objects/post-id.vo'
import { UserId } from '../value-objects/user-id.vo'

export interface PostFilter {
  published?: boolean
  authorId?: UserId
  titleContains?: string
  contentContains?: string
}

export interface PostOrderBy {
  createdAt?: 'asc' | 'desc'
  updatedAt?: 'asc' | 'desc'
  title?: 'asc' | 'desc'
  viewCount?: 'asc' | 'desc'
}

export interface IPostRepository {
  // Basic CRUD operations
  findById(id: PostId): Promise<Post | null>
  findByIds(ids: PostId[]): Promise<Post[]>
  save(post: Post): Promise<Post>
  delete(id: PostId): Promise<Post | null>

  // Query operations
  findMany(criteria: {
    filter?: PostFilter
    skip?: number
    take?: number
    orderBy?: PostOrderBy
  }): Promise<Post[]>

  count(filter?: PostFilter): Promise<number>

  // Business-specific queries
  findByAuthor(
    authorId: UserId,
    options?: {
      includeUnpublished?: boolean
      skip?: number
      take?: number
    }
  ): Promise<Post[]>

  findPublished(options?: {
    searchString?: string
    skip?: number
    take?: number
    orderBy?: PostOrderBy
  }): Promise<Post[]>

  countPublished(searchString?: string): Promise<number>

  // Bulk operations
  bulkDelete(ids: PostId[]): Promise<number>
  bulkUpdatePublished(ids: PostId[], published: boolean): Promise<number>
}