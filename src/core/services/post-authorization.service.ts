/**
 * Post Authorization Service
 * 
 * Domain service that encapsulates authorization logic for posts.
 */

import { AuthenticationError, ForbiddenError } from '../../core/errors/types'
import { Post } from '../entities/post.entity'
import { UserId } from '../value-objects/user-id.vo'

export class PostAuthorizationService {
  static canView(post: Post, userId?: UserId): boolean {
    return post.canBeViewedBy(userId)
  }

  static canEdit(post: Post, userId?: UserId): boolean {
    if (!userId) return false
    return post.isOwnedBy(userId)
  }

  static canDelete(post: Post, userId?: UserId): boolean {
    return this.canEdit(post, userId)
  }

  static ensureCanView(post: Post, userId?: UserId): void {
    if (!this.canView(post, userId)) {
      if (!userId) {
        throw new AuthenticationError('Authentication required to view this post')
      }
      throw new ForbiddenError('You are not allowed to view this post')
    }
  }

  static ensureCanEdit(post: Post, userId?: UserId): void {
    if (!userId) {
      throw new AuthenticationError('Authentication required to edit posts')
    }
    if (!this.canEdit(post, userId)) {
      throw new ForbiddenError('You can only edit your own posts')
    }
  }

  static ensureCanDelete(post: Post, userId?: UserId): void {
    if (!userId) {
      throw new AuthenticationError('Authentication required to delete posts')
    }
    if (!this.canDelete(post, userId)) {
      throw new ForbiddenError('You can only delete your own posts')
    }
  }
}