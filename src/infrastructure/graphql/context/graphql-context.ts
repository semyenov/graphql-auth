/**
 * GraphQL Context
 * 
 * Enhanced context that integrates with our clean architecture.
 */

import { container } from 'tsyringe'
import { IncomingMessage } from 'http'
import { UserId } from '../../../core/value-objects/user-id.vo'
import { IAuthService } from '../../../core/services/auth.service.interface'

// Import use cases
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case'
import { SignupUseCase } from '../../../application/use-cases/auth/signup.use-case'
import { CreatePostUseCase } from '../../../application/use-cases/posts/create-post.use-case'
import { UpdatePostUseCase } from '../../../application/use-cases/posts/update-post.use-case'
import { DeletePostUseCase } from '../../../application/use-cases/posts/delete-post.use-case'
import { GetPostUseCase } from '../../../application/use-cases/posts/get-post.use-case'

export interface GraphQLContext {
  // Request information
  req: IncomingMessage
  
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

  // Create context with use cases
  return {
    req,
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
      },
    },
  }
}