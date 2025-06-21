/**
 * Post Authorization Service
 *
 * Domain service that encapsulates authorization logic for posts.
 */

import type { Post } from '../../entities/post.entity'
import type { UserId } from '../../value-objects/user-id.vo'
import { AuthenticationError, ForbiddenError } from '../errors/types'

export const PostAuthorizationService = {
  canView(post: Post, userId?: UserId): boolean {
    return post.canBeViewedBy(userId)
  },

  canEdit(post: Post, userId?: UserId): boolean {
    if (!userId) return false
    return post.isOwnedBy(userId)
  },

  canDelete(post: Post, userId?: UserId): boolean {
    return this.canEdit(post, userId)
  },

  ensureCanView(post: Post, userId?: UserId): void {
    if (!this.canView(post, userId)) {
      if (!userId) {
        throw new AuthenticationError(
          'Authentication required to view this post',
        )
      }
      throw new ForbiddenError('You are not allowed to view this post')
    }
  },

  ensureCanEdit(post: Post, userId?: UserId): void {
    if (!userId) {
      throw new AuthenticationError('Authentication required to edit posts')
    }
    if (!this.canEdit(post, userId)) {
      throw new ForbiddenError('You can only edit your own posts')
    }
  },

  ensureCanDelete(post: Post, userId?: UserId): void {
    if (!userId) {
      throw new AuthenticationError('Authentication required to delete posts')
    }
    if (!this.canDelete(post, userId)) {
      throw new ForbiddenError('You can only delete your own posts')
    }
  },
}
