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

### Architecture: Modular Direct Resolvers

The project uses a **modular architecture** with direct Pothos resolvers organized by feature:

```
src/
├── app/                              # Application entry and configuration
│   ├── server.ts                     # Main server setup
│   ├── config/                       # Configuration (auth, database, environment)
│   └── middleware/                   # Application-level middleware
│
├── modules/                          # Feature modules (domain-driven)
│   ├── auth/                         # Authentication module
│   │   ├── auth.schema.ts            # GraphQL schema definitions
│   │   ├── auth.permissions.ts       # Authorization rules
│   │   ├── auth.validation.ts        # Input validation schemas
│   │   ├── resolvers/                # GraphQL resolvers
│   │   ├── services/                 # Business logic services
│   │   └── types/                    # Module-specific types
│   ├── posts/                        # Posts module (same structure)
│   └── users/                        # Users module (same structure)
│
├── graphql/                          # GraphQL infrastructure
│   ├── schema/                       # Schema building and assembly
│   │   ├── builder.ts                # Pothos builder with plugins
│   │   ├── plugins/                  # Schema plugins
│   │   └── types/                    # GraphQL type definitions
│   ├── context/                      # GraphQL context
│   ├── directives/                   # Custom GraphQL directives
│   └── middleware/                   # GraphQL-specific middleware
│
├── core/                             # Core business logic and utilities
│   ├── auth/                         # Authentication core
│   ├── errors/                       # Error handling system
│   ├── logging/                      # Logging system
│   ├── utils/                        # Core utilities
│   └── validation/                   # Validation system
│
├── data/                             # Data access layer
│   ├── database/                     # Database configuration
│   ├── loaders/                      # DataLoader implementations
│   ├── repositories/                 # Repository pattern (if needed)
│   └── cache/                        # Caching layer
│
├── types/                            # Global type definitions
└── constants/                        # Application constants
```

### Authorization System

GraphQL Shield middleware with modular rule system:

```
src/graphql/middleware/
├── shield-config.ts    # Maps rules to schema operations
├── rules.ts           # Permission rules using rule-utils
├── rule-utils.ts      # Extracted rule logic (ownership checks, validation)
└── auth.middleware.ts # Authentication middleware
```

### Context System

Type-safe context with enhanced authentication:

```
src/graphql/context/
├── context.types.ts    # Context type definitions
├── context.factory.ts  # Context creation with error handling
├── context.auth.ts     # Authentication guards (isAuthenticated, requireAuthentication)
└── context.utils.ts    # JWT and request utilities
```

### Error Handling

Hierarchical error system with descriptive messages:

```
src/core/errors/
├── types.ts        # Error class definitions
├── handlers.ts     # Error handlers and normalizers
├── formatters.ts   # Error formatters
└── constants.ts    # Error messages and codes
```

Error hierarchy:
- `BaseError` (400) - Base class with code and statusCode
- `AuthenticationError` (401) - "You must be logged in to perform this action"
- `AuthorizationError` (403) - "You can only modify posts that you have created"
- `ValidationError` (400) - Field-specific validation errors
- `NotFoundError` (404) - "Post with identifier 'X' not found"
- `ConflictError` (409) - "An account with this email already exists"
- `RateLimitError` (429) - Rate limiting with retry information

### Testing Infrastructure

Comprehensive testing utilities:

```
test/
├── modules/                    # Module-specific tests
│   ├── auth/                   # Auth module tests
│   ├── posts/                  # Posts module tests
│   └── users/                  # Users module tests
├── core/                       # Core functionality tests
├── utils/                      # Test utilities
│   ├── helpers/                # Test helpers by category
│   ├── fixtures/               # Test fixtures
│   └── factories/              # Test data factories
└── performance/                # Performance tests
```

## Key Architectural Patterns

### 1. Advanced Pothos Plugin Architecture

The schema builder uses multiple Pothos plugins with advanced integration patterns:

```typescript
// Advanced builder configuration (src/graphql/schema/builder.ts)
plugins: [PrismaPlugin, RelayPlugin, DataloaderPlugin, ErrorsPlugin, ScopeAuthPlugin, ValidationPlugin],
prisma: {
    client: prisma,
    dmmf: prisma._runtimeDataModel, // Pre-load DMMF for faster startup
    filterConnectionTotalCount: true,
    onUnusedQuery: isProduction ? null : 'warn',
},
relay: {
    clientMutationId: 'omit', // Modern Relay style
    cursorType: 'String',
},
errors: {
    defaultTypes: [Error, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError],
    directResult: true, // Enable direct result mode
},
```

### 2. Direct Pothos Resolvers with Direct Prisma Access

**Important**: Following Pothos best practices, Prisma is NOT included in the GraphQL context to improve TypeScript performance. Always import Prisma directly:

```typescript
// Import Prisma directly - NOT from context
import { prisma } from '../../../prisma'

// Direct resolver pattern - business logic in resolver
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string({ required: false }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      const userId = requireAuthentication(context)
      
      return prisma.post.create({
        ...query, // ALWAYS spread query for Prisma optimizations
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

### 3. Enhanced Relay Implementation

All entities use global IDs with enhanced pagination:

```typescript
// Enhanced Node interface
builder.prismaNode('User', {
  id: { field: 'id' },
  fields: (t) => ({
    posts: t.relatedConnection('posts', {
      cursor: 'id',
      totalCount: true,
      query: (args, context) => ({
        orderBy: { createdAt: 'desc' },
        where: args.published !== undefined 
          ? { published: args.published }
          : undefined,
      }),
    }),
  }),
})
```

### 4. Error Handling Pattern

Always use `normalizeError` in catch blocks:

```typescript
try {
  // operation
} catch (error) {
  throw normalizeError(error) // Converts to BaseError
}
```

### 5. Permission Rules Pattern

Rules return errors instead of throwing:

```typescript
export const isPostOwner = rule({ cache: 'strict' })(
  async (parent, args, context) => {
    try {
      const userId = requireAuthentication(context)
      const postId = await parseAndValidateGlobalId(args.id, 'Post')
      
      const ownership = await checkPostOwnership(postId, userId)
      if (!ownership.isOwner) {
        throw new AuthorizationError('You can only modify posts that you have created')
      }
      
      return true
    } catch (error) {
      return handleRuleError(error)
    }
  }
)
```

## Current Resolver Operations

The following operations are available and fully tested:

### Authentication Operations
- `signup` - Create new user account with email/password
- `login` - Authenticate user and return JWT token  
- `me` - Get current authenticated user profile

### Authentication with Refresh Tokens
- `loginWithTokens` - Login and receive access + refresh tokens
- `refreshToken` - Refresh access token using refresh token 
- `logout` - Revoke all refresh tokens for user

### Post Operations
- `createPost` - Create new post (draft by default)
- `updatePost` - Update existing post (owner only)
- `deletePost` - Delete post (owner only)
- `togglePublishPost` - Toggle post publish status (owner only)
- `incrementPostViewCount` - Increment post view count (public)

### Post Queries
- `feed` - Get published posts with search and pagination
- `drafts` - Get user's draft posts (authenticated)
- `post` - Get individual post by global ID

### User Operations
- `searchUsers` - Search users by name or email with pagination
- `updateUserProfile` - Update the current user profile

All operations support:
- Global IDs for consistent entity references
- Enhanced authentication and authorization
- Input validation with Zod schemas
- Rate limiting protection
- Comprehensive error handling
- DataLoader optimization for N+1 query prevention
- Field-level Prisma optimizations

## Working with Global IDs

```typescript
// In resolvers - use shared relay helpers
import { parseAndValidateGlobalId, encodeGlobalId } from '../../core/utils/relay-helpers'
const numericId = await parseAndValidateGlobalId(args.id, 'Post')

// In tests
import { toPostId, extractNumericId } from './test/relay-utils'
const globalId = toPostId(1)
const numericId = extractNumericId(result.data.post.id)
```

## Running a Single Test

```bash
# Run a specific test file
bun test test/auth.test.ts

# Run tests matching a pattern
bun run test -t "should create a new user"

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage
```

## GraphQL Client Integration

The project uses GraphQL Tada for type-safe GraphQL operations:

```typescript
// src/gql/ directory contains:
- queries.ts                  # GraphQL queries (me, feed, etc.)
- mutations.ts                # GraphQL mutations (signup, createPost, etc.)
- mutations-auth-tokens.ts    # Token-based auth mutations (loginWithTokens, etc.)
```

All operations use `gql` template literals and are tested with the `print()` function from graphql package.

## API Endpoints

- **GraphQL Playground**: http://localhost:4000
- **GraphQL Endpoint**: POST http://localhost:4000/graphql

## Environment Variables

```bash
# .env
DATABASE_URL="file:./dev.db"              # SQLite database path
JWT_SECRET="your-secret-key"              # JWT signing secret
BCRYPT_ROUNDS=10                          # Password hashing rounds
NODE_ENV="development"                    # Environment mode
```

## Common Development Tasks

### Adding a New Feature (Direct Resolver Approach)

1. **Database Model**:
   ```bash
   # Update prisma/schema.prisma
   bunx prisma migrate dev --name add-feature
   bun run generate
   ```

2. **Create Module Structure**:
   ```typescript
   // src/modules/feature/feature.schema.ts - GraphQL schema definitions
   // src/modules/feature/feature.permissions.ts - Authorization rules
   // src/modules/feature/resolvers/feature.resolver.ts - Direct resolver
   ```

3. **Create Direct Resolver**:
   ```typescript
   // src/modules/feature/resolvers/feature.resolver.ts
   import { prisma } from '../../../prisma'
   
   builder.mutationField('createFeature', (t) =>
     t.prismaField({
       type: 'Feature',
       grantScopes: ['authenticated'],
       args: {
         name: t.arg.string({ required: true }),
       },
       resolve: async (query, _parent, args, context: EnhancedContext) => {
         const userId = requireAuthentication(context)
         
         return prisma.feature.create({
           ...query,
           data: {
             name: args.name,
             userId: userId.value,
           },
         })
       },
     })
   )
   ```

4. **Add Permissions**:
   ```typescript
   // src/graphql/middleware/shield-config.ts
   Mutation: {
     createFeature: isAuthenticatedUser,
   }
   ```

## Debugging Tips

- **Type errors**: Run `bun run generate`
- **GraphQL Playground**: http://localhost:4000
- **Database viewer**: `bunx prisma studio`
- **Global ID format**: Base64("Type:id") e.g., "UG9zdDox" = "Post:1"
- **Permission errors**: Check JWT token and shield-config.ts mappings
- **Test failures**: Check error message changes in constants/index.ts
- **Relay connections**: Always spread `query` in resolver functions
- **Environment verification**: Run `bun run env:verify` to check setup
- **Schema generation**: Run `bun run gen:schema` to update schema.graphql

## Important Patterns to Remember

### Always Spread Prisma Query Parameter
When using Pothos with Prisma, ALWAYS spread the `query` parameter first:
```typescript
resolve: async (query, _parent, args, context) => {
  return prisma.post.findMany({
    ...query, // CRITICAL: This enables field-level optimization
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
}
```

### Error Normalization
Always normalize errors in catch blocks:
```typescript
try {
  // operation
} catch (error) {
  throw normalizeError(error) // Converts unknown errors to BaseError
}
```

### Global ID Handling
Use the centralized relay helpers for consistency:
```typescript
import { parseAndValidateGlobalId, encodeGlobalId } from '../../core/utils/relay-helpers'
```

## Sequential Thinking Workflow

This project follows the Context7 sequential thinking approach for complex tasks. When implementing features or solving problems:

1. **Break down the task** into logical, sequential steps
2. **Complete each step fully** before moving to the next
3. **Verify each step** works correctly in isolation
4. **Build incrementally** on verified foundations

Example workflow for adding a new feature:
```
Step 1: Update database schema → Verify migration works
Step 2: Create types and inputs → Verify GraphQL schema compiles  
Step 3: Implement resolver logic → Verify business logic works
Step 4: Add permissions → Verify authorization works
Step 5: Write tests → Verify all tests pass
Step 6: Update documentation → Verify docs are accurate
```

This approach ensures robust, well-tested code by validating each component before building on it.

Reference: https://blog.langdb.ai/smarter-coding-workflows-with-context7-sequential-thinking

### Setting up Context7 MCP

Context7 MCP (Model Context Protocol) is configured for this project. The setup includes:

1. **Installation** (already added to devDependencies):
   ```bash
   # Install locally (recommended)
   bun install
   
   # Or install globally
   bun add -g @context7/mcp-server
   ```

2. **Claude Desktop Configuration**:
   The example configuration is in `claude-desktop-config.example.json`.

3. **Project Configuration**:
   The `.context7rc` file is configured with all project patterns.

For detailed setup instructions, see [CONTEXT7.md](./CONTEXT7.md).