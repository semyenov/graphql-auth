/**
 * Core Authentication Types
 * 
 * Central type definitions for authentication and authorization
 */

// User authentication types
export interface AuthUser {
  id: string
  email: string
  role: UserRole
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

// JWT token types
export interface TokenPayload {
  userId: string
  email: string
  role?: UserRole
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

// User roles and permissions
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export interface Permission {
  action: string
  resource: string
  scope?: string
}

// Authentication context
export interface AuthContext {
  user?: AuthUser
  permissions?: Permission[]
  isAuthenticated: boolean
}

// Authorization scope types
export interface AuthScope {
  type: string
  value: any
  condition?: (context: any) => boolean | Promise<boolean>
}

// Token verification result
export interface TokenVerificationResult {
  valid: boolean
  payload?: TokenPayload
  error?: string
}

// Authentication error types
export interface AuthError {
  code: string
  message: string
  details?: any
}