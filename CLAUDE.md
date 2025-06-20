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

### Architecture: Direct Pothos Resolvers (Modern Approach)

The project has **completed migration** from Domain-Driven Design to direct Pothos resolvers:

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
│   └── users/                         # Users module
│       ├── resolvers/
│       │   └── users.resolver.ts      # User search and management
│       └── types/
│           └── user.types.ts          # User-specific types
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
├── infrastructure/                    # External Service Integrations
│   ├── services/                      # Infrastructure services
│   │   └── rate-limiter.service.ts   # Rate limiting service
│   └── config/                        # Configuration
│       └── container.ts               # DI container setup
│
├── context/                           # GraphQL Context System
│   ├── context-direct.ts              # Context type definitions
│   ├── creation.ts                    # Context creation
│   ├── validation.ts                  # Context validation utilities
│   ├── utils.ts                       # JWT and request utilities
│   └── types.d.ts                     # Operation-specific context types
│
├── app/                               # Application Entry Points
│   ├── server.ts                      # Main server setup
│   └── config/                        # App configuration
│       ├── environment.ts             # Environment variables
│       ├── index.ts                   # Config exports
│       ├── database.ts                # Database configuration
│       ├── auth.ts                    # Auth configuration
│       └── server.ts                  # Server configuration
│
├── gql/                               # GraphQL Operations (Client-side)
│   ├── mutations.ts                   # GraphQL mutations
│   ├── queries.ts                     # GraphQL queries
│   └── mutations-auth-tokens.ts       # Token-based auth mutations
│
└── prisma.ts                          # Prisma client instance
```

### Authorization System

GraphQL Shield middleware with modular rule system:

```
src/graphql/middleware/
├── shield-config.ts   # Maps rules to schema operations
├── rules-clean.ts     # Permission rules using rule-utils
├── rule-utils-clean.ts # Extracted rule logic (ownership checks, validation)
└── utils-clean.ts     # Permission utilities
```

### Context System

Type-safe context with enhanced authentication:

```
src/context/
├── context-direct.ts  # Context type definitions
├── creation.ts        # Context creation with error handling
├── validation.ts      # Context validation utilities
├── utils.ts           # JWT and request utilities
└── types.d.ts         # Operation-specific context types
```

### Error Handling

Hierarchical error system with descriptive messages:

```
src/core/errors/
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

### Testing Infrastructure

Comprehensive testing utilities:

```
test/
├── modules/                        # Module-specific tests
│   ├── auth/                       # Auth module tests
│   │   ├── auth.integration.test.ts
│   │   └── auth-tokens.integration.test.ts
│   ├── posts/                      # Posts module tests
│   │   └── posts.integration.test.ts
│   └── users/                      # Users module tests
│       └── users.integration.test.ts
│
├── core/                           # Core functionality tests
│   ├── auth/                       # Auth core tests
│   │   ├── permissions.test.ts
│   │   └── rate-limiting.test.ts
│   └── validation/                 # Validation tests
│
├── utils/                          # Test utilities
│   ├── helpers/                    # Test helpers
│   │   ├── database.helpers.ts    # DB and context helpers
│   │   ├── graphql.helpers.ts     # GraphQL execution helpers
│   │   └── relay.helpers.ts       # Global ID utilities
│   └── fixtures/                   # Test fixtures
│
├── setup.ts                        # Test setup and teardown
└── test-database-url.ts            # Test DB configuration
```

## Key Architectural Patterns

### 1. Advanced Pothos Plugin Architecture

The schema builder uses multiple Pothos plugins with advanced integration patterns:

```typescript
// Advanced builder configuration (src/graphql/schema/builder.ts)
plugins: [PrismaPlugin, RelayPlugin, DataloaderPlugin, ErrorsPlugin, ScopeAuthPlugin, ValidationPlugin],
prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
    onUnusedQuery: isProduction ? null : 'warn',
},
relay: {
    clientMutationId: 'omit', // Modern Relay style
    cursorType: 'String',
    encodeGlobalID: (typename, id) => encodeGlobalId(typename, id as string | number),
    decodeGlobalID: (globalID) => {
        const { type, id } = decodeGlobalId(globalID)
        return { typename: type, id }
    },
},
errors: {
    defaultTypes: [Error, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError],
    directResult: true, // Enable direct result mode
},
```

### 2. Direct Pothos Resolvers with Direct Prisma Access

The codebase implements business logic directly in Pothos resolvers with direct Prisma imports (following Pothos best practices):

```typescript
// Import Prisma directly - NOT from context
import { prisma } from '../../../prisma'

// Direct resolver pattern - business logic in resolver
builder.mutationField('signup', (t) =>
  t.string({
    description: 'Create a new user account',
    grantScopes: ['public'],
    args: {
      email: t.arg.string({ required: true, validate: { schema: commonValidations.email } }),
      password: t.arg.string({ required: true, validate: { schema: commonValidations.password } }),
      name: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, context) => {
      // Direct business logic implementation with direct Prisma access
      const existingUser = await prisma.user.findUnique({
        where: { email: args.email },
      })
      if (existingUser) {
        throw new ConflictError('An account with this email already exists')
      }
      const hashedPassword = await passwordService.hash(args.password)
      const user = await prisma.user.create({
        data: { email: args.email, password: hashedPassword, name: args.name },
      })
      return signToken({ userId: user.id, email: user.email })
    },
  })
)
```

**Important**: Following Pothos best practices, Prisma is NOT included in the GraphQL context to improve TypeScript performance and developer experience.

### 3. Enhanced Relay Implementation

All entities use global IDs with enhanced pagination and filtering:

```typescript
// Enhanced Node interface with relatedConnection
builder.prismaNode('User', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    // Enhanced posts connection with filtering and total count
    posts: t.relatedConnection('posts', {
      cursor: 'id',
      totalCount: true,
      query: (args, context) => ({
        orderBy: { createdAt: 'desc' },
        where: args.published !== undefined 
          ? { published: args.published }
          : undefined,
      }),
      args: {
        published: t.arg.boolean({
          description: 'Filter posts by published status',
        }),
      },
    }),
  }),
})

// Enhanced queries with advanced filtering
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    args: {
      where: t.arg({ type: PostWhereInput }),
      orderBy: t.arg({ type: [PostOrderByInput] }),
    },
    resolve: (query, root, args, ctx) => {
      const where = transformPostWhereInput(args.where) || { published: true }
      const orderBy = args.orderBy?.map(transformOrderBy) || [{ createdAt: 'desc' }]
      
      return prisma.post.findMany({
        ...query, // ALWAYS spread query for Prisma optimizations
        where,
        orderBy,
      })
    },
    totalCount: (parent, args, ctx) => {
      const where = transformPostWhereInput(args.where) || { published: true }
      return prisma.post.count({ where })
    },
  })
)
```

### 4. Error Handling Pattern

Always use error normalization in catch blocks:

```typescript
import { normalizeError } from '../../core/errors'

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

### 5. Permission Rules Pattern

Rules use guard functions and return descriptive errors:

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

### 6. Repository Pattern with Proper Entity Mapping

Repositories map database fields to domain entities:

```typescript
async findByEmail(email: Email): Promise<User | null> {
  const data = await this.prisma.user.findUnique({
    where: { email: email.value },
  })
  
  if (!data) return null
  
  // Map database fields to entity properties
  return User.fromPersistence({
    id: UserId.from(data.id),
    email: Email.create(data.email),
    name: data.name,
    passwordHash: data.password, // Map 'password' field to 'passwordHash'
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  })
}
```

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
grantScopes: ['authenticated'], // Simple scope

// Enhanced ownership check (in resolver function)
resolve: async (_parent, args, context) => {
  // Create scopes from context
  const scopes = context.createScopes ? context.createScopes() : createEnhancedAuthScopes(context)
  
  // Check ownership
  const isOwner = await scopes.postOwner(args.id)
  if (!isOwner) {
    throw new AuthorizationError('You can only update your own posts')
  }
  
  // Perform operation
  return prisma.post.update({
    where: { id: numericId },
    data: updateData,
  })
}

// Complex authorization with multiple checks
resolve: async (_parent, args, context) => {
  const scopes = context.createScopes ? context.createScopes() : createEnhancedAuthScopes(context)
  
  // Admin can do anything
  if (scopes.admin) return performOperation()
  
  // Otherwise check ownership AND permission
  const [isOwner, canPublish] = await Promise.all([
    scopes.postOwner(args.id),
    scopes.hasPermission('post:publish')
  ])
  
  if (!isOwner || !canPublish) {
    throw new AuthorizationError('Insufficient permissions')
  }
  
  return performOperation()
}
```

#### Integration Files
- **Implementation**: `src/core/auth/scopes.ts`
- **Integration Guide**: `POTHOS-ENHANCED-SCOPES-INTEGRATION.md`
- **Usage Examples**: `ENHANCED-SCOPES-GUIDE.md`

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
- Enhanced authentication and authorization with dynamic scopes
- Advanced input validation with Zod schemas and async refinements
- Rate limiting protection with time-based controls
- Comprehensive error handling with descriptive error messages
- DataLoader optimization for N+1 query prevention
- Field-level Prisma optimizations for minimal database queries

## Testing Strategy

### Running Tests

```bash
bun run test --run              # Run all tests once
bun test test/posts.test.ts     # Run specific file
bun run test -t "should create" # Run by test name
```

### Typed GraphQL Operations

All tests use typed queries from `src/gql/`:

```typescript
import { print } from 'graphql'
import { LoginMutation, SignupMutation } from '../src/gql/mutations'
import { FeedQuery, MeQuery } from '../src/gql/queries'
import { LoginWithTokensMutation } from '../src/gql/mutations-auth-tokens'

const data = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(LoginMutation),
  variables,
  context
)
```

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

// Performance testing
await benchmark(server, operation, variables, context, { iterations: 100 })
assertPerformance(report, { maxP95Time: 100 })

// Snapshot testing
await snapshotTester.testSnapshot(response, {
  name: 'feed-query',
  normalizers: [commonNormalizers.timestamps]
})
```

### Test Database

- Isolated SQLite database per test file
- Automatic cleanup between tests
- No manual cleanup needed

## Architectural Evolution: Complete Migration to Direct Resolvers

The project has **successfully completed** migration from a layered DDD structure to direct Pothos resolvers:

### ✅ Current Direct Resolver Pattern (Completed)
- **Direct Resolvers**: Business logic implemented directly in Pothos resolvers
- **Services**: Stateless services for reusable logic (PasswordService, TokenService)  
- **Repositories**: Direct Prisma usage in resolvers (minimal abstraction layer)
- **Benefits**: Simpler architecture, less boilerplate, better performance, easier debugging

### ✅ Migration Status (All Complete)
1. **Auth Operations**: ✅ Migrated to direct resolvers (`signup`, `login`, `me`)
2. **Post Operations**: ✅ Migrated to direct resolvers (`createPost`, `updatePost`, etc.)
3. **User Operations**: ✅ Migrated to direct resolvers (`searchUsers`)
4. **Refresh Tokens**: ✅ Migrated to direct resolvers (`loginWithTokens`, `refreshToken`, `logout`)

### 🗑️ Removed Legacy Components
- Application layer (use cases, DTOs, mappers)
- Complex repository abstractions  
- Service orchestration layers
- GraphQL operation adapters

## Environment Variables

Required environment variables (see `.env` file):
```bash
DATABASE_URL="file:./dev.db"              # SQLite database path
JWT_SECRET="your-secret-key"              # JWT signing secret (min 32 chars)
JWT_EXPIRES_IN="7d"                       # JWT expiration time
BCRYPT_ROUNDS=10                          # Password hashing rounds
APP_SECRET="your-secret-key"              # App secret for signing
```

## Common Development Tasks

### Adding a New Feature (Direct Resolver Approach)

1. **Database Model** (if needed):
   ```bash
   # Update prisma/schema.prisma
   bunx prisma migrate dev --name add-feature
   bun run generate
   ```

2. **Create Direct Resolver** in appropriate module:
   ```typescript
   // src/modules/feature/resolvers/feature.resolver.ts
   import { prisma } from '../../../prisma'
   import { builder } from '../../../graphql/schema/builder'
   import { requireAuthentication } from '../../auth/guards/auth.guards'
   
   builder.mutationField('createFeature', (t) =>
     t.prismaField({
       type: 'Feature',
       grantScopes: ['authenticated'],
       args: {
         name: t.arg.string({ required: true }),
       },
       resolve: async (query, _parent, args, context) => {
         const userId = requireAuthentication(context)
         
         // Direct business logic
         return prisma.feature.create({
           ...query, // ALWAYS spread query first
           data: {
             name: args.name,
             userId: userId.value,
           },
         })
       },
     })
   )
   ```

3. **Import resolver** in schema:
   ```typescript
   // src/graphql/schema/index.ts
   import '../../modules/feature/resolvers/feature.resolver'
   ```

4. **Add permissions** if using Shield:
   ```typescript
   // src/graphql/middleware/shield-config.ts
   Mutation: {
     createFeature: isAuthenticatedUser,
   }
   ```

5. **Write tests**:
   ```typescript
   // test/modules/feature/feature.integration.test.ts
   ```

### Working with Global IDs

```typescript
// In resolvers - use core relay helpers
import { parseAndValidateGlobalId, encodeGlobalId } from '../../../core/utils/relay-helpers'
const numericId = await parseAndValidateGlobalId(args.id, 'Post')

// In tests
import { toPostId, extractNumericId } from '../../utils/helpers/relay.helpers'
const globalId = toPostId(1)
const numericId = extractNumericId(result.data.post.id)
```

### Running a Single Test

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

### GraphQL Operations

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

## Naming Conventions

Follow the established patterns from NAMING-CONVENTIONS.md:

### File Naming
- **kebab-case** for all files: `create-post.resolver.ts`
- **Descriptive patterns**: `[feature].resolver.ts`, `[entity].repository.ts`
- **Test files**: `[file-name].test.ts` or `[feature].integration.test.ts`

### Code Naming  
- **Classes**: PascalCase with suffix: `PasswordService`, `TokenService`
- **Functions**: camelCase with verb-noun: `validatePassword`, `createUser`
- **Constants**: UPPER_SNAKE_CASE: `MAX_PASSWORD_LENGTH`
- **Interfaces**: PascalCase with 'I' prefix for services: `IPasswordService`

### Resolver Conventions
```typescript
// Mutations: [action][Entity]
export const signup = builder.mutationField('signup', ...)
export const createPost = builder.mutationField('createPost', ...)

// Queries: [query][Entity]  
export const me = builder.queryField('me', ...)
export const searchUsers = builder.queryField('searchUsers', ...)
```

## Debugging Tips

- **Type errors**: Run `bun run generate`
- **GraphQL Playground**: http://localhost:4000
- **Database viewer**: `bunx prisma studio`
- **Global ID format**: Base64("Type:id") e.g., "UG9zdDox" = "Post:1"
- **Permission errors**: Check JWT token and shield-config.ts mappings
- **Test failures**: Check error message changes in constants/index.ts
- **Relay connections**: Always spread `query` in resolver functions
- **Direct resolver debugging**: Check grantScopes configuration and context type
- **Environment verification**: Run `bun run env:verify` to check setup
- **Schema generation**: Run `bun run gen:schema` to update schema.graphql
- **Type generation**: Run `bunx gql.tada generate-output` for GraphQL types

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

### Direct Prisma Access
Follow Pothos best practices - import Prisma directly:
```typescript
import { prisma } from '../../../prisma' // Direct import
// NOT: const prisma = context.prisma
```

### Authentication Guards
Use guard functions from auth module:
```typescript
import { requireAuthentication, isAuthenticated } from '../../auth/guards/auth.guards'

// In resolver
const userId = requireAuthentication(context) // Throws if not authenticated
if (!isAuthenticated(context)) { /* handle */ } // Returns boolean
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

## Test Status

Current test suite status:
- **Total Tests**: 140
- **Passing**: 140 ✓
- **Success Rate**: 100%

The project has comprehensive test coverage across all modules with isolated SQLite databases for each test file.