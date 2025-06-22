# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run dev:h3                          # Start dev server with H3 (minimal HTTP framework)
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
bunx prisma db push                     # Push schema changes without migration (dev only)

# Build & Production
bun run build                          # Build for production (builds src/main.ts)
bun run start                          # Start production server (runs dist/app/server.js)
bun run clean                          # Clean build directory

# Code Quality
bunx tsc --noEmit                      # Type check all files
bun run lint                           # Run Biome linter
bun run lint:fix                       # Auto-fix linting issues
bun run format                         # Check formatting
bun run format:fix                     # Auto-fix formatting
bun run check                          # Run all Biome checks
bun run check:fix                      # Auto-fix all issues
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
- **HTTP Framework**: H3 (minimal HTTP framework)
- **GraphQL**: Apollo Server 4 with Pothos schema builder (7 plugins)
- **Database**: Prisma ORM with SQLite (PostgreSQL-ready)
- **Authentication**: JWT with argon2 + refresh token rotation
- **Authorization**: Dual system - Pothos Scope Auth + GraphQL Shield
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities
- **DI Container**: TSyringe for service management
- **Code Quality**: Biome for linting and formatting
- **OIDC Provider**: oidc-provider for OpenID Connect support

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

Use the new test helpers for type-safe GraphQL operations:

```typescript
// ✅ CORRECT - Using new helpers
import { createGraphQLTestHelper } from '@test/utils'
import { LoginMutation } from '../src/gql/mutations'

const gql = createGraphQLTestHelper(server)
const data = await gql.mutate(LoginMutation, variables, context)
await gql.expectError(LoginMutation, variables, 'Error message', context)

// ❌ WRONG - Don't use raw strings or old patterns
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

# OIDC Configuration (Optional)
OIDC_ISSUER="http://localhost:4000"  # OIDC provider issuer URL
OIDC_JWKS_PATH="./oidc-jwks.json"    # Path to JWKS keys for OIDC
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

## Test Configuration

Tests use Vitest with the following configuration:
- **Sequential execution**: Tests run in sequence to prevent database conflicts
- **Process isolation**: Each test file runs in a separate process using 'forks' pool
- **Path aliases**: Use `@test/*` for test utilities, `@` for src imports
- **GraphQL deduplication**: Single GraphQL instance enforced to prevent schema errors

## Test Utilities

The project includes comprehensive test utilities in `test/utils/`:

- `createTestServer()`: Creates Apollo Server instance for testing
- `createAuthenticatedContextFromScratch()`: Creates new test user with authenticated context
- `createAuthenticatedContext(user)`: Creates authenticated context from existing user
- `createMockContext()`: Creates unauthenticated context
- `createGraphQLTestHelper()`: Type-safe GraphQL test helper with query/mutate/expectError methods
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

## Code Style & Formatting

Based on Biome configuration:

### Formatting Rules
- **Indentation**: 2 spaces (no tabs)
- **Line width**: 80 characters max
- **Line endings**: LF (Unix-style)
- **Quotes**: Single quotes for JavaScript/TypeScript
- **JSX Quotes**: Double quotes
- **Trailing commas**: Always use
- **Semicolons**: Use as needed (ASI-safe)
- **Arrow parentheses**: Always use (e.g., `(x) => x`)
- **Bracket spacing**: Use spaces inside brackets
- **Array syntax**: Use shorthand (`[]` not `Array<>`)

### Linting Rules
- **No `any` types**: Use `unknown` or specific types
- **No unused imports**: Will error on unused imports
- **Use `const`**: For immutable variables
- **No barrel files**: Performance optimization disabled
- **Consistent array types**: Use `T[]` not `Array<T>`
- **No non-null assertions**: Avoid `!` operator when possible

### TypeScript Configuration
- **Strict mode**: All strict checks enabled
- **No unchecked indexed access**: Must handle undefined
- **No implicit returns**: All code paths must return
- **No unused locals/parameters**: Clean up unused code
- **Experimental decorators**: Enabled for DI
- **Path aliases**: `@` for src, `@test/*` for test utils

### Editor Integration
- **Format on save**: Enabled with Biome
- **Default formatter**: Biome for all file types
- **Fix on save**: Auto-fix linting issues
- **Organize imports**: On save

## Refresh Token Implementation

- Stores UUID string IDs in database
- Returns JWT refresh token containing the UUID
- Single-use with rotation on refresh
- Repository pattern exception (only for RefreshToken entity)

## OIDC (OpenID Connect) Implementation

The project includes a full OIDC provider implementation:

### OIDC Module Structure
```
modules/oidc/
├── oidc.resolver.ts              # GraphQL resolvers for OIDC management
├── oidc.rules.ts                 # Authorization rules for OIDC operations
├── oidc.types.ts                 # GraphQL type definitions
├── oidc.middleware.ts            # Express middleware for OIDC routes
├── services/
│   ├── oidc-provider.service.ts  # Main OIDC provider service
│   └── prisma-adapter.service.ts # Prisma adapter for oidc-provider
└── types/
    └── oidc.types.ts             # TypeScript types for OIDC
```

### OIDC Endpoints
- `/.well-known/openid-configuration` - OIDC discovery endpoint
- `/.well-known/jwks.json` - JSON Web Key Set endpoint
- `/oidc/auth` - Authorization endpoint
- `/oidc/token` - Token endpoint
- `/oidc/userinfo` - UserInfo endpoint
- `/oidc/interaction/:uid` - User interaction endpoints

### OIDC GraphQL Operations
```graphql
# Queries
oidcClients                 # List all OIDC clients (admin only)
oidcClient(id: ID!)        # Get specific client (admin only)
myOidcSessions             # Get current user's OIDC sessions

# Mutations
createOidcClient           # Create new OIDC client (admin only)
updateOidcClient           # Update OIDC client (admin only)
deleteOidcClient           # Delete OIDC client (admin only)
revokeOidcSession          # Revoke specific session
revokeAllOidcSessions      # Revoke all user sessions
```

### Testing OIDC
```bash
# Run OIDC-specific tests
bun test test/modules/oidc --run

# Test OIDC provider manually
bun run scripts/test-oidc.ts
```

## Running Single Tests

```bash
# Run a specific test file
bun test test/modules/auth/auth.test.ts

# Run tests matching a pattern
bun test -t "should create user"

# Run tests in a specific directory
bun test test/modules/users

# Debug a specific test with console output
bun test test/modules/auth/auth.test.ts --no-coverage
```

## H3 Server Routes

The project provides three main endpoints using H3:

- `/graphql` - GraphQL API endpoint (GET/POST)
- `/health` - Health check endpoint with database status
- `/oidc/*` - OIDC provider endpoints (auth, token, userinfo, etc.)
- `/.well-known/*` - OIDC discovery endpoints

### H3 Features Used
- Minimal routing with `createRouter()`
- CORS handling with `handleCors()`
- Event handlers with `defineEventHandler()`
- Node.js middleware integration with `fromNodeMiddleware()`

### Available Middleware
- `cors.middleware.ts` - CORS configuration
- `error.middleware.ts` - Error formatting and handling