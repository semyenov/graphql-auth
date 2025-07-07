/**
 * Service tokens as constants to prevent typos
 */
export const SERVICE_TOKENS = {
  // Core
  APP_CONFIG: 'AppConfig',
  LOGGER: 'Logger',
  PRISMA_CLIENT: 'PrismaClient',

  // Auth
  PASSWORD_SERVICE: 'PasswordService',
  TOKEN_SERVICE: 'TokenService',
  REFRESH_TOKEN_REPOSITORY: 'RefreshTokenRepository',
  LOGIN_ATTEMPT_SERVICE: 'LoginAttemptService',
  VERIFICATION_TOKEN_SERVICE: 'VerificationTokenService',

  // Shared
  EMAIL_SERVICE: 'EmailService',
  RATE_LIMITER_SERVICE: 'RateLimiterService',

  // OIDC
  OIDC_PROVIDER_SERVICE: 'OidcProviderService',
} as const
