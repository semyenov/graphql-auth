/**
 * Refresh Token Repository
 *
 * Handles database operations for refresh tokens
 */

import type { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import { RefreshToken } from '../../modules/auth/entities/refresh-token.entity'
import type { IRefreshTokenRepository } from '../../modules/auth/interfaces/refresh-token.repository.interface'

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(@inject('PrismaClient') private db: PrismaClient) {}
  async revokeTokenFamily(family: string): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { family },
      data: { revoked: true },
    })
  }
  findById(_id: string): Promise<RefreshToken | null> {
    throw new Error('Method not implemented.')
  }
  findAll(): Promise<RefreshToken[]> {
    throw new Error('Method not implemented.')
  }
  async save(entity: RefreshToken): Promise<RefreshToken> {
    const data = entity.toJSON()
    const refreshToken = await this.db.refreshToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
        family: data.family,
        revoked: data.revoked,
        createdAt: data.createdAt,
      },
    })
    return RefreshToken.reconstitute(refreshToken.id, {
      token: refreshToken.token,
      userId: refreshToken.userId,
      expiresAt: refreshToken.expiresAt,
      family: refreshToken.family,
      revoked: refreshToken.revoked,
      createdAt: refreshToken.createdAt,
    })
  }
  update(_entity: RefreshToken): Promise<RefreshToken> {
    throw new Error('Method not implemented.')
  }
  async delete(id: string): Promise<void> {
    await this.db.refreshToken.delete({
      where: { id },
    })
  }
  exists(_id: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.db.refreshToken.findUnique({
      where: { token },
    })
    return refreshToken
      ? RefreshToken.reconstitute(refreshToken.id, {
          token: refreshToken.token,
          userId: refreshToken.userId,
          expiresAt: refreshToken.expiresAt,
          createdAt: refreshToken.createdAt,
          family: refreshToken.family,
          revoked: refreshToken.revoked,
        })
      : null
  }

  async findActiveByUserId(userId: number): Promise<RefreshToken[]> {
    const refreshTokens = await this.db.refreshToken.findMany({
      where: { userId: userId, expiresAt: { gt: new Date() } },
    })
    return refreshTokens.map((refreshToken) =>
      RefreshToken.reconstitute(refreshToken.id, {
        token: refreshToken.token,
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt,
        createdAt: refreshToken.createdAt,
        family: refreshToken.family,
        revoked: refreshToken.revoked,
      }),
    )
  }

  async revokeAllByUserId(userId: number): Promise<void> {
    await this.db.refreshToken.updateMany({
      where: { userId: userId },
      data: { revoked: true },
    })
  }

  async deleteExpired(): Promise<number> {
    const result = await this.db.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
    return result.count
  }
}
