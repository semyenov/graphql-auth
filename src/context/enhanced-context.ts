/**
 * Enhanced Context for Clean Architecture
 * 
 * This context integrates with the new clean architecture while maintaining
 * backward compatibility with the existing code.
 */

import { container as tsyringeContainer } from 'tsyringe'
import { configureContainer } from '../infrastructure/config/container'
import { DatabaseClient } from '../infrastructure/database'
import type { Context } from './types.d'

// Import new use cases
import type { PrismaClient } from '@prisma/client'
import { LoginUseCase } from '../application/use-cases/auth/login.use-case'
import { SignupUseCase } from '../application/use-cases/auth/signup.use-case'
import { CreatePostUseCase } from '../application/use-cases/posts/create-post.use-case'
import { DeletePostUseCase } from '../application/use-cases/posts/delete-post.use-case'
import { GetFeedUseCase } from '../application/use-cases/posts/get-feed.use-case'
import { GetPostUseCase } from '../application/use-cases/posts/get-post.use-case'
import { GetUserDraftsUseCase } from '../application/use-cases/posts/get-user-drafts.use-case'
import { IncrementViewCountUseCase } from '../application/use-cases/posts/increment-view-count.use-case'
import { UpdatePostUseCase } from '../application/use-cases/posts/update-post.use-case'
import { GetCurrentUserUseCase } from '../application/use-cases/users/get-current-user.use-case'
import { GetUserByIdUseCase } from '../application/use-cases/users/get-user-by-id.use-case'
import { SearchUsersUseCase } from '../application/use-cases/users/search-users.use-case'

export interface EnhancedContext extends Context {
  // Add prisma client for Pothos resolvers
  prisma: PrismaClient
  // New clean architecture use cases
  useCases: {
    auth: {
      login: LoginUseCase
      signup: SignupUseCase
    }
    users: {
      getCurrentUser: GetCurrentUserUseCase
      searchUsers: SearchUsersUseCase
      getUserById: GetUserByIdUseCase
    }
    posts: {
      create: CreatePostUseCase
      update: UpdatePostUseCase
      delete: DeletePostUseCase
      get: GetPostUseCase
      incrementViewCount: IncrementViewCountUseCase
      getFeed: GetFeedUseCase
      getUserDrafts: GetUserDraftsUseCase
    }
  }
}

/**
 * Enhance the existing context with clean architecture use cases
 */
export function enhanceContext(baseContext: Context): EnhancedContext {
  // Configure DI container if not already done
  if (!tsyringeContainer.isRegistered('IUserRepository')) {
    configureContainer()
  }

  try {
    // Create enhanced context
    return {
      ...baseContext,
      prisma: DatabaseClient.getClient(),
      useCases: {
        auth: {
          login: tsyringeContainer.resolve(LoginUseCase),
          signup: tsyringeContainer.resolve(SignupUseCase),
        },
        posts: {
          create: tsyringeContainer.resolve(CreatePostUseCase),
          update: tsyringeContainer.resolve(UpdatePostUseCase),
          delete: tsyringeContainer.resolve(DeletePostUseCase),
          get: tsyringeContainer.resolve(GetPostUseCase),
          incrementViewCount: tsyringeContainer.resolve(IncrementViewCountUseCase),
          getFeed: tsyringeContainer.resolve(GetFeedUseCase),
          getUserDrafts: tsyringeContainer.resolve(GetUserDraftsUseCase),
        },
        users: {
          getCurrentUser: tsyringeContainer.resolve(GetCurrentUserUseCase),
          searchUsers: tsyringeContainer.resolve(SearchUsersUseCase),
          getUserById: tsyringeContainer.resolve(GetUserByIdUseCase),
        },
      },
    }
  } catch (error) {
    console.error('Error enhancing context:', error)
    throw error
  }
}