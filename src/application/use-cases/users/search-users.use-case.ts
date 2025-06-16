/**
 * Search Users Use Case
 * 
 * Searches users by name or email.
 */

import { injectable, inject } from 'tsyringe'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import { UserDto } from '../../dtos/user.dto'
import { UserMapper } from '../../mappers/user.mapper'

export interface SearchUsersCommand {
  searchTerm: string
  skip?: number
  take?: number
  orderBy?: {
    field: string
    direction: 'asc' | 'desc'
  }
}

export interface SearchUsersResult {
  users: UserDto[]
  totalCount: number
}

@injectable()
export class SearchUsersUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

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
      skip,
      take,
      orderBy,
    })

    // Filter users by search term (since the interface doesn't have search criteria)
    const filteredUsers = users.filter(user => 
      user.email.value.toLowerCase().includes(trimmedTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(trimmedTerm.toLowerCase()))
    )

    return {
      users: filteredUsers.map(UserMapper.toDto),
      totalCount: filteredUsers.length,
    }
  }
}