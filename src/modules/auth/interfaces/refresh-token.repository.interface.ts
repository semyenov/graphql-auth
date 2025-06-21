/**
 * RefreshToken Repository Interface
 *
 * Defines the contract for refresh token persistence.
 */

import type { RefreshToken } from '../entities/refresh-token.entity'

export interface IRefreshTokenRepository {
  findById(id: string): Promise<RefreshToken | null>
  findByToken(token: string): Promise<RefreshToken | null>
  findActiveByUserId(userId: number): Promise<RefreshToken[]>
  save(entity: RefreshToken): Promise<RefreshToken>
  update(entity: RefreshToken): Promise<RefreshToken>
  delete(id: string): Promise<void>
  exists(id: string): Promise<boolean>
  revokeAllByUserId(userId: number): Promise<void>
  revokeTokenFamily(family: string): Promise<void>
  deleteExpired(): Promise<number>
}
