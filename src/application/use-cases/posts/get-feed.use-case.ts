/**
 * Get Feed Use Case
 * 
 * Retrieves published posts for the public feed.
 */

import { Prisma } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import type { ILogger } from '../../../core/services/logger.interface'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface GetFeedCommand {
  searchString?: string
  skip?: number
  take?: number
  orderBy?: Prisma.PostOrderByWithRelationInput
}

export interface GetFeedResult {
  posts: PostDto[]
  totalCount: number
}

@injectable()
export class GetFeedUseCase {
  private logger: ILogger

  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
    @inject('ILogger') logger: ILogger,
  ) {
    this.logger = logger.child({ useCase: 'GetFeedUseCase' })
  }

  async execute(command: GetFeedCommand): Promise<GetFeedResult> {
    const { searchString, skip = 0, take = 10, orderBy } = command

    this.logger.debug('Fetching feed', {
      searchString,
      skip,
      take,
      orderBy: orderBy ? JSON.stringify(orderBy) : undefined
    })

    try {
      // Get published posts
      const posts = await this.postRepository.findPublished({
        searchString,
        skip,
        take,
        orderBy,
      })

      // Get total count
      const totalCount = await this.postRepository.countPublished(searchString)

      this.logger.info('Feed fetched successfully', {
        postsCount: posts.length,
        totalCount,
        searchString,
        pagination: { skip, take }
      })

      return {
        posts: posts.map(PostMapper.toDto),
        totalCount,
      }
    } catch (error) {
      this.logger.error('Failed to fetch feed', error as Error, {
        searchString,
        skip,
        take
      })
      throw error
    }
  }
}