/**
 * Auth Data Repository
 * Following modular monolith pattern - isolates auth module data access
 *
 * This repository provides auth module with controlled access to its own data models.
 * It prevents cross-module data access and enforces proper boundaries.
 */

import { prisma } from '@/modules/shared/shared.module'
import type {
  Prisma,
  RefreshToken,
  User,
  VerificationToken,
} from '@prisma/client'
import { injectable } from 'tsyringe'

/**
 * Auth Data Repository Interface
 * Defines the data operations available to the auth module
 */
export interface IAuthDataRepository {
  // User operations (auth-specific)
  findUserByEmail(email: string): Promise<User | null>
  findUserById(id: number): Promise<User | null>
  createUser(data: Prisma.UserCreateInput): Promise<User>
  updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User>
  updateUserPassword(id: number, hashedPassword: string): Promise<User>
  updateUserEmailVerification(id: number, verified: boolean): Promise<User>

  // Refresh token operations
  createRefreshToken(
    data: Prisma.RefreshTokenCreateInput,
  ): Promise<RefreshToken>
  findRefreshTokenByToken(token: string): Promise<RefreshToken | null>
  findRefreshTokensByUserId(userId: number): Promise<RefreshToken[]>
  revokeRefreshToken(id: string): Promise<RefreshToken>
  revokeAllUserRefreshTokens(userId: number): Promise<void>
  revokeRefreshTokenFamily(family: string): Promise<void>
  deleteExpiredRefreshTokens(): Promise<void>

  // Verification token operations
  createVerificationToken(
    data: Prisma.VerificationTokenCreateInput,
  ): Promise<VerificationToken>
  findVerificationToken(
    userId: number,
    token: string,
  ): Promise<VerificationToken | null>
  markVerificationTokenUsed(userId: number, token: string): Promise<void>
  deleteExpiredVerificationTokens(): Promise<void>

  // Login attempt operations
  getUserLoginAttempts(email: string, timeWindow: Date): Promise<number>
  recordLoginAttempt(
    email: string,
    success: boolean,
    ipAddress: string,
  ): Promise<void>
  clearLoginAttempts(email: string): Promise<void>

  // Utility operations
  isUserEmailTaken(email: string, excludeUserId?: number): Promise<boolean>
}

/**
 * Auth Data Repository Implementation
 *
 * This implementation provides the auth module with isolated access to its own data.
 * It only exposes operations that are relevant to authentication and authorization.
 */
@injectable()
export class AuthDataRepository implements IAuthDataRepository {
  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async findUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })
  }

  async updateUserEmailVerification(
    id: number,
    verified: boolean,
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        emailVerified: verified,
        emailVerifiedAt: verified ? new Date() : null,
      },
    })
  }

  // Refresh token operations
  async createRefreshToken(
    data: Prisma.RefreshTokenCreateInput,
  ): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data })
  }

  async findRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    })
  }

  async findRefreshTokensByUserId(userId: number): Promise<RefreshToken[]> {
    return prisma.refreshToken.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async revokeRefreshToken(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    })
  }

  async revokeAllUserRefreshTokens(userId: number): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    })
  }

  async revokeRefreshTokenFamily(family: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { family },
      data: { revoked: true },
    })
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { revoked: true }],
      },
    })
  }

  // Verification token operations
  async createVerificationToken(
    data: Prisma.VerificationTokenCreateInput,
  ): Promise<VerificationToken> {
    return prisma.verificationToken.create({ data })
  }

  async findVerificationToken(
    userId: number,
    token: string,
  ): Promise<VerificationToken | null> {
    return prisma.verificationToken.findFirst({
      where: {
        userId,
        token,
        usedAt: null, // Only unused tokens
        expiresAt: { gt: new Date() }, // Only non-expired tokens
      },
    })
  }

  async markVerificationTokenUsed(
    userId: number,
    token: string,
  ): Promise<void> {
    await prisma.verificationToken.updateMany({
      where: {
        userId,
        token,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    })
  }

  async deleteExpiredVerificationTokens(): Promise<void> {
    await prisma.verificationToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
      },
    })
  }

  // Login attempt operations (using the LoginAttempt model)
  async getUserLoginAttempts(email: string, timeWindow: Date): Promise<number> {
    return prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: timeWindow },
      },
    })
  }

  async recordLoginAttempt(
    email: string,
    success: boolean,
    ipAddress: string,
  ): Promise<void> {
    await prisma.loginAttempt.create({
      data: {
        email,
        success,
        ipAddress,
      },
    })
  }

  async clearLoginAttempts(email: string): Promise<void> {
    await prisma.loginAttempt.deleteMany({
      where: { email },
    })
  }

  // Utility operations
  async isUserEmailTaken(
    email: string,
    excludeUserId?: number,
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (!user) return false
    if (excludeUserId && user.id === excludeUserId) return false

    return true
  }
}
