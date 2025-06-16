# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run test                            # Run all tests
bun run test --run                      # Run tests once (CI mode)
bun test test/auth.test.ts              # Run specific test file
bun run test -t "test name"             # Run specific test by name
bun run test:ui                         # Run tests with UI
bun run test:coverage                   # Run tests with coverage

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate all types (Prisma + GraphQL)
bun run db:reset                        # Reset database with seed data
bunx prisma studio                      # Open database GUI

# Build & Production
bun run build                          # Build for production
bun run start                          # Start production server
bun run clean                          # Clean build directory

# Code Quality
bunx tsc --noEmit                      # Type check all files
bunx prettier --write .                # Format code
```

## Architecture Overview

### Tech Stack
- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **GraphQL Server**: Apollo Server 4 with Pothos schema builder
- **Database**: Prisma ORM with SQLite (dev.db)
- **Authentication**: JWT tokens with bcryptjs
- **Authorization**: GraphQL Shield middleware
- **Dependency Injection**: TSyringe with interface-based architecture
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities

### Clean Architecture with DDD

The codebase follows **Clean Architecture** principles with Domain-Driven Design:

```
src/
├── core/                           # Domain Layer (pure business logic)
│   ├── entities/                   # User, Post entities with business rules
│   ├── value-objects/              # Email, UserId, PostId value objects
│   ├── repositories/               # Repository interfaces (ports)
│   ├── services/                   # Domain service interfaces
│   └── errors/                     # Domain-specific errors
│
├── application/                    # Application Layer (use cases)
│   ├── use-cases/                  # Business operations
│   │   ├── auth/                   # LoginUseCase, SignupUseCase
│   │   ├── posts/                  # CreatePostUseCase, UpdatePostUseCase, etc.
│   │   └── users/                  # GetCurrentUserUseCase, SearchUsersUseCase
│   ├── dtos/                       # Data Transfer Objects
│   └── mappers/                    # Entity ↔ DTO conversion
│
├── infrastructure/                 # Infrastructure Layer
│   ├── database/                   # Prisma implementation
│   │   ├── client.ts               # DatabaseClient singleton
│   │   └── repositories/           # PrismaUserRepository, PrismaPostRepository
│   ├── auth/                       # JWT implementation
│   ├── graphql/                    # GraphQL infrastructure
│   │   └── resolvers/              # Clean architecture resolvers
│   └── config/                     # Configuration
│       ├── container.ts            # TSyringe DI container setup
│       └── configuration.ts        # Environment config with Zod validation
│
├── schema/                         # GraphQL Schema (Pothos)
│   ├── builder.ts                  # Pothos builder with Prisma & Relay plugins
│   ├── types/                      # GraphQL type definitions
│   ├── queries/                    # Query definitions
│   └── inputs.ts                   # Input types with advanced filtering
│
├── context/                        # GraphQL Context
│   ├── enhanced-context.ts         # Bridges legacy and clean architecture
│   ├── creation.ts                 # Context creation with auth handling
│   └── auth.ts                     # Authentication guards
│
├── permissions/                    # GraphQL Shield Authorization
│   ├── rules-clean.ts              # Permission rules
│   └── shield-config.ts            # Rule → operation mapping
│
├── gql/                            # Generated GraphQL operations (Tada)
│   ├── relay-mutations.ts          # Relay-style mutations
│   └── relay-queries.ts            # Relay-style queries
│
└── constants/                      # Centralized constants
    ├── config.ts                   # Configuration constants
    ├── context.ts                  # Context-related constants
    ├── graphql.ts                  # GraphQL constants
    └── validation.ts               # Validation limits and messages
```

### Critical Integration Points

1. **Dependency Injection Container** (`src/infrastructure/config/container.ts`):
   ```typescript
   // IMPORTANT: Uses shared Prisma instance from src/prisma.ts
   container.registerInstance<PrismaClient>('PrismaClient', prisma)
   ```

2. **Enhanced Context** (`src/context/enhanced-context.ts`):
   - Provides `ctx.prisma` for Pothos resolvers
   - Provides `ctx.useCases` for clean architecture patterns
   - Handles authentication with `ctx.userId` (UserId value object)

3. **ID Type Conversions**:
   - DTOs return string IDs: `"1"`, `"2"` (for client compatibility)
   - Prisma expects numeric IDs: `1`, `2`
   - **Always use `parseInt(dto.id, 10)` when passing DTO IDs to Prisma**

## Relay Implementation

### Global ID Format
- Base64 encoded: `Base64("Type:id")` 
- Example: `"UG9zdDox"` = `"Post:1"`

### Critical Query Pattern
```typescript
// ALWAYS spread query for Pothos optimizations
return ctx.prisma.post.findMany({
  ...query,  // <-- Critical for performance
  where: { id: { in: postIds } },
})
```

### ID Conversion Helpers
```typescript
// In resolvers
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
const numericId = parseGlobalId(args.id.toString(), 'Post')

// In tests
import { toPostId, extractNumericId } from './test/relay-utils'
const globalId = toPostId(1)  // 1 → "UG9zdDox"
```

## Testing Architecture

### Test Database Configuration
- Single shared SQLite database: `file:./test-db.db`
- Automatic cleanup between tests
- **Run tests with `--run` flag to avoid watch mode issues**

### Test Patterns
```typescript
// Create authenticated context with value object
const userId = UserId.create(1)
const context = createAuthContext(userId)

// Execute typed GraphQL operations
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/relay-mutations'

const data = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(LoginMutation),
  variables,
  context
)
```

## Error Handling

### Domain Error Hierarchy
- `BaseError` (400) - Base class
- `AuthenticationError` (401) - "You must be logged in..."
- `AuthorizationError` (403) - "You can only modify posts..."
- `ValidationError` (400) - Field-specific errors
- `NotFoundError` (404) - "Post with identifier 'X' not found"
- `ConflictError` (409) - "An account with this email already exists"

### Error Pattern
```typescript
try {
  // operation
} catch (error) {
  throw normalizeError(error)  // Converts to BaseError
}
```

## Permission System

### GraphQL Shield Rules
```typescript
export const isPostOwner = rule({ cache: 'strict' })(
  async (parent, args, context: EnhancedContext) => {
    try {
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id, 'Post')
      
      const post = await context.prisma.post.findUnique({
        where: { id: postId }
      })
      
      if (!post) throw new NotFoundError('Post', args.id)
      if (post.authorId !== userId.value) {
        throw new AuthorizationError(ERROR_MESSAGES.NOT_POST_OWNER)
      }
      
      return true
    } catch (error) {
      return handleRuleError(error)  // Never throw directly
    }
  }
)
```

## Common Development Patterns

### Using Use Cases in Resolvers
```typescript
builder.mutationField('createDraft', (t) =>
  t.prismaField({
    type: 'Post',
    resolve: async (query, parent, args, context) => {
      // Use clean architecture use case
      const postDto = await context.useCases.posts.create.execute({
        title: args.data.title,
        content: args.data.content,
        authorId: context.userId,
      })
      
      // Return Prisma object for field selection
      return context.prisma.post.findUniqueOrThrow({
        ...query,  // Spread for Pothos optimizations
        where: { id: parseInt(postDto.id, 10) },  // DTO ID conversion
      })
    },
  })
)
```

### Value Object Pattern
```typescript
const email = Email.create('user@example.com')  // Validates format
const userId = UserId.create(1)  // Ensures positive integer
userId.value  // 1
```

## Environment Variables

Required in `.env`:
```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-32-character-minimum-secret"  # Min 32 chars
JWT_EXPIRES_IN="7d"                            # String format
NODE_ENV="development"
PORT="4000"
BCRYPT_ROUNDS="10"
LOG_LEVEL="info"
```

## Common Pitfalls & Solutions

1. **ID Type Mismatch**: 
   - Problem: DTOs use string IDs, Prisma uses numeric
   - Solution: Always `parseInt(dto.id, 10)`

2. **Missing Query Spread**:
   - Problem: Pothos field selection doesn't work
   - Solution: Always spread `...query` in Prisma calls

3. **Context Type Confusion**:
   - Problem: Wrong context type in resolvers
   - Solution: Use `EnhancedContext`, not base `Context`

4. **Permission Errors**:
   - Problem: Rules throwing instead of returning errors
   - Solution: Use `handleRuleError()` in catch blocks

5. **JWT Configuration**:
   - Problem: JWT library expects string for expiresIn
   - Solution: Ensure JWT_EXPIRES_IN is string format

## API Endpoints

- **GraphQL Playground**: http://localhost:4000
- **GraphQL Endpoint**: POST http://localhost:4000/graphql

## File Naming Conventions

- **Files**: kebab-case (`create-post.use-case.ts`)
- **Classes**: PascalCase with suffix (`CreatePostUseCase`)
- **Functions**: camelCase with verb-noun (`createUser`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PASSWORD_LENGTH`)
- **Interfaces**: PascalCase (`IUserRepository`)