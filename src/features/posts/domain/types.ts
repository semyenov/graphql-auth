/**
 * Domain types for posts feature
 */

import { Prisma } from '@prisma/client'

export type Post = Prisma.PostGetPayload<{}>

export interface CreatePostData {
  title: string
  content?: string | null
  authorId: number
}

export interface UpdatePostData {
  title?: string
  content?: string | null
  published?: boolean
}

export interface PostFilters {
  published?: boolean
  authorId?: number
}

export interface PaginationArgs {
  first?: number
  after?: string
  last?: number
  before?: string
}

/**
 * Domain errors specific to posts
 */
export class PostNotFoundError extends Error {
  constructor(id: string | number) {
    super(`Post with ID ${id} not found`)
    this.name = 'PostNotFoundError'
  }
}

export class UnauthorizedPostAccessError extends Error {
  constructor(action: string = 'access') {
    super(`You are not authorized to ${action} this post`)
    this.name = 'UnauthorizedPostAccessError'
  }
}