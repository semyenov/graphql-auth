/**
 * Dependency Injection Container Configuration (Clean)
 *
 * Sets up TSyringe container with only necessary dependencies for direct resolvers.
 */

import type { PrismaClient } from '@prisma/client'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { createLoggerFromEnv } from '../../app/logging/logger-factory'
import type { ILogger } from '../../app/services/logger.interface'
import type { IPasswordService } from '../../app/services/password.service.interface'
import type {
  ITokenConfig,
  ITokenService,
} from '../../app/services/token.service.interface'
import { RefreshTokenRepository } from '../../data/repositories/refresh-token.repository'
import { Argon2PasswordService } from '../../modules/auth/services/argon2-password.service'
import { LoginAttemptService } from '../../modules/auth/services/login-attempt.service'
import { TokenService } from '../../modules/auth/services/token.service'
import { VerificationTokenService } from '../../modules/auth/services/verification-token.service'
import { prisma } from '../../prisma'
import { EmailService, type IEmailService } from '../services/email.service'
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
  container.registerInstance<ITokenConfig>('ITokenConfig', {
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
  container.register('IRefreshTokenRepository', {
    useClass: RefreshTokenRepository,
  })

  // Register email service
  container.register<IEmailService>('IEmailService', {
    useClass: EmailService,
  })

  // Register verification services
  container.register<VerificationTokenService>(VerificationTokenService, {
    useClass: VerificationTokenService,
  })
  container.register<LoginAttemptService>(LoginAttemptService, {
    useClass: LoginAttemptService,
  })
}

export { container }
