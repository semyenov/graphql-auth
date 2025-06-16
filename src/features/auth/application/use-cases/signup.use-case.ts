import { SignupData, User } from '../../domain/types'
import { PasswordService } from '../../domain/services/password.service'
import { UserRepository } from '../../infrastructure/repositories/user.repository'
import { TokenService } from '../../infrastructure/services/token.service'
import { ConflictError } from '../../../../errors'
import { ERROR_MESSAGES } from '../../../../constants'

/**
 * Use case for user signup
 * Orchestrates the signup flow with proper validation and error handling
 */
export class SignupUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService
  ) {}

  async execute(data: SignupData): Promise<string> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
    }

    // Hash password with validation
    const hashedPassword = await PasswordService.hash(data.password)

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name ?? null,
    })

    // Generate token
    return this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
    })
  }
}