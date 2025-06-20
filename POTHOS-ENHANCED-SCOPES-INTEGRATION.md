# Integrating Enhanced Auth Scopes with Pothos Scope Auth Plugin

This guide demonstrates how to integrate the EnhancedAuthScopes system with the Pothos Scope Auth plugin for advanced authorization patterns.

## Overview

The EnhancedAuthScopes system extends Pothos' built-in Scope Auth plugin with:
- 14+ predefined scope types (ownership, permissions, content-based, time-based)
- Batch authorization checks with ScopeLoader
- DataLoader integration for N+1 prevention
- Rich error handling with descriptive messages

## Installation & Setup

### 1. Configure Pothos Builder with Enhanced Scopes

```typescript
// src/schema/builder.ts
import { createEnhancedAuthScopes, type EnhancedAuthScopes } from '../infrastructure/graphql/authorization/enhanced-scopes'

// Define the AuthScopes type to include both basic and enhanced scopes
type AuthScopes = {
  // Basic boolean scopes (Pothos native)
  public: boolean
  authenticated: boolean
  admin: boolean
  
  // Enhanced dynamic scopes (our implementation)
  enhanced: EnhancedAuthScopes
}

const builder = new SchemaBuilder<{
  Context: EnhancedContext
  AuthScopes: AuthScopes
  // ... other types
}>({
  plugins: [
    ScopeAuthPlugin, // Must be first
    PrismaPlugin,
    RelayPlugin,
    ErrorsPlugin,
    DataloaderPlugin,
    ValidationPlugin,
  ],
  
  // Configure auth scopes
  authScopes: async (context) => {
    const enhanced = createEnhancedAuthScopes(context)
    
    return {
      // Basic scopes for simple checks
      public: true,
      authenticated: !!context.userId,
      admin: context.user?.role === 'admin',
      
      // Enhanced scopes object
      enhanced,
    }
  },
  
  // Configure scope auth plugin
  scopeAuthOptions: {
    // Recommended: run authorization before resolving field
    runScopesOnType: false,
    
    // Custom authorization error
    unauthorizedError: (parent, args, context, info) => {
      return new AuthorizationError(`Not authorized to access ${info.fieldName}`)
    },
  },
})
```

### 2. Using Enhanced Scopes in Resolvers

#### Basic Authentication (Pothos Native)

```typescript
builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    authScopes: {
      authenticated: true, // Simple boolean check
    },
    resolve: (query, root, args, ctx) => {
      return prisma.user.findUniqueOrThrow({
        ...query,
        where: { id: ctx.userId!.value },
      })
    },
  })
)
```

#### Resource Ownership Check

```typescript
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      id: t.arg.id({ required: true }),
      data: t.arg({ type: UpdatePostInput, required: true }),
    },
    authScopes: async (parent, args, context, info) => {
      // Use enhanced scopes for ownership check
      const isOwner = await context.authScopes.enhanced.postOwner(args.id)
      
      if (!isOwner) {
        throw new AuthorizationError('You can only update your own posts')
      }
      
      return true
    },
    resolve: async (query, root, args, ctx) => {
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

#### Permission-Based Authorization

```typescript
builder.mutationField('moderatePost', (t) =>
  t.field({
    type: 'Post',
    args: {
      id: t.arg.id({ required: true }),
      action: t.arg.string({ required: true }),
    },
    authScopes: async (parent, args, context) => {
      // Check multiple permissions
      const canModerate = await context.authScopes.enhanced.hasAnyPermission([
        'post:moderate',
        'admin:all',
      ])
      
      return canModerate
    },
    resolve: async (root, args, ctx) => {
      // Moderation logic
    },
  })
)
```

#### Content Visibility Rules

```typescript
builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    // Skip type-level auth to handle in resolver
    skipTypeScopes: true,
    authScopes: async (parent, args, context) => {
      // Complex visibility check
      return context.authScopes.enhanced.canViewContent('Post', args.id)
    },
    resolve: async (query, root, args, ctx) => {
      const postId = parseGlobalId(args.id, 'Post')
      
      return prisma.post.findUnique({
        ...query,
        where: { id: postId },
      })
    },
  })
)
```

## Advanced Patterns

### 1. Combining Multiple Scopes

```typescript
builder.mutationField('publishPost', (t) =>
  t.field({
    type: 'Post',
    args: {
      id: t.arg.id({ required: true }),
    },
    authScopes: {
      // Must be authenticated
      authenticated: true,
      
      // AND must satisfy custom logic
      $all: [
        async (parent, args, context) => {
          // Admin can publish any post
          if (context.authScopes.admin) return true
          
          // Otherwise must own the post
          const isOwner = await context.authScopes.enhanced.postOwner(args.id)
          if (!isOwner) {
            throw new AuthorizationError('You can only publish your own posts')
          }
          
          // AND have publish permission
          const canPublish = await context.authScopes.enhanced.hasPermission('post:publish')
          if (!canPublish) {
            throw new AuthorizationError('You need publish permission')
          }
          
          return true
        },
      ],
    },
    resolve: async (root, args, ctx) => {
      // Publishing logic
    },
  })
)
```

### 2. Rate Limiting Integration

```typescript
builder.mutationField('createComment', (t) =>
  t.field({
    type: 'Comment',
    args: {
      postId: t.arg.id({ required: true }),
      content: t.arg.string({ required: true }),
    },
    authScopes: async (parent, args, context) => {
      // Check authentication
      if (!context.authScopes.authenticated) {
        return false
      }
      
      // Check rate limit
      const withinLimit = await context.authScopes.enhanced.withinRateLimit(
        'createComment',
        10,      // max 10 comments
        3600000  // per hour (in ms)
      )
      
      if (!withinLimit) {
        throw new RateLimitError('Too many comments. Please try again later.')
      }
      
      return true
    },
    resolve: async (root, args, ctx) => {
      // Create comment
    },
  })
)
```

### 3. Batch Authorization with ScopeLoader

```typescript
// In a connection resolver
builder.queryField('posts', (t) =>
  t.connection({
    type: 'Post',
    authScopes: {
      authenticated: true,
    },
    resolve: async (root, args, ctx) => {
      // Fetch posts
      const posts = await prisma.post.findMany({
        where: { published: true },
      })
      
      // Batch check permissions using ScopeLoader
      const scopeLoader = new ScopeLoader(ctx)
      const postIds = posts.map(p => p.id)
      const ownershipChecks = await scopeLoader.batchCheckPostOwnership(postIds)
      
      // Filter based on ownership
      return posts.filter((post, index) => 
        post.published || ownershipChecks[index]
      )
    },
  })
)
```

### 4. Type-Level Authorization

```typescript
// Apply authorization to all fields of a type
builder.prismaObject('AdminDashboard', {
  authScopes: {
    admin: true, // All fields require admin
  },
  fields: (t) => ({
    stats: t.field({
      type: DashboardStats,
      resolve: () => getAdminStats(),
    }),
    users: t.field({
      type: [User],
      resolve: () => prisma.user.findMany(),
    }),
  }),
})
```

### 5. Conditional Field Exposure

```typescript
builder.prismaObject('User', {
  fields: (t) => ({
    // Public fields
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    
    // Email only visible to self or admin
    email: t.exposeString('email', {
      authScopes: async (user, args, context) => {
        return context.authScopes.admin || 
               await context.authScopes.enhanced.userOwner(user.id)
      },
    }),
    
    // Private fields
    settings: t.field({
      type: UserSettings,
      authScopes: async (user, args, context) => {
        // Only owner can see settings
        return context.authScopes.enhanced.userOwner(user.id)
      },
      resolve: (user) => getUserSettings(user.id),
    }),
  }),
})
```

## Performance Optimization

### 1. Scope Caching

The EnhancedAuthScopes system includes built-in caching:

```typescript
const scopeLoader = new ScopeLoader(context)

// Cache permission check result
const hasPermission = scopeLoader.getCacheKey('perm:post:edit')
if (hasPermission === null) {
  const result = await checkPermission('post:edit')
  scopeLoader.setCacheKey('perm:post:edit', result, 60000) // Cache for 1 minute
}
```

### 2. DataLoader Integration

```typescript
// Enhanced scopes automatically use DataLoaders when available
const enhanced = createEnhancedAuthScopes(context)

// This will use the post DataLoader if available
const isOwner = await enhanced.postOwner(postId)

// Multiple checks are batched automatically
const [canEdit, canDelete] = await Promise.all([
  enhanced.canEditContent('Post', postId),
  enhanced.canDeleteContent('Post', postId),
])
```

## Migration Guide

### From Basic Pothos Scopes

```typescript
// Before: Basic scope check
authScopes: {
  authenticated: true,
}

// After: Same syntax still works
authScopes: {
  authenticated: true,
}
```

### From Manual Authorization

```typescript
// Before: Manual ownership check in resolver
resolve: async (query, root, args, ctx) => {
  const post = await prisma.post.findUnique({
    where: { id: args.id },
    select: { authorId: true },
  })
  
  if (post?.authorId !== ctx.userId?.value) {
    throw new AuthorizationError('Not authorized')
  }
  
  // ... rest of resolver
}

// After: Using enhanced scopes
authScopes: async (parent, args, context) => {
  return context.authScopes.enhanced.postOwner(args.id)
},
resolve: async (query, root, args, ctx) => {
  // Just the business logic
}
```

### From GraphQL Shield

```typescript
// Before: Shield rule
const isPostOwner = rule({ cache: 'strict' })(
  async (parent, args, ctx) => {
    // ownership check logic
  }
)

// After: Enhanced scope
authScopes: async (parent, args, context) => {
  return context.authScopes.enhanced.postOwner(args.id)
}
```

## Best Practices

1. **Use Basic Scopes for Simple Checks**: For `authenticated`, `public`, or `admin` checks, use the basic boolean scopes.

2. **Enhanced Scopes for Complex Logic**: Use enhanced scopes for ownership, permissions, or content-based rules.

3. **Throw Descriptive Errors**: Enhanced scopes throw specific error types with helpful messages.

4. **Batch Operations**: Use ScopeLoader for checking multiple resources at once.

5. **Cache Expensive Checks**: Utilize the built-in caching for permission lookups.

6. **Type Safety**: The enhanced scopes are fully typed, ensuring compile-time safety.

## Comparison with Standard Pothos Patterns

| Feature | Standard Pothos | Enhanced Scopes |
|---------|----------------|-----------------|
| Basic auth checks | ✅ Built-in | ✅ Included |
| Ownership checks | ❌ Manual implementation | ✅ `postOwner()`, `userOwner()` |
| Permission system | ❌ Custom code | ✅ `hasPermission()`, `hasAnyPermission()` |
| Content visibility | ❌ Manual checks | ✅ `canViewContent()`, `canEditContent()` |
| Rate limiting | ❌ Separate middleware | ✅ `withinRateLimit()` |
| Batch auth checks | ❌ Manual DataLoader | ✅ Built-in ScopeLoader |
| Time-based rules | ❌ Custom logic | ✅ `withinTimeLimit()` |
| Error handling | ⚠️ Basic errors | ✅ Rich error types |

## Troubleshooting

### Common Issues

1. **Type Errors with authScopes**
   - Ensure your builder includes the `AuthScopes` type
   - Check that enhanced scopes are properly typed in the context

2. **Async Scope Functions**
   - Remember that scope functions can be async
   - Always await enhanced scope methods

3. **Performance Issues**
   - Use ScopeLoader for batch operations
   - Enable DataLoader integration
   - Cache expensive permission checks

4. **Authorization Errors**
   - Enhanced scopes throw specific error types
   - Catch and handle appropriately in error formatting

## Future Enhancements

As Pothos evolves, we plan to:
1. Add more scope types (geo-based, subscription-based)
2. Improve caching strategies
3. Add metrics and monitoring
4. Support for external authorization services

## Resources

- [Pothos Scope Auth Documentation](https://pothos-graphql.dev/docs/plugins/scope-auth)
- [Enhanced Scopes Source Code](./src/infrastructure/graphql/authorization/enhanced-scopes.ts)
- [Usage Examples](./ENHANCED-SCOPES-GUIDE.md)
- [Test Suite](./test/enhanced-scopes.test.ts)