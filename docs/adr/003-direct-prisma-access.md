# ADR-003: Direct Prisma Access Pattern

## Status
Accepted

## Context
We evaluated different patterns for database access:
1. Repository pattern with interfaces
2. Prisma passed through GraphQL context
3. Direct Prisma import and usage

## Decision
We chose **Direct Prisma Import** pattern where:
- Prisma client is imported directly in resolvers and services
- No abstraction layer between business logic and Prisma
- Exception: RefreshToken uses repository for token-specific operations

## Implementation
```typescript
// CORRECT: Direct import
import { prisma } from '../../../prisma'

// WRONG: Never do this
const prisma = context.prisma

// In resolver
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    resolve: async (query, _parent, args, context) => {
      return prisma.post.create({
        ...query,  // Always spread query for optimization
        data: { ... }
      })
    }
  })
)
```

## Consequences

### Positive
- **Type Safety**: Full Prisma type inference
- **Performance**: Query optimization through Pothos
- **Simplicity**: No abstraction overhead
- **Clarity**: Database operations are explicit

### Negative
- **Testing**: Requires database or mocking Prisma
- **Coupling**: Tight coupling to Prisma
- **Migration**: Harder to switch ORMs

## Mitigation
- Use test database for integration tests
- Accept ORM coupling as reasonable trade-off
- RefreshToken repository shows migration path if needed