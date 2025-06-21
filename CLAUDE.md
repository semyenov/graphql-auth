# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun test                                # Run tests with Bun test runner
bun test --run                          # Run all tests once (no watch)
bun test --watch                        # Run tests in watch mode
bun test test/modules/auth/auth.test.ts # Run specific test file
bun test -t "authentication"            # Run tests matching pattern
bun test --coverage                     # Run tests with coverage
bun test --ui                           # Run tests with UI

# Alternative Test Runners
bun run vitest                          # Run tests with Vitest
bun run vitest:run                      # Run Vitest once (no watch)
bun run vitest:ui                       # Run Vitest with UI
bun run vitest:coverage                 # Run Vitest with coverage

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate all types (Prisma + GraphQL)
bun run generate:prisma                 # Generate Prisma client only
bun run generate:gql                    # Generate GraphQL types only
bun run db:reset                        # Reset database with seed data
bun run seed                            # Manually seed database
bunx prisma studio                      # Open database GUI

# Build & Production
bun run build                          # Build for production (src/main.ts -> dist/app/server.js)
bun run start                          # Start production server
bun run clean                          # Clean build directory

# Code Quality
bunx tsc --noEmit                      # Type check all files
bun run lint                           # Run Biome linter
bun run lint:fix                       # Auto-fix linting issues
bun run format                         # Check formatting
bun run format:fix                     # Auto-fix formatting
bun run check                          # Run all Biome checks
bun run check:fix                      # Auto-fix all issues

# GraphQL Schema
bun run gen:schema                      # Generate GraphQL schema file
bunx gql.tada generate-output           # Generate GraphQL type definitions

# Environment & Utilities
bun run env:verify                      # Verify environment setup
bun run postinstall                     # Apply patches after install
bun run prepare                         # Setup husky git hooks
bun run lint-staged                     # Run lint-staged (used by git hooks)
```

## Architecture Overview

### Tech Stack

- **Runtime**: Bun (fast JavaScript/TypeScript runtime)
- **GraphQL Server**: Apollo Server 4 with standalone server
- **Schema Builder**: Pothos with 7 advanced plugins:
  - **Prisma Plugin**: Direct access pattern (NOT in context)
  - **Relay Plugin**: Global IDs, connections, cursor pagination
  - **Errors Plugin**: Union result types for error handling
  - **Scope Auth Plugin**: Dynamic authorization scopes
  - **Shield Plugin**: Inline GraphQL Shield rules (custom implementation)
  - **DataLoader Plugin**: Automatic N+1 query prevention
  - **Validation Plugin**: Zod integration with async refinements
- **Database**: Prisma ORM with SQLite (PostgreSQL ready with Accelerate)
- **Authentication**: JWT with argon2 (bcrypt fallback) + refresh tokens
- **Authorization**: Dual system - Pothos Scope Auth + GraphQL Shield
- **Type Safety**: GraphQL Tada for compile-time GraphQL typing
- **Testing**: Bun test (primary), Vitest (alternative with dedicated config)
- **Code Quality**: Biome for linting/formatting + Husky for git hooks
- **Rate Limiting**: rate-limiter-flexible with configurable presets
- **Dependency Injection**: TSyringe for service management
- **Logging**: Consola for development, Pino ready for production

### Project Structure

The project follows a **modular architecture** with direct Pothos resolvers:

```
src/
├── app/                    # Application bootstrap
├── modules/                # Feature modules (auth, posts, users, shared)  
├── graphql/               # GraphQL infrastructure
├── core/                  # Core utilities and business logic
├── data/                  # Data layer (database, loaders, cache)
├── lib/                   # Third-party integrations
├── gql/                   # Typed GraphQL operations for testing
└── prisma.ts             # Prisma client export
```

## Critical Patterns

### 1. Direct Prisma Access (NEVER from context)

```typescript
// ✅ CORRECT
import { prisma } from '../../../prisma'

// ❌ WRONG - Never do this
// const prisma = context.prisma
```

### 2. Always Spread Query Parameter

```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    resolve: async (query, _parent, args, context) => {
      return prisma.post.create({
        ...query, // ⚠️ CRITICAL: Always spread first
        data: { /* ... */ },
      })
    },
  }),
)
```

### 3. Error Handling

```typescript
import { normalizeError } from '../../../core/errors/handlers'

try {
  // operation
} catch (error) {
  throw normalizeError(error)
}
```

### 4. Global ID Handling

```typescript
import { parseAndValidateGlobalId, encodeGlobalId } from '../../core/utils/relay'

// Parse: "UG9zdDox" -> 1
const numericId = await parseAndValidateGlobalId(args.id, 'Post')

// Encode: 1 -> "UG9zdDox"
const globalId = encodeGlobalId('Post', post.id)
```

### 5. Authentication

```typescript
import { requireAuthentication } from '../../graphql/context/context.auth'

const userId = requireAuthentication(context) // Throws if not authenticated
```

### 6. Shield Authorization

```typescript
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],              // Pothos Scope Auth
    shield: and(isAuthenticatedUser, isPostOwner), // GraphQL Shield
    resolve: async (query, _parent, args, context) => {
      // Implementation
    },
  }),
)
```

### 7. Testing with GraphQL Tada

```typescript
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/mutations'

// ✅ CORRECT - Typed operations
const result = await executeOperation(
  server,
  print(LoginMutation),
  variables,
  context,
)

// ❌ WRONG - Raw strings
// await executeOperation(server, 'mutation { ... }', ...)
```

## Common Tasks

### Add a New Module

1. Create directory: `src/modules/feature/`
2. Add files:
   - `feature.schema.ts` - GraphQL types
   - `feature.permissions.ts` - Authorization rules
   - `feature.validation.ts` - Input validation
   - `resolvers/feature.resolver.ts` - GraphQL resolvers

3. Import resolver in `src/graphql/schema/index.ts`:
   ```typescript
   import '../../modules/feature/resolvers/feature.resolver'
   ```

### Add GraphQL Operation for Testing

1. Define in `src/gql/mutations.ts`:
   ```typescript
   export const CreateFeatureMutation = graphql(`
     mutation CreateFeature($input: CreateFeatureInput!) {
       createFeature(input: $input) { id name }
     }
   `)
   ```

2. Generate types: `bun run generate:gql`

3. Use in tests with `print(CreateFeatureMutation)`

### Debug Common Issues

- **Type errors**: Run `bun run generate`
- **Permission denied**: Check JWT token and Shield rules
- **Global ID invalid**: Verify Base64 encoding
- **Database issues**: Use `bunx prisma studio`
- **Lint errors**: Run `bun run check:fix`

## Environment Variables

```bash
# Required
DATABASE_URL="file:./dev.db"     # SQLite or postgresql://...
JWT_SECRET="your-secret-key"      # JWT signing secret

# Optional  
NODE_ENV="development"
PORT=4000
HOST="localhost"
BCRYPT_ROUNDS=10
```

## Testing Notes

- **Primary**: Use `bun test` - fast and reliable
- **Alternative**: `vitest` configured but may have GraphQL module conflicts
- **Always**: Use typed GraphQL operations from `src/gql/`
- **Never**: Use raw GraphQL strings in tests

### Test Runner Configuration

#### Bun Test (Recommended)
- Native Bun test runner with excellent performance
- Configuration in `bunfig.toml`
- Preloads: `test/test-env.ts` and `test/bun-setup.ts`
- Best compatibility with Bun runtime features

#### Vitest (Alternative)
- Configuration in `vitest.config.ts`
- Environment: `happy-dom`
- Pool: `forks` with sequential execution
- GraphQL module resolution fixes included
- Coverage: V8 provider

## Key Dependencies

- **graphql**: Locked at 16.11.0 (avoid version conflicts)
- **@pothos/***: Keep all plugins on compatible versions
- **argon2**: Primary password hashing (bcrypt as fallback)
- **biome**: Code quality tool (no ESLint/Prettier needed)
- **fetchdts**: Type-safe fetch API for improved HTTP handling
- **husky + lint-staged**: Git hooks for code quality enforcement

## Recent Changes

- Consolidated test utilities under `test/utils/`
- Fixed vitest GraphQL module conflicts
- Added argon2 password hashing with hybrid service
- Migrated to inline ShieldPlugin approach
- Enhanced with security headers middleware
- Added fetchdts for type-safe HTTP operations
- Configured dual test runner support (Bun + Vitest)
- Implemented git hooks with Husky for code quality
- Improved TypeScript strict mode compliance
- Removed legacy bcrypt-only implementations