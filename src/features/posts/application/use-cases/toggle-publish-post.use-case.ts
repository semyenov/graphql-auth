import { NotFoundError } from '../../../../errors';
import { PostAuthorizationService } from '../../domain/services/post-authorization.service';
import { PostRepository } from '../../infrastructure/repositories/post.repository';

export class TogglePublishPostUseCase {
  constructor(
    private postRepository: PostRepository,
  ) { }

  async execute(postId: number, userId: number): Promise<{ id: number; published: boolean }> {
    // Find the post
    const post = await this.postRepository.findById(postId)
    if (!post) {
      throw new NotFoundError('Post', postId.toString())
    }

    // Check ownership
    PostAuthorizationService.canModify(post, userId)

    // Toggle publication status
    const newPublishedStatus = !post.published
    const updatedPost = await this.postRepository.update(postId, {
      published: newPublishedStatus,
    })

    return updatedPost
  }
}