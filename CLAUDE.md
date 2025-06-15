# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

### GraphQL Schema Definition
The project uses **Pothos** (not Nexus as mentioned in README) for type-safe GraphQL schema construction:

- `src/schema/builder.ts` - Pothos builder with Prisma plugin configuration
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
4. **Permission Rules**: 
   - `isAuthenticatedUser` - Requires valid JWT
   - `isPostOwner` - Requires user to own the resource

### Adding New Features

1. **New Database Model**:
   ```bash
   # 1. Add model to prisma/schema.prisma
   # 2. Run migration
   bunx prisma migrate dev --name add-feature
   # 3. Add GraphQL type in src/schema/types/ using builder.prismaObject()
   ```

2. **New GraphQL Field**:
   ```typescript
   // In src/schema/queries/ or src/schema/mutations/
   builder.queryField('fieldName', (t) =>
     t.prismaField({
       type: 'ModelName',
       resolve: (query, root, args, ctx) => ctx.prisma.model.findMany()
     })
   )
   ```

3. **Protected Endpoints**: Add permission rules in `src/permissions/index.ts`

## Project Structure

```
src/
├── server.ts           # Apollo Server setup with H3
├── schema/             # GraphQL schema definitions (Pothos)
│   ├── index.ts        # Main schema export
│   ├── builder.ts      # Pothos builder configuration
│   ├── scalars.ts      # Custom scalar types
│   ├── enums.ts        # GraphQL enums
│   ├── inputs.ts       # Input type definitions
│   ├── types/          # Object type definitions
│   │   ├── user.ts     # User type definition
│   │   └── post.ts     # Post type definition
│   ├── queries/        # Query resolvers
│   │   ├── users.ts    # User queries
│   │   └── posts.ts    # Post queries
│   └── mutations/      # Mutation resolvers
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
│   ├── queries.ts      # Typed queries
│   ├── mutations.ts    # Typed mutations
│   └── types.d.ts      # Generated types
├── prisma.ts           # Prisma client instance
├── generate-schema.ts  # Schema generation script
└── permissions/        # GraphQL Shield authorization
    ├── index.ts        # Permission middleware
    └── README.md       # Permission documentation

prisma/
├── schema.prisma       # Database models
├── seed.ts             # Database seeding
└── migrations/         # Migration history

test/
├── setup.ts            # Test setup and database cleanup
├── test-utils.ts       # Helper functions for testing
├── auth.test.ts        # Authentication tests
└── posts.test.ts       # Post CRUD operation tests

_docs/
├── audit-report.md     # Security audit findings
└── schema.graphql      # Generated GraphQL schema

types/
└── pothos/             # Generated Pothos types

.pothos/
└── types.d.ts          # Pothos type definitions

graphql-env.d.ts        # GraphQL Tada environment
```

## Authentication & Authorization Flow

### Public Endpoints (No Auth Required)
- `Query.feed` - List published posts
- `Query.allUsers` - List all users
- `Mutation.signup` - Create new account
- `Mutation.login` - Authenticate user

### Protected Endpoints (JWT Required)
- `Query.me` - Current user profile
- `Query.draftsByUser` - User's draft posts
- `Query.postById` - Get specific post
- `Mutation.createDraft` - Create new post

### Owner-Only Endpoints (Resource Ownership)
- `Mutation.deletePost` - Delete own posts
- `Mutation.togglePublishPost` - Publish/unpublish own posts

## Testing GraphQL Endpoints

GraphQL Playground available at http://localhost:4000

**Public query example**:
```graphql
query { feed { id title author { name } } }
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

## Pothos Schema Patterns

### Object Types
```typescript
// Define Prisma-backed objects
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    posts: t.relation('posts')
  })
})
```

### Query Fields
```typescript
builder.queryField('users', (t) =>
  t.prismaField({
    type: ['User'],
    resolve: (query, root, args, ctx) => {
      // IMPORTANT: Always spread ...query for Prisma optimizations
      return ctx.prisma.user.findMany({ ...query })
    }
  })
)
```

### Mutations with Auth
```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string()
    },
    resolve: async (query, root, args, ctx) => {
      const userId = ctx.userId
      if (!userId) throw new Error('Not authenticated')
      
      return ctx.prisma.post.create({
        ...query,
        data: {
          title: args.title,
          content: args.content || null,
          authorId: userId
        }
      })
    }
  })
)
```

## Type-Safe GraphQL with GraphQL Tada

### Define Typed Queries
```typescript
import { graphql } from '../graphql-env'

const GetUserQuery = graphql(`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`)

// Export types
export type GetUserResult = ResultOf<typeof GetUserQuery>
export type GetUserVariables = VariablesOf<typeof GetUserQuery>
```

### Type Flow
1. Prisma generates database types
2. Pothos uses Prisma types to build GraphQL schema
3. GraphQL Tada reads schema to provide typed queries
4. fetchdts provides typed HTTP client wrappers

## Permission Patterns

### Define Rules
```typescript
// src/permissions/rules.ts
export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  async (parent, args, ctx) => Boolean(ctx.userId)
)

export const isPostOwner = rule({ cache: 'contextual' })(
  async (parent, { id }, ctx) => {
    const post = await ctx.prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    })
    return post?.authorId === ctx.userId
  }
)
```

### Apply to Schema
```typescript
// src/permissions/index.ts
export const permissions = shield({
  Query: {
    me: isAuthenticatedUser,
    drafts: isAuthenticatedUser
  },
  Mutation: {
    createDraft: isAuthenticatedUser,
    deletePost: isPostOwner
  }
})
```

## Development Workflow

### Adding a Feature
1. Update Prisma schema if needed
2. Run `bunx prisma migrate dev --name feature-name`
3. Run `bun run generate` to update all types
4. Add GraphQL types in `src/schema/types/`
5. Add resolvers in `src/schema/queries/` or `src/schema/mutations/`
6. Add permissions in `src/permissions/index.ts`
7. Test with GraphQL Playground

### Testing Authentication
```bash
# Get auth token
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email: \"alice@prisma.io\", password: \"myPassword42\") { token } }"}'

# Use token in requests
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"{ me { id email } }"}'
```

## Testing

The project uses **Vitest** for testing with the following setup:

### Test Structure
```
test/
├── setup.ts          # Test setup and database cleanup
├── test-utils.ts     # Helper functions for testing
├── auth.test.ts      # Authentication tests
└── posts.test.ts     # Post CRUD operation tests
```

### Writing Tests
```typescript
import { describe, it, expect } from 'vitest'
import { executeOperation, createTestServer, createAuthContext } from './test-utils'

describe('Feature', () => {
  const server = createTestServer()

  it('should work', async () => {
    const result = await executeOperation(
      server,
      'query { feed { id } }',
      {},
      createAuthContext('1') // For authenticated requests
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

### Running Single Tests
```bash
# Run a single test file
bun test test/auth.test.ts

# Run tests matching a pattern
bun test -t "should create a new user"

# Run tests in a specific describe block
bun test -t "Authentication"
```

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

# Generate coverage report
bun run test:coverage
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
  locations: error.locations
})

// Info logging with metadata
consola.info(`${method} ${url}`, {
  operationName: request.operationName,
  variables: Object.keys(variables)
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