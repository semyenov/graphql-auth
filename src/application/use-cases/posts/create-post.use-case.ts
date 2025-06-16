/**
 * Create Post Use Case
 * 
 * Handles post creation.
 */

import { inject, injectable } from 'tsyringe'
import { Post } from '../../../core/entities/post.entity'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import type { ILogger } from '../../../core/services/logger.interface'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface CreatePostCommand {
  title: string
  content: string | null
  authorId: UserId
}

@injectable()
export class CreatePostUseCase {
  private logger: ILogger

  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
    @inject('ILogger') logger: ILogger,
  ) {
    this.logger = logger.child({ useCase: 'CreatePostUseCase' })
  }

  async execute(command: CreatePostCommand): Promise<PostDto> {
    this.logger.info('Creating new post', {
      authorId: command.authorId.value,
      title: command.title
    })

    try {
      // Create post entity
      const post = Post.create({
        title: command.title,
        content: command.content,
        authorId: command.authorId,
      })

      this.logger.debug('Post entity created', { postId: post.id?.value })

      // Save post
      const savedPost = await this.postRepository.save(post)

      this.logger.info('Post created successfully', {
        postId: savedPost.id?.value,
        authorId: savedPost.authorId?.value,
        published: savedPost.published
      })

      // Return DTO
      return PostMapper.toDto(savedPost)
    } catch (error) {
      this.logger.error('Failed to create post', error as Error, {
        authorId: command.authorId.value,
        title: command.title
      })
      throw error
    }
  }
}