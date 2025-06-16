/**
 * Delete Post Use Case
 * 
 * Handles post deletion with authorization.
 */

import { inject, injectable } from 'tsyringe'
import { EntityNotFoundError } from '../../../core/errors/domain.errors'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import { PostAuthorizationService } from '../../../core/services/post-authorization.service'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface DeletePostCommand {
  postId: PostId
  userId: UserId
}

@injectable()
export class DeletePostUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) { }

  async execute(command: DeletePostCommand): Promise<PostDto> {
    // Find the post
    const post = await this.postRepository.findById(command.postId)
    if (!post) {
      throw new EntityNotFoundError('Post', command.postId.toString())
    }

    // Check authorization
    PostAuthorizationService.ensureCanDelete(post, command.userId)

    // Delete the post
    const deletedPost = await this.postRepository.delete(command.postId)
    if (!deletedPost) {
      throw new EntityNotFoundError('Post', command.postId.toString())
    }

    return PostMapper.toDto(deletedPost)
  }
}