/**
 * Refresh Token Repository
 *
 * Handles database operations for refresh tokens
 */

import type { PrismaClient, RefreshToken } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import { BaseRepository } from './base'

@injectable()
export class RefreshTokenRepository extends BaseRepository {
  constructor(@inject('PrismaClient') db: PrismaClient) {
    super(db)
  }

  /**
   * Create a new refresh token
   */
  async create(data: {
    token: string
    userId: number
    expiresAt: Date
  }): Promise<RefreshToken> {
    return this.db.refreshToken.create({
      data,
    })
  }

  /**
   * Find a refresh token by token value
   */
  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.db.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    })
  }

  /**
   * Delete a refresh token
   */
  async delete(id: string): Promise<void> {
    await this.db.refreshToken.delete({
      where: { id },
    })
  }

  /**
   * Delete all refresh tokens for a user
   */
  async deleteAllForUser(userId: number): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: { userId },
    })
  }

  /**
   * Delete expired refresh tokens
   */
  async deleteExpired(): Promise<void> {
    await this.db.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  }

  /**
   * Count refresh tokens for a user
   */
  async countForUser(userId: number): Promise<number> {
    return this.db.refreshToken.count({
      where: { userId },
    })
  }
}
