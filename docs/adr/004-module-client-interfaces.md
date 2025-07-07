# ADR-004: Module Client Interfaces for Inter-Module Communication

## Status
**Accepted** - 2025-01-16

## Context

In our modular monolith architecture (see [ADR-001](./001-modular-monolith-architecture.md)), modules need to access functionality from other modules without creating tight coupling. The challenges include:

1. **Direct Imports**: Modules importing each other's internal implementations
2. **Hidden Dependencies**: Unclear what functionality one module provides to others  
3. **Testing Complexity**: Difficulty mocking cross-module dependencies
4. **Interface Evolution**: Changes to internal implementations breaking other modules
5. **Circular Dependencies**: Modules depending on each other creating import cycles

We needed a way for modules to expose stable, well-defined APIs while keeping internal implementations hidden.

## Decision

We will implement **Module Client Interfaces** that provide clean, contract-based APIs for inter-module communication:

### Client Interface Architecture
- Each module exposes a single client interface (e.g., `IAuthClient`, `IUsersClient`)
- Interfaces define only the operations other modules need
- Implementations handle internal complexity and business logic
- Error handling through module-specific error types

### Interface Design Principles
1. **Stable APIs**: Interfaces change infrequently, implementations can evolve
2. **Rich Return Types**: Include enough data to avoid N+1 queries
3. **Async by Default**: All operations return Promises for consistency
4. **Type Safety**: Full TypeScript support with proper error types
5. **Domain-Focused**: Methods organized by business capabilities, not technical layers

## Interface Definitions

### Auth Module Client
```typescript
interface IAuthClient {
  // Authentication
  authenticateUser(email: string, password: string): Promise<AuthResult>
  refreshToken(refreshToken: string): Promise<TokenPair>
  validateToken(token: string): Promise<ValidatedUser>
  
  // User Management
  createUser(data: CreateUserInput): Promise<User>
  verifyUserEmail(token: string): Promise<boolean>
  
  // Security
  checkPasswordStrength(password: string): Promise<PasswordStrengthResult>
  isAccountLocked(userId: string): Promise<boolean>
  recordLoginAttempt(userId: string, success: boolean): Promise<void>
}
```

### Users Module Client
```typescript
interface IUsersClient {
  // User Queries
  getUserProfile(userId: string): Promise<UserProfile>
  searchUsers(criteria: UserSearchCriteria): Promise<UserConnection>
  getUserStatistics(userId: string): Promise<UserStatistics>
  
  // User Operations  
  updateUserProfile(userId: string, data: UpdateProfileInput): Promise<UserProfile>
  deactivateUser(userId: string): Promise<boolean>
  
  // Validation
  validateUsername(username: string): Promise<ValidationResult>
  checkUserPermissions(userId: string, action: string): Promise<boolean>
}
```

### Posts Module Client
```typescript
interface IPostsClient {
  // Post Operations
  createPost(authorId: string, data: CreatePostInput): Promise<Post>
  updatePost(postId: string, data: UpdatePostInput): Promise<Post>
  deletePost(postId: string): Promise<boolean>
  
  // Post Queries
  getPostById(postId: string): Promise<Post | null>
  getPostsByAuthor(authorId: string, pagination: PaginationInput): Promise<PostConnection>
  searchPosts(criteria: PostSearchCriteria): Promise<PostConnection>
  
  // Publishing
  publishPost(postId: string): Promise<Post>
  unpublishPost(postId: string): Promise<Post>
}
```

### Shared Module Client  
```typescript
interface ISharedClient {
  // Email Services
  sendEmail(to: string, template: string, data: EmailData): Promise<boolean>
  
  // Rate Limiting
  checkRateLimit(key: string, action: string): Promise<RateLimitResult>
  
  // Utilities
  encodeGlobalId(type: string, id: string): Promise<string>
  decodeGlobalId(globalId: string): Promise<{ type: string; id: string }>
  
  // Validation
  validateInput<T>(schema: string, data: unknown): Promise<ValidationResult<T>>
}
```

## Error Handling Strategy

### Module-Specific Error Types
Each module defines its own error hierarchy:

```typescript
// Auth Module Errors
export class AuthClientError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
  }
}

export class AuthenticationFailedError extends AuthClientError {
  constructor(reason: string) {
    super(`Authentication failed: ${reason}`, 'AUTH_FAILED')
  }
}

export class TokenExpiredError extends AuthClientError {
  constructor() {
    super('Token has expired', 'TOKEN_EXPIRED')
  }
}
```

### Error Handling Patterns
```typescript
try {
  const result = await authClient.authenticateUser(email, password)
  return result
} catch (error) {
  if (error instanceof AuthenticationFailedError) {
    // Handle auth failure specifically
  } else if (error instanceof AccountLockedError) {
    // Handle locked account
  } else {
    // Handle unexpected errors
  }
}
```

## Implementation Patterns

### Client Interface Implementation
```typescript
@injectable()
export class AuthClient implements IAuthClient {
  constructor(
    @inject('UserService') private userService: IUserService,
    @inject('TokenService') private tokenService: ITokenService,
    @inject('PasswordService') private passwordService: IPasswordService
  ) {}

  async authenticateUser(email: string, password: string): Promise<AuthResult> {
    try {
      const user = await this.userService.findByEmail(email)
      if (!user) {
        throw new AuthenticationFailedError('Invalid credentials')
      }

      const isValid = await this.passwordService.verify(password, user.passwordHash)
      if (!isValid) {
        await this.recordLoginAttempt(user.id, false)
        throw new AuthenticationFailedError('Invalid credentials')
      }

      const tokens = await this.tokenService.generateTokenPair(user.id)
      await this.recordLoginAttempt(user.id, true)

      return {
        user: this.mapUserToProfile(user),
        tokens
      }
    } catch (error) {
      if (error instanceof AuthClientError) {
        throw error
      }
      throw new AuthClientError('Authentication failed', 'INTERNAL_ERROR')
    }
  }
}
```

### Dependency Injection Registration
```typescript
// Module container setup
container.register<IAuthClient>('AuthClient', AuthClient)
container.register<IUsersClient>('UsersClient', UsersClient)
container.register<IPostsClient>('PostsClient', PostsClient)
container.register<ISharedClient>('SharedClient', SharedClient)
```

### Usage in Other Modules
```typescript
// In posts resolver
@injectable()
export class PostResolver {
  constructor(
    @inject('AuthClient') private authClient: IAuthClient,
    @inject('UsersClient') private usersClient: IUsersClient,
    private postsService: PostsService
  ) {}

  async createPost(authorId: string, input: CreatePostInput): Promise<Post> {
    // Verify user exists and can create posts
    const userProfile = await this.usersClient.getUserProfile(authorId)
    if (!userProfile.canCreatePosts) {
      throw new PostPermissionError('User cannot create posts')
    }

    // Create the post
    return await this.postsService.createPost(authorId, input)
  }
}
```

## Benefits

### Decoupling
- Modules depend on interfaces, not implementations
- Internal module changes don't affect consumers
- Clear API contracts between modules
- Eliminates circular dependencies

### Testing
- Easy to mock client interfaces for unit tests
- Can test modules in complete isolation
- Predictable error scenarios for edge case testing
- Integration tests can use real implementations

### Maintainability
- Changes contained within module boundaries
- Interface evolution through versioning
- Clear documentation of inter-module dependencies
- Easier refactoring and optimization

### Type Safety
- Full TypeScript support across module boundaries
- Compile-time checking of method signatures
- Proper error type handling
- IntelliSense support for cross-module APIs

## Trade-offs

### Advantages
- Clean separation of concerns
- Excellent testability
- Type-safe inter-module communication
- Supports future microservices migration
- Clear API documentation

### Disadvantages
- Additional abstraction layer
- More interfaces to maintain
- Potential performance overhead
- Need to design stable APIs upfront
- More complex dependency injection setup

## Guidelines

### Interface Design
1. **Focused Scope**: Each interface should serve a specific business domain
2. **Stable APIs**: Design for long-term compatibility
3. **Rich Data**: Return enough data to avoid follow-up calls
4. **Async First**: All methods should return Promises
5. **Error Handling**: Use specific error types for different failure modes

### Method Design
```typescript
// Good: Rich return type, specific errors
async getUserProfile(userId: string): Promise<UserProfile>

// Avoid: Generic return type, unclear errors  
async getUser(id: string): Promise<any>
```

### Error Handling
1. Use module-specific error hierarchies
2. Provide meaningful error messages
3. Include error codes for programmatic handling
4. Log errors appropriately within modules

### Testing Strategy
1. Mock client interfaces in unit tests
2. Use real implementations in integration tests
3. Test error scenarios thoroughly
4. Verify interface contracts don't break

## Migration Strategy

### Phase 1: Interface Definition
- Define client interfaces for all modules
- Document method signatures and error types
- Create basic implementations

### Phase 2: Implementation
- Implement client interfaces using existing services
- Add dependency injection registration
- Create error type hierarchies

### Phase 3: Module Integration
- Replace direct imports with client interface usage
- Update resolvers and services to use clients
- Add comprehensive error handling

### Phase 4: Testing & Optimization
- Add thorough unit and integration tests
- Optimize client implementations for performance
- Document usage patterns and best practices

## Compliance

### Implementation Requirements
1. All inter-module functionality MUST go through client interfaces
2. Modules MUST NOT import other modules' internal implementations
3. Client interfaces MUST use module-specific error types
4. All client methods MUST be async and return Promises
5. Client interfaces MUST be registered in dependency injection container

### Interface Evolution
- Breaking changes require new interface versions
- Deprecated methods must be supported for transition periods
- Interface changes must be documented and communicated
- Backward compatibility should be maintained when possible

## Related Decisions
- [ADR-001: Modular Monolith Architecture](./001-modular-monolith-architecture.md)
- [ADR-002: Event-Driven Communication](./002-event-driven-communication.md)
- [ADR-003: Data Isolation Patterns](./003-data-isolation-patterns.md)

## References
- [Interface Segregation Principle](https://en.wikipedia.org/wiki/Interface_segregation_principle)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [API Design Guidelines](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design) 