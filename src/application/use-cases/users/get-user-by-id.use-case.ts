/**
 * Get User By ID Use Case
 * 
 * Retrieves a user by their ID.
 */

import { injectable, inject } from 'tsyringe'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { UserDto } from '../../dtos/user.dto'
import { UserMapper } from '../../mappers/user.mapper'

export interface GetUserByIdCommand {
  userId: string
}

@injectable()
export class GetUserByIdUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(command: GetUserByIdCommand): Promise<UserDto | null> {
    const userId = UserId.create(parseInt(command.userId))

    const user = await this.userRepository.findById(userId)
    if (!user) {
      return null
    }

    return UserMapper.toDto(user)
  }
}