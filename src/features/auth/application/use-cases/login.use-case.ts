import { UserCredentials } from '../../domain/types'
import { PasswordService } from '../../domain/services/password.service'
import { UserRepository } from '../../infrastructure/repositories/user.repository'
import { TokenService } from '../../infrastructure/services/token.service'
import { AuthenticationError } from '../../../../errors'
import { ERROR_MESSAGES } from '../../../../constants'

/**
 * Use case for user login
 * Handles authentication flow with proper validation
 */
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService
  ) {}

  async execute(credentials: UserCredentials): Promise<string> {
    // Find user by email
    const user = await this.userRepository.findByEmailWithPassword(credentials.email)
    if (!user) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    // Verify password
    const isValidPassword = await PasswordService.verify(
      credentials.password,
      user.password
    )
    if (!isValidPassword) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    // Generate token
    return this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
    })
  }
}