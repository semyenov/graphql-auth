# Clean Architecture Implementation Guide

This document describes the new clean architecture implementation for the GraphQL Auth project.

## Architecture Overview

The project now follows Clean Architecture principles with clear separation of concerns:

```
src/
├── core/                      # Domain Layer (Business Logic)
│   ├── entities/             # Domain entities (User, Post)
│   ├── value-objects/        # Value objects (Email, UserId, PostId)
│   ├── repositories/         # Repository interfaces (ports)
│   ├── services/             # Domain services
│   └── errors/               # Domain-specific errors
│
├── application/              # Application Layer (Use Cases)
│   ├── use-cases/           # Business use cases
│   │   ├── auth/           # Authentication use cases
│   │   └── posts/          # Post-related use cases
│   ├── dtos/               # Data Transfer Objects
│   └── mappers/            # Entity-DTO mappers
│
├── infrastructure/          # Infrastructure Layer (External Concerns)
│   ├── database/           # Database implementation
│   │   └── repositories/   # Prisma repository implementations
│   ├── auth/              # Authentication implementation (JWT)
│   ├── graphql/           # GraphQL infrastructure
│   │   ├── context/       # GraphQL context
│   │   ├── resolvers/     # GraphQL resolvers
│   │   ├── schema/        # Schema builder
│   │   ├── types/         # GraphQL types
│   │   └── errors/        # Error handling
│   └── config/            # Configuration & DI container
│
└── main.ts                # Application entry point
```

## Key Concepts

### 1. Domain Layer (Core)

The domain layer contains the business logic and is completely independent of external frameworks:

- **Entities**: Core business objects with behavior (User, Post)
- **Value Objects**: Immutable objects representing values (Email, UserId)
- **Repository Interfaces**: Contracts for data access
- **Domain Services**: Business logic that doesn't fit in entities
- **Domain Errors**: Business-specific error types

### 2. Application Layer

Contains use cases that orchestrate the domain logic:

- **Use Cases**: Single-responsibility classes for each business operation
- **DTOs**: Data structures for transferring data between layers
- **Mappers**: Convert between domain entities and DTOs

### 3. Infrastructure Layer

Implements external concerns and adapters:

- **Repository Implementations**: Prisma-based implementations
- **Authentication Service**: JWT implementation
- **GraphQL Integration**: Resolvers, context, and schema
- **Configuration**: Environment config and DI container

## Dependency Injection

The project uses TSyringe for dependency injection:

```typescript
// Container configuration
container.register<IUserRepository>('IUserRepository', {
  useClass: PrismaUserRepository,
})

// Use case with injected dependencies
@injectable()
export class LoginUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IAuthService') private authService: IAuthService,
  ) {}
}
```

## GraphQL Integration

GraphQL resolvers use the clean architecture:

```typescript
builder.mutationField('login', (t) =>
  t.string({
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      const result = await context.useCases.auth.login.execute({
        email: args.email,
        password: args.password,
      })
      return result.token
    },
  })
)
```

## Error Handling

Domain errors are automatically converted to appropriate GraphQL errors:

- `EntityNotFoundError` → 404 NOT_FOUND
- `UnauthorizedError` → 401 UNAUTHENTICATED
- `ForbiddenError` → 403 FORBIDDEN
- `BusinessRuleViolationError` → 400 BUSINESS_RULE_VIOLATION
- `ValidationError` → 400 VALIDATION_ERROR

## Configuration

Environment variables are validated using Zod:

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  // ... other config
})
```

## Benefits

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Easy to swap implementations (e.g., switch from Prisma to another ORM)
4. **Type Safety**: Full TypeScript support with proper types
5. **Business Logic Protection**: Core domain is framework-agnostic

## Migration from Old Structure

To use the new clean architecture:

1. **Resolvers**: Use context.useCases instead of direct repository/service calls
2. **Authentication**: Use IAuthService interface instead of concrete implementation
3. **Data Access**: Use repository interfaces instead of Prisma directly
4. **Error Handling**: Throw domain errors, they'll be converted automatically

## Running the Application

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

The clean architecture provides better separation of concerns, improved testability, and makes the codebase more maintainable and scalable.