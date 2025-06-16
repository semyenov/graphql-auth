/**
 * Get User Drafts Use Case
 * 
 * Retrieves unpublished posts (drafts) for a specific user.
 */

import { inject, injectable } from 'tsyringe'
import { UnauthorizedError } from '../../../core/errors/domain.errors'
import type { IPostRepository } from '../../../core/repositories/post.repository.interface'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { PostDto } from '../../dtos/post.dto'
import { PostMapper } from '../../mappers/post.mapper'

export interface GetUserDraftsCommand {
  requestedUserId: string
  currentUserId: string
  skip?: number
  take?: number
}

export interface GetUserDraftsResult {
  drafts: PostDto[]
  totalCount: number
}

@injectable()
export class GetUserDraftsUseCase {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
  ) { }

  async execute(command: GetUserDraftsCommand): Promise<GetUserDraftsResult> {
    const requestedUserId = UserId.create(parseInt(command.requestedUserId))
    const currentUserId = UserId.create(parseInt(command.currentUserId))

    // Users can only see their own drafts
    if (!requestedUserId.equals(currentUserId)) {
      throw new UnauthorizedError('You can only view your own drafts')
    }

    const { skip = 0, take = 10 } = command

    // Get unpublished posts for the user
    const drafts = await this.postRepository.findByAuthor(requestedUserId, {
      includeUnpublished: true,
      skip,
      take,
    })

    // Filter only unpublished posts
    const unpublishedDrafts = drafts.filter(post => !post.published)

    // Get total count of drafts
    const allDrafts = await this.postRepository.findByAuthor(requestedUserId, {
      includeUnpublished: true,
    })
    const totalCount = allDrafts.filter(post => !post.published).length

    return {
      drafts: unpublishedDrafts.map(PostMapper.toDto),
      totalCount,
    }
  }
}