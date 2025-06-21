# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run test --run                      # Run all tests once (no watch)
bun run test                            # Run tests in watch mode
bun test test/auth.test.ts              # Run specific test file
bun run test -t "test name"             # Run tests matching pattern
bun run test:ui                         # Run tests with UI
bun run test:coverage                   # Run tests with coverage

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate all types (Prisma + GraphQL)
bun run db:reset                        # Reset database with seed data
bunx prisma studio                      # Open database GUI

# Build & Production
bun run build                          # Build for production (builds src/main.ts)
bun run start                          # Start production server (runs dist/app/server.js)
bun run clean                          # Clean build directory

# Code Quality
bunx tsc --noEmit                      # Type check all files
bun run lint                          # Run Biome linter
bun run lint:fix                      # Auto-fix linting issues
bun run format                        # Check formatting
bun run format:fix                    # Auto-fix formatting
bun run check                         # Run all Biome checks
bun run check:fix                     # Auto-fix all issues
bun run check:fix --unsafe             # Apply unsafe fixes (for any types, etc.)

# GraphQL Schema
bun run gen:schema                      # Generate GraphQL schema file
bunx gql.tada generate-output           # Generate GraphQL type definitions
bun run generate:gql                    # Alternative GraphQL type generation

# Environment & Debugging
bun run env:verify                      # Verify environment setup
bun run seed                            # Manually seed database
```

## Architecture Overview

This project follows a **Modular Monolith** architecture with **Direct Pothos Resolvers** pattern. The architecture is documented through Architecture Decision Records (ADRs):

- **[ADR-001](docs/adr/001-modular-direct-resolvers.md)**: Direct resolvers with business logic, complex logic extracted to services
- **[ADR-002](docs/adr/002-dual-authorization-system.md)**: Pothos Scope Auth + GraphQL Shield for flexible permissions  
- **[ADR-003](docs/adr/003-direct-prisma-access.md)**: Import Prisma directly, never through context

### Tech Stack

- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **GraphQL**: Apollo Server 4 with Pothos schema builder (7 plugins)
- **Database**: Prisma ORM with SQLite (PostgreSQL-ready)
- **Authentication**: JWT with argon2 + refresh token rotation
- **Authorization**: Dual system - Pothos Scope Auth + GraphQL Shield
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities
- **DI Container**: TSyringe for service management
- **Code Quality**: Biome for linting and formatting

## Critical Architectural Patterns

### 1. Direct Prisma Access (ADR-003)

**NEVER** include Prisma in GraphQL context. Always import directly:

```typescript
// ✅ CORRECT
import { prisma } from '../../../prisma'

// ❌ WRONG - Never do this
const prisma = context.prisma
```

### 2. Pothos Resolver Pattern

**CRITICAL**: Always spread the `query` parameter first for Prisma optimizations:

```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],     // Pothos auth
    shield: isPostOwner,                // Shield rule
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      
      return prisma.post.create({
        ...query, // ⚠️ CRITICAL: Always spread query first
        data: {
          title: args.title,
          authorId: userId.value,
        },
      })
    },
  }),
)
```

### 3. Dual Authorization (ADR-002)

- **Pothos Scope Auth**: Basic authentication/role checks (`grantScopes`)
- **GraphQL Shield**: Complex business rules (`shield`)

```typescript
grantScopes: ['authenticated']              // Simple auth check
shield: and(isAuthenticatedUser, isPostOwner)  // Complex rules
```

### 4. Service Layer with DI

Complex business logic uses TSyringe dependency injection:

```typescript
@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('IPasswordService') private passwordService: IPasswordService,
    @inject('ITokenService') private tokenService: ITokenService,
  ) {}
}

// Register in container.ts
container.register<IAuthService>('IAuthService', { useClass: AuthService })
```

### 5. GraphQL Tada Testing

**NEVER** use raw GraphQL strings in tests:

```typescript
// ✅ CORRECT
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/mutations'

const result = await executeOperation(
  server,
  print(LoginMutation),
  { email: 'test@example.com', password: 'password' },
  context,
)

// ❌ WRONG - Don't use raw strings
const result = await executeOperation(server, `mutation { login(...) }`)
```

### 6. Relay Global IDs

The project uses Base64-encoded global IDs for all entities:

```typescript
// Encoding: "Post:1" → "UG9zdDox"
// Decoding in Shield rules:
const postId = parseGlobalId(args.id, 'Post') // Returns numeric ID
```

## Module Structure

```
modules/[feature]/
├── [feature].resolver.ts     # Pothos resolvers with inline logic
├── [feature].rules.ts        # Shield rules for authorization
├── [feature].types.ts        # GraphQL type definitions
├── services/                 # Complex business logic
│   └── [feature].service.ts  # Service implementation + interface
├── entities/                 # Domain entities (if needed)
├── interfaces/               # Repository interfaces (refresh tokens only)
└── types/                    # TypeScript types
```

## Key Implementation Rules

1. **Prisma Query Spreading**: Always spread `query` in `t.prismaField` calls
2. **Direct Imports**: Import Prisma directly, never from context
3. **Error Normalization**: Use `normalizeError()` for all caught errors
4. **Authentication**: Use `requireAuthentication()` for protected resolvers
5. **Type Safety**: No `any` types - use `unknown` or specific types
6. **Testing**: Use GraphQL Tada typed operations from `src/gql/`
7. **Shield Rules**: Cache with `{ cache: 'strict' }` when appropriate
8. **DataLoaders**: Available as `context.loaders` for N+1 prevention
9. **Global IDs**: Decode relay IDs in Shield rules using `parseGlobalId()`
10. **Unused Parameters**: Prefix with underscore (e.g., `_parent`, `_args`)

## Environment Variables

```bash
# Required
DATABASE_URL="file:./dev.db"     # SQLite (or postgresql://...)
JWT_SECRET="your-secret-key"      # JWT signing secret

# Optional
BCRYPT_ROUNDS=10                  # Password hashing rounds
NODE_ENV="development"            # Environment mode
PORT=4000                         # Server port
HOST="localhost"                  # Server host
```

## Common Debugging Issues

- **Type errors**: Run `bun run generate` to regenerate Prisma & GraphQL types
- **Permission denied**: Check JWT token and Shield rule implementations
- **Global ID errors**: Verify Base64 encoding (e.g., "UG9zdDox" = "Post:1")
- **Test failures**: Ensure test database is clean (`bun run db:reset`)
- **DI errors**: Check `container.ts` for interface registration
- **Lint errors**: Run `bun run check:fix` to auto-fix (add `--unsafe` for any types)
- **Shield errors**: Shield returns "Not authorized" as fallback - check rule logic

## Performance Optimizations

- **Query Spreading**: Pothos optimizes Prisma queries based on requested fields
- **DataLoaders**: Automatic batching prevents N+1 queries
- **Shield Caching**: Authorization results cached per request
- **Direct Access**: No context overhead for Prisma calls

## RefreshToken Implementation

- Stores UUID string IDs in database
- Returns JWT refresh token containing the UUID
- Single-use with rotation on refresh
- Repository pattern exception (only for RefreshToken entity)

## Test Utilities

The project includes comprehensive test utilities in `test/utils/`:

- `createTestServer()`: Creates Apollo Server instance for testing
- `createAuthContext()`: Creates authenticated context with user
- `createMockContext()`: Creates unauthenticated context
- `gqlHelpers`: GraphQL operation helpers with type safety
- `createTestUser()`: Creates test users with hashed passwords
- `cleanDatabase()`: Cleans test database between tests

## GraphQL Context

Context is created by `context.factory.ts` and includes:
- `user`: Authenticated user (null if not authenticated)
- `userId`: User ID value object
- `loaders`: DataLoader instances for batching
- `security`: Security metadata (roles, permissions)
- `requestId`: Unique request identifier

Never add Prisma to context - always import directly.