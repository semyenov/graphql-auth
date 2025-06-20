# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run test                            # Run all tests
bun run test --run                      # Run all tests once (no watch)
bun run test -t "test name"             # Run specific test by name
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
  - **Scope Auth Plugin**: Dynamic authorization with EnhancedAuthScopes
  - **DataLoader Plugin**: Automatic batch loading for N+1 prevention
  - **Validation Plugin**: Zod integration with async refinements
  - **Shield Plugin**: Currently disabled due to module conflicts (permissions still active via middleware)
- **Database**: Prisma ORM with SQLite (dev.db) - accessed directly, not through context
- **Authentication**: JWT tokens with bcryptjs + refresh token rotation
- **Authorization**: GraphQL Shield middleware with Pothos Scope Auth + EnhancedAuthScopes (14+ scope types)
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities
- **Validation**: Zod schema validation with custom async refinements
- **Rate Limiting**: rate-limiter-flexible with configurable presets

### Architecture: Direct Pothos Resolvers

The project uses direct Pothos resolvers pattern:

```
src/
├── infrastructure/graphql/resolvers/  # Direct Pothos resolvers
│   ├── auth.resolver.ts               # Auth operations (signup, login, me)
│   ├── auth-tokens.resolver.ts        # Refresh token operations
│   ├── posts.resolver.ts              # Post CRUD operations
│   └── users.resolver.ts              # User search and management
│
├── infrastructure/graphql/authorization/ # Enhanced authorization system
│   └── enhanced-scopes.ts             # 14+ scope types with batch loading
│
├── schema/                            # GraphQL Schema Definition
│   ├── builder.ts                     # Pothos builder with plugins
│   ├── index.ts                       # Schema assembly and middleware
│   ├── types/                         # Prisma Node types
│   ├── scalars.ts                     # Custom scalars (DateTime)
│   ├── enums.ts                       # GraphQL enums
│   ├── inputs.ts                      # Input type definitions
│   └── error-types.ts                 # Error type definitions
│
├── context/                           # Context system
│   ├── enhanced-context-direct.ts     # Enhanced context with createScopes method
│   ├── auth.ts                        # Authentication guards
│   └── types.d.ts                     # Context type definitions
│
├── permissions/                       # Permission system
│   ├── index.ts                       # Shield middleware export
│   ├── rules-clean.ts                 # Permission rules
│   ├── utils-clean.ts                 # Permission utilities
│   └── shield-config.ts               # Maps rules to schema operations
```

## Key Architectural Patterns

### 1. Direct Prisma Access (Pothos Best Practice)

**ALWAYS** import Prisma directly, never from context:

```typescript
// ✅ CORRECT
import { prisma } from '../../../prisma'

// ❌ WRONG - Don't use context.prisma
import { prisma } from context
```

### 2. Enhanced Authorization with EnhancedAuthScopes

Due to Pothos type constraints, use EnhancedAuthScopes within resolvers:

```typescript
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'], // Basic scope check
    resolve: async (query, _parent, args, context) => {
      // Use enhanced scopes for complex authorization
      if ('createScopes' in context && typeof context.createScopes === 'function') {
        const scopes = context.createScopes()
        const canEdit = await scopes.canEditContent('Post', args.id)
        if (!canEdit) {
          throw new AuthorizationError('You cannot edit this post')
        }
      }
      // ... resolver logic
    }
  })
)
```

Available EnhancedAuthScopes:
- Basic: `public`, `authenticated`, `admin`
- Ownership: `postOwner(id)`, `userOwner(id)`
- Permissions: `hasPermission(perm)`, `hasAnyPermission([perms])`
- Content: `canViewContent(type, id)`, `canEditContent(type, id)`
- Rate limiting: `withinRateLimit(action, limit, window)`

### 3. Always Spread Prisma Query Parameter

**CRITICAL**: When using Pothos with Prisma, ALWAYS spread the `query` parameter first:

```typescript
resolve: async (query, _parent, args, context) => {
  return prisma.post.findMany({
    ...query, // ALWAYS FIRST - enables field-level optimization
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
}
```

### 4. Error Handling Pattern

Always use `normalizeError` in catch blocks:

```typescript
try {
  // operation
} catch (error) {
  throw normalizeError(error) // Converts to proper error type
}
```

Error hierarchy:
- `BaseError` (400)
- `AuthenticationError` (401) 
- `AuthorizationError` (403)
- `ValidationError` (400)
- `NotFoundError` (404)
- `ConflictError` (409)
- `RateLimitError` (429)

### 5. Global ID Handling

Use centralized relay helpers:

```typescript
// In resolvers
import { parseGlobalId, encodeGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
const numericId = parseGlobalId(args.id.toString(), 'Post')

// In tests
import { toPostId, toUserId, extractNumericId } from './test/relay-utils'
const globalId = toPostId(1) // 1 → "UG9zdDox"
const numericId = extractNumericId(globalId) // "UG9zdDox" → 1
```

## Current Issues & Workarounds

### Shield Plugin
The Shield plugin is temporarily disabled due to GraphQL module conflicts. Permissions are still enforced via GraphQL middleware in `src/schema/index.ts`.

### TypeScript Errors
Some TypeScript errors exist in test files and unused parameters. These don't affect functionality but should be cleaned up.

## Enhanced Authorization System

### EnhancedAuthScopes Overview

The project includes a sophisticated authorization system that extends Pothos Scope Auth plugin with 14+ scope types:

#### Key Features
- **Resource Ownership**: `postOwner()`, `userOwner()` for entity-based access control
- **Permission System**: `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()` for role-based auth
- **Content Visibility**: `canViewContent()`, `canEditContent()`, `canDeleteContent()` for content-based rules
- **Time-Based Rules**: `withinTimeLimit()`, `withinRateLimit()` for temporal authorization
- **Batch Operations**: `ScopeLoader` class for N+1 prevention in authorization checks
- **Conditional Logic**: `canAccessIfPublic()`, `canAccessIfOwnerOrPublic()` for complex scenarios

#### Usage Patterns

Due to Pothos type constraints, enhanced scopes are used within resolver functions:

```typescript
// Basic authentication (Pothos native)
authScopes: {
  authenticated: true, // Simple boolean scope
}

// Enhanced ownership check (in resolver function)
authScopes: async (_parent, args, context) => {
  const scopes = createEnhancedAuthScopes(context)
  const isOwner = await scopes.postOwner(args.id)
  
  if (!isOwner) {
    throw new AuthorizationError('You can only update your own posts')
  }
  
  return true
}

// Complex authorization with multiple checks
authScopes: async (_parent, args, context) => {
  const scopes = createEnhancedAuthScopes(context)
  
  // Admin can do anything
  if (scopes.admin) return true
  
  // Otherwise check ownership AND permission
  const [isOwner, canPublish] = await Promise.all([
    scopes.postOwner(args.id),
    scopes.hasPermission('post:publish')
  ])
  
  if (!isOwner || !canPublish) {
    throw new AuthorizationError('Insufficient permissions')
  }
  
  return true
}
```

#### Integration Files
- **Implementation**: `src/infrastructure/graphql/authorization/enhanced-scopes.ts`
- **Integration Guide**: `POTHOS-ENHANCED-SCOPES-INTEGRATION.md`
- **Usage Examples**: `ENHANCED-SCOPES-GUIDE.md`
- **Example Resolver**: `src/infrastructure/graphql/resolvers/example-enhanced-scopes.resolver.ts`
- **Tests**: `test/enhanced-scopes.test.ts`

#### Key Benefits
- **Type Safety**: Full TypeScript integration with Pothos
- **Performance**: Automatic DataLoader integration and batch authorization checks
- **Consistency**: Centralized authorization logic with descriptive errors
- **Flexibility**: Supports complex conditional authorization patterns

## Testing Strategy

### Running Tests
```bash
bun run test --run              # Run all tests once
bun test test/posts.test.ts     # Run specific file
bun run test -t "should create" # Run by test name
```

### Test Utilities
- `createAuthContext(userId)` - Create authenticated context
- `createMockContext()` - Create unauthenticated context
- `expectSuccessfulQuery/Mutation()` - Assert successful operations
- `expectGraphQLError()` - Assert error cases
- Isolated SQLite database per test file

### Typed GraphQL Operations
All tests use typed operations from `src/gql/`:
```typescript
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/mutations'

const result = await executeOperation(
  server,
  print(LoginMutation),
  variables,
  context
)
```

## Environment Variables

Required in `.env`:
```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
BCRYPT_ROUNDS=10
NODE_ENV="development"
```

## Common Development Tasks

### Adding a New Feature

1. **Update Prisma schema** if needed:
   ```bash
   bunx prisma migrate dev --name add-feature
   bun run generate
   ```

2. **Create resolver** in `src/infrastructure/graphql/resolvers/`:
   ```typescript
   builder.mutationField('createFeature', (t) =>
     t.prismaField({
       type: 'Feature',
       grantScopes: ['authenticated'],
       resolve: async (query, _parent, args, context) => {
         const userId = requireAuthentication(context)
         return prisma.feature.create({
           ...query, // ALWAYS spread query first
           data: { ...args.input, userId: userId.value }
         })
       }
     })
   )
   ```

3. **Add to schema** in `src/schema/index.ts`

4. **Update permissions** in `src/permissions/shield-config.ts`

5. **Write tests** in `test/feature.test.ts`

## API Endpoints

- **GraphQL Playground**: http://localhost:4000
- **GraphQL Endpoint**: POST http://localhost:4000/graphql

## Important Reminders

1. **Never** include Prisma in GraphQL context
2. **Always** spread `query` parameter first in Prisma operations
3. **Use** EnhancedAuthScopes within resolver functions, not in grantScopes
4. **Import** Prisma directly: `import { prisma } from '../../../prisma'`
5. **Normalize** errors in catch blocks
6. **Test** with `bun run test --run` before committing

## Debugging Tips

- **Type errors**: Run `bun run generate`
- **Permission denied**: Check JWT token and context.createScopes
- **Global ID issues**: Use relay-utils for conversion
- **Test failures**: Check for changed error messages in constants
- **Database issues**: Run `bun run db:reset`