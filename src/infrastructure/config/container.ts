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
import { ITokenService } from '../../core/services/token.service.interface'

// Infrastructure implementations
import { BcryptPasswordService } from '../auth/bcrypt-password.service'
import { JwtTokenService } from '../auth/jwt-token.service'
import { LoggerFactory } from '../logging/logger-factory'

// Feature-based implementations (for refresh tokens - to be migrated)
import { TokenService, TokenConfig } from '../../features/auth/infrastructure/services/token.service'
import { RefreshTokenRepository } from '../../features/auth/infrastructure/repositories/refresh-token.repository'
import { LoginWithTokensUseCase } from '../../features/auth/application/use-cases/login-with-tokens.use-case'
import { RefreshTokenUseCase } from '../../features/auth/application/use-cases/refresh-token.use-case'

// Repositories (for refresh tokens - to be migrated)
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
  container.register<ITokenService>('ITokenService', {
    useClass: JwtTokenService,
  })

  // Register feature-based services (for refresh tokens - to be migrated)
  container.register<TokenService>(TokenService, {
    useClass: TokenService,
  })
  container.register<RefreshTokenRepository>(RefreshTokenRepository, {
    useClass: RefreshTokenRepository,
  })

  // Register repository (for refresh tokens - to be migrated)
  container.register<IUserRepository>('IUserRepository', {
    useClass: PrismaUserRepository,
  })

  // Register use cases (for refresh tokens - to be migrated to direct resolvers)
  container.register<LoginWithTokensUseCase>(LoginWithTokensUseCase, {
    useClass: LoginWithTokensUseCase,
  })
  container.register<RefreshTokenUseCase>(RefreshTokenUseCase, {
    useClass: RefreshTokenUseCase,
  })
}

export { container }