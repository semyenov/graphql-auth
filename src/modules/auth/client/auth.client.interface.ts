/**
 * Auth Module Client Interface
 * Following modular monolith pattern - defines the public API for inter-module communication
 *
 * This interface represents what other modules can do with the Auth module.
 * It's the only entry point other modules should use to interact with auth functionality.
 */

// Input/Output types for the client interface
export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: string
  emailVerified: boolean
  emailVerifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  name?: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmation {
  token: string
  newPassword: string
}

export interface EmailVerificationRequest {
  token: string
}

export interface TokenValidationResult {
  valid: boolean
  userId?: number
  email?: string
  error?: string
}

/**
 * Auth Module Client Interface
 *
 * This interface defines all operations that other modules can perform
 * on the Auth module. It acts as a contract and abstraction layer.
 */
export interface IAuthClient {
  // Authentication operations
  authenticate(credentials: LoginCredentials): Promise<AuthTokens>
  register(userData: SignupData): Promise<AuthUser>
  logout(userId: number): Promise<boolean>

  // Token management
  validateToken(token: string): Promise<TokenValidationResult>
  refreshTokens(refreshToken: string): Promise<AuthTokens>
  revokeAllTokens(userId: number): Promise<boolean>

  // User verification
  verifyEmail(request: EmailVerificationRequest): Promise<boolean>
  sendEmailVerification(userId: number): Promise<boolean>

  // Password management
  requestPasswordReset(request: PasswordResetRequest): Promise<boolean>
  confirmPasswordReset(request: PasswordResetConfirmation): Promise<boolean>
  changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean>

  // User lookup and validation
  getUserById(userId: number): Promise<AuthUser | null>
  getUserByEmail(email: string): Promise<AuthUser | null>
  validateUserPermissions(
    userId: number,
    requiredRole: string,
  ): Promise<boolean>

  // Account management
  lockAccount(userId: number, reason: string): Promise<boolean>
  unlockAccount(userId: number): Promise<boolean>
  isAccountLocked(
    email: string,
  ): Promise<{ locked: boolean; remainingMinutes?: number }>

  // Security operations
  recordLoginAttempt(
    email: string,
    ipAddress: string,
    success: boolean,
  ): Promise<void>
  checkRateLimit(operation: string, identifier: string): Promise<boolean>
}

/**
 * Auth Module Events
 *
 * Events that the Auth module can publish for other modules to subscribe to.
 * This enables loose coupling between modules.
 */
export interface AuthModuleEvents {
  'user.registered': {
    userId: number
    email: string
    name: string | null
    timestamp: Date
  }
  'user.authenticated': {
    userId: number
    email: string
    ipAddress: string
    timestamp: Date
  }
  'user.logout': {
    userId: number
    timestamp: Date
  }
  'email.verified': {
    userId: number
    email: string
    timestamp: Date
  }
  'password.changed': {
    userId: number
    timestamp: Date
  }
  'account.locked': {
    userId: number
    email: string
    reason: string
    timestamp: Date
  }
  'auth.failed': {
    email: string
    ipAddress: string
    reason: string
    timestamp: Date
  }
}

/**
 * Error types that the Auth module can return
 */
export class AuthClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'AuthClientError'
  }
}

export class AuthenticationFailedError extends AuthClientError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_FAILED', 401)
  }
}

export class AccountLockedError extends AuthClientError {
  constructor(
    message = 'Account is locked',
    public readonly remainingMinutes?: number,
  ) {
    super(message, 'ACCOUNT_LOCKED', 423)
  }
}

export class TokenExpiredError extends AuthClientError {
  constructor(message = 'Token has expired') {
    super(message, 'TOKEN_EXPIRED', 401)
  }
}
