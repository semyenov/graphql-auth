/**
 * Dependency injection container
 * Centralizes the instantiation of services and use cases
 */

import {
  LoginUseCase,
  SignupUseCase,
  TokenService,
  UserRepository,
} from '../../../features/auth'

import {
  CreatePostUseCase,
  DeletePostUseCase,
  PostRepository,
} from '../../../features/posts'

import { IncrementPostViewCountUseCase } from '../../../features/posts/application/use-cases/increment-post-view-count.use-case'
import { TogglePublishPostUseCase } from '../../../features/posts/application/use-cases/toggle-publish-post.use-case'
import { PostAuthorizationService } from '../../../features/posts/domain/services/post-authorization.service'

/**
 * Container class for managing dependencies
 */
class Container {
  private static instance: Container

  // Repositories
  private _userRepository?: UserRepository
  private _postRepository?: PostRepository

  // Services
  private _tokenService?: TokenService
  private _postAuthorizationService?: PostAuthorizationService

  // Use cases
  private _signupUseCase?: SignupUseCase
  private _loginUseCase?: LoginUseCase
  private _createPostUseCase?: CreatePostUseCase
  private _deletePostUseCase?: DeletePostUseCase
  private _togglePublishPostUseCase?: TogglePublishPostUseCase
  private _incrementPostViewCountUseCase?: IncrementPostViewCountUseCase

  private constructor() { }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  // Repository getters
  get userRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository()
    }
    return this._userRepository
  }

  get postRepository(): PostRepository {
    if (!this._postRepository) {
      this._postRepository = new PostRepository()
    }
    return this._postRepository
  }

  // Service getters
  get tokenService(): TokenService {
    if (!this._tokenService) {
      this._tokenService = new TokenService()
    }
    return this._tokenService
  }

  get postAuthorizationService(): PostAuthorizationService {
    if (!this._postAuthorizationService) {
      this._postAuthorizationService = new PostAuthorizationService()
    }
    return this._postAuthorizationService
  }

  // Use case getters
  get signupUseCase(): SignupUseCase {
    if (!this._signupUseCase) {
      this._signupUseCase = new SignupUseCase(
        this.userRepository,
        this.tokenService
      )
    }
    return this._signupUseCase
  }

  get loginUseCase(): LoginUseCase {
    if (!this._loginUseCase) {
      this._loginUseCase = new LoginUseCase(
        this.userRepository,
        this.tokenService
      )
    }
    return this._loginUseCase
  }

  get createPostUseCase(): CreatePostUseCase {
    if (!this._createPostUseCase) {
      this._createPostUseCase = new CreatePostUseCase(this.postRepository)
    }
    return this._createPostUseCase
  }

  get deletePostUseCase(): DeletePostUseCase {
    if (!this._deletePostUseCase) {
      this._deletePostUseCase = new DeletePostUseCase(this.postRepository)
    }
    return this._deletePostUseCase
  }

  get togglePublishPostUseCase(): TogglePublishPostUseCase {
    if (!this._togglePublishPostUseCase) {
      this._togglePublishPostUseCase = new TogglePublishPostUseCase(
        this.postRepository,
      )
    }
    return this._togglePublishPostUseCase
  }

  get incrementPostViewCountUseCase(): IncrementPostViewCountUseCase {
    if (!this._incrementPostViewCountUseCase) {
      this._incrementPostViewCountUseCase = new IncrementPostViewCountUseCase(
        this.postRepository
      )
    }
    return this._incrementPostViewCountUseCase
  }
}

export const container = Container.getInstance()