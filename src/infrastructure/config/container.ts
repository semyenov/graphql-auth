/**
 * Dependency Injection Container Configuration
 * 
 * Sets up TSyringe container with all dependencies.
 */

import 'reflect-metadata'
import { container } from 'tsyringe'
import { PrismaClient } from '@prisma/client'
import { prisma } from '../../prisma'

// Core interfaces
import { IUserRepository } from '../../core/repositories/user.repository.interface'
import { IPostRepository } from '../../core/repositories/post.repository.interface'
import { IAuthService } from '../../core/services/auth.service.interface'

// Infrastructure implementations
import { PrismaUserRepository } from '../database/repositories/prisma-user.repository'
import { PrismaPostRepository } from '../database/repositories/prisma-post.repository'
import { JwtAuthService, AuthConfig } from '../auth/jwt-auth.service'

// Application use cases
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case'
import { SignupUseCase } from '../../application/use-cases/auth/signup.use-case'
import { CreatePostUseCase } from '../../application/use-cases/posts/create-post.use-case'
import { UpdatePostUseCase } from '../../application/use-cases/posts/update-post.use-case'
import { DeletePostUseCase } from '../../application/use-cases/posts/delete-post.use-case'
import { GetPostUseCase } from '../../application/use-cases/posts/get-post.use-case'

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

  // Register Prisma client - use the shared instance from prisma.ts
  // This ensures tests can override the client with setTestPrismaClient
  container.registerInstance<PrismaClient>('PrismaClient', prisma as PrismaClient)

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

  // Register use cases
  container.register<LoginUseCase>(LoginUseCase, {
    useClass: LoginUseCase,
  })
  container.register<SignupUseCase>(SignupUseCase, {
    useClass: SignupUseCase,
  })
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
}

export { container }