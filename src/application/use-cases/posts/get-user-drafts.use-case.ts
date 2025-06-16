/**
 * Get User Drafts Use Case
 * 
 * Retrieves unpublished posts (drafts) for a specific user.
 */

import { inject, injectable } from 'tsyringe'
import { UnauthorizedError } from '../../../core/errors/domain.errors'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import type { ILogger } from '../../../core/services/logger.interface'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface GetUserDraftsCommand {
  authorId: UserId
  skip?: number
  take?: number
}

export interface GetUserDraftsResult {
  drafts: PostDto[]
  totalCount: number
}

@injectable()
export class GetUserDraftsUseCase {
  private logger: ILogger

  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
    @inject('ILogger') logger: ILogger,
  ) {
    this.logger = logger.child({ useCase: 'GetUserDraftsUseCase' })
  }

  async execute(command: GetUserDraftsCommand): Promise<GetUserDraftsResult> {
    this.logger.debug('Fetching user drafts', {
      authorId: command.authorId.value,
      skip: command.skip,
      take: command.take
    })

    try {
      // Users can only see their own drafts
      if (!command.authorId.equals(command.authorId)) {
        throw new UnauthorizedError('You can only view your own drafts')
      }

      const { skip = 0, take = 10 } = command

      // Get unpublished posts for the user
      const drafts = await this.postRepository.findByAuthor(command.authorId, {
        includeUnpublished: true,
        skip,
        take,
      })

      // Filter only unpublished posts
      const unpublishedDrafts = drafts.filter(post => !post.published)

      // Get total count of drafts
      const allDrafts = await this.postRepository.findByAuthor(command.authorId, {
        includeUnpublished: true,
      })
      const totalCount = allDrafts.filter(post => !post.published).length

      return {
        drafts: unpublishedDrafts.map(PostMapper.toDto),
        totalCount,
      }
    } catch (error) {
      this.logger.error('Failed to fetch user drafts', error as Error, {
        authorId: command.authorId.value,
        skip: command.skip,
        take: command.take
      })
      throw error
    }
  }
}