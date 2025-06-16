/**
 * Login Use Case
 * 
 * Handles user authentication.
 */

import { inject, injectable } from 'tsyringe'
import { UnauthorizedError } from '../../../core/errors/domain.errors'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import type { IAuthService } from '../../../core/services/auth.service.interface'
import type { ILogger } from '../../../core/services/logger.interface'
import { Email } from '../../../core/value-objects/email.vo'
import { AuthResponseDto } from '../../dtos/user.dto'
import { UserMapper } from '../../mappers/user.mapper'

export interface LoginCommand {
  email: string
  password: string
}

@injectable()
export class LoginUseCase {
  private logger: ILogger

  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IAuthService') private authService: IAuthService,
    @inject('ILogger') logger: ILogger,
  ) {
    this.logger = logger.child({ useCase: 'LoginUseCase' })
  }

  async execute(command: LoginCommand): Promise<AuthResponseDto> {
    this.logger.info('Login attempt', { email: command.email })

    try {
      // Validate email
      const email = Email.create(command.email)

      // Find user by email
      const user = await this.userRepository.findByEmail(email)
      if (!user) {
        this.logger.warn('Login failed - user not found', { email: command.email })
        throw new UnauthorizedError('Invalid email or password')
      }

      // Verify password
      const isValidPassword = await this.authService.verifyPassword(
        command.password,
        user.passwordHash
      )
      if (!isValidPassword) {
        this.logger.warn('Login failed - invalid password', { email: command.email, userId: user.id.value })
        throw new UnauthorizedError('Invalid email or password')
      }

      // Generate token
      const token = await this.authService.generateToken(user.id)

      this.logger.info('Login successful', { email: command.email, userId: user.id.value })

      // Return response
      return {
        token,
        user: UserMapper.toDto(user),
      }
    } catch (error) {
      this.logger.error('Login error', error as Error, { email: command.email })
      throw error
    }
  }
}