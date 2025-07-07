/**
 * Dependency Injection Container Configuration
 *
 * Provides a well-organized DI setup with:
 * - Interface-based registration for all services
 * - Proper lifecycle management
 * - Clear separation of concerns
 */

import type { PrismaClient } from '@prisma/client'
import 'reflect-metadata'
import { container, Lifecycle } from 'tsyringe'
// Configuration
import { type AppConfig, getConfig } from '@/app/config/config'
import { SERVICE_TOKENS } from '@/app/config/service-registry'
import { createLoggerFromEnv } from '@/app/logging/logger-factory'
import type { ILoginAttemptService } from '@/modules/auth/interfaces/login-attempt.service.interface'
import type { IPasswordService } from '@/modules/auth/interfaces/password.service.interface'
import type { IRefreshTokenRepository } from '@/modules/auth/interfaces/refresh-token.repository.interface'
import type { ITokenService } from '@/modules/auth/interfaces/token.service.interface'
import type { IVerificationTokenService } from '@/modules/auth/interfaces/verification-token.service.interface'
import { RefreshTokenRepository } from '@/modules/auth/repositories/refresh-token.repository'
// Implementations
import { Argon2PasswordService } from '@/modules/auth/services/argon2-password.service'
import { LoginAttemptService } from '@/modules/auth/services/login-attempt.service'
import { TokenService } from '@/modules/auth/services/token.service'
import { VerificationTokenService } from '@/modules/auth/services/verification-token.service'
import type { IOidcProviderService } from '@/modules/oidc/services/oidc-provider.service'
import { OidcProviderService } from '@/modules/oidc/services/oidc-provider.service'
// Database
import { prisma } from '@/modules/shared/database'
// Interfaces
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
import type { IRateLimiterService } from '@/modules/shared/interfaces/rate-limiter.service.interface'
import type { IEmailService } from '@/modules/shared/services/email.service'
import { EmailService } from '@/modules/shared/services/email.service'
import { RateLimiterService } from '@/modules/shared/services/rate-limiter.service'

export function configureContainer(): void {
  // ===========================================================================
  // Core Infrastructure
  // ===========================================================================

  // Configuration - Singleton
  container.registerInstance<AppConfig>(SERVICE_TOKENS.APP_CONFIG, getConfig())

  // Logger - Singleton
  const logger = createLoggerFromEnv()
  container.registerInstance<ILogger>(SERVICE_TOKENS.LOGGER, logger)

  // Database Client - Singleton
  container.registerInstance<PrismaClient>(
    SERVICE_TOKENS.PRISMA_CLIENT,
    prisma as PrismaClient,
  )

  // ===========================================================================
  // Authentication Services
  // ===========================================================================

  // Password Service - Singleton (stateless)
  container.register<IPasswordService>(
    SERVICE_TOKENS.PASSWORD_SERVICE,
    { useClass: Argon2PasswordService },
    { lifecycle: Lifecycle.Singleton },
  )

  // Token Service - Singleton (uses config)
  container.register<ITokenService>(
    SERVICE_TOKENS.TOKEN_SERVICE,
    { useClass: TokenService },
    { lifecycle: Lifecycle.Singleton },
  )

  // Refresh Token Repository - Scoped (per request)
  container.register<IRefreshTokenRepository>(
    SERVICE_TOKENS.REFRESH_TOKEN_REPOSITORY,
    { useClass: RefreshTokenRepository },
  )

  // Login Attempt Service - Singleton (stateless)
  container.register<ILoginAttemptService>(
    SERVICE_TOKENS.LOGIN_ATTEMPT_SERVICE,
    { useClass: LoginAttemptService },
    { lifecycle: Lifecycle.Singleton },
  )

  // Verification Token Service - Singleton (stateless)
  container.register<IVerificationTokenService>(
    SERVICE_TOKENS.VERIFICATION_TOKEN_SERVICE,
    { useClass: VerificationTokenService },
    { lifecycle: Lifecycle.Singleton },
  )

  // ===========================================================================
  // Shared Services
  // ===========================================================================

  // Email Service - Singleton (stateless)
  container.register<IEmailService>(
    SERVICE_TOKENS.EMAIL_SERVICE,
    { useClass: EmailService },
    { lifecycle: Lifecycle.Singleton },
  )

  // Rate Limiter Service - Singleton (maintains state)
  container.registerInstance<IRateLimiterService>(
    SERVICE_TOKENS.RATE_LIMITER_SERVICE,
    RateLimiterService.getInstance(),
  )

  // ===========================================================================
  // OIDC Services
  // ===========================================================================

  // OIDC Provider Service - Singleton
  container.register<IOidcProviderService>(
    SERVICE_TOKENS.OIDC_PROVIDER_SERVICE,
    { useClass: OidcProviderService },
    { lifecycle: Lifecycle.Singleton },
  )

  // Log successful configuration
  logger.info('Dependency injection container configured', {
    environment: process.env.NODE_ENV,
    services: [
      SERVICE_TOKENS.APP_CONFIG,
      SERVICE_TOKENS.LOGGER,
      SERVICE_TOKENS.PRISMA_CLIENT,
      SERVICE_TOKENS.PASSWORD_SERVICE,
      SERVICE_TOKENS.TOKEN_SERVICE,
      SERVICE_TOKENS.REFRESH_TOKEN_REPOSITORY,
      SERVICE_TOKENS.LOGIN_ATTEMPT_SERVICE,
      SERVICE_TOKENS.VERIFICATION_TOKEN_SERVICE,
      SERVICE_TOKENS.EMAIL_SERVICE,
      SERVICE_TOKENS.RATE_LIMITER_SERVICE,
      SERVICE_TOKENS.OIDC_PROVIDER_SERVICE,
    ],
  })
}

export { container }
