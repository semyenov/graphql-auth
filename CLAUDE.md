# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run build                           # Build for production (target: bun)
bun run test                            # Run all tests
bun run test -t "test name"             # Run specific test
bun test test/auth.test.ts              # Run specific test file

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate all types (Prisma + GraphQL)
bun run db:reset                        # Reset database
bunx prisma studio                      # View database GUI

# Code Quality
bunx tsc --noEmit                       # Type check
bunx prettier --write .                 # Format code
bun run env:verify                      # Verify environment setup
```

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **GraphQL Server**: Apollo Server 4 with Pothos schema builder
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL/MySQL/MongoDB (prod)
- **Authentication**: JWT tokens with bcryptjs
- **Authorization**: GraphQL Shield middleware with modular rules
- **Type Safety**:
  - GraphQL Tada for compile-time GraphQL typing
  - Zod for runtime validation
  - TypeScript strict mode
- **Testing**: Vitest with separate test databases
- **Logging**: Consola for structured logging

## Architecture Overview

### Core Modules

1. **Error Handling** (`src/errors/`)

   - Custom error classes extending `BaseError`
   - Structured error responses with codes and HTTP status
   - Error normalization for consistent API responses

2. **Constants** (`src/constants/`)

   - Centralized configuration values
   - AUTH, DATABASE, SERVER, VALIDATION constants
   - Error/success messages

3. **Utilities** (`src/utils/`)

   - `jwt.ts` - JWT token management
   - `validation.ts` - Zod schemas and validation helpers

4. **Environment** (`src/environment.ts`)
   - Type-safe environment parsing with Zod
   - Required: `APP_SECRET`, `DATABASE_URL`
   - Optional: `JWT_SECRET`, `CORS_ORIGIN`, `LOG_LEVEL`

### GraphQL Schema (Pothos with Prisma Plugin)

```
src/schema/
├── builder.ts      # Pothos builder with Prisma plugin
├── index.ts        # Schema assembly
├── types/          # Object type definitions (using prismaObject)
├── queries/        # Query resolvers (using prismaField)
├── mutations/      # Mutation resolvers (using prismaField)
├── inputs.ts       # Input type definitions
├── enums.ts        # GraphQL enums
└── scalars.ts      # Custom scalars
```

The Prisma plugin provides:

- Automatic query optimization (prevents N+1 queries)
- Type-safe field exposure from Prisma models
- Efficient relation loading with single database queries

**Note**: This codebase uses `t.expose()` syntax. Newer Pothos versions support `t.exposeID()`, `t.exposeString()` helpers.

### Permissions System

```
src/permissions/
├── rules.ts        # Individual permission rules
├── utils.ts        # Permission helper functions
├── shield-config.ts # GraphQL Shield configuration
└── index.ts        # Main exports
```

Key rules:

- `isAuthenticatedUser` - Requires valid JWT
- `isPostOwner` - Requires resource ownership
- `isAdmin`, `isModerator` - Role-based rules
- `rateLimitSensitiveOperations` - Rate limiting placeholder

### Context System

The context provides type-safe access to:

- Authentication state (`userId`, `isAuthenticated`)
- Request metadata (IP, user agent, operation)
- Security info (roles, permissions)
- Prisma client instance

## Development Patterns

### Adding a New Feature

1. **Database Model**:

   ```bash
   # Add to prisma/schema.prisma
   bunx prisma migrate dev --name add-feature
   bun run generate
   ```

2. **GraphQL Type (Pothos + Prisma)**:

   ```typescript
   // src/schema/types/feature.ts
   builder.prismaObject('Feature', {
     fields: (t) => ({
       id: t.expose('id', { type: 'Int' }),
       name: t.expose('name', { type: 'String' }),
       // Relations - automatically optimized
       user: t.relation('user'),
       // Relation with custom query
       items: t.relation('items', {
         query: { orderBy: { createdAt: 'desc' } },
       }),
       // Computed field with selection
       displayName: t.string({
         select: { name: true, user: { select: { name: true } } },
         resolve: (feature) => `${feature.name} by ${feature.user.name}`,
       }),
     }),
   })
   ```

3. **Resolver with Prisma Optimization**:

   ```typescript
   // src/schema/mutations/feature.ts
   import { validateInput, featureSchema } from '../../utils/validation'
   import { AuthenticationError, normalizeError } from '../../errors'

   // Mutation using prismaField for optimized queries
   builder.mutationField('createFeature', (t) =>
     t.prismaField({
       type: 'Feature',
       args: {
         /* ... */
       },
       resolve: async (query, _, args, ctx) => {
         try {
           const userId = getUserId(ctx)
           if (!userId) throw new AuthenticationError()

           const data = validateInput(featureSchema, args)
           // IMPORTANT: Always spread ...query for Prisma optimizations
           return await ctx.prisma.feature.create({
             ...query, // This enables automatic include/select
             data: { ...data, userId },
           })
         } catch (error) {
           throw normalizeError(error)
         }
       },
     }),
   )

   // Query using prismaField to prevent N+1 queries
   builder.queryField('features', (t) =>
     t.prismaField({
       type: ['Feature'],
       resolve: async (query, _, args, ctx) => {
         // The query object handles relations efficiently
         return ctx.prisma.feature.findMany({
           ...query,
           where: { published: true },
           orderBy: { createdAt: 'desc' },
         })
       },
     }),
   )
   ```

4. **Add Permission Rule**:
   ```typescript
   // src/permissions/shield-config.ts
   Mutation: {
     createFeature: rules.isAuthenticatedUser,
   }
   ```

### Error Handling

Always use custom error classes:

```typescript
import { AuthenticationError, ValidationError, NotFoundError } from '../errors'

// Instead of: throw new Error('Not authenticated')
throw new AuthenticationError()

// Instead of: throw new Error('Post not found')
throw new NotFoundError('Post', postId)

// Validation errors
throw new ValidationError({ field: ['error message'] })
```

### Input Validation

Use Zod schemas from `utils/validation.ts`:

```typescript
import { validateInput, createPostSchema } from '../utils/validation'

const validatedData = validateInput(createPostSchema, input)
// Throws ValidationError if invalid
```

### Testing Patterns

```typescript
import { createTestServer, createAuthContext, gqlHelpers } from './test-utils'

describe('Feature', () => {
  const server = createTestServer()

  it('should work', async () => {
    const data = await gqlHelpers.expectSuccessfulMutation(
      server,
      query,
      variables,
      createAuthContext('1'), // For authenticated requests
    )
  })
})
```

## Pothos-Prisma Best Practices

### Object Definition Patterns

```typescript
// Current pattern in codebase
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.expose('id', { type: 'Int' }),
    email: t.expose('email', { type: 'String' }),
    name: t.expose('name', { type: 'String', nullable: true }),
    posts: t.relation('posts'),
  }),
})

// Alternative with newer Pothos syntax (if upgrading)
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    posts: t.relation('posts'),
    postCount: t.relationCount('posts'),
  }),
})
```

### Query Optimization

```typescript
// ✅ GOOD: Using prismaField with query spread
builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    args: { id: t.arg.int({ required: true }) },
    resolve: async (query, _, args, ctx) => {
      return ctx.prisma.post.findUniqueOrThrow({
        ...query, // Critical for optimization
        where: { id: args.id },
      })
    },
  }),
)

// ❌ AVOID: Forgetting to spread query
resolve: async (query, _, args, ctx) => {
  return ctx.prisma.post.findUnique({
    where: { id: args.id }, // Missing ...query - breaks optimization!
  })
}
```

### Relation Patterns

```typescript
// Efficient relation with filtering
posts: t.relation('posts', {
  args: {
    published: t.arg.boolean(),
    limit: t.arg.int(),
  },
  query: (args) => ({
    where: args.published !== null ? { published: args.published } : undefined,
    take: args.limit ?? undefined,
    orderBy: { createdAt: 'desc' },
  }),
})

// Computed fields with minimal DB queries
fullName: t.string({
  select: {
    firstName: true,
    lastName: true,
  },
  resolve: (user) => `${user.firstName} ${user.lastName}`,
})
```

### Relay Support (Available but Not Used)

The project has `@pothos/plugin-relay` installed and configured but currently uses offset-based pagination.

**Example Implementation**: See `src/schema/relay-examples.ts` for complete working examples of Relay patterns. 

Benefits of Relay patterns:
- **Stable pagination**: Cursor-based pagination handles data changes better
- **Global object identification**: Enables client-side caching
- **Standardized connections**: Consistent pagination across all types
- **Better performance**: More efficient for large datasets

To implement Relay patterns:

```typescript
// 1. Convert objects to Relay Nodes
builder.prismaNode('Post', {
  id: { field: 'id' }, // Uses 'id' field for global identification
  fields: (t) => ({
    title: t.expose('title', { type: 'String' }),
    content: t.expose('content', { type: 'String', nullable: true }),
    published: t.expose('published', { type: 'Boolean' }),
    author: t.relation('author'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
})

// 2. Implement cursor-based pagination with connections
builder.queryField('posts', (t) => 
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    args: {
      published: t.arg.boolean(),
    },
    resolve: async (query, parent, args, ctx) => {
      return ctx.prisma.post.findMany({
        ...query,
        where: { 
          published: args.published ?? true 
        },
        orderBy: { createdAt: 'desc' }
      })
    },
    totalCount: async (parent, args, ctx) => {
      return ctx.prisma.post.count({
        where: { published: args.published ?? true }
      })
    },
  })
)

// 3. Use relatedConnection for relations
builder.prismaNode('User', {
  id: { field: 'id' },
  fields: (t) => ({
    email: t.expose('email', { type: 'String' }),
    posts: t.relatedConnection('posts', {
      cursor: 'id',
      args: {
        published: t.arg.boolean(),
      },
      query: (args) => ({
        where: { published: args.published ?? undefined }
      }),
    }),
  }),
})

// Current implementation status:
// ❌ Uses offset pagination (skip/take)
// ❌ No Node interface implementation
// ❌ No Connection/Edge types
// ✅ Relay plugin is installed and configured
```

#### Migration from Offset to Cursor Pagination

```typescript
// BEFORE: Offset-based (current implementation)
builder.queryField('feed', (t) =>
  t.prismaField({
    type: ['Post'],
    args: {
      skip: t.arg.int(),
      take: t.arg.int(),
    },
    resolve: (query, _, args) => {
      return prisma.post.findMany({
        ...query,
        skip: args.skip || undefined,
        take: args.take || undefined,
      })
    }
  })
)

// AFTER: Cursor-based with Relay
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    // Automatically adds: first, last, before, after args
    resolve: (query, _, args, ctx) => {
      return ctx.prisma.post.findMany({
        ...query,
        where: { published: true }
      })
    }
  })
)

// Client query changes:
// Before: query { feed(skip: 10, take: 5) { id title } }
// After:  query { feed(first: 5, after: "cursor") { 
//           edges { node { id title } cursor }
//           pageInfo { hasNextPage endCursor }
//         }}
```

## Common Issues & Solutions

- **Type errors**: Run `bun run generate`
- **Build errors**: Ensure `bunfig.toml` has `target = "bun"`
- **Test failures**: Check error messages match new patterns (e.g., "Invalid email or password" not "Invalid password")
- **Permission errors**: Verify context has proper userId and roles
- **Database issues**: Run `bun run db:reset`
- **N+1 queries**: Ensure you're using `prismaField` and spreading `...query`
- **Missing relations**: Check that Prisma schema has proper `@relation` directives

## Key Files Reference

- `src/constants/` - All magic values and configuration
- `src/errors/` - Error handling system
- `src/utils/validation.ts` - Input validation schemas
- `src/utils/jwt.ts` - JWT utilities
- `src/permissions/` - Modular authorization system
- `test/test-utils.ts` - Testing helpers
- `bunfig.toml` - Bun configuration (build target)

## Environment Variables

Required:

- `APP_SECRET` - JWT signing secret (min 8 chars)
- `DATABASE_URL` - Database connection string

Optional:

- `JWT_SECRET` - Separate JWT secret (defaults to APP_SECRET)
- `PORT` - Server port (default: 4000)
- `HOST` - Server host (default: localhost)
- `LOG_LEVEL` - Logging level (debug|info|warn|error)
- `CORS_ORIGIN` - CORS origin configuration
