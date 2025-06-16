/**
 * Post Mapper
 * 
 * Converts between domain entities and DTOs.
 */

import { Post } from '../../core/entities/post.entity'
import { PostId } from '../../core/value-objects/post-id.vo'
import { UserId } from '../../core/value-objects/user-id.vo'
import { PostDto } from '../dtos/post.dto'

export class PostMapper {
  static toDto(post: Post): PostDto {
    return {
      id: post.id.value.toString(),
      title: post.title,
      content: post.content,
      published: post.published,
      viewCount: post.viewCount,
      authorId: post.authorId?.value.toString() ?? '0',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  }

  static toDomain(data: {
    id: number
    title: string
    content: string | null
    published: boolean
    viewCount: number
    authorId: number | null
    createdAt: Date
    updatedAt: Date
  }): Post {
    return Post.fromPersistence({
      id: PostId.create(data.id),
      title: data.title,
      content: data.content,
      published: data.published,
      viewCount: data.viewCount,
      authorId: data.authorId ? UserId.create(data.authorId) : null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}