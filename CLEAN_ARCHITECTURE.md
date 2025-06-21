# Architecture Evolution: From Clean Architecture to Direct Resolvers

This document describes the architectural evolution of the GraphQL Auth project from Clean Architecture to the current modular direct resolver pattern.

## Current Architecture (Direct Resolvers)

The project has migrated from Clean Architecture to a simpler, more performant direct resolver pattern:

```
src/
├── app/                              # Application entry and configuration
│   ├── server.ts                     # Main server setup (entry point)
│   ├── config/                       # Configuration
│   │   ├── container.ts              # TSyringe DI container setup
│   │   ├── environment.ts            # Environment variable handling
│   │   └── database.ts               # Database configuration
│   └── middleware/                   # Application-level middleware
│
├── modules/                          # Feature modules (domain-driven)
│   ├── auth/                         # Authentication module
│   │   ├── auth.schema.ts            # GraphQL schema definitions
│   │   ├── auth.permissions.ts       # Authorization rules
│   │   ├── auth.validation.ts        # Input validation schemas
│   │   ├── resolvers/                # GraphQL resolvers
│   │   ├── services/                 # Business logic services
│   │   └── types/                    # Module-specific types
│   ├── posts/                        # Posts module
│   ├── users/                        # Users module
│   └── shared/                       # Shared module utilities
│
├── graphql/                          # GraphQL infrastructure
│   ├── schema/                       # Schema building and assembly
│   ├── context/                      # GraphQL context
│   ├── directives/                   # Custom GraphQL directives
│   └── middleware/                   # GraphQL-specific middleware
│
├── core/                             # Core business logic and utilities
│   ├── auth/                         # Authentication core
│   ├── errors/                       # Error handling system
│   ├── logging/                      # Logging system
│   ├── utils/                        # Core utilities
│   └── validation/                   # Validation system
│
├── data/                             # Data access layer
│   ├── database/                     # Database configuration
│   ├── loaders/                      # DataLoader implementations
│   ├── repositories/                 # Repository pattern
│   └── cache/                        # Caching layer
│
├── gql/                              # GraphQL client operations (for testing)
├── types/                            # Global type definitions
├── constants/                        # Application constants
├── main.ts                           # Build entry point
└── prisma.ts                         # Prisma client export
```

## Migration Benefits

### Why We Moved Away from Clean Architecture

1. **Performance**: Direct Prisma access eliminates repository abstraction overhead
2. **Simplicity**: Fewer layers mean easier understanding and maintenance
3. **Type Safety**: End-to-end type safety without complex mappers
4. **Developer Experience**: Faster development with direct patterns
5. **Modern Standards**: Following current GraphQL and Pothos best practices

### What Was Removed

- ❌ Use case layer (complex orchestration)
- ❌ Repository abstractions (unnecessary with Prisma)
- ❌ DTOs and mappers (Prisma types work directly)
- ❌ Complex dependency injection patterns
- ❌ Over-engineered domain services

### What Was Kept

- ✅ Clear separation of concerns through modules
- ✅ Domain entities and value objects where needed
- ✅ Error handling and validation
- ✅ Business logic (now in resolvers)
- ✅ Clean interfaces and contracts

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