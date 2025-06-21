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
- **Authentication**: JWT tokens with argon2 (hybrid bcrypt support) + refresh token rotation
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
├── server.ts                         # Main server setup (entry point: bun run dev)
├── main.ts                           # Build entry point
├── prisma.ts                         # Prisma client export
├── types/                            # Global type definitions
│
├── app/                              # Application infrastructure
│   ├── config/                       # Configuration
│   │   ├── container.ts              # TSyringe DI container setup
│   │   ├── config.ts                 # Configuration management
│   │   ├── environment.ts            # Environment variables
│   │   └── database.ts               # Database configuration
│   ├── middleware/                   # HTTP middleware
│   │   ├── cors.ts                   # CORS configuration
│   │   ├── rate-limiting.ts          # Rate limiter setup
│   │   ├── logging.ts                # Request/response logging
│   │   └── security-headers.ts       # Security headers
│   ├── errors/                       # Error handling
│   │   ├── types.ts                  # Error class hierarchy
│   │   ├── handlers.ts               # Error normalization
│   │   └── constants.ts              # Error messages
│   ├── logging/                      # Logging system
│   │   ├── logger-factory.ts         # Logger creation
│   │   └── console-logger.ts         # Console implementation
│   └── services/                     # Application services
│       ├── email.service.ts          # Email service
│       └── *.interface.ts            # Service interfaces

├── modules/                          # Feature modules
│   ├── auth/                         # Authentication module
│   │   ├── auth.schema.ts            # GraphQL type definitions
│   │   ├── auth.permissions.ts       # Authorization rules
│   │   ├── auth.validation.ts        # Input validation schemas
│   │   ├── entities/                 # Module entities
│   │   │   └── refresh-token.entity.ts # Refresh token entity
│   │   ├── interfaces/               # Module interfaces
│   │   │   └── refresh-token.repository.interface.ts
│   │   ├── resolvers/                # GraphQL resolvers
│   │   │   ├── auth.resolver.ts      # Basic auth (signup/login/me)
│   │   │   ├── auth-tokens.resolver.ts # Refresh token operations
│   │   │   └── auth-enhanced.resolver.ts # Email verification & password reset
│   │   ├── services/                 # Business logic services
│   │   │   ├── argon2-password.service.ts # Argon2 password hashing
│   │   │   ├── token.service.ts      # JWT token management
│   │   │   ├── verification-token.service.ts # Email verification
│   │   │   └── login-attempt.service.ts # Login attempt tracking
│   │   └── types/                    # Module-specific types
│   ├── posts/                        # Posts module
│   │   ├── posts.schema.ts           # Post type definitions
│   │   ├── posts.permissions.ts      # Post authorization rules
│   │   ├── posts.validation.ts       # Post input validation
│   │   ├── posts.service.ts          # Post business logic
│   │   └── resolvers/                # Post CRUD resolvers
│   │       └── posts.resolver.ts     # Post operations
│   ├── users/                        # Users module
│   │   ├── users.schema.ts           # User type definitions
│   │   ├── users.permissions.ts      # User authorization rules
│   │   ├── users.validation.ts       # User input validation
│   │   ├── users.service.ts          # User business logic
│   │   └── resolvers/                # User query resolvers
│   │       └── users.resolver.ts     # User operations
│   └── shared/                       # Shared module utilities
│       └── connections/              # Relay connection helpers
│           └── relay.utils.ts        # Connection utilities

├── graphql/                          # GraphQL infrastructure
│   ├── schema/                       # Schema building
│   │   ├── builder.ts                # Pothos builder with plugins
│   │   ├── index.ts                  # Schema assembly & export
│   │   ├── inputs.ts                 # Shared input types
│   │   ├── scalars.ts                # Custom scalars (DateTime)
│   │   ├── enums.ts                  # GraphQL enums
│   │   ├── error-types.ts            # Error union types
│   │   └── plugins/                  # Schema plugins
│   │       └── shield.plugin.ts      # Custom ShieldPlugin
│   ├── context/                      # GraphQL context
│   │   ├── context.types.ts          # Context type definitions
│   │   ├── context.factory.ts        # Context creation
│   │   ├── context.auth.ts           # Authentication helpers
│   │   └── context.utils.ts          # Context utilities
│   ├── directives/                   # Custom GraphQL directives
│   │   ├── auth.directive.ts         # @auth directive
│   │   ├── rate-limit.directive.ts   # @rateLimit directive
│   │   └── index.ts                  # Directive exports
│   └── middleware/                   # GraphQL middleware
│       ├── auth.middleware.ts        # Authentication checks
│       ├── rate-limit.middleware.ts  # Rate limiting
│       ├── validation.middleware.ts  # Input validation
│       ├── shield-config.ts          # Permission mapping
│       ├── rules.ts                  # Shield permission rules
│       ├── shared-rules.ts           # Reusable auth rules
│       └── rule-utils.ts             # Rule helper functions

├── data/                             # Data access layer
│   ├── loaders/                      # DataLoader implementations
│   │   └── loaders.ts                # User/Post loaders
│   └── repositories/                 # Repository implementations
│       ├── index.ts                  # Repository exports
│       └── refresh-token.repository.ts # Refresh token storage

├── lib/                              # Third-party integrations
│   ├── apollo/                       # Apollo Server setup
│   │   ├── plugins.ts                # Apollo Server plugins
│   │   └── formatters.ts             # Error formatters
│   └── prisma/                       # Prisma extensions
│       └── client.ts                 # Extended Prisma client

├── gql/                              # GraphQL client operations (testing)
│   ├── queries.ts                    # Query definitions
│   ├── mutations.ts                  # Mutation definitions
│   └── mutations-auth-tokens.ts      # Auth token mutations

├── constants/                        # Application constants
├── utils/                            # Shared utilities
├── validation/                       # Validation schemas
├── value-objects/                    # Value objects
└── entities/                         # Domain entities
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
import { normalizeError } from '../../../app/errors/handlers'
import { AuthenticationError, NotFoundError } from '../../../app/errors/types'

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
} from '../../utils/relay'

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

### RefreshToken Implementation

Key points for refresh token implementation:

1. **Entity Structure**: RefreshToken uses string IDs (UUIDs) in the database
2. **Token Service**: Returns JWT refresh token, not the raw token value
3. **Repository Pattern**: Implements `IRefreshTokenRepository` interface
4. **Revocation**: Check `revoked` field before accepting refresh tokens
5. **Rotation**: Delete old token after successful refresh (single-use tokens)

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
- **DI errors**: Check container.ts for proper interface registration (e.g., `ITokenConfig` not `TokenConfig`)

## Recent Architecture Changes

1. **Simplified Architecture**: Removed DDD implementation in favor of modular direct resolvers
2. **RefreshToken Entity**: Simplified entity without value objects, using primitive types
3. **Direct Repository Pattern**: Implemented repositories without base classes or complex abstractions
4. **Improved Testing**: Fixed all dependency injection issues, all 191 tests now pass
5. **Clean Module Structure**: Each module contains entities, interfaces, services, and resolvers
6. **TypeScript Strict**: All files pass strict type checking with Biome
7. **Hybrid Password Service**: Argon2 as default with bcrypt fallback support
8. **Enhanced Security**: Security headers middleware with CSP support
9. **ShieldPlugin Integration**: Custom inline GraphQL Shield plugin for field-level auth
10. **Dual Authorization**: Pothos Scope Auth + GraphQL Shield for flexible permissions
11. **Token Rotation**: Proper refresh token rotation with family tracking

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
- Use comprehensive test utilities
- Test authorization and authentication flows

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