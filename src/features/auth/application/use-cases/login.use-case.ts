import { ERROR_MESSAGES } from '../../../../constants'
import { AuthenticationError } from '../../../../errors'
import { UserRepository } from '../../../../infrastructure/database/repositories'
import { PasswordService } from '../../domain/services/password.service'
import { UserCredentials } from '../../domain/types'
import { TokenService } from '../../infrastructure/services/token.service'

/**
 * Use case for user login
 * Handles authentication flow with proper validation
 */
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService
  ) { }

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