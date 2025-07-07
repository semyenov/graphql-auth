# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recent Updates (2025-07-07)

### Test Performance Optimizations
- **Parallel Test Execution**: Tests now run up to 4x faster with `fileParallelism: true`
- **Worker-Specific Databases**: Each test worker gets unique SQLite file (`test-db-${workerId}.db`)
- **Schema Caching**: GraphQL schema cached per worker to reduce initialization overhead
- **New Test Commands**: Added cleanup and performance-focused test scripts

### Security & Performance Enhancements (2025-07-06)
- **Security Headers Middleware**: CSP, HSTS, X-Frame-Options, etc.
- **Rate Limiting**: GraphQL-aware with operation-specific limits
- **Query Depth/Complexity Limiting**: Max depth 10, max complexity 1000
- **Response Compression**: Gzip/Brotli for responses > 1KB
- **Request Logging**: Structured logging with timing information

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server with H3 (port 4000)
bun run test --run                      # Run all tests once (no watch)
bun run test                            # Run tests in watch mode
bun test test/modules/auth/auth.test.ts # Run specific test file
bun test -t "should create user"        # Run tests matching pattern
bun test test/modules/oidc --run        # Run tests in specific directory
bun run test:ui                         # Run tests with UI
bun run test:coverage                   # Run tests with coverage
bun run test:cleanup                    # Clean up orphaned test database files

# Vitest (for parallel execution)
npm run vitest:run                      # Run all tests in parallel (recommended)
npm run vitest:unit                     # Run unit tests only
npm run vitest:integration              # Run integration tests only
npm run vitest:performance              # Run performance tests only
npm run vitest:fast                     # Run with ultra-fast cleanup
npx vitest run                          # Alternative: run tests in parallel

# IMPORTANT: For Vitest, use npm/npx, NOT bun vitest (causes GraphQL duplication)

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate all types (Prisma + GraphQL)
bun run db:reset                        # Reset database with seed data
bunx prisma studio                      # Open database GUI
bunx prisma db push                     # Push schema changes without migration (dev only)
bun run seed                            # Manually seed database

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
bun run gen:schema                      # Generate GraphQL schema file to _docs/
bunx gql.tada generate-output           # Generate GraphQL type definitions
bun run generate:gql                    # Alternative GraphQL type generation

# Environment & Debugging
bun run env:verify                      # Verify environment setup
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

**Important**: The `query` parameter must be spread in ALL Prisma operations, not just create:
- `prisma.user.findUnique({ ...query, where })`
- `prisma.post.update({ ...query, where, data })`
- `prisma.comment.delete({ ...query, where })`

### 3. Dual Authorization (ADR-002)

- **Pothos Scope Auth**: Basic authentication/role checks (`grantScopes`)
- **GraphQL Shield**: Complex business rules (`shield`)

```typescript
grantScopes: ['authenticated']              // Simple auth check
shield: and(isAuthenticatedUser, isPostOwner)  // Complex rules
```

**Shield Rule Pattern**: Rules should return errors, not throw:
```typescript
// ✅ CORRECT
export const isPostOwner = rule({ cache: 'strict' })(
  async (_parent, args, context) => {
    try {
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id, 'Post')
      const post = await prisma.post.findUnique({ where: { id: postId } })
      
      if (!post || post.authorId !== userId.value) {
        return new ForbiddenError('You can only modify your own posts')
      }
      return true
    } catch (error) {
      return handleRuleError(error)
    }
  },
)

// ❌ WRONG - Don't throw in Shield rules
if (!post) throw new Error('Post not found')
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

**When to use services**: Only for complex business logic, not simple CRUD operations.

### 5. GraphQL Tada Testing

Use the test helpers for type-safe GraphQL operations:

```typescript
// ✅ CORRECT - Using new helpers
import { createGraphQLTestHelper } from '@test/utils'
import { LoginMutation } from '../src/gql/mutations'

const gql = createGraphQLTestHelper(server)
const data = await gql.mutate(LoginMutation, variables, context)
await gql.expectError(LoginMutation, variables, 'Error message', context)

// Advanced test helpers
await gqlHelpers.expectSuccessfulQuery(GetUserQuery, { id }, context)
await gqlHelpers.expectGraphQLError(
  CreatePostMutation,
  { title: '' },
  'Title is required',
  context
)

// ❌ WRONG - Don't use raw strings or old patterns
const result = await executeOperation(server, `mutation { login(...) }`)
```

### 6. Relay Global IDs

The project uses Base64-encoded global IDs for all entities:

```typescript
// Encoding format: "EntityType:numericId"
// Example: "Post:1" → "UG9zdDox"

// Helper functions
import { toPostId, toUserId, extractNumericId } from '@/utils/relay'

// In resolvers
const post = await prisma.post.findUnique({
  where: { id: extractNumericId(args.id) }
})

// In Shield rules
const postId = parseGlobalId(args.id, 'Post') // Returns numeric ID
```

### 7. Schema Building & Caching

The GraphQL schema is built lazily and cached for performance:

```typescript
// In tests, use cached schema for better performance
import { getCachedSchema } from '@test/utils/graphql/schema-cache'

// OIDC resolver loads only when DI container is configured
ensureOidcResolver() // Safely loads OIDC if container is ready
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
APP_SECRET="32-char-minimum"      # App secret for encryption (min 32 chars)

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
- **OIDC resolver errors**: Ensure DI container is configured before schema building
- **GraphQL duplication**: Use npm/npx for Vitest, not bun vitest
- **Parallel test conflicts**: Run `bun run test:cleanup` to remove orphaned databases

## Performance Optimizations

### Runtime Optimizations
- **Query Spreading**: Pothos optimizes Prisma queries based on requested fields
- **DataLoaders**: Automatic batching prevents N+1 queries
- **Shield Caching**: Authorization results cached per request
- **Direct Access**: No context overhead for Prisma calls

### Test Optimizations (New)
- **Parallel Execution**: Tests run up to 4x faster with worker isolation
- **Worker Databases**: Each test worker uses unique SQLite file
- **Schema Caching**: GraphQL schema cached per worker
- **Server Caching**: Apollo/Yoga servers cached to reduce initialization

## Test Configuration

Tests use Vitest with parallel execution optimizations:
- **Parallel execution**: `fileParallelism: true` with up to 4 workers
- **Process isolation**: Each test file runs in separate process using 'forks' pool
- **Worker databases**: Each worker gets unique database file (`test-db-${workerId}.db`)
- **Path aliases**: Use `@test/*` for test utilities, `@` for src imports
- **Schema caching**: GraphQL schema cached per worker for performance
- **Automatic cleanup**: Database cleaned between tests, orphaned files removed

### Test Path Aliases

```typescript
// Test utilities
import { createTestUser } from '@test/utils/factories'
import { prisma } from '@test/utils/database/prisma'

// Source code
import { AuthService } from '@/modules/auth/services/auth.service'
```

### Running Tests Efficiently

```bash
# Parallel execution (recommended for speed)
npm run vitest:run

# Single worker execution (for debugging)
bun test

# Clean up test databases
bun run test:cleanup
```

## Test Utilities

The project includes comprehensive test utilities:

### Factory Functions (`@test/utils/factories/`)
- `createTestUser()`: Creates test users with hashed passwords
- `createTestPost()`: Creates test posts
- `createUserWithPosts()`: Creates user with multiple posts
- `seedTestUsers()`: Seeds database with predefined test users

### Core Test Utilities (`@test/utils/core/`)
- `createTestServer()`: Creates cached Apollo Server instance
- `createAuthenticatedContextFromScratch()`: Creates new test user with authenticated context
- `createAuthenticatedContext(user)`: Creates authenticated context from existing user
- `createMockContext()`: Creates unauthenticated context
- `createGraphQLTestHelper()`: Type-safe GraphQL test helper with query/mutate/expectError methods

### Advanced Test Helpers (`@test/utils/helpers/`)
- `gqlHelpers.expectSuccessfulQuery()`: Assert successful query execution
- `gqlHelpers.expectSuccessfulMutation()`: Assert successful mutation execution
- `gqlHelpers.expectGraphQLError()`: Assert specific GraphQL errors
- `benchmark()`: Performance testing utility
- `GraphQLSnapshotTester`: Snapshot testing for GraphQL responses

### Database Utilities (`@test/utils/database/`)
- `prisma`: Test database Prisma client
- `cleanDatabase()`: Cleans test database between tests

### Schema Cache Utilities (`@test/utils/graphql/schema-cache.ts`)
- `getCachedSchema()`: Returns cached GraphQL schema
- `refreshSchemaCache()`: Force refresh schema cache
- `getSchemaStats()`: Get cache performance statistics
- `measureSchemaBuildPerformance()`: Benchmark schema building

## GraphQL Context

Context is created by `context.factory.ts` and includes:
- `user`: Authenticated user (null if not authenticated)
- `userId`: User ID value object
- `loaders`: DataLoader instances for batching
- `security`: Security metadata (roles, permissions)
- `requestId`: Unique request identifier

Never add Prisma to context - always import directly.

### DataLoader Usage

```typescript
// Available loaders in context
const users = await context.loaders.userById.loadMany([1, 2, 3])
const posts = await context.loaders.postById.load(postId)
```

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

## H3 Server Middleware Stack

Applied in order:
1. Request logging (all requests)
2. GraphQL operation logging
3. Response compression
4. Security headers
5. Rate limiting
6. CORS handling

### Middleware Files
- `src/middleware/h3/security-headers.middleware.ts`
- `src/middleware/h3/rate-limiter.middleware.ts`
- `src/middleware/h3/request-logger.middleware.ts`
- `src/middleware/h3/compression.middleware.ts`
- `src/graphql/plugins/depth-limit.plugin.ts`

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
├── oidc.h3.ts                    # H3 routes for OIDC endpoints
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

The project uses H3 as the HTTP framework with the following endpoints:

- `/graphql` - GraphQL API endpoint (GET/POST)
- `/health` - Health check endpoint with database status
- `/oidc/*` - OIDC provider endpoints (auth, token, userinfo, etc.)
- `/.well-known/*` - OIDC discovery endpoints

### H3 Features Used
- Minimal routing with `createRouter()`
- CORS handling with `handleCors()`
- Event handlers with `defineEventHandler()`
- Integration with Apollo Server via custom handler

## GraphQL Tada Patterns

### Fragment Definitions
```typescript
// Define fragments in src/gql/fragments/
export const UserFragment = graphql(`
  fragment UserFields on User @_unmask {
    id
    email
    name
  }
`)

// Use in operations
export const GetUserQuery = graphql(`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
`, [UserFragment])
```

### Type Extraction
```typescript
import type { ResultOf, VariablesOf } from '@graphql-typed-document-node/core'

type UserData = ResultOf<typeof GetUserQuery>
type UserVars = VariablesOf<typeof GetUserQuery>
```

## Error Handling Patterns

### Error Hierarchy
- `GraphQLError` (base)
  - `AuthenticationError` (401)
  - `ForbiddenError` (403)
  - `UserInputError` (400)
  - `NotFoundError` (404)
  - `InternalServerError` (500)

### Prisma Error Mapping
```typescript
// Automatic mapping in normalizeError()
P2002 → UserInputError (unique constraint)
P2025 → NotFoundError (record not found)
P2003 → UserInputError (foreign key constraint)
```

### Error Constants
```typescript
import { ERROR_MESSAGES } from '@/shared/constants/errors'

// Use predefined messages
throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
```

## Important Cursor Rules

The project includes extensive Cursor rules in `.cursor/rules/` that provide:
- Pothos-specific patterns and best practices
- Testing patterns with GraphQL Tada
- Error handling conventions
- Authentication implementation guidelines
- Common issue resolutions

These rules ensure consistent code patterns across the codebase.

## Common Pitfalls

### Wrong: Manual relation resolvers
```typescript
// ❌ WRONG
t.field('author', {
  type: 'User',
  resolve: (parent) => prisma.user.findUnique({ where: { id: parent.authorId } })
})

// ✅ CORRECT
t.relation('author')
```

### Wrong: Not spreading query in Prisma operations
```typescript
// ❌ WRONG
return prisma.post.findMany({ where: { authorId } })

// ✅ CORRECT
return prisma.post.findMany({ ...query, where: { authorId } })
```

### Wrong: Throwing in Shield rules
```typescript
// ❌ WRONG
throw new Error('Not authorized')

// ✅ CORRECT
return new ForbiddenError('Not authorized')
```

### Wrong: Using Bun for Vitest
```typescript
// ❌ WRONG - Causes GraphQL module duplication
bun vitest

// ✅ CORRECT
npm run vitest:run
npx vitest run
```