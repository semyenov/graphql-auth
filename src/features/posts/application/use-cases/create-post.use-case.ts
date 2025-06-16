import { PostRepository } from '../../../../infrastructure/database/repositories/posts'
import { createPostSchema, validateInput } from '../../../../utils/validation'
import { CreatePostData, Post } from '../../domain/types'

/**
 * Use case for creating a new post
 */
export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) { }

  async execute(data: CreatePostData): Promise<Post> {
    const validatedData = validateInput(createPostSchema, {
      title: data.title,
      content: data.content,
    })

    return this.postRepository.create({
      title: validatedData.title,
      content: validatedData.content ?? null,
      authorId: data.authorId,
      published: false,
    })
  }
}