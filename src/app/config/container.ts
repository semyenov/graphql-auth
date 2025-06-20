/**
 * Dependency Injection Container Configuration (Clean)
 *
 * Sets up TSyringe container with only necessary dependencies for direct resolvers.
 */

import type { PrismaClient } from '@prisma/client'
import 'reflect-metadata'
import { container } from 'tsyringe'
// Infrastructure implementations
import { createLoggerFromEnv } from '../../core/logging/logger-factory'
// Core interfaces
import type { ILogger } from '../../core/services/logger.interface'
import type { IPasswordService } from '../../core/services/password.service.interface'
import type { ITokenService } from '../../core/services/token.service.interface'
// Feature-based implementations (for refresh tokens)
import { RefreshTokenRepository } from '../../data/repositories/refresh-token.repository'
import { Argon2PasswordService } from '../../modules/auth/services/argon2-password.service'
import {
  type TokenConfig,
  TokenService,
} from '../../modules/auth/services/token.service'
import { prisma } from '../../prisma'

// Configuration
import { type AppConfig, getConfig } from './config'

export function configureContainer(): void {
  const config = getConfig()

  // Register config
  container.registerInstance<AppConfig>('AppConfig', config)

  // Register logger using factory
  const logger = createLoggerFromEnv()
  container.registerInstance<ILogger>('ILogger', logger)

  // Register Prisma client - use the shared instance from prisma.ts
  // This ensures tests can override the client with setTestPrismaClient
  container.registerInstance<PrismaClient>(
    'PrismaClient',
    prisma as PrismaClient,
  )

  // Register token configuration
  container.registerInstance<TokenConfig>('TokenConfig', {
    accessTokenSecret: config.auth.jwtSecret,
    refreshTokenSecret: `${config.auth.jwtSecret}-refresh`, // In production, use a different secret
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
  })

  // Register services
  container.register<IPasswordService>('IPasswordService', {
    useClass: Argon2PasswordService,
  })

  // Register feature-based services (for refresh tokens)
  container.register<ITokenService>('ITokenService', {
    useClass: TokenService,
  })
  container.register<RefreshTokenRepository>(RefreshTokenRepository, {
    useClass: RefreshTokenRepository,
  })
}

export { container }
