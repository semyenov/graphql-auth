/**
 * Create Post Use Case
 * 
 * Handles post creation.
 */

import { inject, injectable } from 'tsyringe'
import { Post } from '../../../core/entities/post.entity'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
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
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) { }

  async execute(command: CreatePostCommand): Promise<PostDto> {
    // Create post entity
    const post = Post.create({
      title: command.title,
      content: command.content,
      authorId: command.authorId,
    })

    // Save post
    const savedPost = await this.postRepository.save(post)

    // Return DTO
    return PostMapper.toDto(savedPost)
  }
}