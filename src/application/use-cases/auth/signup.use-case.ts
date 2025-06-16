/**
 * Signup Use Case
 * 
 * Handles user registration.
 */

import { inject, injectable } from 'tsyringe'
import { User } from '../../../core/entities/user.entity'
import { BusinessRuleViolationError } from '../../../core/errors/domain.errors'
import type { IUserRepository } from '../../../core/repositories/user.repository.interface'
import type { IAuthService } from '../../../core/services/auth.service.interface'
import { Email } from '../../../core/value-objects/email.vo'
import { AuthResponseDto } from '../../dtos/user.dto'
import { UserMapper } from '../../mappers/user.mapper'

export interface SignupCommand {
  email: string
  password: string
  name: string | null
}

@injectable()
export class SignupUseCase {

  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IAuthService') private authService: IAuthService,
  ) {
  }

  async execute(command: SignupCommand): Promise<AuthResponseDto> {
    // Validate email
    const email = Email.create(command.email)

    // Check if user already exists
    const existingUser = await this.userRepository.existsByEmail(email)
    if (existingUser) {
      throw new BusinessRuleViolationError('An account with this email already exists')
    }

    // Validate password
    if (command.password.length < 6) {
      throw new BusinessRuleViolationError('Password must be at least 6 characters long')
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(command.password)

    // Create user entity
    const user = User.create({
      email: command.email,
      name: command.name,
      passwordHash,
    })

    // Save user
    const savedUser = await this.userRepository.save(user)

    // Generate token
    const token = await this.authService.generateToken(savedUser.id)

    // Return response
    return {
      token,
      user: UserMapper.toDto(savedUser),
    }
  }
}