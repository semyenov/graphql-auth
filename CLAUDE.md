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
  - Pothos with Relay plugin for schema definition
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
bun test test/auth.test.ts  # Run specific test file
bun run test -t "pattern"   # Run tests matching pattern
```

### Type Checking & Code Quality

```bash
bunx tsc --noEmit           # Type check all TypeScript files
bunx prettier --check .     # Check code formatting
bunx prettier --write .     # Format code with Prettier
```

## Architecture Overview

### GraphQL Schema (Pothos + Relay)

The project uses **Pothos** with Relay plugin for type-safe GraphQL schema construction:

- **Builder Configuration**: `src/schema/builder.ts` configures Pothos with Prisma and Relay plugins
- **Schema Organization**:
  - `src/schema/index.ts` - Main schema export
  - `src/schema/utils.ts` - Global ID encoding/decoding utilities
  - `src/schema/types/` - Object type definitions using `prismaNode`
  - `src/schema/queries/` - Query resolvers with `prismaConnection` for pagination
  - `src/schema/mutations/` - Mutation resolvers accepting global IDs
  - `src/schema/scalars.ts`, `enums.ts`, `inputs.ts` - Type definitions

### Authorization System

- **GraphQL Shield**: `src/permissions/` implements middleware-based authorization
  - `index.ts` - Exports permission middleware
  - `rules.ts` - Permission rules (handles global IDs)
  - `shield-config.ts` - Maps rules to schema operations

### Context System

Enhanced type-safe context management in `src/context/`:
- `auth.ts` - Authentication guards (`isAuthenticated`, `requireAuthentication`)
- `creation.ts` - Context creation with comprehensive error handling
- `validation.ts` - Context validation utilities
- `utils.ts` - JWT and request utilities
- `constants.ts` - Centralized constants (no magic strings)
- `types.ts` - Operation-specific context types for type safety

### Error Handling

Custom error class hierarchy in `src/errors/`:
```typescript
BaseError (400)
├── AuthenticationError (401) - Authentication required
├── AuthorizationError (403) - Insufficient permissions  
├── ValidationError (400) - Input validation failed
├── NotFoundError (404) - Resource not found
├── ConflictError (409) - Conflicts with existing data
└── RateLimitError (429) - Rate limit exceeded
```

## Key Architecture Patterns

1. **Prisma-First Development**: Database models drive GraphQL schema
2. **JWT Authentication**: Bearer tokens in Authorization header
3. **Global ID System**: All entities use base64-encoded IDs ("Type:id")
4. **Relay Pagination**: Cursor-based pagination with connections
5. **Error Normalization**: `normalizeError()` converts all errors to BaseError
6. **Permission Rules**: Return errors instead of throwing in GraphQL Shield

## Relay Implementation Details

### Object Types
```typescript
// Use prismaNode for Relay compliance
builder.prismaNode('Post', {
  id: { field: 'id' }, // Auto-implements Node interface
  // Fields are auto-exposed from Prisma
})
```

### Query Connections
```typescript
// Use prismaConnection for pagination
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query, root, args, ctx) => {
      return ctx.prisma.post.findMany({
        ...query, // IMPORTANT: Always spread query
        where: { published: true },
      })
    },
    totalCount: () => prisma.post.count({ where: { published: true } }),
  }),
)
```

### Mutations with Global IDs
```typescript
builder.mutationField('deletePost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      id: t.arg.id({ required: true }), // Accepts global ID
    },
    resolve: async (query, parent, args, ctx) => {
      const { id: postId } = parseGlobalID(args.id, 'Post')
      // Use numeric postId with Prisma
    },
  }),
)
```

## Adding New Features

### 1. New Database Model

```bash
# Add model to prisma/schema.prisma
# Run migration
bunx prisma migrate dev --name add-feature
# Generate types
bun run generate
```

### 2. New GraphQL Type

```typescript
// In src/schema/types/feature.ts
builder.prismaNode('Feature', {
  id: { field: 'id' },
  // Add only computed fields here
  fields: (t) => ({
    computedField: t.string({
      resolve: (parent) => computeValue(parent),
    }),
  }),
})
```

### 3. New Query with Pagination

```typescript
// In src/schema/queries/features.ts
builder.queryField('features', (t) =>
  t.prismaConnection({
    type: 'Feature',
    cursor: 'id',
    resolve: (query, root, args, ctx) => {
      return ctx.prisma.feature.findMany({
        ...query,
        where: buildWhereClause(args),
      })
    },
  }),
)
```

### 4. Protected Mutation

```typescript
// In src/schema/mutations/features.ts
builder.mutationField('createFeature', (t) =>
  t.prismaField({
    type: 'Feature',
    args: {
      data: t.arg({ type: FeatureCreateInput, required: true }),
    },
    resolve: async (query, parent, args, ctx) => {
      const userId = requireAuthentication(ctx)
      return ctx.prisma.feature.create({
        ...query,
        data: { ...args.data, userId },
      })
    },
  }),
)

// In src/permissions/shield-config.ts
Mutation: {
  createFeature: isAuthenticatedUser,
}
```

## Testing Patterns

### Test Setup
- Uses Vitest with isolated SQLite databases per test file
- Automatic cleanup between tests
- JWT tokens generated for authenticated tests

### Key Test Utilities
```typescript
import { 
  createTestServer,
  executeOperation,
  createAuthContext,
  toPostId,
  toUserId,
  extractNumericId 
} from './test-utils'
```

### Writing Tests
```typescript
describe('Feature', () => {
  const server = createTestServer()
  
  it('should handle relay IDs', async () => {
    const globalId = toPostId(1) // Convert to global ID
    const result = await executeOperation(
      server,
      `mutation { deletePost(id: "${globalId}") { id } }`,
      {},
      createAuthContext('1')
    )
    // Assertions...
  })
})
```

## Global ID Handling

### In Resolvers
```typescript
import { parseGlobalID } from './src/schema/utils'

// Decode global ID to numeric ID
const { id: postId } = parseGlobalID(args.id, 'Post')
```

### In Tests
```typescript
import { toPostId, toUserId, extractNumericId } from './test/relay-utils'

// Encode numeric ID to global ID
const globalId = toPostId(1) // "UG9zdDox"

// Extract numeric ID from result
const numericId = extractNumericId(result.data.post.id)
```

## Common Patterns

### Error Handling in Mutations
```typescript
try {
  // Validate input
  const data = validateInput(schema, args)
  
  // Check authentication
  const userId = requireAuthentication(context)
  
  // Perform operation
  return await prisma.model.create({ data })
} catch (error) {
  throw normalizeError(error) // Always normalize
}
```

### Permission Rules
```typescript
// Return errors, don't throw
export const isOwner = rule()(async (parent, args, ctx) => {
  if (!ctx.userId) {
    return new AuthenticationError()
  }
  // Check ownership...
  return true
})
```

### Context Type Guards
```typescript
// Use type-safe context checks
if (isAuthenticated(context)) {
  // TypeScript knows context.userId is number
  const userId = context.userId
}
```

## Development Workflow

1. **Schema Changes**: Update `prisma/schema.prisma` → migrate → generate
2. **GraphQL Changes**: Update schema files → test with playground
3. **Permission Changes**: Update rules → update shield config
4. **Testing**: Write tests with Relay IDs → run `bun test`

## Debugging Tips

- **GraphQL Playground**: http://localhost:4000
- **Database GUI**: `bunx prisma studio`
- **Type Errors**: Run `bun run generate`
- **Global ID Issues**: Check base64 encoding format "Type:id"
- **Permission Errors**: Verify JWT token and rule configuration