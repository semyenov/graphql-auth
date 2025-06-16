/**
 * Delete Post Use Case
 * 
 * Handles post deletion with authorization.
 */

import { injectable, inject } from 'tsyringe'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { EntityNotFoundError } from '../../../core/errors/domain.errors'
import { PostAuthorizationService } from '../../../core/services/post-authorization.service'

export interface DeletePostCommand {
  postId: string
  userId: string
}

@injectable()
export class DeletePostUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const postId = PostId.create(parseInt(command.postId))
    const userId = UserId.create(parseInt(command.userId))

    // Find the post
    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw new EntityNotFoundError('Post', command.postId)
    }

    // Check authorization
    PostAuthorizationService.ensureCanDelete(post, userId)

    // Delete the post
    await this.postRepository.delete(postId)
  }
}