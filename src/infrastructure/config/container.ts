/**
 * Dependency Injection Container Configuration
 * 
 * Sets up TSyringe container with all dependencies.
 */

import { PrismaClient } from '@prisma/client'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { prisma } from '../../prisma'

// Core interfaces
import { IPostRepository } from '../../core/repositories/post.repository.interface'
import { IUserRepository } from '../../core/repositories/user.repository.interface'
import { IAuthService } from '../../core/services/auth.service.interface'
import { ILogger } from '../../core/services/logger.interface'
import { IPasswordService } from '../../core/services/password.service.interface'
import { IPostAuthorizationService } from '../../core/services/post-authorization.service.interface'
import { ITokenService } from '../../core/services/token.service.interface'

// Infrastructure implementations
import { BcryptPasswordService } from '../auth/bcrypt-password.service'
import { AuthConfig, JwtAuthService } from '../auth/jwt-auth.service'
import { JwtTokenService } from '../auth/jwt-token.service'
import { PostAuthorizationService } from '../auth/post-authorization.service'
import { PrismaPostRepository } from '../database/repositories/prisma-post.repository'
import { PrismaUserRepository } from '../database/repositories/prisma-user.repository'
import { LoggerFactory } from '../logging/logger-factory'

// Application use cases - Auth
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case'
import { SignupUseCase } from '../../application/use-cases/auth/signup.use-case'

// Feature-based implementations
import { TokenService, TokenConfig } from '../../features/auth/infrastructure/services/token.service'
import { RefreshTokenRepository } from '../../features/auth/infrastructure/repositories/refresh-token.repository'
import { LoginWithTokensUseCase } from '../../features/auth/application/use-cases/login-with-tokens.use-case'
import { RefreshTokenUseCase } from '../../features/auth/application/use-cases/refresh-token.use-case'

// Application use cases - Posts
import { CreatePostUseCase } from '../../application/use-cases/posts/create-post.use-case'
import { DeletePostUseCase } from '../../application/use-cases/posts/delete-post.use-case'
import { GetFeedUseCase } from '../../application/use-cases/posts/get-feed.use-case'
import { GetPostUseCase } from '../../application/use-cases/posts/get-post.use-case'
import { GetUserDraftsUseCase } from '../../application/use-cases/posts/get-user-drafts.use-case'
import { IncrementViewCountUseCase } from '../../application/use-cases/posts/increment-view-count.use-case'
import { UpdatePostUseCase } from '../../application/use-cases/posts/update-post.use-case'

// Application use cases - Users
import { GetCurrentUserUseCase } from '../../application/use-cases/users/get-current-user.use-case'
import { GetUserByIdUseCase } from '../../application/use-cases/users/get-user-by-id.use-case'
import { SearchUsersUseCase } from '../../application/use-cases/users/search-users.use-case'

// Configuration
import { getConfig } from './configuration'

export function configureContainer(): void {
  const config = getConfig()

  // Register configuration
  container.registerInstance<AuthConfig>('AuthConfig', {
    jwtSecret: config.auth.jwtSecret,
    jwtExpiresIn: config.auth.jwtExpiresIn,
    bcryptRounds: config.auth.bcryptRounds,
  })

  // Register token configuration
  container.registerInstance<TokenConfig>('TokenConfig', {
    accessTokenSecret: config.auth.jwtSecret,
    refreshTokenSecret: config.auth.jwtSecret + '-refresh', // In production, use a different secret
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d'
  })

  // Register Prisma client - use the shared instance from prisma.ts
  // This ensures tests can override the client with setTestPrismaClient
  container.registerInstance<PrismaClient>('PrismaClient', prisma as PrismaClient)

  // Register logger using factory
  const logger = LoggerFactory.createFromEnv()
  container.registerInstance<ILogger>('ILogger', logger)

  // Register repositories
  container.register<IUserRepository>('IUserRepository', {
    useClass: PrismaUserRepository,
  })
  container.register<IPostRepository>('IPostRepository', {
    useClass: PrismaPostRepository,
  })

  // Register services
  container.register<IAuthService>('IAuthService', {
    useClass: JwtAuthService,
  })
  container.register<IPasswordService>('IPasswordService', {
    useClass: BcryptPasswordService,
  })
  container.register<ITokenService>('ITokenService', {
    useClass: JwtTokenService,
  })
  container.register<IPostAuthorizationService>('IPostAuthorizationService', {
    useClass: PostAuthorizationService,
  })

  // Register feature-based services
  container.register<TokenService>(TokenService, {
    useClass: TokenService,
  })
  container.register<RefreshTokenRepository>(RefreshTokenRepository, {
    useClass: RefreshTokenRepository,
  })

  // Register use cases - Auth
  container.register<LoginUseCase>(LoginUseCase, {
    useClass: LoginUseCase,
  })
  container.register<SignupUseCase>(SignupUseCase, {
    useClass: SignupUseCase,
  })
  container.register<LoginWithTokensUseCase>(LoginWithTokensUseCase, {
    useClass: LoginWithTokensUseCase,
  })
  container.register<RefreshTokenUseCase>(RefreshTokenUseCase, {
    useClass: RefreshTokenUseCase,
  })

  // Register use cases - Posts
  container.register<CreatePostUseCase>(CreatePostUseCase, {
    useClass: CreatePostUseCase,
  })
  container.register<UpdatePostUseCase>(UpdatePostUseCase, {
    useClass: UpdatePostUseCase,
  })
  container.register<DeletePostUseCase>(DeletePostUseCase, {
    useClass: DeletePostUseCase,
  })
  container.register<GetPostUseCase>(GetPostUseCase, {
    useClass: GetPostUseCase,
  })
  container.register<GetFeedUseCase>(GetFeedUseCase, {
    useClass: GetFeedUseCase,
  })
  container.register<GetUserDraftsUseCase>(GetUserDraftsUseCase, {
    useClass: GetUserDraftsUseCase,
  })
  container.register<IncrementViewCountUseCase>(IncrementViewCountUseCase, {
    useClass: IncrementViewCountUseCase,
  })

  // Register use cases - Users
  container.register<GetCurrentUserUseCase>(GetCurrentUserUseCase, {
    useClass: GetCurrentUserUseCase,
  })
  container.register<GetUserByIdUseCase>(GetUserByIdUseCase, {
    useClass: GetUserByIdUseCase,
  })
  container.register<SearchUsersUseCase>(SearchUsersUseCase, {
    useClass: SearchUsersUseCase,
  })
}

export { container }
