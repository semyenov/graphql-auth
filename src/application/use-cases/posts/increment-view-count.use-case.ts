/**
 * Increment View Count Use Case
 * 
 * Handles incrementing post view counts.
 */

import { injectable, inject } from 'tsyringe'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { EntityNotFoundError } from '../../../core/errors/domain.errors'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface IncrementViewCountCommand {
  postId: string
}

@injectable()
export class IncrementViewCountUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) {}

  async execute(command: IncrementViewCountCommand): Promise<PostDto> {
    const postId = PostId.create(parseInt(command.postId))

    // Find the post
    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw new EntityNotFoundError('Post', command.postId)
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