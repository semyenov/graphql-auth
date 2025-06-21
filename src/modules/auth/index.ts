/**
 * Auth Module Public API
 *
 * Exports all public interfaces and classes from the auth module.
 */

export * from './application/dtos/auth-response.dto'
export * from './application/dtos/sign-in.dto'
export * from './application/dtos/sign-up.dto'
export * from './application/services/email.service.interface'
export * from './application/services/token.service.interface'
export * from './application/use-cases/refresh-token.use-case'
export * from './application/use-cases/sign-in.use-case'
// Application exports
export * from './application/use-cases/sign-up.use-case'
// Module configuration
export * from './config/auth.config'
export * from './config/auth.module'
export * from './domain/entities/refresh-token.entity'
// Domain exports
export * from './domain/entities/user.entity'
export * from './domain/errors/auth.errors'
export * from './domain/repositories/refresh-token.repository.interface'
export * from './domain/repositories/user.repository.interface'
export * from './domain/services/password-hasher.interface'
export * from './domain/value-objects/email.vo'
export * from './domain/value-objects/password.vo'
export * from './domain/value-objects/user-id.vo'

// Legacy exports (for backward compatibility)
export * from './guards'
export * from './resolvers'
export * from './services'
export * from './types'

// Import resolvers to register them
import './presentation/graphql/resolvers/auth.resolver'
