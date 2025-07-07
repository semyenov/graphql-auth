/**
 * Posts Module Client Interface
 * Following modular monolith pattern - defines the public API for inter-module communication
 *
 * This interface represents what other modules can do with the Posts module.
 * It's the only entry point other modules should use to interact with posts functionality.
 */

// Input/Output types for the client interface
export interface PostData {
  id: number
  title: string
  content: string | null
  published: boolean
  authorId: number
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface PostCreateRequest {
  title: string
  content?: string
  authorId: number
  published?: boolean
}

export interface PostUpdateRequest {
  title?: string
  content?: string
  published?: boolean
}

export interface PostSearchCriteria {
  query?: string
  authorId?: number
  published?: boolean
  startDate?: Date
  endDate?: Date
}

export interface PostOrderBy {
  field: 'createdAt' | 'updatedAt' | 'viewCount' | 'title'
  direction: 'asc' | 'desc'
}

export interface PaginationOptions {
  skip?: number
  take?: number
  cursor?: string
}

export interface PostsResponse {
  posts: PostData[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
}

export interface PostStatistics {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  averageViewsPerPost: number
}

export interface PostMetrics {
  viewCount: number
  wordCount: number
  readingTimeMinutes: number
  excerpt: string
}

/**
 * Posts Module Client Interface
 *
 * This interface defines all operations that other modules can perform
 * on the Posts module. It acts as a contract and abstraction layer.
 */
export interface IPostsClient {
  // Post CRUD operations
  createPost(request: PostCreateRequest): Promise<PostData>
  getPostById(postId: number): Promise<PostData | null>
  updatePost(postId: number, request: PostUpdateRequest): Promise<PostData>
  deletePost(postId: number): Promise<boolean>

  // Post publishing operations
  publishPost(postId: number): Promise<PostData>
  unpublishPost(postId: number): Promise<PostData>

  // Post search and listing
  searchPosts(
    criteria: PostSearchCriteria,
    pagination?: PaginationOptions,
  ): Promise<PostsResponse>
  getPublishedPosts(
    pagination?: PaginationOptions,
    orderBy?: PostOrderBy,
  ): Promise<PostsResponse>
  getDraftsByAuthor(
    authorId: number,
    pagination?: PaginationOptions,
  ): Promise<PostsResponse>
  getPostsByAuthor(
    authorId: number,
    pagination?: PaginationOptions,
  ): Promise<PostsResponse>

  // Post metrics and analytics
  incrementViewCount(postId: number): Promise<PostData>
  getPostMetrics(postId: number): Promise<PostMetrics>
  getAuthorStatistics(authorId: number): Promise<PostStatistics>
  getTrendingPosts(
    timeframe: 'day' | 'week' | 'month',
    limit?: number,
  ): Promise<PostData[]>

  // Content operations
  generateExcerpt(content: string, maxLength?: number): Promise<string>
  calculateReadingTime(content: string): Promise<number>
  validatePostContent(
    title: string,
    content?: string,
  ): Promise<{ valid: boolean; errors?: string[] }>

  // Moderation operations
  moderatePost(
    postId: number,
    action: 'approve' | 'reject' | 'flag',
    reason?: string,
  ): Promise<boolean>
  getPostsForModeration(pagination?: PaginationOptions): Promise<PostsResponse>

  // Permission checks
  canUserEditPost(userId: number, postId: number): Promise<boolean>
  canUserDeletePost(userId: number, postId: number): Promise<boolean>
  canUserViewPost(userId: number, postId: number): Promise<boolean>
}

/**
 * Posts Module Events
 *
 * Events that the Posts module can publish for other modules to subscribe to.
 * This enables loose coupling between modules.
 */
export interface PostsModuleEvents {
  'post.created': {
    postId: number
    title: string
    authorId: number
    published: boolean
    timestamp: Date
  }
  'post.updated': {
    postId: number
    title: string
    authorId: number
    changes: string[]
    timestamp: Date
  }
  'post.deleted': {
    postId: number
    title: string
    authorId: number
    timestamp: Date
  }
  'post.published': {
    postId: number
    title: string
    authorId: number
    timestamp: Date
  }
  'post.unpublished': {
    postId: number
    title: string
    authorId: number
    timestamp: Date
  }
  'post.viewed': {
    postId: number
    viewerId?: number
    ipAddress: string
    timestamp: Date
  }
  'post.moderated': {
    postId: number
    moderatorId: number
    action: string
    reason?: string
    timestamp: Date
  }
}

/**
 * Error types that the Posts module can return
 */
export class PostsClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'PostsClientError'
  }
}

export class PostNotFoundError extends PostsClientError {
  constructor(postId: number) {
    super(`Post with ID ${postId} not found`, 'POST_NOT_FOUND', 404)
  }
}

export class PostPermissionError extends PostsClientError {
  constructor(message = 'Insufficient permissions to access this post') {
    super(message, 'POST_PERMISSION_DENIED', 403)
  }
}

export class PostValidationError extends PostsClientError {
  constructor(
    message: string,
    public readonly errors: string[],
  ) {
    super(message, 'POST_VALIDATION_ERROR', 422)
  }
}
