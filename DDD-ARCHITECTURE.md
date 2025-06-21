# Domain-Driven Design Architecture Guide

## Overview

This project demonstrates a modern implementation of Domain-Driven Design (DDD) principles in a GraphQL API built with TypeScript, Bun, and Prisma. The architecture features three distinct modules (Auth, Posts, Users) that showcase different approaches to DDD implementation while maintaining clean separation of concerns.

## 🏗️ Architecture Patterns

### 1. Modular DDD Architecture

The project implements a **modular DDD architecture** where each business domain is organized as a self-contained module:

```
src/modules/
├── auth/           # Authentication & Authorization
├── posts/          # Content Management
├── users/          # User Profile Management
└── shared/         # Shared Kernel
```

### 2. Clean Architecture Layers

Each module follows the **Clean Architecture** pattern with four distinct layers:

```
src/modules/{domain}/
├── domain/         # Core Business Logic
├── application/    # Use Cases & DTOs
├── infrastructure/ # External Concerns
└── presentation/   # API Layer
```

#### **Domain Layer** (Innermost)
- **Entities**: Core business objects with identity
- **Value Objects**: Immutable objects representing concepts
- **Domain Services**: Business logic that doesn't belong to entities
- **Repository Interfaces**: Data access contracts
- **Domain Events**: Business events (future implementation)

#### **Application Layer**
- **Use Cases**: Orchestrate business operations
- **DTOs**: Data transfer objects for boundaries
- **Application Services**: Coordinate external systems

#### **Infrastructure Layer**
- **Repositories**: Data persistence implementations
- **Mappers**: Domain ↔ Persistence mapping
- **External Service Adapters**: Third-party integrations

#### **Presentation Layer**
- **GraphQL Resolvers**: API endpoints
- **Input Validation**: Request validation
- **Authentication Guards**: Access control

## 📚 Module Examples

### 1. Auth Module (Legacy + DDD Hybrid)

**Pattern**: BaseModule with manual DI registration

```typescript
// src/modules/auth/config/auth.module.ts
export class AuthModule extends BaseModule {
  register(): void {
    // Manual dependency registration
    this.container.register<IUserRepository>('IUserRepository', {
      useClass: PrismaUserRepository,
    });
  }
}
```

**Key Features:**
- User registration and authentication
- JWT token management
- Password hashing with argon2
- Email verification system

### 2. Posts Module (Legacy + DDD Hybrid)

**Pattern**: BaseModule with factory-based registration

```typescript
// src/modules/posts/config/posts.module.ts
export class PostsModule extends BaseModule {
  register(): void {
    this.container.register<CreatePostUseCase>(CreatePostUseCase, {
      useFactory: (c) => new CreatePostUseCase(
        c.resolve<IPostRepository>('IPostRepository'),
        c.resolve<IPostAuthorizationService>('IPostAuthorizationService'),
      ),
    });
  }
}
```

**Key Features:**
- CRUD operations for blog posts
- Author-based authorization
- Content publishing workflow
- Post search and filtering

### 3. Users Module (Pure DDD)

**Pattern**: Modern Module interface with automatic DI

```typescript
// src/modules/users/users.module.ts
export class UsersModule implements Module {
  async initialize(): Promise<void> {
    // Automatic dependency injection
    container.registerSingleton('IUserProfileRepository', PrismaUserProfileRepository);
    container.registerSingleton(GetUserProfileUseCase);
  }
}
```

**Key Features:**
- User profile management
- Privacy controls
- Profile search and discovery
- Cross-module authorization

## 🔧 Implementation Patterns

### 1. Entity Design Pattern

Entities represent core business concepts with identity and behavior:

```typescript
export class User extends Entity<UserId> {
  private props: UserProps;

  // Factory method for creation
  static create(props: CreateUserProps): User {
    // Business validation
    if (!props.email || props.email.length === 0) {
      throw new InvalidUserDataError('email', 'Email cannot be empty');
    }
    
    return new User(UserId.createTransient(), {
      email: props.email,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Business methods
  verifyEmail(): void {
    this.props.emailVerified = true;
    this.props.updatedAt = new Date();
  }

  canBeEditedBy(userId: UserId): boolean {
    return this.id.equals(userId);
  }
}
```

### 2. Value Object Pattern

Value objects encapsulate concepts without identity:

```typescript
export class Email extends ValueObject<string> {
  private constructor(email: string) {
    super(email);
  }

  static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new DomainError('Invalid email format');
    }
    return new Email(email.toLowerCase().trim());
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get value(): string {
    return this.props;
  }
}
```

### 3. Use Case Pattern

Use cases orchestrate business operations:

```typescript
@injectable()
export class CreatePostUseCase implements IUseCase<CreatePostRequest, PostResponseDto> {
  constructor(
    @inject('IPostRepository')
    private readonly postRepository: PrismaPostRepository,
    @inject('IPostAuthorizationService')
    private readonly authService: PostAuthorizationService
  ) {}

  async execute(request: CreatePostRequest): Promise<PostResponseDto> {
    // 1. Validate input
    const authorId = UserId.create(request.authorId);
    
    // 2. Check authorization
    this.authService.requireCreatePermission(authorId);
    
    // 3. Create domain entity
    const post = Post.create({
      title: request.title,
      content: request.content,
      authorId,
    });
    
    // 4. Persist
    const savedPost = await this.postRepository.save(post);
    
    // 5. Return DTO
    return PostMapper.toResponseDto(savedPost);
  }
}
```

### 4. Repository Pattern

Repositories abstract data access:

```typescript
export interface IPostRepository extends IRepository<Post, PostId> {
  findByAuthor(authorId: UserId): Promise<Post[]>;
  findPublished(limit?: number): Promise<Post[]>;
  search(query: string): Promise<Post[]>;
}

@injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async save(post: Post): Promise<Post> {
    const data = PostMapper.toPersistence(post);
    
    if (post.id.isTransient()) {
      const created = await this.prisma.post.create({ data });
      return PostMapper.toDomain(created);
    }
    
    const updated = await this.prisma.post.update({
      where: { id: post.id.value },
      data,
    });
    return PostMapper.toDomain(updated);
  }
}
```

### 5. Domain Service Pattern

Domain services contain business logic that doesn't belong to entities:

```typescript
export class PostAuthorizationService {
  static canEditPost(post: Post, editorId: UserId): boolean {
    return post.isOwnedBy(editorId);
  }

  static requireEditPermission(post: Post, editorId: UserId): void {
    if (!this.canEditPost(post, editorId)) {
      throw new AuthorizationError('Cannot edit this post');
    }
  }

  static filterViewablePosts(posts: Post[], viewerId: UserId | null): Post[] {
    return posts.filter(post => post.canBeViewedBy(viewerId));
  }
}
```

## 🔄 Cross-Module Integration

### 1. Shared Kernel

Common elements shared across modules:

```typescript
// src/shared/domain/base-classes/
├── entity.base.ts          # Base entity class
├── value-object.base.ts    # Base value object class
└── module.base.ts          # Base module class

// src/shared/application/interfaces/
├── use-case.interface.ts   # Use case contract
├── repository.interface.ts # Repository contract
└── module.interface.ts     # Module contract
```

### 2. Dependency Injection

All modules share the same DI container:

```typescript
// Shared dependencies
container.registerInstance('PrismaClient', prisma);
container.registerInstance('ILogger', logger);

// Module-specific dependencies
authModule.register();      // Auth module registration
postsModule.register();     // Posts module registration
await usersModule.initialize(); // Users module registration
```

### 3. ID Consistency

Cross-module references use consistent ID types:

```typescript
// Auth module creates user
const user = await signUpUseCase.execute({
  email: 'user@example.com',
  password: 'secure123',
});

// Posts module uses the user ID
const post = await createPostUseCase.execute({
  title: 'My Post',
  authorId: parseInt(user.id, 10), // Convert string to number
});

// Users module manages the profile
const profile = await getUserProfileUseCase.execute({
  userId: user.id, // Use as string
});
```

## 🛡️ Error Handling Strategy

### 1. Domain Error Hierarchy

```typescript
// Base domain error
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

// Specific domain errors
export class InvalidPostDataError extends DomainError {
  constructor(field: string, message: string) {
    super(`Invalid ${field}: ${message}`);
    this.name = 'InvalidPostDataError';
  }
}

export class PostNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`Post not found: ${identifier}`);
    this.name = 'PostNotFoundError';
  }
}
```

### 2. Error Normalization

```typescript
// src/errors/handlers.ts
export function normalizeError(error: unknown): Error {
  if (error instanceof BaseError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new UnknownError(error.message);
  }
  
  return new UnknownError('An unknown error occurred');
}

// Usage in resolvers
builder.mutationField('createPost', (t) =>
  t.field({
    type: Post,
    resolve: async (parent, args, context) => {
      try {
        return await createPostUseCase.execute(args);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  })
);
```

## 🧪 Testing Strategy

### 1. Unit Tests

Test individual components in isolation:

```typescript
describe('Post Entity', () => {
  it('should create a valid post', () => {
    const post = Post.create({
      title: 'Test Post',
      content: 'Test content',
      authorId: UserId.create(1),
    });
    
    expect(post.title).toBe('Test Post');
    expect(post.published).toBe(false);
  });

  it('should validate title length', () => {
    expect(() => Post.create({
      title: '', // Invalid
      authorId: UserId.create(1),
    })).toThrow(InvalidPostDataError);
  });
});
```

### 2. Integration Tests

Test module interactions:

```typescript
describe('Cross-Module Integration', () => {
  it('should create user and post together', async () => {
    // Create user via Auth module
    const user = await signUpUseCase.execute({
      email: 'test@example.com',
      password: 'secure123',
    });

    // Create post via Posts module
    const post = await createPostUseCase.execute({
      title: 'Integration Test',
      authorId: parseInt(user.id, 10),
    });

    // Verify via Users module
    const profile = await getUserProfileUseCase.execute({
      userId: user.id,
    });

    expect(profile.email).toBe('test@example.com');
    expect(post.authorId.value).toBe(parseInt(user.id, 10));
  });
});
```

## 📝 Best Practices

### 1. Domain Modeling

- **Rich Models**: Entities contain business logic, not just data
- **Immutable Value Objects**: Value objects are immutable and self-validating
- **Expressive APIs**: Method names express business intent
- **Domain Language**: Use ubiquitous language throughout the codebase

### 2. Dependency Management

- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Single Responsibility**: Each class has one reason to change
- **Composition over Inheritance**: Favor composition when possible

### 3. Data Flow

- **Inside-Out**: Domain drives the architecture
- **Unidirectional**: Data flows from presentation to domain to infrastructure
- **Boundary Isolation**: Clear boundaries between layers
- **DTO Mapping**: Explicit mapping at boundaries

### 4. Evolution Strategy

- **Gradual Migration**: Migrate modules one at a time
- **Parallel Implementation**: Run old and new systems side by side
- **Feature Flags**: Toggle between implementations
- **Incremental Refactoring**: Small, safe changes

## 🔄 Migration Guide

### From Legacy to DDD

1. **Identify Bounded Contexts**: Group related functionality
2. **Extract Domain Logic**: Move business rules to entities
3. **Introduce Use Cases**: Replace service methods with use cases
4. **Implement Repositories**: Abstract data access
5. **Add Domain Events**: Enable loose coupling (future)

### Module Migration Checklist

- [ ] Create module directory structure
- [ ] Identify domain entities and value objects
- [ ] Extract business logic from services
- [ ] Implement repository interfaces
- [ ] Create use cases for business operations
- [ ] Add presentation layer with GraphQL resolvers
- [ ] Set up dependency injection
- [ ] Write comprehensive tests
- [ ] Update documentation

## 🚀 Performance Considerations

### 1. Query Optimization

- Use Prisma's `query` spreading for optimal database queries
- Implement DataLoader for N+1 prevention
- Add database indexes for frequently queried fields

### 2. Caching Strategy

- Cache computed domain values
- Use Redis for session and temporary data
- Implement query result caching

### 3. Scalability

- Modules can be deployed independently
- Database can be sharded by domain
- Use event sourcing for audit trails

## 🔮 Future Enhancements

### 1. Event-Driven Architecture

```typescript
// Domain events
export class PostCreatedEvent extends DomainEvent {
  constructor(public readonly post: Post) {
    super();
  }
}

// Event handlers
@EventHandler(PostCreatedEvent)
export class PostCreatedHandler {
  async handle(event: PostCreatedEvent): Promise<void> {
    // Update search index
    // Send notifications
    // Update analytics
  }
}
```

### 2. CQRS Implementation

```typescript
// Command model
export class CreatePostCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: number
  ) {}
}

// Query model
export class PostQueryModel {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly authorName: string,
    public readonly publishedAt: Date
  ) {}
}
```

### 3. Microservices Evolution

Each module can become an independent service:

```
Auth Service    ←→ API Gateway ←→ Client
Posts Service   ←→     ↕      
Users Service   ←→ Event Bus
```

## 📊 Metrics and Monitoring

### 1. Business Metrics

- User registration rate
- Post creation frequency
- Profile completion percentage

### 2. Technical Metrics

- Use case execution time
- Repository performance
- Error rates by domain

### 3. Domain Insights

- Most used features per module
- Cross-module interaction patterns
- Domain model evolution over time

---

This architecture provides a solid foundation for building scalable, maintainable applications using Domain-Driven Design principles. The modular approach allows for independent development and deployment while maintaining consistency through shared patterns and interfaces.