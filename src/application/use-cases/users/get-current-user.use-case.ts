/**
 * Get Current User Use Case
 * 
 * Retrieves the currently authenticated user.
 */

import { inject, injectable } from 'tsyringe'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import type { UserId } from '../../../core/value-objects/user-id.vo'
import { UserDto } from '../../dtos/user.dto'
import { UserMapper } from '../../mappers/user.mapper'

export interface GetCurrentUserCommand {
  userId: UserId
}

@injectable()
export class GetCurrentUserUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) { }

  async execute(command: GetCurrentUserCommand): Promise<UserDto | null> {
    const user = await this.userRepository.findById(command.userId)
    if (!user) {
      return null
    }

    return UserMapper.toDto(user)
  }
}