/**
 * Increment View Count Use Case
 * 
 * Handles incrementing post view counts.
 */

import { inject, injectable } from 'tsyringe'
import { EntityNotFoundError } from '../../../core/errors/domain.errors'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface IncrementViewCountCommand {
  postId: PostId
}

@injectable()
export class IncrementViewCountUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) { }

  async execute(command: IncrementViewCountCommand): Promise<PostDto> {
    // Find the post
    const post = await this.postRepository.findById(command.postId)
    if (!post) {
      throw new EntityNotFoundError('Post', command.postId.toString())
    }

    // Only increment view count for published posts
    if (post.published) {
      post.incrementViewCount()

      // Save changes
      const updatedPost = await this.postRepository.save(post)
      return PostMapper.toDto(updatedPost)
    }

    // Return unchanged post if not published
    return PostMapper.toDto(post)
  }
}