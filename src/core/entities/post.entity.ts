/**
 * Post Entity - Core business entity
 * 
 * Represents a blog post in our domain model.
 */

import { VALIDATION_LIMITS, VALIDATION_MESSAGES } from '../../constants/validation'
import { EntityValidationError } from '../../core/errors/types'
import { PostId } from '../value-objects/post-id.vo'
import { UserId } from '../value-objects/user-id.vo'

export interface PostProps {
  id: PostId
  title: string
  content: string | null
  published: boolean
  viewCount: number
  authorId: UserId | null
  createdAt: Date
  updatedAt: Date
}

export class Post {
  private constructor(private readonly props: PostProps) { }

  // Factory method for creating a new post
  static create(props: {
    title: string
    content: string | null
    authorId: UserId | null
  }): Post {
    if (!props.title || props.title.trim().length === 0) {
      throw new EntityValidationError([], VALIDATION_MESSAGES.TITLE_REQUIRED)
    }

    if (props.title.length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
      throw new EntityValidationError([], VALIDATION_MESSAGES.TITLE_TOO_LONG)
    }

    if (props.content && props.content.length > VALIDATION_LIMITS.CONTENT_MAX_LENGTH) {
      throw new EntityValidationError([], VALIDATION_MESSAGES.CONTENT_TOO_LONG)
    }

    return new Post({
      id: PostId.generate(),
      title: props.title.trim(),
      content: props.content,
      published: false,
      viewCount: 0,
      authorId: props.authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // Factory method for reconstituting from persistence
  static fromPersistence(props: PostProps): Post {
    return new Post(props)
  }

  // Getters
  get id(): PostId {
    return this.props.id
  }

  get title(): string {
    return this.props.title
  }

  get content(): string | null {
    return this.props.content
  }

  get published(): boolean {
    return this.props.published
  }

  get viewCount(): number {
    return this.props.viewCount
  }

  get authorId(): UserId | null {
    return this.props.authorId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // Business methods
  update(props: { title?: string; content?: string | null }): void {
    if (props.title !== undefined) {
      if (!props.title || props.title.trim().length === 0) {
        throw new EntityValidationError([], VALIDATION_MESSAGES.TITLE_REQUIRED)
      }
      if (props.title.length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
        throw new EntityValidationError([], VALIDATION_MESSAGES.TITLE_TOO_LONG)
      }
      this.props.title = props.title.trim()
    }

    if (props.content !== undefined) {
      if (props.content && props.content.length > VALIDATION_LIMITS.CONTENT_MAX_LENGTH) {
        throw new EntityValidationError([], VALIDATION_MESSAGES.CONTENT_TOO_LONG)
      }
      this.props.content = props.content
    }

    this.props.updatedAt = new Date()
  }

  publish(): void {
    if (this.props.published) {
      throw new EntityValidationError([], 'Post is already published')
    }
    this.props.published = true
    this.props.updatedAt = new Date()
  }

  unpublish(): void {
    if (!this.props.published) {
      throw new EntityValidationError([], 'Post is already unpublished')
    }
    this.props.published = false
    this.props.updatedAt = new Date()
  }

  incrementViewCount(): void {
    this.props.viewCount += 1
    // Note: We don't update updatedAt for view count changes
  }

  isOwnedBy(userId: UserId): boolean {
    return this.props.authorId?.equals(userId) ?? false
  }

  canBeViewedBy(userId?: UserId): boolean {
    // Published posts can be viewed by anyone
    if (this.props.published) {
      return true
    }
    // Unpublished posts can only be viewed by the author
    return userId ? this.isOwnedBy(userId) : false
  }

  // Convert to plain object for persistence
  toPersistence(): {
    id: number
    title: string
    content: string | null
    published: boolean
    viewCount: number
    authorId: number | null
    createdAt: Date
    updatedAt: Date
  } {
    return {
      id: this.props.id.value,
      title: this.props.title,
      content: this.props.content,
      published: this.props.published,
      viewCount: this.props.viewCount,
      authorId: this.props.authorId?.value ?? null,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}