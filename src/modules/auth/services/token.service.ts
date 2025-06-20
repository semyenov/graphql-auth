/**
 * Enhanced Token Service
 * 
 * Handles both access and refresh tokens
 */

import { randomBytes } from 'crypto'
import * as jwt from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { ITokenService, type AuthTokens, type TokenConfig, type TokenPayload } from '../../../core/services/token.service.interface'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { RefreshTokenRepository } from '../../../data/repositories/refresh-token.repository'
import { AuthenticationError as UnauthorizedError } from '../../../errors'


@injectable()
export class TokenService implements ITokenService {
    constructor(
        @inject('TokenConfig') private config: TokenConfig,
        @inject(RefreshTokenRepository) private refreshTokenRepo: RefreshTokenRepository
    ) { }

    /**
     * Generate both access and refresh tokens
     */
    async generateTokens(user: { id: number; email: string }): Promise<AuthTokens> {
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email
        }

        // Generate access token with unique identifier
        const accessToken = jwt.sign(
            { ...payload, type: 'access', jti: this.generateSecureToken() },
            this.config.accessTokenSecret,
            { expiresIn: this.parseExpiration(this.config.accessTokenExpiresIn) }
        )

        // Generate refresh token
        const refreshTokenValue = this.generateSecureToken()
        const refreshToken = jwt.sign(
            { ...payload, type: 'refresh', jti: refreshTokenValue },
            this.config.refreshTokenSecret,
            { expiresIn: this.parseExpiration(this.config.refreshTokenExpiresIn) }
        )

        // Calculate expiration date
        const expiresAt = new Date()
        const expiresInMs = this.parseExpiration(this.config.refreshTokenExpiresIn)
        expiresAt.setTime(expiresAt.getTime() + expiresInMs)

        // Store refresh token in database
        await this.refreshTokenRepo.create({
            token: refreshTokenValue,
            userId: user.id,
            expiresAt
        })

        return {
            accessToken,
            refreshToken
        }
    }

    /**
     * Verify access token
     */
    async verifyAccessToken(token: string): Promise<UserId | null> {
        try {
            const decoded = jwt.verify(token, this.config.accessTokenSecret) as TokenPayload

            if (decoded.type !== 'access') {
                return null
            }

            return UserId.create(decoded.userId)
        } catch {
            return null
        }
    }

    /**
     * Refresh tokens using a refresh token
     */
    async refreshTokens(refreshToken: string): Promise<AuthTokens> {
        try {
            // Verify refresh token JWT
            const decoded = jwt.verify(refreshToken, this.config.refreshTokenSecret) as TokenPayload & { jti: string }

            if (decoded.type !== 'refresh') {
                throw new UnauthorizedError('Invalid token type')
            }

            // Check if refresh token exists in database
            const storedToken = await this.refreshTokenRepo.findByToken(decoded.jti)

            if (!storedToken) {
                throw new UnauthorizedError('Invalid refresh token')
            }

            // Check if token is expired
            if (new Date() > storedToken.expiresAt) {
                await this.refreshTokenRepo.delete(storedToken.id)
                throw new UnauthorizedError('Refresh token expired')
            }

            // Delete old refresh token (rotation)
            await this.refreshTokenRepo.delete(storedToken.id)

            // Generate new tokens
            return this.generateTokens({
                id: decoded.userId,
                email: decoded.email
            })
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                throw error
            }
            throw new UnauthorizedError('Invalid refresh token')
        }
    }

    /**
     * Revoke all refresh tokens for a user
     */
    async revokeAllTokens(userId: number): Promise<void> {
        await this.refreshTokenRepo.deleteAllForUser(userId)
    }

    /**
     * Generate a secure random token
     */
    private generateSecureToken(): string {
        return randomBytes(32).toString('hex')
    }

    /**
     * Parse expiration string to milliseconds
     */
    private parseExpiration(expiration: string): number {
        const match = expiration.match(/^(\d+)([smhd])$/)
        if (!match) {
            throw new Error(`Invalid expiration format: ${expiration}`)
        }

        const [, value, unit] = match
        const numValue = parseInt(value!, 10)

        switch (unit) {
            case 's': return numValue * 1000
            case 'm': return numValue * 60 * 1000
            case 'h': return numValue * 60 * 60 * 1000
            case 'd': return numValue * 24 * 60 * 60 * 1000
            default: throw new Error(`Invalid time unit: ${unit}`)
        }
    }
}