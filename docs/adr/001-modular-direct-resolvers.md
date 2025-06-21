# ADR-001: Modular Direct Resolvers Pattern

## Status
Accepted

## Context
We needed to decide between several architectural patterns for organizing our GraphQL resolvers:
1. Domain-Driven Design (DDD) with multiple layers
2. Repository pattern with abstraction layers
3. Direct resolvers with modular organization

## Decision
We chose to use **Modular Direct Resolvers** pattern where:
- Resolvers contain business logic directly
- Prisma is accessed directly without repository abstraction
- Complex logic is extracted to services
- Each module is self-contained with its own resolvers, types, and services

## Consequences

### Positive
- **Simplicity**: Code is straightforward and easy to understand
- **Performance**: No unnecessary abstraction layers
- **Type Safety**: Direct Prisma usage provides full type safety
- **Maintainability**: Business logic is colocated with GraphQL definitions

### Negative
- **Testing**: Requires database for integration tests (mitigated by test utilities)
- **Flexibility**: Harder to swap data sources (acceptable trade-off)

## Example
```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      return prisma.post.create({
        ...query,
        data: {
          title: args.title,
          authorId: userId.value,
        }
      })
    }
  })
)
```