/**
 * Dependency Injection Container Configuration (Clean)
 * 
 * Sets up TSyringe container with only necessary dependencies for direct resolvers.
 */

import { PrismaClient } from '@prisma/client'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { prisma } from '../../prisma'

// Core interfaces
import { ILogger } from '../../core/services/logger.interface'
import { IPasswordService } from '../../core/services/password.service.interface'

// Infrastructure implementations
import { BcryptPasswordService } from '../auth/bcrypt-password.service'
import { LoggerFactory } from '../logging/logger-factory'

// Feature-based implementations (for refresh tokens)
import { TokenService, TokenConfig } from '../../features/auth/infrastructure/services/token.service'
import { RefreshTokenRepository } from '../../features/auth/infrastructure/repositories/refresh-token.repository'

// Repositories (for refresh tokens)
import { IUserRepository } from '../../core/repositories/user.repository.interface'
import { PrismaUserRepository } from '../database/repositories/prisma-user.repository'

// Configuration
import { getConfig } from './configuration'

export function configureContainer(): void {
  const config = getConfig()

  // Register token configuration
  container.registerInstance<TokenConfig>('TokenConfig', {
    accessTokenSecret: config.auth.jwtSecret,
    refreshTokenSecret: config.auth.jwtSecret + '-refresh', // In production, use a different secret
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d'
  })

  // Register Prisma client - use the shared instance from prisma.ts
  // This ensures tests can override the client with setTestPrismaClient
  container.registerInstance<PrismaClient>('PrismaClient', prisma as PrismaClient)

  // Register logger using factory
  const logger = LoggerFactory.createFromEnv()
  container.registerInstance<ILogger>('ILogger', logger)

  // Register services
  container.register<IPasswordService>('IPasswordService', {
    useClass: BcryptPasswordService,
  })

  // Register feature-based services (for refresh tokens)
  container.register<TokenService>(TokenService, {
    useClass: TokenService,
  })
  container.register<RefreshTokenRepository>(RefreshTokenRepository, {
    useClass: RefreshTokenRepository,
  })

  // Register repository (for refresh tokens)
  container.register<IUserRepository>('IUserRepository', {
    useClass: PrismaUserRepository,
  })
}

export { container }