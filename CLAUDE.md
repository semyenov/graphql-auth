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
├── infrastructure/graphql/resolvers/  # MAIN: Direct Pothos resolvers
│   ├── auth-direct.resolver.ts        # Auth operations (signup, login, me)
│   ├── auth-tokens-direct.resolver.ts # Refresh token operations
│   ├── posts-direct.resolver.ts       # Post CRUD operations
│   └── users-direct.resolver.ts       # User search and management
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
├── gql/                               # GraphQL Operations (Client-side)
│   ├── mutations-direct.ts            # Direct resolver mutations
│   ├── queries-direct.ts              # Direct resolver queries
│   └── mutations-auth-tokens-direct.ts # Token-based auth mutations
│
├── features/auth/infrastructure/      # LEGACY: Refresh tokens only
│   ├── repositories/refresh-token.repository.ts
│   └── services/token.service.ts      # JWT token generation/validation
│
├── core/                              # Domain Models & Interfaces  
│   ├── entities/                      # Domain entities
│   ├── value-objects/                 # Value objects (UserId, Email)
│   ├── repositories/                  # Repository interfaces
│   └── services/                      # Service interfaces
│
├── infrastructure/                    # Supporting Infrastructure
│   ├── config/                        # DI container and configuration
│   ├── database/                      # Prisma client and repositories
│   ├── auth/                          # Password hashing service
│   ├── logging/                       # Logger implementations
│   └── services/                      # Rate limiting service
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

### Testing Infrastructure

Comprehensive testing utilities:

```
test/
├── auth.test.ts            # Authentication tests
├── permissions.test.ts     # Permission system tests
├── posts.test.ts          # Post CRUD tests
├── user.test.ts           # User-related tests
├── test-utils.ts          # Core testing utilities
├── test-fixtures.ts       # Complex test scenarios
├── performance-utils.ts   # Performance testing tools
├── snapshot-utils.ts      # Snapshot testing utilities
├── subscription-utils.ts  # Subscription testing helpers
├── integration-utils.ts   # E2E test flow builder
└── relay-utils.ts         # Global ID conversion utilities
```

## Key Architectural Patterns

### 1. Advanced Pothos Plugin Architecture

The schema builder uses multiple Pothos plugins with advanced integration patterns:

```typescript
// Advanced builder configuration (src/schema/builder.ts)
plugins: [PrismaPlugin, RelayPlugin, DataloaderPlugin, ErrorsPlugin, ScopeAuthPlugin, ValidationPlugin],
prisma: {
    client: prisma,
    dmmf: prisma._runtimeDataModel, // Pre-load DMMF for faster startup
    neverScalarize: ['Json'], // Prevent JSON fields from being scalars
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
    onUnusedQuery: isProduction ? null : 'warn',
},
relay: {
    clientMutationId: 'omit', // Modern Relay style
    cursorType: 'String',
    nodeQueryOptions: false,
    nodesQueryOptions: false,
},
errors: {
    defaultTypes: [Error, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError],
    directResult: true, // Enable direct result mode
},
```

**Enhanced Features:**
- **Enhanced Connections**: `EnhancedPostConnection` and `EnhancedUserConnection` with metadata (totalCount, searchMetadata, filterSummary)
- **Dynamic Scopes**: 14+ authorization scopes including `hasPermission`, `canViewContent`, `withinTimeLimit`
- **Advanced DataLoaders**: Entity loaders, count loaders, and relation loaders with configurable batching
- **Enhanced Validation**: Async refinements with database checks, contextual validation, field dependencies

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
    resolve: async (_parent, args, context: EnhancedContext) => {
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

### 5. Permission Rules Pattern

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

### Enhanced Query Operations
- `enhancedFeed` - Advanced feed with metadata, search, and filtering
- `enhancedUserSearch` - User search with aggregated metadata
- `postAnalytics` - Get aggregated analytics for posts

### Post Queries
- `feed` - Get published posts with search and pagination
- `drafts` - Get user's draft posts (authenticated)
- `post` - Get individual post by global ID

### User Operations
- `searchUsers` - Search users by name or email with pagination
- `updateUserProfile` - Update the current user profile

### Enhanced Features
- **Enhanced Connections**: Rich metadata including totalCount, searchMetadata, filterSummary
- **Advanced Search**: Multi-field search with complex filtering options
- **Dynamic Authorization**: Content-based and permission-based access control
- **Performance Tracking**: Built-in performance monitoring with PerformanceTracker
- **Optimized Queries**: Always spread Prisma query parameter for field-level optimization
- **Advanced Validation**: Async refinements, contextual validation, field dependencies

All operations support:
- Global IDs for consistent entity references
- Enhanced authentication and authorization with dynamic scopes
- Advanced input validation with Zod schemas and async refinements
- Rate limiting protection with time-based controls
- Comprehensive error handling with descriptive error messages
- DataLoader optimization for N+1 query prevention
- Rich metadata and performance information
- Field-level Prisma optimizations for minimal database queries

## Enhanced Relay Features

### Advanced Filtering System

The enhanced implementation includes comprehensive filtering with logical operators:

```typescript
// Filtering input types with full Prisma compatibility
export const StringFilter = builder.inputType('StringFilter', {
  fields: (t) => ({
    equals: t.string({ description: 'Exact string match' }),
    contains: t.string({ description: 'String contains this value' }),
    startsWith: t.string({ description: 'String starts with this value' }),
    endsWith: t.string({ description: 'String ends with this value' }),
    not: t.string({ description: 'String does not equal this value' }),
  }),
})

export const PostWhereInput = builder.inputType('PostWhereInput', {
  fields: (t) => ({
    title: t.field({ type: StringFilter }),
    content: t.field({ type: StringFilter }),
    published: t.field({ type: BooleanFilter }),
    viewCount: t.field({ type: IntFilter }),
    createdAt: t.field({ type: DateTimeFilter }),
    // Logical operators for complex queries
    AND: t.field({ type: ['PostWhereInput'] }),
    OR: t.field({ type: ['PostWhereInput'] }),
    NOT: t.field({ type: 'PostWhereInput' }),
  }),
})
```

### Filter Transformation Utilities

Utility functions transform GraphQL inputs to Prisma-compatible where clauses:

```typescript
// Transform filters to Prisma format
import { transformPostWhereInput, transformOrderBy } from '../utils/filter-transform'

// Usage in resolvers
const where = transformPostWhereInput(args.where) || { published: true }
const orderBy = args.orderBy?.map(transformOrderBy) || [{ createdAt: 'desc' }]
```

### Enhanced Connection Features

- **Total Count**: All connections provide `totalCount` for pagination UI
- **Advanced Ordering**: Multiple sort fields with direction control
- **Field Descriptions**: All inputs have detailed descriptions for GraphQL introspection
- **Error Handling**: Proper error normalization and type-safe error responses
- **Performance**: Optimized queries with `filterConnectionTotalCount` enabled

## Testing Strategy

### Typed GraphQL Operations

All tests use typed queries from `src/gql/`:

```typescript
import { print } from 'graphql'
import { LoginDirectMutation, SignupDirectMutation } from '../src/gql/mutations-direct'
import { FeedDirectQuery, MeDirectQuery } from '../src/gql/queries-direct'
import { LoginWithTokensDirectMutation } from '../src/gql/mutations-auth-tokens-direct'

const data = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(LoginDirectMutation),
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
1. **Auth Operations**: ✅ Migrated to direct resolvers (`signupDirect`, `loginDirect`, `meDirect`)
2. **Post Operations**: ✅ Migrated to direct resolvers (`createPostDirect`, `updatePostDirect`, etc.)
3. **User Operations**: ✅ Migrated to direct resolvers (`searchUsersDirect`)
4. **Refresh Tokens**: ✅ Migrated to direct resolvers (`loginWithTokensDirect`, `refreshTokenDirect`, `logoutDirect`)

### 🗑️ Removed Legacy Components
- Application layer (use cases, DTOs, mappers)
- Complex repository abstractions  
- Service orchestration layers
- GraphQL operation adapters

## Environment Variables

Required environment variables (see `.env.example`):
```bash
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

2. **Create Direct Resolver**:
   ```typescript
   // src/infrastructure/graphql/resolvers/feature-direct.resolver.ts
   builder.mutationField('createFeatureDirect', (t) =>
     t.prismaField({
       type: 'Feature',
       grantScopes: ['authenticated'],
       args: {
         name: t.arg.string({ required: true }),
       },
       resolve: async (query, _parent, args, context: EnhancedContext) => {
         const userId = requireAuthentication(context)
         
         // Direct business logic
         return context.prisma.feature.create({
           ...query,
           data: {
             name: args.name,
             userId,
           },
         })
       },
     })
   )
   ```

3. **Add to Schema**:
   ```typescript
   // src/schema/index.ts
   import '../infrastructure/graphql/resolvers/feature-direct.resolver'
   ```

4. **Add Permissions**:
   ```typescript
   // src/permissions/shield-config.ts
   Mutation: {
     createFeatureDirect: isAuthenticatedUser,
   }
   ```

### Working with Global IDs

```typescript
// In resolvers - use shared relay helpers
import { parseAndValidateGlobalId, encodeGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
const numericId = await parseAndValidateGlobalId(args.id, 'Post')

// Legacy resolver approach
import { parseGlobalID } from '../schema/utils'
const { id: numericId } = parseGlobalID(args.id, 'Post')

// In tests
import { toPostId, extractNumericId } from './test/relay-utils'
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
- **kebab-case** for all files: `create-post-direct.resolver.ts`
- **Descriptive patterns**: `[feature]-direct.resolver.ts`, `[entity].repository.ts`
- **Test files**: `[file-name].test.ts`

### Code Naming  
- **Classes**: PascalCase with suffix: `PasswordService`, `TokenService`
- **Functions**: camelCase with verb-noun: `validatePassword`, `createUser`
- **Constants**: UPPER_SNAKE_CASE: `MAX_PASSWORD_LENGTH`
- **Interfaces**: PascalCase: `User`, `EnhancedContext`

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
  return context.prisma.post.findMany({
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
import { parseAndValidateGlobalId, encodeGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
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

Context7 MCP (Model Context Protocol) is already configured for this project. The setup includes:

1. **Installation** (already added to devDependencies):
   ```bash
   # Install locally (recommended)
   bun install
   
   # Or install globally
   bun add -g @context7/mcp-server
   ```

2. **Claude Desktop Configuration**:
   Copy the example configuration to your Claude Desktop config:
   ```bash
   # Location varies by OS:
   # macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
   # Windows: %APPDATA%\Claude\claude_desktop_config.json
   # Linux: ~/.config/Claude/claude_desktop_config.json
   ```
   
   See `claude-desktop-config.example.json` for the configuration template.

3. **Project Configuration**:
   The `.context7rc` file is already configured with:
   - All project patterns (direct resolvers, Prisma, JWT auth, DataLoader, etc.)
   - Context files including schemas, resolvers, tests, and documentation
   - Code generation preferences and import paths
   - Testing patterns and conventions

4. **Usage**:
   Once configured, Context7 MCP will:
   - Understand Pothos GraphQL patterns and generate consistent code
   - Follow Prisma best practices (always spread `query` parameter)
   - Apply DataLoader patterns for N+1 query prevention
   - Maintain the established error hierarchy
   - Use proper Relay conventions for connections and global IDs
   - Follow JWT authentication patterns with refresh tokens

For detailed setup instructions, see [CONTEXT7.md](./CONTEXT7.md).
For more information: https://github.com/context7/mcp-server