/**
 * Get Feed Use Case
 * 
 * Retrieves published posts for the public feed.
 */

import { inject, injectable } from 'tsyringe'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import { PostOrderBy } from '../../../core/repositories/post.repository.interface'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface GetFeedCommand {
  searchString?: string
  skip?: number
  take?: number
  orderBy?: {
    field: string
    direction: 'asc' | 'desc'
  }[]
}

export interface GetFeedResult {
  posts: PostDto[]
  totalCount: number
}

@injectable()
export class GetFeedUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) { }

  async execute(command: GetFeedCommand): Promise<GetFeedResult> {
    const { searchString, skip = 0, take = 10, orderBy } = command

    // Get published posts
    const posts = await this.postRepository.findPublished({
      searchString,
      skip,
      take,
      orderBy: orderBy?.[0] as PostOrderBy,
    })

    // Get total count
    const totalCount = await this.postRepository.countPublished(searchString)

    return {
      posts: posts.map(PostMapper.toDto),
      totalCount,
    }
  }
}