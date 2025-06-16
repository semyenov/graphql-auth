import { NotFoundError } from '../../../../errors';
import { PostAuthorizationService } from '../../domain/services/post-authorization.service';
import { PostRepository } from '../../infrastructure/repositories/post.repository';

export class IncrementPostViewCountUseCase {
  constructor(private postRepository: PostRepository) { }

  async execute(postId: number): Promise<{ id: number; viewCount: number }> {
    // Find the post
    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw new NotFoundError('Post', postId.toString())
    }

    PostAuthorizationService.canView(post)

    // Increment view count
    const updatedPost = await this.postRepository.incrementViewCount(postId)

    return updatedPost
  }
}