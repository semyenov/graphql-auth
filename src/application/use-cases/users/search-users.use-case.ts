/**
 * Search Users Use Case
 * 
 * Searches users by name or email.
 */

import { Prisma } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import { UserDto } from '../../dtos/user.dto'
import { UserMapper } from '../../mappers/user.mapper'

export interface SearchUsersCommand {
  searchTerm: string
  skip?: number
  take?: number
  orderBy?: Prisma.UserOrderByWithRelationInput
}

export interface SearchUsersResult {
  users: UserDto[]
  totalCount: number
}

@injectable()
export class SearchUsersUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) { }

  async execute(command: SearchUsersCommand): Promise<SearchUsersResult> {
    const { searchTerm, skip = 0, take = 10, orderBy } = command
    const trimmedTerm = searchTerm.trim()

    if (!trimmedTerm) {
      return {
        users: [],
        totalCount: 0,
      }
    }

    // Search in both email and name
    const users = await this.userRepository.findMany({
      filter: {
        emailContains: trimmedTerm,
        nameContains: trimmedTerm,
      },
      skip,
      take,
      orderBy,
    })

    return {
      users: users.map(UserMapper.toDto),
      totalCount: users.length,
    }
  }
}