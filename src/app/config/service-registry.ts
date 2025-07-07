/**
 * Service Registry
 *
 * Provides a centralized, type-safe way to access services from the DI container.
 * This reduces boilerplate in resolvers and provides better IntelliSense support.
 */

import { container } from 'tsyringe'
import type { AppConfig } from '@/app/config/config'
import type { ILoginAttemptService } from '@/modules/auth/interfaces/login-attempt.service.interface'
import type { IPasswordService } from '@/modules/auth/interfaces/password.service.interface'
import type { IRefreshTokenRepository } from '@/modules/auth/interfaces/refresh-token.repository.interface'
import type { ITokenService } from '@/modules/auth/interfaces/token.service.interface'
import type { IVerificationTokenService } from '@/modules/auth/interfaces/verification-token.service.interface'
import type { IOidcProviderService } from '@/modules/oidc/services/oidc-provider.service'
import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
import type { IRateLimiterService } from '@/modules/shared/interfaces/rate-limiter.service.interface'
import type { IEmailService } from '@/modules/shared/services/email.service'

/**
 * Service tokens as constants to prevent typos
 */
export const SERVICE_TOKENS = {
  // Core
  APP_CONFIG: 'AppConfig',
  LOGGER: 'ILogger',
  PRISMA_CLIENT: 'PrismaClient',

  // Auth
  PASSWORD_SERVICE: 'IPasswordService',
  TOKEN_SERVICE: 'ITokenService',
  REFRESH_TOKEN_REPOSITORY: 'IRefreshTokenRepository',
  LOGIN_ATTEMPT_SERVICE: 'ILoginAttemptService',
  VERIFICATION_TOKEN_SERVICE: 'IVerificationTokenService',

  // Shared
  EMAIL_SERVICE: 'IEmailService',
  RATE_LIMITER_SERVICE: 'IRateLimiterService',

  // OIDC
  OIDC_PROVIDER_SERVICE: 'IOidcProviderService',
} as const

/**
 * Type-safe service registry with lazy loading
 */
export const Services = {
  // Core Services
  get config(): AppConfig {
    return container.resolve<AppConfig>(SERVICE_TOKENS.APP_CONFIG)
  },

  get logger(): ILogger {
    return container.resolve<ILogger>(SERVICE_TOKENS.LOGGER)
  },

  // Auth Services
  get password(): IPasswordService {
    return container.resolve<IPasswordService>(SERVICE_TOKENS.PASSWORD_SERVICE)
  },

  get token(): ITokenService {
    return container.resolve<ITokenService>(SERVICE_TOKENS.TOKEN_SERVICE)
  },

  get refreshToken(): IRefreshTokenRepository {
    return container.resolve<IRefreshTokenRepository>(
      SERVICE_TOKENS.REFRESH_TOKEN_REPOSITORY,
    )
  },

  get loginAttempt(): ILoginAttemptService {
    return container.resolve<ILoginAttemptService>(
      SERVICE_TOKENS.LOGIN_ATTEMPT_SERVICE,
    )
  },

  get verificationToken(): IVerificationTokenService {
    return container.resolve<IVerificationTokenService>(
      SERVICE_TOKENS.VERIFICATION_TOKEN_SERVICE,
    )
  },

  // Shared Services
  get email(): IEmailService {
    return container.resolve<IEmailService>(SERVICE_TOKENS.EMAIL_SERVICE)
  },

  get rateLimiter(): IRateLimiterService {
    return container.resolve<IRateLimiterService>(
      SERVICE_TOKENS.RATE_LIMITER_SERVICE,
    )
  },

  // OIDC Services
  get oidcProvider(): IOidcProviderService {
    return container.resolve<IOidcProviderService>(
      SERVICE_TOKENS.OIDC_PROVIDER_SERVICE,
    )
  },

  /**
   * Create a scoped logger for a specific context
   */
  createLogger(context: Record<string, unknown>): ILogger {
    const logger = container.resolve<ILogger>(SERVICE_TOKENS.LOGGER)
    return logger.child(context)
  },
} as const

/**
 * Service factory functions for more complex initialization
 */
export const ServiceFactory = {
  /**
   * Create a logger with resolver context
   */
  createResolverLogger(resolverName: string): ILogger {
    return Services.createLogger({ resolver: resolverName })
  },

  /**
   * Create a logger with service context
   */
  createServiceLogger(serviceName: string): ILogger {
    return Services.createLogger({ service: serviceName })
  },

  /**
   * Get all auth-related services
   */
  getAuthServices() {
    return {
      password: Services.password,
      token: Services.token,
      refreshToken: Services.refreshToken,
      loginAttempt: Services.loginAttempt,
      verificationToken: Services.verificationToken,
    }
  },

  /**
   * Check if a service is registered
   */
  isServiceRegistered(token: string): boolean {
    try {
      container.resolve(token)
      return true
    } catch {
      return false
    }
  },
}

/**
 * Decorator for automatic service injection
 * Usage: @InjectService('ILogger') private logger: ILogger
 */
export function InjectService(token: string) {
  return (target: unknown, propertyKey: string) => {
    Object.defineProperty(target, propertyKey, {
      get() {
        return container.resolve(token)
      },
      enumerable: true,
      configurable: true,
    })
  }
}

/**
 * Type guard to check if a service implements a specific interface
 */
export function implementsInterface<T>(
  service: unknown,
  methodNames: (keyof T)[],
): service is T {
  if (!service || typeof service !== 'object') {
    return false
  }

  return methodNames.every(
    (methodName) =>
      methodName in service &&
      typeof service[methodName as keyof typeof service] === 'function',
  )
}
