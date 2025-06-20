/**
 * Refresh Token Repository
 * 
 * Handles database operations for refresh tokens
 */

import { PrismaClient, RefreshToken } from '@prisma/client'
import { injectable, inject } from 'tsyringe'

@injectable()
export class RefreshTokenRepository {
    constructor(
        @inject('PrismaClient') private readonly prisma: PrismaClient
    ) {}

    /**
     * Create a new refresh token
     */
    async create(data: {
        token: string
        userId: number
        expiresAt: Date
    }): Promise<RefreshToken> {
        return this.prisma.refreshToken.create({
            data
        })
    }

    /**
     * Find a refresh token by token value
     */
    async findByToken(token: string): Promise<RefreshToken | null> {
        return this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true }
        })
    }

    /**
     * Delete a refresh token
     */
    async delete(id: string): Promise<void> {
        await this.prisma.refreshToken.delete({
            where: { id }
        })
    }

    /**
     * Delete all refresh tokens for a user
     */
    async deleteAllForUser(userId: number): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId }
        })
    }

    /**
     * Delete expired refresh tokens
     */
    async deleteExpired(): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        })
    }

    /**
     * Count refresh tokens for a user
     */
    async countForUser(userId: number): Promise<number> {
        return this.prisma.refreshToken.count({
            where: { userId }
        })
    }
}