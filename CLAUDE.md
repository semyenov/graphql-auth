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
bun run build                          # Build for production (builds src/main.ts)
bun run start                          # Start production server (runs dist/app/server.js)
bun run clean                          # Clean build directory

# Code Quality
bunx tsc --noEmit                      # Type check all files
bun run lint                          # Run Biome linter
bun run lint:fix                      # Auto-fix linting issues
bun run format                        # Check formatting
bun run format:fix                    # Auto-fix formatting
bun run check                         # Run all Biome checks
bun run check:fix                     # Auto-fix all issues

# GraphQL Schema
bun run gen:schema                      # Generate GraphQL schema file
bunx gql.tada generate-output           # Generate GraphQL type definitions
bun run generate:gql                    # Alternative GraphQL type generation

# Environment & Debugging
bun run env:verify                      # Verify environment setup
bun run graphql:examples                # Run GraphQL query examples
bun run seed                            # Manually seed database
bun run demo                            # Run demo script
```

## Architecture Overview

### Tech Stack

- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **GraphQL Server**: Apollo Server 4 with H3 HTTP framework
- **Schema Builder**: Pothos with 7 plugins (Prisma, Relay, Errors, Scope Auth, Shield, DataLoader, Validation)
- **Database**: Prisma ORM with SQLite (easily switchable to PostgreSQL)
- **Authentication**: JWT tokens with argon2 (bcrypt fallback) + refresh token rotation
- **Authorization**: Dual system - Pothos Scope Auth + GraphQL Shield Plugin
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Vitest with comprehensive test utilities
- **Validation**: Zod schema validation with async refinements
- **Rate Limiting**: rate-limiter-flexible with configurable presets
- **Dependency Injection**: TSyringe for service management
- **Code Quality**: Biome for linting and formatting

### Architecture: Modular Monolith with Direct Resolvers

The project follows a **Modular Monolith** architecture with direct Pothos resolvers. Key architectural decisions:

1. **Direct Resolvers**: Business logic lives in resolvers, complex logic extracted to services
2. **Direct Prisma Access**: Import Prisma directly, never through context
3. **Dual Authorization**: Pothos Scope Auth + GraphQL Shield for flexible permissions
4. **Module-Based Organization**: Self-contained feature modules with clear boundaries

See [Architecture Documentation](docs/ARCHITECTURE.md) and [Architecture Decision Records](docs/adr/) for detailed patterns.

## Key Architectural Patterns

### 1. Direct Prisma Access Pattern

**Critical**: Prisma is NOT included in GraphQL context. Always import directly:

```typescript
// ✅ CORRECT - Import Prisma directly
import { prisma } from '../../../prisma'

// ❌ WRONG - Never access Prisma from context
// const prisma = context.prisma
```

### 2. Resolver Implementation Pattern

**Critical**: Always spread the `query` parameter for Prisma optimizations:

```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],     // Pothos Scope Auth
    shield: isPostOwner,                // GraphQL Shield rule
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      
      return prisma.post.create({
        ...query, // ⚠️ CRITICAL: Always spread query first
        data: {
          title: args.title,
          content: args.content,
          authorId: userId.value,
        },
      })
    },
  }),
)
```

### 3. Dual Authorization System

The project uses two complementary authorization systems:

**Pothos Scope Auth Plugin** - For basic authentication and role checks:
```typescript
grantScopes: ['authenticated']        // Requires login
grantScopes: ['admin']               // Requires admin role
grantScopes: ['public']              // No auth required
```

**GraphQL Shield Plugin** - For complex, field-level authorization rules:
```typescript
shield: and(isAuthenticatedUser, isPostOwner)  // Composite rules
```

### 4. Error Handling Pattern

Use the centralized error hierarchy and always normalize errors:

```typescript
import { normalizeError } from '../../../app/errors/handlers'
import { AuthenticationError, NotFoundError } from '../../../app/errors/types'

try {
  // operation
} catch (error) {
  throw normalizeError(error) // Converts unknown errors to BaseError
}
```

### 5. Service Layer Pattern

Complex business logic should be extracted to services:

```typescript
// Service interface
export interface IAuthService {
  signup(input: SignupInput): Promise<AuthResult>
}

// Service implementation
@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('IPasswordService') private passwordService: IPasswordService,
    @inject('ITokenService') private tokenService: ITokenService,
  ) {}
}

// Register in container
container.register<IAuthService>('IAuthService', {
  useClass: AuthService,
})
```

### 6. GraphQL Tada Integration

**Critical**: Always use typed GraphQL operations for testing:

```typescript
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/mutations'

// ✅ CORRECT - Use typed operations
const result = await executeOperation(
  server,
  print(LoginMutation),
  { email: 'test@example.com', password: 'password' },
  context,
)

// ❌ WRONG - Never use raw GraphQL strings in tests
```

## Module Structure Pattern

Each feature module follows this structure:

```
modules/[feature]/
├── [feature].schema.ts       # GraphQL type definitions
├── [feature].permissions.ts  # Authorization rules and guards
├── [feature].validation.ts   # Input validation schemas
├── resolvers/
│   └── [feature].resolver.ts # GraphQL resolvers
├── services/                 # Business logic (if needed)
│   └── [feature].service.ts
├── entities/                 # Domain entities (if needed)
│   └── [entity].entity.ts
└── types/                    # TypeScript types
    └── [feature].types.ts
```

## Common Development Workflows

### Adding a New Module

1. Create module directory structure (see pattern above)
2. Import resolver in schema index:
   ```typescript
   // src/graphql/schema/index.ts
   import '../../modules/feature/resolvers/feature.resolver'
   ```
3. Add permissions to shield config if needed:
   ```typescript
   // src/graphql/middleware/shield-config.ts
   import { featurePermissions } from '../../modules/feature/feature.permissions'
   ```

### Working with GraphQL Operations

1. Define operations in `src/gql/`:
   ```typescript
   export const CreatePostMutation = graphql(`
     mutation CreatePost($title: String!, $content: String) {
       createPost(input: { title: $title, content: $content }) {
         id
         title
       }
     }
   `)
   ```

2. Generate types after schema changes:
   ```bash
   bun run generate:gql  # or bun run generate
   ```

3. Use in tests with type safety (see GraphQL Tada Integration pattern above)

## Environment Variables

```bash
# Required
DATABASE_URL="file:./dev.db"     # SQLite database path (or postgresql://...)
JWT_SECRET="your-secret-key"      # JWT signing secret

# Optional
BCRYPT_ROUNDS=10                  # Password hashing rounds (default: 10)
NODE_ENV="development"            # Environment mode
PORT=4000                         # Server port
HOST="localhost"                  # Server host
```

For PostgreSQL:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

## Critical Implementation Rules

### From Cursor Rules (.cursor/rules/)

1. **Pothos Patterns**: 
   - Always import Prisma directly, never from context
   - Always spread the `query` parameter in `t.prismaField` calls
   - Use `t.relation()` for automatic relation handling
   - Use `prismaNode` for entities with global IDs

2. **Testing Patterns**:
   - Use typed GraphQL operations from `src/gql/`
   - Test both success and error cases
   - Test authorization and authentication flows

3. **Error Handling**:
   - Use the centralized error hierarchy
   - Always normalize unknown errors
   - Handle GraphQL Shield rule errors gracefully

4. **Authentication**:
   - Use `requireAuthentication()` for protected resolvers
   - Implement proper JWT token validation
   - Support refresh token rotation

5. **GraphQL Tada**:
   - Always define operations in `src/gql/` directory
   - Never use raw GraphQL strings in tests
   - Generate types with `bun run generate:gql` after schema changes

## Code Quality Standards

- **No `any` types**: Use specific types or `unknown`
- **Consistent formatting**: Auto-formatted with Biome
- **Import organization**: Imports are automatically sorted
- **Strict TypeScript**: All files must pass `bunx tsc --noEmit`
- **String modes**: Never use `mode: 'insensitive'` in Prisma queries (not supported in SQLite)

## Debugging Quick Reference

- **Type errors**: `bun run generate` (regenerates Prisma & GraphQL types)
- **Permission denied**: Check JWT token and shield-config.ts mappings
- **Global ID errors**: Verify Base64 encoding (e.g., "UG9zdDox" = "Post:1")
- **Database issues**: `bunx prisma studio` for visual inspection
- **GraphQL schema**: `bun run gen:schema` to update schema.graphql
- **Test specific operation**: Use GraphQL Playground at http://localhost:4000
- **Lint errors**: `bun run check:fix` to auto-fix all Biome issues
- **DI errors**: Check container.ts for proper interface registration

## Key Implementation Details

### RefreshToken Implementation
- Uses string IDs (UUIDs) in the database
- Returns JWT refresh token, not the raw token value
- Implements repository pattern with `IRefreshTokenRepository`
- Single-use tokens with rotation on refresh

### DataLoader Integration
- Created in context for N+1 prevention
- Available as `context.loaders.users` and `context.loaders.posts`
- Automatically batches database queries

### Authentication Flow
1. JWT access tokens (short-lived)
2. Refresh tokens (long-lived, stored in DB)
3. Token rotation on refresh
4. Email verification support
5. Password reset flow

### Performance Optimizations
- Pothos query spreading for efficient Prisma selects
- DataLoader for automatic query batching
- Strategic caching in Shield rules
- Direct Prisma access (no context overhead)