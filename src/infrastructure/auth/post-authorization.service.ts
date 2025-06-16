/**
 * Post Authorization Service Implementation
 * 
 * Implements authorization checks for post operations.
 */

import { inject, injectable } from 'tsyringe'
import type { IPostRepository } from '../../core/repositories/post.repository.interface'
import { IPostAuthorizationService } from '../../core/services/post-authorization.service.interface'
import { PostId } from '../../core/value-objects/post-id.vo'
import { UserId } from '../../core/value-objects/user-id.vo'

@injectable()
export class PostAuthorizationService implements IPostAuthorizationService {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository
  ) { }

  async isOwner(postId: PostId, userId: UserId): Promise<boolean> {
    const post = await this.postRepository.findById(postId)
    if (!post) return false
    return post.authorId?.equals(userId) ?? false
  }

  async canUpdate(postId: PostId, userId: UserId): Promise<boolean> {
    // For now, only the owner can update
    return this.isOwner(postId, userId)
  }

  async canDelete(postId: PostId, userId: UserId): Promise<boolean> {
    // For now, only the owner can delete
    return this.isOwner(postId, userId)
  }

  async canView(postId: PostId, userId?: UserId): Promise<boolean> {
    const post = await this.postRepository.findById(postId)
    if (!post) return false

    // Published posts are viewable by everyone
    if (post.published) return true

    // Unpublished posts are only viewable by the owner
    if (!userId) return false
    return post.authorId?.equals(userId) ?? false
  }
}