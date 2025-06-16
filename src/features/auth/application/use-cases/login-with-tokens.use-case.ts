/**
 * Login with Tokens Use Case
 * 
 * Handles user authentication with refresh tokens
 */

import { inject, injectable } from 'tsyringe'
import { UnauthorizedError } from '../../../../core/errors/domain.errors'
import type { IUserRepository } from '../../../../core/repositories/user.repository.interface'
import type { ILogger } from '../../../../core/services/logger.interface'
import { Email } from '../../../../core/value-objects/email.vo'
// Temporarily removed - to be replaced with direct resolvers
// import { AuthTokensDto } from '../../../../application/dtos/user.dto'
// import { UserMapper } from '../../../../application/mappers/user.mapper'
import { TokenService } from '../../infrastructure/services/token.service'
import type { IPasswordService } from '../../../../core/services/password.service.interface'

export interface LoginWithTokensCommand {
    email: string
    password: string
}

@injectable()
export class LoginWithTokensUseCase {
    private logger: ILogger

    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject(TokenService) private tokenService: TokenService,
        @inject('IPasswordService') private passwordService: IPasswordService,
        @inject('ILogger') logger: ILogger
    ) {
        this.logger = logger.child({ useCase: 'LoginWithTokensUseCase' })
    }

    async execute(command: LoginWithTokensCommand): Promise<{ accessToken: string; refreshToken: string; user: any }> {
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
            const isValidPassword = await this.passwordService.verify(
                command.password,
                user.passwordHash
            )
            if (!isValidPassword) {
                this.logger.warn('Login failed - invalid password', { email: command.email, userId: user.id.value })
                throw new UnauthorizedError('Invalid email or password')
            }

            // Generate tokens
            const tokens = await this.tokenService.generateTokens({
                id: user.id.value,
                email: user.email.value
            })

            this.logger.info('Login successful', { email: command.email, userId: user.id.value })

            // Return response
            // Temporarily returning simple object instead of using UserMapper
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id.value,
                    email: user.email.value,
                    name: user.name,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        } catch (error) {
            this.logger.error('Login error', error as Error, { email: command.email })
            throw error
        }
    }
}