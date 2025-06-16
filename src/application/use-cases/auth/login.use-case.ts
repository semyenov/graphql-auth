/**
 * Login Use Case
 * 
 * Handles user authentication.
 */

import { injectable, inject } from 'tsyringe'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import type { IAuthService } from '../../../core/services/auth.service.interface'
import { Email } from '../../../core/value-objects/email.vo'
import { UnauthorizedError } from '../../../core/errors/domain.errors'
import { AuthResponseDto } from '../../dtos/user.dto'
import { UserMapper } from '../../mappers/user.mapper'

export interface LoginCommand {
  email: string
  password: string
}

@injectable()
export class LoginUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IAuthService') private authService: IAuthService,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponseDto> {
    // Validate email
    const email = Email.create(command.email)

    // Find user by email
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Verify password
    const isValidPassword = await this.authService.verifyPassword(
      command.password,
      user.passwordHash
    )
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Generate token
    const token = await this.authService.generateToken(user.id)

    // Return response
    return {
      token,
      user: UserMapper.toDto(user),
    }
  }
}