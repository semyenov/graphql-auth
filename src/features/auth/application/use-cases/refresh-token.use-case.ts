/**
 * Refresh Token Use Case
 * 
 * Handles token refresh flow
 */

import { injectable, inject } from 'tsyringe'
import { TokenService } from '../../infrastructure/services/token.service'
import type { ILogger } from '../../../../core/services/logger.interface'

export interface RefreshTokenCommand {
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
}

@injectable()
export class RefreshTokenUseCase {
    private logger: ILogger

    constructor(
        @inject(TokenService) private tokenService: TokenService,
        @inject('ILogger') logger: ILogger
    ) {
        this.logger = logger.child({ useCase: 'RefreshTokenUseCase' })
    }

    async execute(command: RefreshTokenCommand): Promise<RefreshTokenResponse> {
        this.logger.info('Token refresh attempt')

        try {
            const tokens = await this.tokenService.refreshTokens(command.refreshToken)
            
            this.logger.info('Token refresh successful')
            
            return tokens
        } catch (error) {
            this.logger.error('Token refresh error', error as Error)
            throw error
        }
    }
}