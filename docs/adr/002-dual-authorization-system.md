# ADR-002: Dual Authorization System

## Status
Accepted

## Context
We needed a flexible authorization system that could handle:
- Simple authentication checks (is user logged in?)
- Complex business rules (does user own this resource?)
- Field-level permissions (can user see this field?)
- Performance optimization (caching authorization results)

## Decision
We implemented a **Dual Authorization System** using:
1. **Pothos Scope Auth Plugin** for basic authentication and role checks
2. **GraphQL Shield Plugin** for complex, rule-based authorization

## Implementation
```typescript
// Basic auth with Pothos
builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    grantScopes: ['authenticated'],  // Simple check
    resolve: (query, _parent, _args, context) => {
      // Already authenticated by grantScopes
      return prisma.user.findUnique({
        ...query,
        where: { id: context.user!.value }
      })
    }
  })
)

// Complex auth with Shield
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],
    shield: and(isAuthenticatedUser, isPostOwner),  // Complex rules
    resolve: async (query, _parent, args, context) => {
      // Authorization already verified by shield
      return prisma.post.update({ ...query, ... })
    }
  })
)
```

## Consequences

### Positive
- **Flexibility**: Different auth needs use appropriate tools
- **Performance**: Shield rules can be cached
- **Readability**: Authorization intent is clear
- **Reusability**: Shield rules can be composed and reused

### Negative
- **Complexity**: Two systems to understand
- **Duplication**: Some checks might be redundant

## Guidelines
- Use `grantScopes` for simple authentication/role checks
- Use `shield` for complex business rules and ownership checks
- Always handle errors gracefully in Shield rules
- Cache Shield rules when appropriate (`cache: 'strict'`)