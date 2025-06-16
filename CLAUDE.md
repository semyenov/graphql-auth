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

### GraphQL Schema (Pothos)

```
src/schema/
├── builder.ts      # Pothos builder with Prisma plugin
├── index.ts        # Schema assembly
├── types/          # Object type definitions
├── queries/        # Query resolvers
├── mutations/      # Mutation resolvers
├── inputs.ts       # Input type definitions
├── enums.ts        # GraphQL enums
└── scalars.ts      # Custom scalars
```

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

2. **GraphQL Type**:
   ```typescript
   // src/schema/types/feature.ts
   builder.prismaObject('Feature', {
     fields: (t) => ({
       id: t.exposeID('id'),
       // ... fields
     })
   })
   ```

3. **Resolver with Validation**:
   ```typescript
   // src/schema/mutations/feature.ts
   import { validateInput, featureSchema } from '../../utils/validation'
   import { AuthenticationError, normalizeError } from '../../errors'
   
   builder.mutationField('createFeature', (t) =>
     t.prismaField({
       type: 'Feature',
       args: { /* ... */ },
       resolve: async (query, _, args, ctx) => {
         try {
           const userId = getUserId(ctx)
           if (!userId) throw new AuthenticationError()
           
           const data = validateInput(featureSchema, args)
           return await ctx.prisma.feature.create({
             ...query,
             data: { ...data, userId }
           })
         } catch (error) {
           throw normalizeError(error)
         }
       }
     })
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
      createAuthContext('1') // For authenticated requests
    )
  })
})
```

## Common Issues & Solutions

- **Type errors**: Run `bun run generate`
- **Build errors**: Ensure `bunfig.toml` has `target = "bun"`
- **Test failures**: Check error messages match new patterns (e.g., "Invalid email or password" not "Invalid password")
- **Permission errors**: Verify context has proper userId and roles
- **Database issues**: Run `bun run db:reset`

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