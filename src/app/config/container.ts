/**
 * Dependency Injection Container Configuration (Clean)
 *
 * Sets up TSyringe container with only necessary dependencies for direct resolvers.
 */

import type { PrismaClient } from '@prisma/client'
import { type AppConfig, getConfig } from '@/app/config/config'
import { createLoggerFromEnv } from '@/app/logging/logger-factory'
import 'reflect-metadata'
import { container } from 'tsyringe'
// OIDC
import type { IPasswordService } from '@/modules/auth/interfaces/password.service.interface'
import type { ITokenService } from '@/modules/auth/interfaces/token.service.interface'
import { RefreshTokenRepository } from '@/modules/auth/repositories/refresh-token.repository'
import { Argon2PasswordService } from '@/modules/auth/services/argon2-password.service'
import { LoginAttemptService } from '@/modules/auth/services/login-attempt.service'
import { TokenService } from '@/modules/auth/services/token.service'
import { VerificationTokenService } from '@/modules/auth/services/verification-token.service'
import {
  type IOidcProviderService,
  OidcProviderService,
} from '@/modules/oidc/services/oidc-provider.service'
import { prisma } from '@/modules/shared/database'
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
import {
  EmailService,
  type IEmailService,
} from '@/modules/shared/services/email.service'

export function configureContainer(): void {
  // Register config
  container.registerInstance<AppConfig>('AppConfig', getConfig())
  // Register logger using factory
  container.registerInstance<ILogger>('ILogger', createLoggerFromEnv())

  // Register Prisma client - use the shared instance from prisma.ts
  // This ensures tests can override the client with setTestPrismaClient
  container.registerInstance<PrismaClient>(
    'PrismaClient',
    prisma as PrismaClient,
  )

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

  // Register OIDC services
  container.register<IOidcProviderService>('IOidcProviderService', {
    useClass: OidcProviderService,
  })
}

export { container }
