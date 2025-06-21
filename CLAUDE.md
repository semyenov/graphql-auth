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

# GraphQL Schema
bun run gen:schema                      # Generate GraphQL schema file
bunx gql.tada generate-output           # Generate GraphQL type definitions

# Environment & Debugging
bun run env:verify                      # Verify environment setup
bun run graphql:examples                # Run GraphQL query examples
bun run seed                            # Manually seed database
bun run demo                            # Run demo script
```

## Architecture Overview

### Tech Stack

- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **GraphQL Server**: Apollo Server 4 with H3 HTTP framework
- **Schema Builder**: Pothos with advanced plugin integration:
  - **Prisma Plugin**: Direct access pattern (NOT in context) for better TypeScript performance
  - **Relay Plugin**: Global IDs, connections with metadata, cursor pagination
  - **Errors Plugin**: Union result types for comprehensive error handling
  - **Scope Auth Plugin**: Dynamic authorization with 14+ scope types
  - **Shield Plugin**: Inline GraphQL Shield rules for field-level authorization
  - **DataLoader Plugin**: Automatic batch loading for N+1 prevention
  - **Validation Plugin**: Zod integration with async refinements
- **Database**: Prisma ORM with SQLite (dev.db) - accessed directly, not through context
- **Authentication**: JWT tokens with hybrid password service (argon2 + bcrypt fallback) + refresh token rotation
- **Authorization**: Dual authorization system using Pothos Scope Auth + GraphQL Shield Plugin
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities
- **Validation**: Zod schema validation with custom async refinements
- **Rate Limiting**: rate-limiter-flexible with configurable presets
- **Dependency Injection**: TSyringe for service management
- **Code Quality**: Biome for linting and formatting (replaces ESLint/Prettier)

### Architecture: Modular Direct Resolvers

The project uses a **modular architecture** with direct Pothos resolvers organized by feature:

```
src/
├── app/                              # Application entry and configuration
│   ├── server.ts                     # Main server setup (entry point: bun run dev)
│   ├── config/                       # Configuration
│   │   ├── container.ts              # TSyringe DI container setup
│   │   ├── environment.ts            # Environment variable handling
│   │   └── database.ts               # Database configuration
│   └── middleware/                   # Application-level middleware
│       ├── cors.ts                   # CORS configuration
│       ├── rate-limiting.ts          # Rate limiter setup
│       ├── logging.ts                # Request/response logging
│       └── security-headers.ts       # Security headers middleware

├── modules/                          # Feature modules (domain-driven)
│   ├── auth/                         # Authentication module
│   │   ├── auth.schema.ts            # GraphQL schema definitions
│   │   ├── auth.permissions.ts       # Authorization rules
│   │   ├── auth.validation.ts        # Input validation schemas
│   │   ├── resolvers/                # GraphQL resolvers
│   │   │   ├── auth.resolver.ts      # Basic auth (signup/login/me)
│   │   │   └── auth-tokens.resolver.ts # Refresh token operations
│   │   ├── services/                 # Business logic services
│   │   │   ├── password.service.ts   # Password hashing (bcryptjs)
│   │   │   ├── argon2-password.service.ts # Argon2 password service
│   │   │   ├── hybrid-password.service.ts # Hybrid password service
│   │   │   └── token.service.ts      # JWT token management
│   │   └── types/                    # Module-specific types
│   ├── posts/                        # Posts module
│   │   ├── posts.schema.ts           # Post type definitions
│   │   ├── posts.permissions.ts      # Post authorization rules
│   │   ├── posts.validation.ts       # Post input validation
│   │   ├── posts.service.ts          # Post business logic
│   │   └── resolvers/                # Post CRUD resolvers
│   ├── users/                        # Users module
│   │   ├── users.schema.ts           # User type definitions
│   │   ├── users.permissions.ts      # User authorization rules
│   │   ├── users.validation.ts       # User input validation
│   │   ├── users.service.ts          # User business logic
│   │   └── resolvers/                # User query resolvers
│   └── shared/                       # Shared module utilities
│       ├── pagination/               # Pagination utilities
│       ├── filtering/                # Filter utilities
│       └── connections/              # Relay connection helpers

├── graphql/                          # GraphQL infrastructure
│   ├── schema/                       # Schema building and assembly
│   │   ├── builder.ts                # Pothos builder with plugins
│   │   ├── index.ts                  # Schema assembly & export
│   │   ├── inputs.ts                 # Shared input types
│   │   ├── scalars.ts                # Custom scalars (DateTime)
│   │   └── plugins/                  # Schema plugins
│   │       └── shield.ts             # Custom ShieldPlugin implementation
│   ├── context/                      # GraphQL context
│   │   ├── context.types.ts          # Context type definitions
│   │   ├── context.factory.ts        # Context creation
│   │   ├── context.auth.ts           # Authentication helpers
│   │   └── context.utils.ts          # Context utilities
│   ├── directives/                   # Custom GraphQL directives
│   └── middleware/                   # GraphQL-specific middleware
│       ├── shield-config.ts          # Permission mapping (legacy)
│       ├── rules.ts                  # Shield permission rules
│       └── rule-utils.ts             # Rule helper functions

├── core/                             # Core business logic and utilities
│   ├── auth/                         # Authentication core
│   │   ├── scopes.ts                 # Authorization scopes
│   │   └── types.ts                  # Auth types
│   ├── errors/                       # Error handling system
│   │   ├── types.ts                  # Error class hierarchy
│   │   ├── handlers.ts               # Error normalization
│   │   └── constants.ts              # Error messages
│   ├── logging/                      # Logging system
│   │   ├── logger-factory.ts         # Logger creation
│   │   └── console-logger.ts         # Console implementation
│   ├── utils/                        # Core utilities
│   │   ├── relay.ts                  # Global ID encoding/decoding
│   │   ├── jwt.ts                    # JWT utilities
│   │   ├── crypto.ts                 # Cryptographic utilities
│   │   ├── dates.ts                  # Date utilities
│   │   ├── strings.ts                # String utilities
│   │   └── types.ts                  # Type utilities
│   └── validation/                   # Validation system
│       ├── schemas.ts                # Common Zod schemas
│       └── validators.ts             # Custom validators

├── data/                             # Data access layer
│   ├── database/                     # Database configuration
│   │   └── client.ts                 # Prisma client setup
│   ├── loaders/                      # DataLoader implementations
│   │   └── loaders.ts                # User/Post loaders
│   ├── repositories/                 # Repository pattern
│   │   └── refresh-token.repository.ts # Refresh token storage
│   └── cache/                        # Caching layer
│       ├── memory-cache.ts           # In-memory cache
│       └── redis-cache.ts            # Redis cache (optional)

├── lib/                              # Third-party integrations
│   ├── apollo/                       # Apollo Server setup
│   │   ├── plugins.ts                # Apollo Server plugins
│   │   ├── formatters.ts             # Error formatters
│   │   └── server.ts                 # Apollo Server configuration
│   └── prisma/                       # Prisma extensions and helpers
│       ├── client.ts                 # Global Prisma client
│       ├── extensions.ts             # Prisma extensions
│       └── helpers.ts                # Prisma utility functions

├── gql/                              # GraphQL client operations (for testing)
│   ├── queries.ts                    # Query definitions
│   ├── mutations.ts                  # Mutation definitions
│   └── mutations-auth-tokens.ts      # Auth token mutations

├── types/                            # Global type definitions
├── constants/                        # Application constants
├── main.ts                           # Build entry point
└── prisma.ts                         # Prisma client export
```

## Key Architectural Patterns

### 1. Direct Pothos Resolvers with Direct Prisma Access

**Critical**: Prisma is NOT included in GraphQL context. Always import directly:

```typescript
// ✅ CORRECT - Import Prisma directly
import { prisma } from '../../../prisma'

// ❌ WRONG - Never access Prisma from context
// const prisma = context.prisma
```

### 2. Resolver Pattern with Query Spreading

**Critical**: Always spread the `query` parameter for Prisma optimizations:

```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)

      return prisma.post.create({
        ...query, // ⚠️ CRITICAL: Always spread query first
        data: {
          title: args.title,
          content: args.content,
          authorId: userId.value,
        },
      })
    },
  }),
)
```

### 3. Error Handling

Use the error hierarchy and always normalize errors:

```typescript
import { normalizeError } from '../../../core/errors/handlers'
import { AuthenticationError, NotFoundError } from '../../../core/errors/types'

try {
  // operation
} catch (error) {
  throw normalizeError(error) // Converts unknown errors to BaseError
}
```

### 4. Global IDs (Relay Pattern)

Use centralized helpers for consistent ID handling:

```typescript
import {
  parseAndValidateGlobalId,
  encodeGlobalId,
} from '../../core/utils/relay'

// Parse incoming global ID
const numericId = await parseAndValidateGlobalId(args.id, 'Post')

// Encode for response
const globalId = encodeGlobalId('Post', post.id)
```

### 5. Authentication Guards

Use context authentication helpers:

```typescript
import { requireAuthentication } from '../../graphql/context/context.auth'

// In resolver
const userId = requireAuthentication(context) // Throws if not authenticated
```

### 6. Authorization with ShieldPlugin

The project uses a custom ShieldPlugin for inline authorization rules:

```typescript
// Define Shield rules inline with field definitions
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'], // Pothos Scope Auth
    shield: and(isAuthenticatedUser, isPostOwner), // GraphQL Shield rules
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdatePostInput, required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      // Implementation
    },
  }),
)
```

Shield rules should handle errors gracefully:

```typescript
export const isPostOwner = rule({ cache: 'strict' })(
  async (_parent, args, context) => {
    try {
      const userId = requireAuthentication(context)
      const postId = await parseAndValidateGlobalId(args.id, 'Post')

      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      })

      if (!post) {
        return new NotFoundError('Post', args.id)
      }

      if (post.authorId !== userId.value) {
        return new AuthorizationError(
          'You can only modify posts that you have created',
        )
      }

      return true
    } catch (error) {
      return handleRuleError(error)
    }
  },
)
```

### 7. GraphQL Tada Integration

**Critical**: Always use typed GraphQL operations for testing:

```typescript
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/mutations'

// ✅ CORRECT - Use typed operations
const result = await executeOperation(
  server,
  print(LoginMutation),
  { email: 'test@example.com', password: 'password' },
  context,
)

// ❌ WRONG - Never use raw GraphQL strings
// const result = await executeOperation(server, 'mutation { ... }', variables, context)
```

### 8. Code Quality Standards

The project uses **Biome** for linting and formatting:

- **No `any` types**: Use specific types or `unknown` for better type safety  
- **Consistent formatting**: Auto-formatted with Biome
- **Import organization**: Imports are automatically sorted
- **Strict TypeScript**: All files must pass `bunx tsc --noEmit`
- **String modes**: Never use `mode: 'insensitive'` in Prisma queries (not supported in SQLite)

## Environment Variables

```bash
# Required
DATABASE_URL="file:./dev.db"     # SQLite database path (or postgresql://... for PostgreSQL)
JWT_SECRET="your-secret-key"      # JWT signing secret

# Optional
BCRYPT_ROUNDS=10                  # Password hashing rounds (default: 10)
NODE_ENV="development"            # Environment mode
PORT=4000                         # Server port
HOST="localhost"                  # Server host
```

**Note**: This project supports multiple databases. For PostgreSQL, use:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

For production with Prisma Postgres, add the Accelerate extension:
```bash
bun add @prisma/extension-accelerate
```

## Common Development Patterns

### Adding a New Module

1. Create module directory structure:

   ```
   src/modules/feature/
   ├── feature.schema.ts       # GraphQL type definitions
   ├── feature.permissions.ts  # Authorization rules
   ├── feature.validation.ts   # Input validation
   ├── feature.service.ts      # Business logic (optional)
   ├── resolvers/
   │   └── feature.resolver.ts # GraphQL resolvers
   └── types/
       └── feature.types.ts    # TypeScript types
   ```

2. Import resolver in schema index:

   ```typescript
   // src/graphql/schema/index.ts
   import '../../modules/feature/resolvers/feature.resolver'
   ```

3. Add permissions to shield config:
   ```typescript
   // src/graphql/middleware/shield-config.ts
   import { featurePermissions } from '../../modules/feature/feature.permissions'
   ```

### Testing Patterns

Tests use typed GraphQL operations:

```typescript
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/mutations'

const result = await executeOperation(
  server,
  print(LoginMutation),
  { email: 'test@example.com', password: 'password' },
  context,
)
```

### DataLoader Usage

DataLoaders are created in context for N+1 prevention:

```typescript
// In context.utils.ts
loaders: {
  users: createUserLoader(),
  posts: createPostLoader(),
}
```

### GraphQL Tada Workflow

When working with GraphQL operations:

1. **Define operations in `src/gql/`**:
   ```typescript
   export const CreatePostMutation = graphql(`
     mutation CreatePost($title: String!, $content: String) {
       createPost(input: { title: $title, content: $content }) {
         id
         title
         content
         author { id name }
       }
     }
   `)
   ```

2. **Generate types after changes**:
   ```bash
   bun run generate:gql  # or bun run generate
   ```

3. **Use in tests with type safety**:
   ```typescript
   import { print } from 'graphql'
   import { CreatePostMutation } from '../src/gql/mutations'
   
   const result = await executeOperation(
     server,
     print(CreatePostMutation),
     { title: 'Test Post', content: 'Content' },
     context,
   )
   ```

## Debugging Quick Reference

- **Type errors**: `bun run generate` (regenerates Prisma & GraphQL types)
- **Permission denied**: Check JWT token and shield-config.ts mappings
- **Global ID errors**: Verify Base64 encoding (e.g., "UG9zdDox" = "Post:1")
- **Database issues**: `bunx prisma studio` for visual inspection
- **GraphQL schema**: `bun run gen:schema` to update schema.graphql
- **Test specific operation**: Use GraphQL Playground at http://localhost:4000
- **Lint errors**: `bun run check:fix` to auto-fix all Biome issues
- **Format issues**: `bun run format:fix` to auto-format code

## Recent Architecture Changes

1. **Modular Structure**: Migrated from scattered files to organized modules
2. **Direct Resolvers**: Removed abstraction layers, business logic in resolvers
3. **Improved Error Handling**: Centralized error types with consistent messages
4. **Enhanced Testing**: All tests use typed GraphQL operations from src/gql/
5. **TypeScript Strict**: All files pass strict type checking
6. **Biome Integration**: Replaced ESLint/Prettier with Biome for better performance
7. **Hybrid Password Service**: Added argon2 support with bcrypt fallback
8. **Enhanced Security**: Added security headers middleware
9. **ShieldPlugin Integration**: Migrated from middleware-based Shield to inline plugin approach
10. **Dual Authorization**: Combined Pothos Scope Auth with GraphQL Shield for flexible permissions
11. **Test Helper Integration**: Comprehensive `gqlHelpers` utilities for cleaner, type-safe testing

## Test Helper Integration

The project uses comprehensive test utilities for GraphQL operations:

```typescript
// ✅ CORRECT - Use gqlHelpers for clean test code
import { gqlHelpers } from '../utils'

// Successful operations
const data = await gqlHelpers.expectSuccessfulQuery(
  server,
  print(FeedQuery),
  { first: 10 },
  context
)

// Expected errors
await gqlHelpers.expectGraphQLError(
  server,
  print(LoginMutation),
  { email: 'invalid', password: 'wrong' },
  context,
  'Invalid email or password'
)
```

Available test helpers:
- `gqlHelpers.expectSuccessfulQuery()` - Execute and expect success
- `gqlHelpers.expectSuccessfulMutation()` - Execute mutation and expect success  
- `gqlHelpers.expectGraphQLError()` - Execute and expect specific error
- `createTestServer()` - Create test Apollo server
- `createAuthContext()` - Create authenticated context
- `createMockContext()` - Create unauthenticated context
- `createTestUser()` - Create test user with unique email
- `createUserWithPosts()` - Create user with sample posts
- `cleanDatabase()` - Clean database between tests

## Critical Rules from .cursor/rules

Based on the Cursor rules in this project:

### Pothos Patterns (.cursor/rules/01-pothos-patterns.mdc)
- Always import Prisma directly, never from context
- Always spread the `query` parameter in `t.prismaField` calls
- Use `t.relation()` for automatic relation handling
- Use `prismaNode` for entities with global IDs
- Extract resolver logic to utility functions

### Testing Patterns (.cursor/rules/02-testing-patterns.mdc)
- Use typed GraphQL operations from `src/gql/`
- Test both success and error cases
- Use comprehensive test utilities with `gqlHelpers`
- Test authorization and authentication flows
- Never use raw GraphQL strings in tests

### Error Handling (.cursor/rules/03-error-handling.mdc)
- Use the centralized error hierarchy
- Always normalize unknown errors
- Provide descriptive error messages
- Handle GraphQL Shield rule errors gracefully

### Authentication (.cursor/rules/04-authentication.mdc)
- Use `requireAuthentication()` for protected resolvers
- Implement proper JWT token validation
- Support refresh token rotation
- Use TSyringe for service injection

### GraphQL Tada (.cursor/rules/05-graphql-tada.mdc)
- Always define operations in `src/gql/` directory
- Never use raw GraphQL strings in tests
- Use `print(operation)` to convert typed operations to strings
- Generate types with `bun run generate:gql` after schema changes
- Extract result and variable types for reuse