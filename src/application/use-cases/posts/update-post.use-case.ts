/**
 * Update Post Use Case
 * 
 * Handles post updates with authorization.
 */

import { inject, injectable } from 'tsyringe'
import { EntityNotFoundError } from '../../../core/errors/domain.errors'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import { PostAuthorizationService } from '../../../core/services/post-authorization.service'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { PostDto, UpdatePostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface UpdatePostCommand extends UpdatePostDto {
  postId: PostId
  userId: UserId
}

@injectable()
export class UpdatePostUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) { }

  async execute(command: UpdatePostCommand): Promise<PostDto> {
    // Find the post
    const post = await this.postRepository.findById(command.postId)
    if (!post) {
      throw new EntityNotFoundError('Post', command.postId.toString())
    }

    // Check authorization
    PostAuthorizationService.canEdit(post, command.userId)

    // Update the post
    if (command.title !== undefined || command.content !== undefined) {
      post.update({
        title: command.title,
        content: command.content,
      })
    }

    if (command.published !== undefined) {
      if (command.published) {
        post.publish()
      } else {
        post.unpublish()
      }
    }

    // Save changes
    const updatedPost = await this.postRepository.save(post)

    return PostMapper.toDto(updatedPost)
  }
}