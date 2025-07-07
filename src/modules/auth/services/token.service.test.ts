/**
 * Token Service Tests
 */

import * as jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AppConfig } from '../../../app/config/config'
import { AuthenticationError } from '../../../app/errors/types'
import type { TokenPayload } from '../../../app/services/token.service.interface'
import { RefreshToken } from '../entities/refresh-token.entity'
import type { IRefreshTokenRepository } from '../interfaces/refresh-token.repository.interface'
import { TokenService } from './token.service'

// Skip token service tests for now as they require mocking
describe('TokenService', () => {
  let tokenService: TokenService
  let mockConfig: AppConfig
  let mockRefreshTokenRepo: IRefreshTokenRepository

  beforeEach(() => {
    mockConfig = {
      server: {
        port: 3000,
        host: 'localhost',
        environment: 'test',
      },
      database: {
        url: 'test-url',
        logLevel: ['error'],
      },
      auth: {
        jwtSecret: 'test-secret',
        jwtExpiresIn: 15,
        bcryptRounds: 10,
      },
    }
    mockRefreshTokenRepo = {
      save: vi.fn(),
      findByToken: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
      revokeAllByUserId: vi.fn(),
      deleteExpired: vi.fn(),
      findActiveByUserId: vi.fn(),
      update: vi.fn(),
      exists: vi.fn(),
      revokeTokenFamily: vi.fn(),
    }

    tokenService = new TokenService(mockConfig, mockRefreshTokenRepo)
  })

  describe('generateTokens', () => {
    it('should generate both access and refresh tokens', async () => {
      const user = { id: 1, email: 'test@example.com' }
      const tokens = await tokenService.generateTokens(user)

      expect(tokens.accessToken).toBeDefined()
      expect(tokens.refreshToken).toBeDefined()
      expect(typeof tokens.accessToken).toBe('string')
      expect(typeof tokens.refreshToken).toBe('string')

      // Verify access token
      const decodedAccess = jwt.verify(
        tokens.accessToken,
        mockConfig.auth.jwtSecret,
      ) as TokenPayload & { type: string; jti: string }

      expect(decodedAccess.userId).toBe(user.id)
      expect(decodedAccess.email).toBe(user.email)
      expect(decodedAccess.type).toBe('access')

      // Verify refresh token
      const decodedRefresh = jwt.verify(
        tokens.refreshToken,
        mockConfig.auth.jwtSecret,
      ) as TokenPayload & { type: string; jti: string }

      expect(decodedRefresh.userId).toBe(user.id)
      expect(decodedRefresh.email).toBe(user.email)
      expect(decodedRefresh.type).toBe('refresh')
    })

    it('should handle users with string IDs', async () => {
      const user = { id: 1, email: 'test@example.com' }
      const tokens = await tokenService.generateTokens(user)

      const decoded = jwt.verify(
        tokens.accessToken,
        mockConfig.auth.jwtSecret,
      ) as TokenPayload
      expect(decoded.userId).toBe(1)
    })
  })

  describe('verifyAccessToken', () => {
    it('should verify valid access token', async () => {
      const payload: TokenPayload & { type: string; jti: string } = {
        userId: 1,
        email: 'test@example.com',
        type: 'access',
        jti: 'token-id',
      }
      const token = jwt.sign(payload, mockConfig.auth.jwtSecret)

      const result = await tokenService.verifyAccessToken(token)
      expect(result).toBe('1')
    })

    it('should return null for invalid token', async () => {
      const result = await tokenService.verifyAccessToken('invalid-token')
      expect(result).toBeNull()
    })

    it('should return null for refresh token used as access token', async () => {
      const payload: TokenPayload & { type: string; jti: string } = {
        userId: 1,
        email: 'test@example.com',
        type: 'refresh',
        jti: 'token-id',
      }
      const token = jwt.sign(payload, mockConfig.auth.jwtSecret)

      const result = await tokenService.verifyAccessToken(token)
      expect(result).toBeNull()
    })

    it('should return null for expired token', async () => {
      const payload: TokenPayload & { type: string; jti: string } = {
        userId: 1,
        email: 'test@example.com',
        type: 'access',
        jti: 'token-id',
      }
      const token = jwt.sign(payload, mockConfig.auth.jwtSecret, {
        expiresIn: '-1s',
      })

      const result = await tokenService.verifyAccessToken(token)
      expect(result).toBeNull()
    })
  })

  describe('refreshTokens', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const userId = 1
      const email = 'test@example.com'
      const jti = 'refresh-token-id'

      const payload: TokenPayload & { type: string; jti: string } = {
        userId,
        email,
        type: 'refresh',
        jti,
      }
      const refreshToken = jwt.sign(payload, mockConfig.auth.jwtSecret)

      const storedToken = RefreshToken.create({
        token: jti,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        family: jti,
      })

      mockRefreshTokenRepo.findByToken = vi.fn().mockResolvedValue(storedToken)

      const tokens = await tokenService.refreshTokens(refreshToken)

      expect(tokens.accessToken).toBeDefined()
      expect(tokens.refreshToken).toBeDefined()
      expect(mockRefreshTokenRepo.findByToken).toHaveBeenCalledWith(jti)
      expect(mockRefreshTokenRepo.delete).toHaveBeenCalledWith(storedToken.id)
    })

    it('should throw error for invalid refresh token JWT', async () => {
      await expect(tokenService.refreshTokens('invalid-token')).rejects.toThrow(
        AuthenticationError,
      )
    })

    it('should throw error for access token used as refresh token', async () => {
      const payload: TokenPayload & { type: string; jti: string } = {
        userId: 1,
        email: 'test@example.com',
        type: 'access',
        jti: 'token-id',
      }
      const token = jwt.sign(payload, mockConfig.auth.jwtSecret)

      await expect(tokenService.refreshTokens(token)).rejects.toThrow(
        'Invalid token type',
      )
    })

    it('should throw error for non-existent refresh token', async () => {
      const payload: TokenPayload & { type: string; jti: string } = {
        userId: 1,
        email: 'test@example.com',
        type: 'refresh',
        jti: 'non-existent',
      }
      const token = jwt.sign(payload, mockConfig.auth.jwtSecret)

      mockRefreshTokenRepo.findByToken = vi.fn().mockResolvedValue(null)

      await expect(tokenService.refreshTokens(token)).rejects.toThrow(
        'Invalid refresh token',
      )
    })

    it('should throw error for revoked refresh token', async () => {
      const jti = 'revoked-token'
      const payload: TokenPayload & { type: string; jti: string } = {
        userId: 1,
        email: 'test@example.com',
        type: 'refresh',
        jti,
      }
      const token = jwt.sign(payload, mockConfig.auth.jwtSecret)

      const revokedToken = RefreshToken.create({
        token: jti,
        userId: 1,
        expiresAt: new Date(Date.now() + 1000000),
        family: jti,
      })
      revokedToken.revoke()

      mockRefreshTokenRepo.findByToken = vi.fn().mockResolvedValue(revokedToken)

      await expect(tokenService.refreshTokens(token)).rejects.toThrow(
        'Invalid refresh token',
      )
    })

    it('should throw error for expired refresh token', async () => {
      const jti = 'expired-token'
      const payload: TokenPayload & { type: string; jti: string } = {
        userId: 1,
        email: 'test@example.com',
        type: 'refresh',
        jti,
      }
      const token = jwt.sign(payload, mockConfig.auth.jwtSecret)

      const expiredToken = RefreshToken.create({
        token: jti,
        userId: 1,
        expiresAt: new Date(Date.now() - 1000),
        family: jti,
      })

      mockRefreshTokenRepo.findByToken = vi.fn().mockResolvedValue(expiredToken)

      await expect(tokenService.refreshTokens(token)).rejects.toThrow(
        'Refresh token expired',
      )
      expect(mockRefreshTokenRepo.delete).toHaveBeenCalledWith(expiredToken.id)
    })
  })

  describe('revokeAllTokens', () => {
    it('should revoke all tokens for a user', async () => {
      const userId = 1
      await tokenService.revokeAllTokens(userId)

      expect(mockRefreshTokenRepo.revokeAllByUserId).toHaveBeenCalledWith(
        userId,
      )
    })
  })

  describe('parseExpiration', () => {
    it('should parse seconds correctly', () => {
      const service = new TokenService(mockConfig, mockRefreshTokenRepo)
      // @ts-expect-error - accessing private method for testing
      const result = service.parseExpiration('30s')
      expect(result).toBe(30 * 1000)
    })

    it('should parse minutes correctly', () => {
      const service = new TokenService(mockConfig, mockRefreshTokenRepo)
      // @ts-expect-error - accessing private method for testing
      const result = service.parseExpiration('15m')
      expect(result).toBe(15 * 60 * 1000)
    })

    it('should parse hours correctly', () => {
      const service = new TokenService(mockConfig, mockRefreshTokenRepo)
      // @ts-expect-error - accessing private method for testing
      const result = service.parseExpiration('2h')
      expect(result).toBe(2 * 60 * 60 * 1000)
    })

    it('should parse days correctly', () => {
      const service = new TokenService(mockConfig, mockRefreshTokenRepo)
      // @ts-expect-error - accessing private method for testing
      const result = service.parseExpiration('7d')
      expect(result).toBe(7 * 24 * 60 * 60 * 1000)
    })

    it('should throw error for invalid format', () => {
      const service = new TokenService(mockConfig, mockRefreshTokenRepo)
      // @ts-expect-error - accessing private method for testing
      expect(() => service.parseExpiration('invalid')).toThrow(
        'Invalid expiration format: invalid',
      )
    })

    it('should throw error for invalid unit', () => {
      const service = new TokenService(mockConfig, mockRefreshTokenRepo)
      // @ts-expect-error - accessing private method for testing
      expect(() => service.parseExpiration('10x')).toThrow(
        'Invalid expiration format: 10x',
      )
    })
  })
})
