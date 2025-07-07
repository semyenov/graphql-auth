# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recent Improvements (2025-07-07)

### Dependency Injection Enhancements
- **Service Registry Pattern**: Centralized `Services` class for type-safe service access
- **Interface-based Registration**: All services use interfaces for better testability
- **Enhanced Auth Features**: Email verification, password reset, account lockout
- **Critical Fix**: SERVICE_TOKENS now properly imported from `@/app/config/service-registry`

## Quick Command Reference

```bash
# Development
bun run dev                             # Start dev server (port 4000)
bun test --run                          # Run all tests once
bun test test/modules/auth/auth.test.ts # Run specific test file
bun test -t "should create user"        # Run tests matching pattern

# Database
bunx prisma migrate dev --name feature  # Create migration
bun run generate                        # Generate Prisma + GraphQL types
bun run db:reset                        # Reset database with seed data
bunx prisma studio                      # Open database GUI

# Code Quality
bunx tsc --noEmit                      # Type check
bun run lint                           # Run Biome linter
bun run format:fix                     # Auto-fix formatting
bun run check:fix --unsafe             # Fix all issues including any types

# GraphQL Schema
bun run gen:schema                     # Generate schema file to _docs/
bunx gql.tada generate-output          # Generate GraphQL types
```

## Architecture Overview

### Tech Stack
- **Runtime**: Bun
- **HTTP**: H3 framework
- **GraphQL**: Apollo Server 4 + Pothos (7 plugins)
- **Database**: Prisma ORM with SQLite
- **Auth**: JWT + argon2 + refresh tokens
- **DI**: TSyringe with Service Registry pattern
- **Testing**: Vitest + GraphQL Tada

### Key Architectural Decisions
- **[ADR-001](docs/adr/001-modular-direct-resolvers.md)**: Direct resolvers pattern
- **[ADR-002](docs/adr/002-dual-authorization-system.md)**: Pothos Scope Auth + GraphQL Shield
- **[ADR-003](docs/adr/003-direct-prisma-access.md)**: Import Prisma directly, never through context

## Critical Patterns

### 1. Service Registry Pattern

```typescript
import { Services, ServiceFactory } from '@/app/config/service-registry'

// Access services directly
await Services.password.hash(password)
await Services.email.sendVerificationEmail({ to, name, token })

// Create contextual loggers
const logger = ServiceFactory.createResolverLogger('signup')
```

### 2. Pothos Resolver Pattern

**CRITICAL**: Always spread `query` parameter first:

```typescript
t.prismaField({
  resolve: async (query, _parent, args, context) => {
    return prisma.post.create({
      ...query, // ⚠️ CRITICAL: Spread first for optimizations
      data: { title: args.title }
    })
  }
})
```

### 3. Direct Prisma Import

```typescript
// ✅ CORRECT
import { prisma } from '@/modules/shared/database'

// ❌ WRONG - Never access from context
const prisma = context.prisma
```

### 4. Shield Rules Pattern

```typescript
export const isPostOwner = rule({ cache: 'strict' })(
  async (_parent, args, context) => {
    try {
      const userId = requireAuthentication(context)
      const postId = parseGlobalId(args.id, 'Post')
      const post = await prisma.post.findUnique({ where: { id: postId } })
      
      if (!post || post.authorId !== userId.value) {
        return new ForbiddenError('You can only modify your own posts')
      }
      return true
    } catch (error) {
      return handleRuleError(error)
    }
  }
)
```

### 5. GraphQL Tada Testing

```typescript
import { createGraphQLTestHelper } from '@test/utils'
import { LoginMutation } from '@/gql/mutations'

const gql = createGraphQLTestHelper(server)
const data = await gql.mutate(LoginMutation, variables, context)
await gql.expectError(LoginMutation, variables, 'Error message', context)
```

## Service Registry Reference

### Available Services
- **Core**: `Services.config`, `Services.logger`
- **Auth**: `Services.password`, `Services.token`, `Services.loginAttempt`, `Services.verificationToken`
- **Shared**: `Services.email`, `Services.rateLimiter`
- **OIDC**: `Services.oidcProvider`

### Service Tokens
```typescript
import { SERVICE_TOKENS } from '@/app/config/service-registry'
// Used for container registration only
```

## Module Structure

```
modules/[feature]/
├── [feature].resolver.ts     # Pothos resolvers
├── [feature].rules.ts        # Shield authorization rules
├── [feature].types.ts        # GraphQL type definitions
├── services/                 # Complex business logic
│   ├── [service].interface.ts
│   └── [service].service.ts
└── tests/                    # Co-located tests
```

## Common Issues & Solutions

### TypeScript Errors
```bash
bun run generate  # Regenerate Prisma + GraphQL types
```

### Import Errors
```typescript
// ❌ WRONG
import { SERVICE_TOKENS } from '@/app/constants'

// ✅ CORRECT
import { SERVICE_TOKENS } from '@/app/config/service-registry'
```

### Test Runner Issues
```bash
# For Bun tests
bun test

# For Vitest (GraphQL duplication issues)
npm run vitest:run  # NOT bun vitest
```

### Shield Authorization
- Rules return errors, don't throw
- Use `parseGlobalId()` for Relay IDs
- Cache with `{ cache: 'strict' }`

## Environment Variables

```bash
# Required
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"

# Optional
NODE_ENV="development"
PORT=4000
OIDC_ISSUER="http://localhost:4000"
TEST_DISABLE_LOCKOUT="true"  # For tests
```

## H3 Middleware Stack

Applied in order:
1. Request logging
2. GraphQL operation logging
3. Response compression
4. Security headers
5. Rate limiting
6. CORS handling

## Key Implementation Rules

1. **Always spread `query`** in Prisma operations
2. **Import Prisma directly**, never from context
3. **Use Services registry** instead of manual container.resolve()
4. **Return errors in Shield rules**, don't throw
5. **Use GraphQL Tada** for type-safe tests
6. **Prefix unused params** with underscore (`_parent`)
7. **No `any` types** - use `unknown` or specific types
8. **Use normalizeError()** for error handling

## Relay Global IDs

```typescript
// Format: Base64("EntityType:numericId")
// "Post:1" → "UG9zdDox"

import { toGlobalId, parseGlobalId } from '@/modules/shared/connections'

// In resolvers
const postId = parseGlobalId(args.id, 'Post')  // Returns numeric ID
```

## OIDC Implementation

### Endpoints
- `/.well-known/openid-configuration` - Discovery
- `/oidc/auth` - Authorization
- `/oidc/token` - Token endpoint
- `/oidc/userinfo` - User info

### GraphQL Operations
```graphql
# Admin only
oidcClients
createOidcClient
updateOidcClient

# User operations
myOidcSessions
revokeOidcSession
```

## Testing Patterns

### Test Utilities
- `createTestUser()` - Test users with hashed passwords
- `createAuthenticatedContext()` - Auth context from user
- `createGraphQLTestHelper()` - Type-safe GraphQL testing

### Running Tests
```bash
bun test                        # All tests
bun test -t "pattern"          # Match pattern
bun test path/to/test.ts       # Specific file
```

## Code Style (Biome)

- **Indentation**: 2 spaces
- **Quotes**: Single quotes (JS/TS), double (JSX)
- **Trailing commas**: Always
- **No `any`**: Use `unknown`
- **No barrel files**: Disabled for performance