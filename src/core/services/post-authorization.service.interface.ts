/**
 * Post Authorization Service Interface
 * 
 * Defines the contract for post-related authorization checks.
 */

import { UserId } from '../value-objects/user-id.vo'
import { PostId } from '../value-objects/post-id.vo'

export interface IPostAuthorizationService {
  /**
   * Check if a user is the owner of a post.
   * 
   * @param postId - The ID of the post to check
   * @param userId - The ID of the user to check
   * @returns True if the user owns the post, false otherwise
   */
  isOwner(postId: PostId, userId: UserId): Promise<boolean>

  /**
   * Check if a user can update a post.
   * 
   * @param postId - The ID of the post to check
   * @param userId - The ID of the user to check
   * @returns True if the user can update the post, false otherwise
   */
  canUpdate(postId: PostId, userId: UserId): Promise<boolean>

  /**
   * Check if a user can delete a post.
   * 
   * @param postId - The ID of the post to check
   * @param userId - The ID of the user to check
   * @returns True if the user can delete the post, false otherwise
   */
  canDelete(postId: PostId, userId: UserId): Promise<boolean>

  /**
   * Check if a user can view a post.
   * 
   * @param postId - The ID of the post to check
   * @param userId - The ID of the user to check (optional for public posts)
   * @returns True if the user can view the post, false otherwise
   */
  canView(postId: PostId, userId?: UserId): Promise<boolean>
}