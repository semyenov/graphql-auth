/**
 * Get Post Use Case
 * 
 * Handles fetching a single post with authorization checks.
 */

import { inject, injectable } from 'tsyringe'
import { EntityNotFoundError } from '../../../core/errors/domain.errors'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import { PostAuthorizationService } from '../../../core/services/post-authorization.service'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { PostWithAuthorDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface GetPostQuery {
  postId: PostId | null
  userId?: UserId | null
}

@injectable()
export class GetPostUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) { }

  async execute(query: GetPostQuery): Promise<PostWithAuthorDto | null> {
    const { postId, userId } = query

    // Find the post
    const post = await this.postRepository.findById(postId!)
    if (!post) {
      throw new EntityNotFoundError('Post', postId!.toString())
    }

    // Check if user can view the post
    PostAuthorizationService.ensureCanView(post, userId!)

    // Get author information
    const author = await this.userRepository.findById(post.authorId!)
    if (!author) {
      throw new EntityNotFoundError('User', post.authorId?.toString() ?? 'Unknown')
    }

    // Return post with author
    return {
      ...PostMapper.toDto(post),
      author: {
        id: author.id.value,
        email: author.email.value,
        name: author.name,
      },
    }
  }
}