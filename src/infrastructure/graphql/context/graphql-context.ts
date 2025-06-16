/**
 * GraphQL Context
 * 
 * Enhanced context that integrates with our clean architecture.
 */

import { container } from 'tsyringe'
import { IncomingMessage } from 'http'
import { PrismaClient } from '@prisma/client'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { IAuthService } from '../../../core/services/auth.service.interface'

// Import use cases - Auth
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case'
import { SignupUseCase } from '../../../application/use-cases/auth/signup.use-case'

// Import use cases - Posts
import { CreatePostUseCase } from '../../../application/use-cases/posts/create-post.use-case'
import { UpdatePostUseCase } from '../../../application/use-cases/posts/update-post.use-case'
import { DeletePostUseCase } from '../../../application/use-cases/posts/delete-post.use-case'
import { GetPostUseCase } from '../../../application/use-cases/posts/get-post.use-case'
import { GetFeedUseCase } from '../../../application/use-cases/posts/get-feed.use-case'
import { GetUserDraftsUseCase } from '../../../application/use-cases/posts/get-user-drafts.use-case'
import { IncrementViewCountUseCase } from '../../../application/use-cases/posts/increment-view-count.use-case'

// Import use cases - Users
import { GetCurrentUserUseCase } from '../../../application/use-cases/users/get-current-user.use-case'
import { GetUserByIdUseCase } from '../../../application/use-cases/users/get-user-by-id.use-case'
import { SearchUsersUseCase } from '../../../application/use-cases/users/search-users.use-case'

export interface GraphQLContext {
  // Request information
  req: IncomingMessage
  
  // Database client for Pothos resolvers
  prisma: PrismaClient
  
  // Authentication
  userId?: UserId
  
  // Use cases
  useCases: {
    auth: {
      login: LoginUseCase
      signup: SignupUseCase
    }
    posts: {
      create: CreatePostUseCase
      update: UpdatePostUseCase
      delete: DeletePostUseCase
      getPost: GetPostUseCase
      getFeed: GetFeedUseCase
      getUserDrafts: GetUserDraftsUseCase
      incrementViewCount: IncrementViewCountUseCase
    }
    users: {
      getCurrentUser: GetCurrentUserUseCase
      getUserById: GetUserByIdUseCase
      searchUsers: SearchUsersUseCase
    }
  }
}

export async function createGraphQLContext(req: IncomingMessage): Promise<GraphQLContext> {
  // Extract token from headers
  const authHeader = req.headers.authorization
  let userId: UserId | undefined

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const authService = container.resolve<IAuthService>('IAuthService')
    const verifiedUserId = await authService.verifyToken(token)
    
    if (verifiedUserId) {
      userId = verifiedUserId
    }
  }

  // Get Prisma client
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  // Create context with use cases
  return {
    req,
    prisma: prismaClient,
    userId,
    useCases: {
      auth: {
        login: container.resolve(LoginUseCase),
        signup: container.resolve(SignupUseCase),
      },
      posts: {
        create: container.resolve(CreatePostUseCase),
        update: container.resolve(UpdatePostUseCase),
        delete: container.resolve(DeletePostUseCase),
        getPost: container.resolve(GetPostUseCase),
        getFeed: container.resolve(GetFeedUseCase),
        getUserDrafts: container.resolve(GetUserDraftsUseCase),
        incrementViewCount: container.resolve(IncrementViewCountUseCase),
      },
      users: {
        getCurrentUser: container.resolve(GetCurrentUserUseCase),
        getUserById: container.resolve(GetUserByIdUseCase),
        searchUsers: container.resolve(SearchUsersUseCase),
      },
    },
  }
}