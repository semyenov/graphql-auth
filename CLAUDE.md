# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run test                            # Run all tests (watch mode)
bun run test --run                      # Run tests once (CI mode)
bun test test/auth.test.ts              # Run specific test file
bun run test -t "should create user"    # Run test by pattern
bun run test:ui                         # Run tests with UI
bun run test:coverage                   # Run tests with coverage

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate all types (Prisma + GraphQL)
bun run db:reset                        # Reset database with seed data
bunx prisma studio                      # Open database GUI
bun run seed                            # Run seed script manually

# Build & Production
bun run build                          # Build for production
bun run start                          # Start production server
bun run clean                          # Clean build directory

# Code Quality
bunx tsc --noEmit                      # Type check all files
bunx prettier --write .                # Format code
bun run gen:schema                     # Generate GraphQL schema file
bun run env:verify                     # Verify environment variables
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
- **Testing**: Vitest with single-threaded execution for SQLite

### Clean Architecture with DDD

The codebase follows **Clean Architecture** principles with Domain-Driven Design:

```
src/
├── core/                           # Domain Layer (pure business logic)
│   ├── entities/                   # User, Post entities
│   ├── value-objects/              # Email, UserId, PostId immutable objects
│   ├── repositories/               # Repository interfaces (IUserRepository, IPostRepository)
│   ├── services/                   # Domain service interfaces (IAuthService, IPasswordService)
│   └── errors/                     # Domain-specific errors (EntityNotFoundError, etc.)
│
├── application/                    # Application Layer (use cases)
│   ├── use-cases/                  # Business operations
│   │   ├── auth/                   # LoginUseCase, SignupUseCase
│   │   ├── posts/                  # CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase
│   │   └── users/                  # GetCurrentUserUseCase, SearchUsersUseCase
│   ├── dtos/                       # Data Transfer Objects (UserDto, PostDto)
│   └── mappers/                    # Entity ↔ DTO conversion
│
├── infrastructure/                 # Infrastructure Layer
│   ├── database/                   # Prisma implementation
│   │   ├── client.ts               # DatabaseClient singleton
│   │   └── repositories/           # PrismaUserRepository, PrismaPostRepository
│   ├── auth/                       # JWT implementation
│   │   ├── jwt-auth.service.ts    # IAuthService implementation
│   │   ├── jwt-token.service.ts   # ITokenService implementation
│   │   └── bcrypt-password.service.ts # IPasswordService implementation
│   ├── graphql/                    # GraphQL infrastructure
│   │   └── resolvers/              # GraphQL resolvers (auth, posts, users)
│   ├── config/                     # Configuration
│   │   ├── container.ts            # TSyringe DI container setup
│   │   └── configuration.ts        # Environment config with Zod validation
│   └── logging/                    # Logger implementations
│
├── schema/                         # GraphQL Schema (Pothos)
│   ├── builder.ts                  # Pothos builder with Prisma & Relay plugins
│   ├── types/                      # GraphQL type definitions (user.ts, post.ts)
│   ├── inputs.ts                   # Input types with advanced filtering
│   ├── scalars.ts                  # Custom scalars (DateTime, DID, UUID)
│   ├── enums.ts                    # GraphQL enums (SortOrder)
│   └── utils/                      # Filter transformation utilities
│
├── context/                        # GraphQL Context
│   ├── enhanced-context.ts         # Provides useCases and prisma to resolvers
│   ├── creation.ts                 # Context creation with auth handling
│   └── auth.ts                     # Authentication guards
│
├── permissions/                    # GraphQL Shield Authorization
│   ├── rules-clean.ts              # Permission rules (isAuthenticatedUser, isPostOwner)
│   ├── shield-config.ts            # Rule → operation mapping
│   └── rule-utils-clean.ts         # Rule helper functions
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

1. **Enhanced Context Bridge** (`src/context/enhanced-context.ts`):
   ```typescript
   interface EnhancedContext extends Context {
     prisma: PrismaClient         // For Pothos resolvers
     useCases: {                  // For clean architecture
       auth: { login, signup }
       posts: { create, update, delete, get, getFeed }
       users: { getCurrentUser, searchUsers }
     }
   }
   ```

2. **Dependency Injection Container** (`src/infrastructure/config/container.ts`):
   - Registers all interfaces with their implementations
   - Uses shared Prisma instance from `src/prisma.ts` for test compatibility
   - Must call `configureContainer()` before resolving dependencies

3. **Value Objects vs DTOs**:
   - **Value Objects**: Immutable, validated domain objects (UserId, Email, PostId)
   - **DTOs**: Plain objects for data transfer with string IDs for client compatibility
   - **Conversion**: Always `parseInt(dto.id, 10)` when passing to Prisma

## Relay Specification Implementation

### Global ID System
```typescript
// Format: Base64("Type:id")
"UG9zdDox" = Base64("Post:1") = Post with ID 1
"VXNlcjoy" = Base64("User:2") = User with ID 2
```

### ID Conversion Patterns
```typescript
// In resolvers - use shared helpers
import { parseGlobalId, encodeGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
const numericId = parseGlobalId(args.id.toString(), 'Post')  // "UG9zdDox" → 1
const globalId = encodeGlobalId('Post', 1)  // 1 → "UG9zdDox"

// In tests - use test utilities
import { toPostId, toUserId, extractNumericId } from './test/relay-utils'
const globalId = toPostId(1)  // 1 → "UG9zdDox"
const numericId = extractNumericId(globalId)  // "UG9zdDox" → 1
```

### Pothos Relay Pattern
```typescript
// CRITICAL: Always spread query for field selection optimization
return ctx.prisma.post.findMany({
  ...query,  // <-- This enables Pothos to optimize field selection
  where: { published: true },
})
```

## GraphQL Operations

All GraphQL operations are implemented in clean architecture resolvers:

### Queries
- `me` - Get current authenticated user
- `user(id)` - Get user by ID
- `users(where, orderBy)` - Get all users with filtering
- `searchUsers(search)` - Search users by name/email
- `post(id)` - Get post by ID  
- `feed(searchString, where, orderBy)` - Get published posts
- `drafts(userId?)` - Get user's drafts (defaults to current user)

### Mutations
- `signup(email, password, name)` - Create account
- `login(email, password)` - Authenticate
- `createDraft(data)` - Create draft post
- `updatePost(id, title?, content?, published?)` - Update post
- `deletePost(id)` - Delete post
- `togglePublishPost(id)` - Toggle publication status
- `incrementPostViewCount(id)` - Increment view count

## Testing Architecture

### Test Configuration (vitest.config.ts)
- **Single-threaded execution**: Required for SQLite with shared cache
- **Sequential test runs**: Prevents database conflicts
- **Shared test database**: `file:./test-db.db` with automatic cleanup

### Test Context Patterns
```typescript
// Create contexts with value objects, not raw IDs
const userId = UserId.create(1)
const context = createAuthContext(userId)  // Authenticated
const context = createMockContext()        // Unauthenticated

// Use typed GraphQL operations from src/gql/
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/relay-mutations'
const data = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(LoginMutation),
  variables,
  context
)
```

## Error Handling Architecture

### Domain Error Hierarchy
```
BaseError (abstract)
├── EntityNotFoundError → 404
├── UnauthorizedError → 401
├── ForbiddenError → 403
├── BusinessRuleViolationError → 400
└── ValidationError → 400
```

### Error Normalization Flow
```typescript
Domain Error → normalizeError() → GraphQL Error → formatError() → Client
```

### Permission Error Pattern
```typescript
// In GraphQL Shield rules - never throw, always return
try {
  // validation logic
  return true
} catch (error) {
  return handleRuleError(error)  // Converts to proper GraphQL error
}
```

## GraphQL Shield Permission System

### Permission Configuration (`src/permissions/shield-config.ts`)
```typescript
Query: {
  me: isAuthenticatedUser,
  users: isAdmin,
  user: isPublic,
  feed: isPublic,
  post: isPublic,
  drafts: isAuthenticatedUser,
}
Mutation: {
  login: isPublic,
  signup: rateLimitSensitiveOperations,
  createDraft: canCreateDraft,
  updatePost: isPostOwner,
  deletePost: isPostOwner,
  togglePublishPost: isPostOwner,
  incrementPostViewCount: isPublic,
}
```

### Rule Caching Strategies
- `'strict'`: Cache per parent/args/context (most performant)
- `'contextual'`: Cache per context
- `'no_cache'`: No caching (for dynamic rules)

## Advanced Filtering System

### Filter Input Types
- `StringFilter`: equals, contains, startsWith, endsWith, not
- `IntFilter`: equals, not, lt, lte, gt, gte
- `BooleanFilter`: equals, not
- `DateTimeFilter`: equals, not, lt, lte, gt, gte
- Logical operators: AND, OR, NOT for complex queries

### Filter Transformation
```typescript
// GraphQL input → Prisma where clause
import { transformPostWhereInput } from '../utils/filter-transform'
const where = transformPostWhereInput(args.where) || { published: true }
```

## Environment Configuration

### Required Environment Variables
```bash
DATABASE_URL="file:./dev.db"              # SQLite database path
JWT_SECRET="min-32-characters-required"   # JWT signing secret
JWT_EXPIRES_IN="7d"                       # Token expiration (string format!)
APP_SECRET="legacy-secret"                # Legacy auth secret
NODE_ENV="development"                    # development|production|test
PORT="4000"                               # Server port
BCRYPT_ROUNDS="10"                        # Password hashing rounds
LOG_LEVEL="info"                          # error|warn|info|debug
```

### Configuration Validation
- Uses Zod for runtime validation
- Validates on startup via `src/infrastructure/config/configuration.ts`
- Run `bun run env:verify` to check configuration

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

## Common Pitfalls & Solutions

1. **DTO ID String vs Prisma Numeric**:
   ```typescript
   // ❌ Wrong - Prisma expects number
   where: { id: postDto.id }
   
   // ✅ Correct - Convert string to number
   where: { id: parseInt(postDto.id, 10) }
   ```

2. **Missing Pothos Query Spread**:
   ```typescript
   // ❌ Wrong - No field selection optimization
   return ctx.prisma.post.findMany({ where })
   
   // ✅ Correct - Enables field selection
   return ctx.prisma.post.findMany({ ...query, where })
   ```

3. **Direct Repository Access in Resolvers**:
   ```typescript
   // ❌ Wrong - Bypasses business logic
   const user = await ctx.prisma.user.findUnique(...)
   
   // ✅ Correct - Use use cases
   const userDto = await ctx.useCases.users.getCurrentUser.execute(...)
   ```

4. **Value Object Creation**:
   ```typescript
   // ❌ Wrong - No validation
   const userId = { value: 1 }
   
   // ✅ Correct - Validated value object
   const userId = UserId.create(1)
   ```

5. **Test Database Conflicts**:
   ```bash
   # ❌ Wrong - Parallel tests conflict
   bun run test
   
   # ✅ Correct - Sequential execution
   bun run test --run
   ```

## Performance Considerations

1. **Prisma Query Optimization**:
   - Use `select` for field selection
   - Leverage `include` for eager loading
   - Avoid N+1 queries with proper includes

2. **GraphQL Relay Connections**:
   - `totalCount` can be expensive on large datasets
   - Use cursor-based pagination for scalability
   - Enable `filterConnectionTotalCount` in Pothos

3. **Caching Strategy**:
   - GraphQL Shield rules are cached based on strategy
   - DatabaseClient uses singleton pattern
   - Consider implementing DataLoader for batch loading

## API Endpoints

- **GraphQL Playground**: http://localhost:4000
- **GraphQL Endpoint**: POST http://localhost:4000/graphql

## File Naming Conventions

- **Files**: kebab-case (`create-post.use-case.ts`)
- **Classes**: PascalCase with suffix (`CreatePostUseCase`)
- **Functions**: camelCase with verb-noun (`createUser`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PASSWORD_LENGTH`)
- **Interfaces**: PascalCase (`IUserRepository`)