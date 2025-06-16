import { Post, UnauthorizedPostAccessError } from '../types'

/**
 * Domain service for post authorization rules
 */
export class PostAuthorizationService {
  /**
   * Checks if a user can modify a post
   */
  static canModify(post: Post, userId: number): void {
    if (post.authorId !== userId) {
      throw new UnauthorizedPostAccessError('modify')
    }
  }

  /**
   * Checks if a user can delete a post
   */
  static canDelete(post: Post, userId: number): void {
    if (post.authorId !== userId) {
      throw new UnauthorizedPostAccessError('delete')
    }
  }

  /**
   * Checks if a user can view a post
   */
  static canView(post: Post, userId?: number): void {
    // If post is published, anyone can view
    if (post.published) return

    // If post is draft, only author can view
    if (!userId || post.authorId !== userId) {
      throw new UnauthorizedPostAccessError('view')
    }
  }

  /**
   * Determines if a user owns a post
   */
  static isOwner(post: Post, userId: number): boolean {
    return post.authorId === userId
  }
}