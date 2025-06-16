# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run test                            # Run all tests
bun run test -t "test name"             # Run specific test
bun test test/auth.test.ts              # Run specific test file

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate all types
bun run db:reset                        # Reset database

# Common Issues
bun run generate                        # Fix type errors
bunx prisma studio                      # View database
```

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Package Manager**: Bun.sh
- **GraphQL Server**: Apollo Server 4 with Pothos schema builder
- **Database**: Prisma ORM with SQLite (dev.db)
- **Authentication**: JWT tokens with bcryptjs
- **Authorization**: GraphQL Shield middleware
- **HTTP Framework**: H3
- **Type Safety**:
  - GraphQL Tada for compile-time GraphQL typing
  - fetchdts for typed HTTP requests
- **Testing**: Vitest with happy-dom

## Essential Commands

### Development

```bash
bun run dev                  # Start development server on port 4000
bun run build               # Build for production
bun run start               # Start production server
```

### Database Management

```bash
bunx prisma migrate dev --name <name>  # Create/apply database migrations
bunx prisma generate                   # Generate Prisma client
bunx prisma studio                     # Open database GUI
bun run seed                          # Seed database with sample data
bun run db:reset                      # Reset database (delete and recreate)
```

### Code Generation

```bash
bun run generate            # Generate all types (Prisma + GraphQL)
bun run generate:prisma     # Generate Prisma client only
bun run generate:gql        # Generate GraphQL types only
bun run gen:schema          # Generate GraphQL schema file
```

### Testing

```bash
bun run test                # Run tests with Vitest
bun run test:ui             # Run tests with Vitest UI
bun run test:coverage       # Run tests with coverage report
```

### Type Checking & Code Quality

```bash
bunx tsc --noEmit           # Type check all TypeScript files
bunx prettier --check .     # Check code formatting
bunx prettier --write .     # Format code with Prettier
```

### Other Commands

```bash
bun run graphql:examples    # Run GraphQL examples demonstrating typed queries
bun run demo                # Run H3 demo server
```

## Code Style

The project uses Prettier with the following configuration:

- No semicolons
- Single quotes
- Trailing commas

The project uses TypeScript in strict mode with additional checks:

- `strict: true` - Enables all strict type checking options
- `noUnusedLocals`, `noUnusedParameters` - Prevents unused code
- `noUncheckedIndexedAccess` - Ensures safe array/object access
- `noImplicitOverride` - Requires explicit override keyword

Note: TypeScript is used only for type checking. Bun handles the actual compilation and execution.

## Architecture Overview

### GraphQL Schema Definition (Pothos + Relay)

The project uses **Pothos** with Relay plugin for type-safe GraphQL schema construction:

- `src/schema/builder.ts` - Pothos builder with Prisma and Relay plugins
- `src/schema/` - Modular GraphQL type definitions and resolvers
  - `index.ts` - Main schema export
  - `types/` - Object type definitions (User, Post)
  - `queries/` - Query resolvers
  - `mutations/` - Mutation resolvers
  - `scalars.ts`, `enums.ts`, `inputs.ts` - Type definitions
- `src/permissions/index.ts` - GraphQL Shield rules for authorization

### Key Patterns

1. **Prisma-First Development**: Database models are defined in `prisma/schema.prisma`, then exposed via GraphQL
2. **JWT Authentication**: Tokens are passed via `Authorization: Bearer <token>` header
3. **Context-Based Auth**: User ID is extracted from JWT and passed through GraphQL context
4. **Relay Patterns**: Using cursor-based pagination with Node interface for better caching
5. **Permission Rules**:
   - `isAuthenticatedUser` - Requires valid JWT
   - `isPostOwner` - Requires user to own the resource (handles global IDs)

### Relay Implementation

The schema uses Relay patterns for improved pagination and caching:

```typescript
// Objects implement Node interface with global IDs
builder.prismaNode('Post', {
  id: { field: 'id' },
  // Fields are auto-exposed by prismaNode
})

// Queries use cursor-based pagination
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query, root, args, ctx) => {
      return ctx.prisma.post.findMany({
        ...query,
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      })
    },
    totalCount: () => prisma.post.count({ where: { published: true } }),
  }),
)

// Mutations accept global IDs
builder.mutationField('deletePost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      id: t.arg.id({ required: true }), // ID! instead of Int!
    },
    resolve: async (query, parent, args, ctx) => {
      const { id: postId } = parseGlobalID(args.id, 'Post')
      // ... resolver logic
    },
  }),
)
```

### Adding New Features

1. **New Database Model**:

   ```bash
   # 1. Add model to prisma/schema.prisma
   # 2. Run migration
   bunx prisma migrate dev --name add-feature
   # 3. Add GraphQL type in src/schema/types/ using builder.prismaNode()
   ```

2. **New GraphQL Field**:

   ```typescript
   // For Relay-compliant types
   builder.prismaNode('Feature', {
     id: { field: 'id' },
     // Fields are auto-exposed, add computed fields if needed
     fields: (t) => ({
       computedField: t.string({
         resolve: (parent) => `Computed: ${parent.name}`,
       }),
     }),
   })

   // For connections
   builder.queryField('features', (t) =>
     t.prismaConnection({
       type: 'Feature',
       cursor: 'id',
       resolve: (query, root, args, ctx) => {
         return ctx.prisma.feature.findMany({
           ...query,
           where: { active: true },
         })
       },
     }),
   )
   ```

3. **Protected Endpoints**: Add permission rules in `src/permissions/shield-config.ts`

## Project Structure

```
src/
├── server.ts           # Apollo Server setup with H3
├── schema/             # GraphQL schema definitions (Pothos + Relay)
│   ├── index.ts        # Main schema export
│   ├── builder.ts      # Pothos builder with Relay plugin
│   ├── utils.ts        # parseGlobalID helper
│   ├── scalars.ts      # Custom scalar types
│   ├── enums.ts        # GraphQL enums
│   ├── inputs.ts       # Input type definitions
│   ├── types/          # Object type definitions (prismaNode)
│   │   ├── user.ts     # User type with Node interface
│   │   └── post.ts     # Post type with Node interface
│   ├── queries/        # Query resolvers with connections
│   │   ├── users.ts    # User queries (users, user, me)
│   │   └── posts.ts    # Post queries (feed, post, drafts)
│   └── mutations/      # Mutation resolvers with global IDs
│       ├── auth.ts     # Authentication mutations
│       └── posts.ts    # Post mutations
├── context/            # GraphQL context management
│   ├── index.ts        # Context export
│   ├── auth.ts         # Authentication logic
│   ├── creation.ts     # Context creation
│   ├── validation.ts   # Input validation
│   ├── utils.ts        # JWT utilities
│   └── types.d.ts      # Context type definitions
├── gql/                # GraphQL client utilities (GraphQL Tada)
│   ├── client.ts       # GraphQL client setup
│   ├── fragments.ts    # Reusable fragments
│   ├── relay-queries.ts    # Relay-compliant queries
│   ├── relay-mutations.ts  # Relay-compliant mutations
│   └── types.d.ts      # Generated types
├── prisma.ts           # Prisma client instance
├── generate-schema.ts  # Schema generation script
└── permissions/        # GraphQL Shield authorization
    ├── index.ts        # Permission middleware
    ├── rules.ts        # Permission rules (handles global IDs)
    └── shield-config.ts # Shield configuration

prisma/
├── schema.prisma       # Database models
├── seed.ts             # Database seeding
└── migrations/         # Migration history

test/
├── setup.ts            # Test setup and database cleanup
├── test-utils.ts       # Helper functions for testing
├── relay-utils.ts      # Global ID conversion helpers
├── auth.test.ts        # Authentication tests
├── posts.test.ts       # Post CRUD operation tests
├── user.test.ts        # User-related tests
└── permissions.test.ts # Permission system tests

_docs/
├── audit-report.md     # Security audit findings
└── schema.graphql      # Generated GraphQL schema

types/
└── pothos/             # Generated Pothos types

.pothos/
└── types.d.ts          # Pothos type definitions

.cursor/
└── rules/              # Cursor-specific development rules

graphql-env.d.ts        # GraphQL Tada environment
```

## Authentication & Authorization Flow

### Public Endpoints (No Auth Required)

- `Query.feed` - List published posts (with pagination)
- `Query.users` - List all users (with pagination)
- `Query.node/nodes` - Relay node queries
- `Mutation.signup` - Create new account
- `Mutation.login` - Authenticate user

### Protected Endpoints (JWT Required)

- `Query.me` - Current user profile
- `Query.drafts` - User's draft posts
- `Query.post` - Get specific post by global ID
- `Mutation.createDraft` - Create new post

### Owner-Only Endpoints (Resource Ownership)

- `Mutation.deletePost` - Delete own posts
- `Mutation.togglePublishPost` - Publish/unpublish own posts

## Testing GraphQL Endpoints

GraphQL Playground available at http://localhost:4000

**Public query example with Relay pagination**:

```graphql
query {
  feed(first: 10) {
    edges {
      node {
        id
        title
        author {
          name
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

**Authenticated query example** (set Authorization header):

```graphql
mutation {
  login(email: "alice@prisma.io", password: "myPassword42") {
    token
  }
}
```

## Common Issues

- **Port conflicts**: Server runs on port 4000 by default
- **Database errors**: Delete `prisma/dev.db` and re-run migrations
- **Type errors**: Run `bun run generate` to regenerate types
- **Auth errors**: Ensure JWT token format is correct and user exists in DB
- **Permission denied**: Check that the correct permission rule is applied and JWT is valid
- **Global ID errors**: Ensure IDs are base64-encoded in format "Type:id"

## Global ID Handling

The project uses Relay-style global IDs:

```typescript
// Converting between numeric and global IDs
import { parseGlobalID } from './src/schema/utils'
import { toPostId, toUserId } from './test/relay-utils'

// In resolvers
const { id: postId } = parseGlobalID(args.id, 'Post') // "UG9zdDox" → 1

// In tests
const globalId = toPostId(1) // 1 → "UG9zdDox"
```

## Testing

The project uses **Vitest** for testing with the following setup:

### Test Structure

```
test/
├── setup.ts          # Test setup and database cleanup
├── test-utils.ts     # Helper functions for testing
├── relay-utils.ts    # Global ID conversion helpers
├── auth.test.ts      # Authentication tests
└── posts.test.ts     # Post CRUD operation tests
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest'
import {
  executeOperation,
  createTestServer,
  createAuthContext,
} from './test-utils'
import { toPostId } from './relay-utils'

describe('Feature', () => {
  const server = createTestServer()

  it('should work', async () => {
    const result = await executeOperation(
      server,
      'query { feed(first: 10) { edges { node { id } } } }',
      {},
      createAuthContext('1'), // For authenticated requests
    )

    expect(result.body.kind).toBe('single')
  })
})
```

### Test Utilities

- `createMockContext()` - Creates a basic context for testing
- `createAuthContext(userId)` - Creates authenticated context with JWT
- `createTestServer()` - Creates Apollo Server instance for testing
- `executeOperation()` - Executes GraphQL operations against test server
- `generateTestToken(userId)` - Generates test JWT tokens
- `toPostId(id)`, `toUserId(id)` - Convert numeric IDs to global IDs
- `extractNumericId(globalId)` - Extract numeric ID from global ID

### Test Database

- Tests use a separate SQLite database (`test.db`)
- Database is cleaned between tests automatically
- No need to manually manage test data cleanup

### Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test -- --watch

# Run specific test file
bun run test auth.test.ts

# Run specific test by name pattern
bun run test -t "should create draft"

# Run tests for a specific module
bun run test permissions

# Generate coverage report
bun run test:coverage

# Run tests with UI
bun run test:ui
```

## Error Handling and Logging

The project uses **Consola** for structured logging with the following patterns:

### Logging Examples

```typescript
// Success logging
consola.success(`🚀 GraphQL Server ready at: ${url}`)

// Error logging with structured data
consola.error('GraphQL Error:', {
  message: error.message,
  path: error.path,
  locations: error.locations,
})

// Info logging with metadata
consola.info(`${method} ${url}`, {
  operationName: request.operationName,
  variables: Object.keys(variables),
})
```

### Error Response Structure

GraphQL errors include:

- `message` - Human-readable error message
- `locations` - Query locations where errors occurred
- `path` - GraphQL field path
- `extensions.code` - Error classification
- `extensions.timestamp` - ISO timestamp
- `extensions.stacktrace` - Stack trace (development only)

### Graceful Shutdown

The server implements proper shutdown handling:

```typescript
process.on('SIGINT', async () => {
  await server.stop()
  process.exit(0)
})
```

## Database Client Management

The project uses a shared Prisma client pattern for better test isolation:

### Production Client

```typescript
// src/prisma.ts - Production singleton
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()
```

### Test Client

```typescript
// src/shared-prisma.ts - Shared client for testing
import { getSharedClient } from './shared-prisma'
const prisma = getSharedClient()
```

This pattern ensures:

- Proper connection management in tests
- Isolated test transactions
- No connection pool exhaustion
- Clean test teardown

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
