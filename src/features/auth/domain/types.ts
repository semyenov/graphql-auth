/**
 * Domain types for authentication feature
 * These types represent the core business entities and rules
 */

export interface User {
  id: number
  email: string
  name: string | null
}

export interface AuthUser extends User {
  password: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface SignupData extends UserCredentials {
  name?: string | null
}

export interface AuthToken {
  token: string
  userId: number
  email: string
  expiresAt: Date
}

export interface AuthResult {
  token: string
  user: User
}

/**
 * Domain errors specific to authentication
 */
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`)
    this.name = 'UserAlreadyExistsError'
  }
}

export class WeakPasswordError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WeakPasswordError'
  }
}