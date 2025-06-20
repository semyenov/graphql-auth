# Architecture Overview

This project implements a **modern GraphQL server** using **direct Pothos resolvers** with advanced authorization and type safety patterns.

## Directory Structure

```
src/
├── schema/                           # GraphQL Schema Definition
│   ├── builder.ts                    # Pothos builder with advanced plugin integration
│   ├── index.ts                      # Schema assembly and middleware
│   ├── types/                        # Prisma Node types and GraphQL objects
│   ├── scalars.ts                    # Custom scalars (DateTime, JSON)
│   ├── enums.ts                      # GraphQL enums
│   ├── inputs.ts                     # Input type definitions
│   └── error-types.ts                # Error type definitions with union types
│
├── infrastructure/graphql/           # GraphQL Infrastructure
│   ├── resolvers/                    # Direct Pothos resolvers (main business logic)
│   │   ├── auth.resolver.ts          # Auth operations (signup, login, me)
│   │   ├── auth-tokens.resolver.ts   # Refresh token operations
│   │   ├── posts.resolver.ts         # Post CRUD operations
│   │   └── users.resolver.ts         # User search and management
│   │
│   ├── authorization/                # Advanced authorization system
│   │   └── enhanced-scopes.ts        # 14+ scope types with batch loading
│   │
│   ├── dataloaders/                  # N+1 prevention
│   │   ├── index.ts                  # Basic DataLoaders
│   │   └── loaders.ts               # Enhanced loaders for Pothos
│   │
│   ├── validation/                   # Advanced validation
│   │   └── enhanced-validations.ts  # Zod schemas with async refinements
│   │
│   └── errors/                       # Error handling
│       └── enhanced-error-handling.ts # Union result types
│
├── context/                          # GraphQL Context System
│   ├── context-direct.ts            # Main context for direct resolvers
│   ├── creation.ts                   # Context creation with error handling
│   ├── auth.ts                       # Authentication guards
│   ├── validation.ts                 # Context validation utilities
│   ├── utils.ts                      # JWT and request utilities
│   └── types.d.ts                    # Context type definitions
│
├── permissions/                      # Authorization System
│   ├── index.ts                      # Shield middleware export
│   ├── rules-clean.ts               # Permission rules using rule-utils
│   ├── rule-utils-clean.ts          # Extracted rule logic (ownership, validation)
│   ├── shield-config.ts             # Maps rules to schema operations
│   └── utils-clean.ts               # Permission utilities
│
├── errors/                           # Hierarchical Error System
│   ├── index.ts                      # Error class definitions
│   ├── README.md                     # Usage examples
│   ├── usage-guide.md               # Comprehensive guide
│   └── examples.ts                   # Real-world examples
│
├── gql/                              # GraphQL Operations (Client-side)
│   ├── mutations.ts                  # Direct resolver mutations
│   ├── queries.ts                    # Direct resolver queries
│   └── mutations-auth-tokens.ts      # Token-based auth mutations
│
├── features/auth/infrastructure/     # Legacy: Refresh tokens only
│   ├── repositories/refresh-token.repository.ts
│   └── services/token.service.ts     # JWT token generation/validation
│
├── core/                             # Domain Models & Interfaces  
│   ├── entities/                     # Domain entities
│   ├── value-objects/               # Value objects (UserId, Email)
│   ├── repositories/                # Repository interfaces
│   └── services/                     # Service interfaces
│
└── shared/infrastructure/graphql/    # Shared GraphQL utilities
    └── relay-helpers.ts              # Global ID encoding/decoding
```

## Architectural Pattern: Direct Pothos Resolvers

The project has **completed migration** from Domain-Driven Design to direct Pothos resolvers following modern GraphQL best practices.

### Key Characteristics

1. **Direct Prisma Access**: Prisma client is imported directly in resolvers (NOT in context) for better TypeScript performance
2. **Business Logic in Resolvers**: Domain logic is implemented directly in Pothos resolvers
3. **Minimal Abstraction**: Reduced boilerplate with direct patterns
4. **Enhanced Type Safety**: End-to-end type safety without code generation

## Tech Stack

### Core Technologies
- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **GraphQL Server**: Apollo Server 4 with H3 HTTP framework
- **Schema Builder**: Pothos with 10+ plugin integration
- **Database**: Prisma ORM with SQLite (dev.db)
- **Authentication**: JWT tokens with bcryptjs + refresh token rotation
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities

### Advanced Pothos Plugin Integration

```typescript
// src/schema/builder.ts
plugins: [
  ScopeAuthPlugin,      // Dynamic authorization with EnhancedAuthScopes
  PrismaPlugin,         // Direct access pattern for better TypeScript performance
  RelayPlugin,          // Global IDs, connections with metadata, cursor pagination
  ErrorsPlugin,         // Union result types for comprehensive error handling
  DataloaderPlugin,     // Automatic batch loading for N+1 prevention
  ValidationPlugin,     // Zod integration with async refinements
  // ShieldPlugin,      // Currently disabled due to module conflicts
]
```

## Authorization System

### EnhancedAuthScopes (14+ Scope Types)

The project includes a sophisticated authorization system that extends Pothos Scope Auth plugin:

- **Resource Ownership**: `postOwner()`, `userOwner()` for entity-based access control
- **Permission System**: `hasPermission()`, `hasAnyPermission()`, `hasAllPermissions()` for role-based auth
- **Content Visibility**: `canViewContent()`, `canEditContent()`, `canDeleteContent()` for content-based rules
- **Time-Based Rules**: `withinTimeLimit()`, `withinRateLimit()` for temporal authorization
- **Batch Operations**: `ScopeLoader` class for N+1 prevention in authorization checks
- **Conditional Logic**: `canAccessIfPublic()`, `canAccessIfOwnerOrPublic()` for complex scenarios

### Permission Integration

```typescript
// GraphQL Shield middleware with modular rule system
src/permissions/
├── rules-clean.ts          # Permission rules using rule-utils
├── rule-utils-clean.ts     # Extracted rule logic (ownership checks, validation)
├── shield-config.ts        # Maps rules to schema operations
└── utils-clean.ts          # Permission utilities
```

## Context System

Type-safe context with enhanced authentication:

```typescript
export interface Context extends BaseContext {
  // Original DataLoaders for batch loading (optional for tests)
  loaders?: DataLoaders
  // Enhanced DataLoaders for Pothos loadable objects
  enhancedLoaders?: Loaders
  // Method to create enhanced auth scopes
  createScopes?: () => EnhancedAuthScopes
}
```

## Error Handling

Hierarchical error system with descriptive messages:

```
BaseError (400)           - Base class with code and statusCode
├── AuthenticationError (401) - "You must be logged in to perform this action"
├── AuthorizationError (403)  - "You can only modify posts that you have created"
├── ValidationError (400)     - Field-specific validation errors
├── NotFoundError (404)       - "Post with identifier 'X' not found"
├── ConflictError (409)       - "An account with this email already exists"
└── RateLimitError (429)      - Rate limiting with retry information
```

## Key Architectural Patterns

### 1. Direct Prisma Access (Pothos Best Practice)

```typescript
// Import Prisma directly - NOT from context
import { prisma } from '../../../prisma'

builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    resolve: async (query, _parent, args, context: Context) => {
      // Direct Prisma access with query optimization
      return prisma.post.create({
        ...query, // ALWAYS spread query for field-level optimization
        data: { title: args.title, authorId: context.userId!.value },
      })
    },
  })
)
```

### 2. Enhanced Authorization Pattern

```typescript
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    resolve: async (query, _parent, args, context: Context) => {
      const scopes = createEnhancedAuthScopes(context)
      
      // Use enhanced scope for ownership check
      const isOwner = await scopes.postOwner(args.id)
      if (!isOwner) {
        throw new AuthorizationError('You can only modify your own posts')
      }
      
      // Business logic
      const postId = parseGlobalId(args.id, 'Post')
      return prisma.post.update({
        ...query,
        where: { id: postId },
        data: args.data,
      })
    },
  })
)
```

### 3. Enhanced Relay Implementation

All entities use global IDs with enhanced pagination and filtering:

```typescript
builder.queryField('feed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    totalCount: true,
    resolve: (query, root, args, ctx) => {
      return prisma.post.findMany({
        ...query, // ALWAYS spread query for Prisma optimizations
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      })
    },
  })
)
```

### 4. Error Normalization Pattern

Always use `normalizeError` in catch blocks:

```typescript
try {
  const userId = requireAuthentication(context)
  return await operation(data)
} catch (error) {
  throw normalizeError(error) // Converts to BaseError
}
```

## Testing Infrastructure

Comprehensive testing utilities in `test/`:

- **Integration Tests**: E2E test flow builder
- **Performance Tests**: Benchmarking and load testing
- **Snapshot Tests**: Response normalization and comparison
- **Test Fixtures**: Complex test scenarios
- **GraphQL Operations**: Typed operations with GraphQL Tada

```typescript
// test/test-utils.ts
createAuthContext(userId)     // Authenticated context
createMockContext()           // Unauthenticated context
expectSuccessfulQuery()       // Assert successful operations
expectGraphQLError()          // Assert error cases
toPostId(1)                  // Global ID conversion
```

## Performance Optimizations

### 1. DataLoader Integration
```typescript
// Automatic N+1 prevention
context.enhancedLoaders?.post.load(postId)
context.loaders?.userById.load(userId)
```

### 2. Field-Level Optimization
```typescript
// Always spread Prisma query parameter
return prisma.post.findMany({
  ...query, // Enables field-level optimization
  where: conditions,
})
```

### 3. Batch Authorization
```typescript
// ScopeLoader for batch authorization checks
const scopeLoader = new ScopeLoader(context)
const ownershipResults = await scopeLoader.batchCheckPostOwnership(postIds)
```

## Current Operations

The following operations are available and fully tested:

### Authentication
- `signup`, `login`, `me`
- `loginWithTokens`, `refreshToken`, `logout`

### Posts
- `createPost`, `updatePost`, `deletePost`, `togglePublishPost`
- `feed`, `drafts`, `post`, `incrementPostViewCount`

### Users
- `searchUsers`, `updateUserProfile`

All operations support:
- Global IDs for consistent entity references
- Enhanced authentication and authorization with dynamic scopes
- Advanced input validation with Zod schemas and async refinements
- Rate limiting protection with time-based controls
- Comprehensive error handling with descriptive error messages
- DataLoader optimization for N+1 query prevention

## Migration Status

**Completed Migration**: The project has successfully migrated from Domain-Driven Design to direct Pothos resolvers:

✅ **Direct Resolvers**: Business logic implemented directly in Pothos resolvers  
✅ **Simplified Architecture**: Reduced boilerplate with direct patterns  
✅ **Enhanced Performance**: Direct Prisma access and field-level optimization  
✅ **Type Safety**: Full TypeScript integration with Pothos  
✅ **Modern Patterns**: Following current Pothos best practices  

### Removed Components
- ❌ Application layer (use cases, DTOs, mappers)
- ❌ Complex repository abstractions  
- ❌ Service orchestration layers
- ❌ GraphQL operation adapters

### Benefits of Current Architecture

1. **Performance**: Direct Prisma access with field-level optimization
2. **Simplicity**: Less boilerplate, easier to understand and maintain
3. **Type Safety**: End-to-end type safety without code generation
4. **Developer Experience**: Faster development with direct patterns
5. **Modern Standards**: Following current GraphQL and Pothos best practices
6. **Maintainability**: Clear separation with fewer abstraction layers

## Proposed Improved File Structure

The current file structure has some organizational challenges. See [IMPROVED-FILE-STRUCTURE.md](./IMPROVED-FILE-STRUCTURE.md) for a detailed proposal for a better modular organization that includes:

### Key Improvements
- **Module-Based Organization**: Each feature is a self-contained module
- **Consistent File Naming**: `{module}.{type}.ts` pattern throughout
- **Clear Separation of Concerns**: Distinct layers for app, modules, graphql, core, data, lib
- **Better Test Organization**: Tests mirror source structure with utilities
- **Improved Scalability**: Easy to add new modules without affecting existing code

### Proposed Structure Overview
```
src/
├── app/                    # Application entry points and config
├── modules/                # Feature modules (auth, posts, users)
├── graphql/                # GraphQL infrastructure
├── core/                   # Shared business logic
├── data/                   # Data access layer
├── lib/                    # External library adapters
├── types/                  # Global type definitions
└── constants/              # Application constants

test/
├── modules/                # Feature tests
├── core/                   # Core functionality tests
├── utils/                  # Test utilities and factories
├── performance/            # Performance tests
└── setup/                  # Test configuration
```

## Future Considerations

- **File Structure Migration**: Implement the improved modular structure
- **Horizontal Scaling**: DataLoader patterns ready for distributed systems
- **Advanced Authorization**: Role-based access control with policy engines
- **Real-time Features**: GraphQL subscriptions with Redis
- **Microservices**: Federation-ready schema design
- **Monitoring**: Built-in performance tracking and metrics