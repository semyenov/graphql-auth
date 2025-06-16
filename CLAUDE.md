# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun run test                            # Run all tests
bun run test --run                      # Run tests once (CI mode)
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
bun run gen:schema                     # Generate GraphQL schema file
```

## Critical Architecture: Mixed DDD + Legacy

The codebase uses **two parallel architectures** that must be kept in sync:

### 1. Clean Architecture (DDD) - New Features
Located in `src/features/` and `src/application/`, following Domain-Driven Design:
- **Domain Layer**: Business logic, entities, value objects
- **Application Layer**: Use cases that orchestrate business operations
- **Infrastructure Layer**: External integrations (database, services)
- **Presentation Layer**: GraphQL resolvers

### 2. Legacy Architecture - Existing Features
Located in `src/schema/`, using Pothos GraphQL schema builder directly

### Critical Integration Points

1. **Context Enhancement** (`src/context/enhanced-context.ts`):
   - Bridges legacy and DDD architectures
   - Provides `ctx.prisma` for legacy resolvers
   - Provides `ctx.useCases` for DDD use cases

2. **Dependency Injection** (`src/infrastructure/config/container.ts`):
   - Uses TSyringe for DI
   - **IMPORTANT**: Uses shared Prisma instance from `src/prisma.ts`
   - Test overrides via `setTestPrismaClient()`

3. **ID Type Conversions**:
   - DTOs return string IDs: `"1"`, `"2"`
   - Prisma expects numeric IDs: `1`, `2`
   - **Always use `parseInt(dto.id, 10)` before passing to Prisma**

## Relay Implementation Details

### Global ID Format
- Base64 encoded: `Base64("Type:id")` 
- Example: `"UG9zdDox"` = `"Post:1"`

### Query Patterns
```typescript
// ALWAYS spread query for Pothos optimizations
return ctx.prisma.post.findMany({
  ...query,  // <-- Critical for performance
  where: { id: { in: postIds } },
})
```

### ID Conversion Helpers
```typescript
// In resolvers
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
const numericId = parseGlobalId(args.id.toString(), 'Post')

// In tests
import { toPostId, extractNumericId } from './test/relay-utils'
const globalId = toPostId(1)  // 1 → "UG9zdDox"
const numericId = extractNumericId(globalId)  // "UG9zdDox" → 1
```

## Testing Architecture

### Test Database Setup
- Single shared database: `file:./test-db.db`
- Automatic cleanup between tests
- Shared Prisma client via `setTestPrismaClient()`

### Common Test Patterns
```typescript
// Create authenticated context
const context = createAuthContext(userId)  // userId must be numeric

// Execute GraphQL operations
const data = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(LoginMutation),  // Use typed queries from src/gql/
  variables,
  context
)
```

## Error Handling Patterns

### Always Normalize Errors
```typescript
try {
  // operation
} catch (error) {
  throw normalizeError(error)  // Converts to BaseError hierarchy
}
```

### Error Hierarchy
- `BaseError` (400) - Base class
- `AuthenticationError` (401) - Login required
- `AuthorizationError` (403) - Permission denied
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Duplicate resource
- `ValidationError` (400) - Invalid input

## Permission System

### GraphQL Shield Rules
- Rules return errors instead of throwing
- Located in `src/permissions/`
- Mapped to operations in `shield-config.ts`

### Rule Pattern
```typescript
export const isPostOwner = rule({ cache: 'strict' })(
  async (parent, args, context) => {
    try {
      // validation and checks
      return true
    } catch (error) {
      return handleRuleError(error)  // Never throw directly
    }
  }
)
```

## Common Pitfalls

1. **ID Type Mismatch**: DTOs use string IDs, Prisma uses numeric IDs
2. **Missing Query Spread**: Always spread `query` in Pothos resolvers
3. **Context Types**: Use `EnhancedContext` for resolvers, not base `Context`
4. **Test Isolation**: Tests share database, clean between tests
5. **Permission Errors**: Rules must return errors, not throw

## GraphQL Development

- **Playground**: http://localhost:4000
- **Schema**: Auto-generated in `_docs/schema.graphql`
- **Type Safety**: GraphQL Tada in `src/gql/`

## Debugging Tips

- **Type errors**: Run `bun run generate`
- **Test failures**: Check ID conversions and context types
- **Permission errors**: Verify JWT token and shield mappings
- **Prisma warnings**: Ensure `query` is spread in resolvers