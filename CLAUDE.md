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
bun run generate                        # Generate all types (fixes type errors)
bun run db:reset                        # Reset database

# Code Quality
bunx tsc --noEmit                       # Type check
bunx prettier --write .                 # Format code
```

## Architecture Overview

### GraphQL Schema (Pothos + Relay)

The project uses **Pothos** with Relay plugin for type-safe schema construction:

```
src/schema/
├── builder.ts          # Pothos builder with Prisma + Relay plugins
├── index.ts           # Main schema export
├── utils.ts           # Global ID encoding/decoding
├── types/             # Object types using prismaNode
├── queries/           # Query resolvers with prismaConnection
├── mutations/         # Mutation resolvers with utility functions
│   ├── auth.ts       # Authentication mutations
│   ├── auth-utils.ts # Extracted auth logic (password hashing, user creation)
│   ├── posts.ts      # Post CRUD mutations
│   └── utils.ts      # Post operation utilities
├── scalars.ts        # Custom scalars (DateTime)
├── enums.ts          # GraphQL enums
└── inputs.ts         # Input type definitions
```

### Authorization System

GraphQL Shield middleware with modular rule system:

```
src/permissions/
├── index.ts           # Shield middleware export
├── rules.ts          # Permission rules using rule-utils
├── rule-utils.ts     # Extracted rule logic (ownership checks, validation)
├── shield-config.ts  # Maps rules to schema operations
└── utils.ts          # Permission utilities
```

### Context System

Type-safe context with enhanced authentication:

```
src/context/
├── index.ts          # Context exports
├── auth.ts           # Authentication guards (isAuthenticated, requireAuthentication)
├── creation.ts       # Context creation with error handling
├── validation.ts     # Context validation utilities
├── utils.ts          # JWT and request utilities
├── constants.ts      # Centralized constants
└── types.ts          # Operation-specific context types
```

### Error Handling

Hierarchical error system with descriptive messages:

```
src/errors/
├── index.ts          # Error class definitions
├── README.md         # Usage examples
├── usage-guide.md    # Comprehensive guide
└── examples.ts       # Real-world examples
```

Error hierarchy:
- `BaseError` (400) - Base class with code and statusCode
- `AuthenticationError` (401) - "You must be logged in to perform this action"
- `AuthorizationError` (403) - "You can only modify posts that you have created"
- `ValidationError` (400) - Field-specific validation errors
- `NotFoundError` (404) - "Post with identifier 'X' not found"
- `ConflictError` (409) - "An account with this email already exists"
- `RateLimitError` (429) - Rate limiting with retry information

## Key Architectural Patterns

### 1. Relay Implementation

All entities use global IDs (base64-encoded "Type:id"):

```typescript
// Object types auto-implement Node interface
builder.prismaNode('Post', {
  id: { field: 'id' },
  // Fields auto-exposed from Prisma
})

// Queries use cursor-based pagination
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query, root, args, ctx) => {
      return ctx.prisma.post.findMany({
        ...query, // ALWAYS spread query
        where: { published: true },
      })
    },
  })
)

// Mutations accept global IDs
builder.mutationField('deletePost', (t) =>
  t.prismaField({
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, parent, args, ctx) => {
      const { postId } = await validatePostAccess(args.id, ctx)
      return deletePostById(postId, query)
    },
  })
)
```

### 2. Clean Code Patterns

Extracted utility functions for single responsibility:

```typescript
// Authentication utilities (src/schema/mutations/auth-utils.ts)
- checkUserExists(email)
- hashPassword(password)
- createUser(data)
- authenticateUser(email, password)

// Post operation utilities (src/schema/mutations/utils.ts)
- validatePostAccess(globalId, context, checkOwnership)
- createDraftPost(title, content, userId, query)
- togglePostPublication(postId, currentStatus, query)
- deletePostById(postId, query)

// Permission rule utilities (src/permissions/rule-utils.ts)
- validateResourceId(id, resourceType)
- checkPostOwnership(postId, userId)
- createAuthenticationCheck(context)
- createRoleCheck(context, role)
- handleRuleError(error)
```

### 3. Error Handling Pattern

Always use `normalizeError` in catch blocks:

```typescript
try {
  // Validate input
  const data = validateInput(schema, args)
  
  // Check authentication
  const userId = requireAuthentication(context)
  
  // Perform operation
  return await operation(data)
} catch (error) {
  throw normalizeError(error) // Converts to BaseError
}
```

### 4. Permission Rules Pattern

Rules return errors instead of throwing:

```typescript
export const isPostOwner = rule({ cache: 'strict' })(
  async (parent, args, context) => {
    try {
      validateResourceId(args.id, 'post')
      const userId = requireAuthentication(context)
      const postId = await parseAndValidateGlobalId(args.id, 'Post')
      
      const ownership = await checkPostOwnership(postId, userId)
      if (!ownership.resourceExists) {
        throw new NotFoundError('Post', args.id)
      }
      if (!ownership.isOwner) {
        throw new AuthorizationError(ERROR_MESSAGES.NOT_POST_OWNER)
      }
      
      return true
    } catch (error) {
      return handleRuleError(error)
    }
  }
)
```

## Testing Strategy

### Test Utilities

```typescript
// Global ID conversion
toPostId(1)              // 1 → "UG9zdDox"
toUserId(1)              // 1 → "VXNlcjox"
extractNumericId(globalId) // "UG9zdDox" → 1

// Context creation
createAuthContext(userId)  // Authenticated context with JWT
createMockContext()        // Unauthenticated context

// GraphQL execution
executeOperation(server, query, variables, context)
expectSuccessfulQuery(server, query, variables, context)
expectGraphQLError(server, query, variables, context, errorSubstring)
```

### Test Database

- Isolated SQLite database per test file
- Automatic cleanup between tests
- No manual cleanup needed

## Common Development Tasks

### Adding a New Feature

1. **Database Model**:
   ```bash
   # Update prisma/schema.prisma
   bunx prisma migrate dev --name add-feature
   bun run generate
   ```

2. **GraphQL Type**:
   ```typescript
   // src/schema/types/feature.ts
   builder.prismaNode('Feature', {
     id: { field: 'id' },
     fields: (t) => ({
       // Only computed fields here
     }),
   })
   ```

3. **Query with Pagination**:
   ```typescript
   // src/schema/queries/features.ts
   builder.queryField('features', (t) =>
     t.prismaConnection({
       type: 'Feature',
       cursor: 'id',
       resolve: (query, root, args, ctx) => {
         return ctx.prisma.feature.findMany({
           ...query,
           where: { /* filters */ },
         })
       },
     })
   )
   ```

4. **Protected Mutation**:
   ```typescript
   // src/schema/mutations/features.ts
   builder.mutationField('createFeature', (t) =>
     t.prismaField({
       type: 'Feature',
       args: { /* input */ },
       resolve: async (query, parent, args, ctx) => {
         const userId = requireAuthentication(ctx)
         // Use utility functions for operations
       },
     })
   )
   
   // src/permissions/shield-config.ts
   Mutation: {
     createFeature: isAuthenticatedUser,
   }
   ```

### Working with Global IDs

```typescript
// In resolvers
import { parseGlobalID } from '../schema/utils'
const { id: numericId } = parseGlobalID(args.id, 'Post')

// In tests
import { toPostId, extractNumericId } from './test/relay-utils'
const globalId = toPostId(1)
const numericId = extractNumericId(result.data.post.id)
```

## Debugging Tips

- **Type errors**: Run `bun run generate`
- **GraphQL Playground**: http://localhost:4000
- **Database viewer**: `bunx prisma studio`
- **Global ID format**: Base64("Type:id") e.g., "UG9zdDox" = "Post:1"
- **Permission errors**: Check JWT token and shield-config.ts mappings
- **Test failures**: Check error message changes in constants/index.ts