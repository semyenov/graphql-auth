import { NotFoundError } from '../../../../errors'
import { PostAuthorizationService } from '../../domain/services/post-authorization.service'
import { Post } from '../../domain/types'
import { PostRepository } from '../../infrastructure/repositories/post.repository'

/**
 * Use case for deleting a post
 */
export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) { }

  async execute(postId: number, userId: number): Promise<Post> {
    // Find the post
    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw new NotFoundError('Post', postId.toString())
    }

    PostAuthorizationService.canDelete(post, userId)
    return this.postRepository.delete(postId)
  }
}