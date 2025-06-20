# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run test                            # Run all tests
bun run test -t "test name"             # Run specific test
bun test test/auth.test.ts              # Run specific test file
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

# GraphQL Schema
bun run gen:schema                      # Generate GraphQL schema file
bunx gql.tada generate-output           # Generate GraphQL type definitions

# Environment & Debugging
bun run env:verify                      # Verify environment setup
bun run graphql:examples                # Run GraphQL query examples
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
  - **DataLoader Plugin**: Automatic batch loading for N+1 prevention
  - **Validation Plugin**: Zod integration with async refinements
- **Database**: Prisma ORM with SQLite (dev.db) - accessed directly, not through context
- **Authentication**: JWT tokens with bcryptjs + refresh token rotation
- **Authorization**: GraphQL Shield middleware with Pothos Scope Auth
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities
- **Validation**: Zod schema validation with custom async refinements
- **Rate Limiting**: rate-limiter-flexible with configurable presets

### Architecture: Modular Feature-Based Structure

The project follows a modular architecture organized by features:

```
src/
├── modules/                           # Feature modules (organized by domain)
│   ├── auth/                          # Authentication module
│   │   ├── resolvers/                 # Direct Pothos resolvers
│   │   │   ├── auth.resolver.ts       # Auth operations (signup, login, me)
│   │   │   └── auth-tokens.resolver.ts # Refresh token operations
│   │   ├── services/                  # Module services
│   │   │   ├── password.service.ts    # Password hashing with bcrypt
│   │   │   └── token.service.ts       # JWT token generation/validation
│   │   ├── guards/                    # Authentication guards
│   │   │   └── auth.guards.ts         # requireAuthentication, isAuthenticated
│   │   └── types/                     # Module types
│   │       └── auth.types.ts          # Auth-specific types
│   │
│   ├── posts/                         # Posts module
│   │   ├── resolvers/                 
│   │   │   └── posts.resolver.ts      # Post CRUD operations
│   │   └── types/
│   │       └── post.types.ts          # Post-specific types
│   │
│   ├── users/                         # Users module
│   │   ├── resolvers/
│   │   │   └── users.resolver.ts      # User search and management
│   │   └── types/
│   │       └── user.types.ts          # User-specific types
│   │
│   └── shared/                        # Shared module utilities
│       ├── connections/               # Relay connection utilities
│       │   ├── relay.utils.ts         # Connection helpers
│       │   └── relay.types.ts         # Connection types
│       ├── filtering/                 # Advanced filtering
│       │   ├── filter.utils.ts        # Filter transformation
│       │   └── filter.types.ts        # Filter types
│       └── pagination/                # Pagination utilities
│           ├── pagination.utils.ts    # Pagination helpers
│           └── pagination.types.ts    # Pagination types
│
├── graphql/                           # GraphQL Infrastructure
│   ├── schema/                        # Schema Definition
│   │   ├── builder.ts                 # Pothos builder with plugins
│   │   ├── index.ts                   # Schema assembly and middleware
│   │   ├── helpers.ts                 # Pothos helper functions
│   │   ├── scalars.ts                 # Custom scalars (DateTime)
│   │   ├── enums.ts                   # GraphQL enums
│   │   ├── inputs.ts                  # Input type definitions
│   │   ├── error-types.ts             # Error type definitions
│   │   ├── types/                     # Prisma Node types
│   │   └── plugins/                   # Custom plugins
│   │       └── rate-limit.plugin.ts   # Rate limiting plugin
│   │
│   └── middleware/                    # GraphQL Middleware
│       ├── shield-config.ts           # Maps rules to schema operations
│       ├── rules.ts                   # Permission rules
│       ├── rule-utils.ts              # Rule logic utilities
│       └── utils.ts                   # Permission utilities
│
├── core/                              # Core Business Logic & Shared Utilities
│   ├── auth/                          # Authentication core
│   │   ├── scopes.ts                  # EnhancedAuthScopes implementation
│   │   └── types.ts                   # Auth types and interfaces
│   ├── entities/                      # Domain entities
│   ├── value-objects/                 # Value objects (UserId, Email)
│   ├── errors/                        # Error hierarchy
│   ├── logging/                       # Logging infrastructure
│   │   └── logger-factory.ts          # Logger factory implementation
│   ├── validation/                    # Validation schemas
│   │   └── enhanced-validations.ts    # Enhanced validation patterns
│   └── utils/                         # Shared utilities
│       └── relay-helpers.ts           # Global ID utilities
│
├── data/                              # Data Access Layer
│   └── repositories/                  # Repository implementations
│       ├── prisma-user.repository.ts
│       └── refresh-token.repository.ts
│
├── context/                           # GraphQL Context System
│   ├── context-direct.ts              # Context type definitions
│   ├── creation.ts                    # Context creation
│   ├── validation.ts                  # Context validation utilities
│   ├── utils.ts                       # JWT and request utilities
│   └── types.d.ts                     # Operation-specific context types
│
├── app/                               # Application Layer
│   ├── server.ts                      # Main server setup
│   ├── config/                        # App configuration
│   │   ├── environment.ts             # Environment variables
│   │   ├── index.ts                   # Config exports
│   │   ├── database.ts                # Database configuration
│   │   ├── auth.ts                    # Auth configuration
│   │   ├── server.ts                  # Server configuration
│   │   ├── container.ts               # DI container setup
│   │   └── configuration-legacy.ts    # Legacy configuration
│   ├── database/                      # Database utilities
│   │   ├── client.ts                  # Database client
│   │   └── index.ts                   # Database exports
│   ├── graphql/                       # GraphQL utilities
│   │   └── error-types.ts             # Error type definitions
│   └── services/                      # Application services
│       └── rate-limiter.service.ts   # Rate limiting service
│
├── gql/                               # GraphQL Operations (Client-side)
│   ├── mutations.ts                   # GraphQL mutations
│   ├── queries.ts                     # GraphQL queries
│   └── mutations-auth-tokens.ts       # Token-based auth mutations
│
└── prisma.ts                          # Prisma client instance
```

### Module Organization

Each feature module follows a consistent structure:
- **resolvers/**: Direct Pothos resolvers with business logic
- **services/**: Stateless services for reusable logic
- **guards/**: Authentication and authorization guards
- **types/**: Module-specific TypeScript types

The `shared` module contains utilities used across features:
- **connections/**: Relay-style pagination and connections
- **filtering/**: Advanced filtering with logical operators
- **pagination/**: Cursor, offset, and page-based pagination

## Key Architectural Patterns

### 1. Direct Pothos Resolvers

Business logic is implemented directly in Pothos resolvers with direct Prisma access:

```typescript
// Import Prisma directly - NOT from context
import { prisma } from '../../../prisma'

// Direct resolver pattern
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string({ required: false }),
    },
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      
      return prisma.post.create({
        ...query, // ALWAYS spread query first for field optimization
        data: {
          title: args.title,
          content: args.content,
          authorId: userId.value,
        },
      })
    },
  })
)
```

### 2. Module Imports

When importing from other modules:

```typescript
// Import from module index files when available
import { requireAuthentication } from '../../auth/guards'

// Or use specific paths for clarity
import { parseAndValidateGlobalId } from '../../../core/utils/relay-helpers'
```

### 3. Error Handling Pattern

Always normalize errors in catch blocks:

```typescript
import { normalizeError } from '../../../core/errors'

try {
  // operation
} catch (error) {
  throw normalizeError(error)
}
```

### 4. Authentication Guards

Use guard functions from the auth module:

```typescript
import { requireAuthentication, isAuthenticated } from '../../auth/guards'

// In resolver
const userId = requireAuthentication(context) // Throws if not authenticated
if (!isAuthenticated(context)) { /* handle */ } // Returns boolean
```

### 5. Global ID Handling

Use centralized relay helpers:

```typescript
import { parseAndValidateGlobalId, encodeGlobalId } from '../../../core/utils/relay-helpers'

// In resolvers
const numericId = await parseAndValidateGlobalId(args.id, 'Post')

// In tests
import { toPostId, extractNumericId } from '../../test/utils/helpers/relay.helpers'
```

### 6. Prisma Query Optimization

ALWAYS spread the query parameter first:

```typescript
resolve: async (query, _parent, args, context) => {
  return prisma.post.findMany({
    ...query, // CRITICAL: Enables field-level optimization
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
}
```

## Testing Infrastructure

### Test Organization

```
test/
├── modules/                        # Module-specific integration tests
│   ├── auth/
│   ├── posts/
│   └── users/
├── core/                           # Core functionality tests
├── utils/                          # Test utilities
│   ├── helpers/                    # Test helpers
│   └── fixtures/                   # Test fixtures
└── setup.ts                        # Test setup
```

### Running Tests

```bash
# Run all tests
bun run test --run

# Run specific test file
bun test test/modules/auth/auth.integration.test.ts

# Run tests matching pattern
bun run test -t "should create post"

# Run with watch mode
bun run test --watch
```

### Test Utilities

All tests use typed GraphQL operations and consistent helpers:

```typescript
import { print } from 'graphql'
import { CreatePostMutation } from '../../../src/gql/mutations'
import { gqlHelpers } from '../../utils/helpers/graphql.helpers'

const result = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(CreatePostMutation),
  variables,
  context
)
```

## Environment Variables

Required environment variables (see `.env` file):

```bash
DATABASE_URL="file:./dev.db"        # SQLite database path
JWT_SECRET="your-secret-key"        # JWT signing secret (min 32 chars)
JWT_EXPIRES_IN="7d"                 # JWT expiration time
BCRYPT_ROUNDS=10                    # Password hashing rounds
APP_SECRET="your-secret-key"        # App secret for signing
NODE_ENV="development"              # Environment mode
```

## Common Development Tasks

### Adding a New Feature Module

1. **Create module structure**:
   ```
   src/modules/feature/
   ├── resolvers/
   │   └── feature.resolver.ts
   ├── services/
   │   └── feature.service.ts
   ├── types/
   │   └── feature.types.ts
   └── index.ts
   ```

2. **Implement resolver**:
   ```typescript
   // src/modules/feature/resolvers/feature.resolver.ts
   import { prisma } from '../../../prisma'
   import { builder } from '../../../graphql/schema/builder'
   import { requireAuthentication } from '../../auth/guards'
   ```

3. **Register in schema**:
   ```typescript
   // src/graphql/schema/index.ts
   import '../../modules/feature/resolvers/feature.resolver'
   ```

### Module Best Practices

- Keep modules focused on a single domain
- Use index files for clean exports
- Share utilities through the `shared` module
- Avoid circular dependencies between modules
- Test each module in isolation

## Debugging Tips

- **Module imports**: Check relative paths and index exports
- **Type errors**: Run `bun run generate`
- **Test isolation**: Each test file has its own database
- **Global IDs**: Use relay helpers for consistent encoding/decoding
- **Prisma queries**: Always spread `query` parameter first
- **Context types**: Import from `context/context-direct.ts`

## Important Patterns to Remember

### Direct Prisma Access
Follow Pothos best practices - import Prisma directly:
```typescript
import { prisma } from '../../../prisma' // Direct import
// NOT: const prisma = context.prisma
```

### Module Boundaries
Respect module boundaries and use proper imports:
```typescript
// Good: Import from another module's public interface
import { TokenService } from '../../auth/services'

// Avoid: Deep imports into module internals
import { someHelper } from '../../auth/services/internal/helper'
```

### Shared Utilities
Use the shared module for cross-cutting concerns:
```typescript
import { createConnection } from '../../shared/connections/relay.utils'
import { transformStringFilter } from '../../shared/filtering/filter.utils'
import { validatePageArgs } from '../../shared/pagination/pagination.utils'
```

## Test Status

Current test suite status:
- **Total Tests**: 237
- **Passing**: 237 ✓
- **Success Rate**: 100%

The project has comprehensive test coverage across all modules with isolated SQLite databases for each test file.