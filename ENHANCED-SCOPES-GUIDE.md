# Enhanced Auth Scopes Usage Guide

This guide explains how to use the EnhancedAuthScopes system in your GraphQL resolvers.

## Overview

The EnhancedAuthScopes provide a powerful authorization system with dynamic scopes, but due to Pothos' type constraints, they need to be used within resolver functions rather than in the `grantScopes` property.

## Available Scopes

### Basic Scopes

- `public`: Always true
- `authenticated`: True if user is logged in
- `admin`: True if user has admin role

### Resource Ownership Scopes

- `postOwner(postId)`: Check if user owns a specific post
- `userOwner(userId)`: Check if user ID matches current user

### Permission-Based Scopes

- `hasPermission(permission)`: Check if user has specific permission
- `hasAnyPermission(permissions[])`: Check if user has any of the permissions
- `hasAllPermissions(permissions[])`: Check if user has all permissions

### Content-Based Scopes

- `canViewContent(type, id)`: Check if user can view content
- `canEditContent(type, id)`: Check if user can edit content
- `canDeleteContent(type, id)`: Check if user can delete content

### Time-Based Scopes

- `withinTimeLimit(action, timeLimit)`: Check if action is within time limit
- `withinRateLimit(action, limit, window)`: Check rate limiting

### Conditional Scopes

- `canAccessIfPublic(type, id)`: Check if resource is public
- `canAccessIfOwnerOrPublic(type, id)`: Check if public or owned

## Usage Patterns

### Pattern 1: Basic Authentication Check

```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'], // Basic Pothos scope
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      // ... resolver logic
    },
  }),
)
```

### Pattern 2: Ownership Check in Resolver

```typescript
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      const scopes = createEnhancedAuthScopes(context)

      // Use enhanced scope for ownership check
      const isOwner = await scopes.postOwner(args.id)
      if (!isOwner) {
        throw new AuthorizationError('You can only modify your own posts')
      }

      // ... update logic
    },
  }),
)
```

### Pattern 3: Permission-Based Authorization

```typescript
builder.mutationField('moderatePost', (t) =>
  t.boolean({
    grantScopes: ['authenticated'],
    resolve: async (_parent, args, context) => {
      const scopes = createEnhancedAuthScopes(context)

      // Check for moderation permission
      const canModerate = await scopes.hasPermission('post:moderate')
      if (!canModerate) {
        throw new AuthorizationError('You need moderation permission')
      }

      // ... moderation logic
    },
  }),
)
```

### Pattern 4: Content Visibility Rules

```typescript
builder.queryField('post', (t) =>
  t.prismaField({
    type: 'Post',
    nullable: true,
    resolve: async (query, _parent, args, context) => {
      const scopes = createEnhancedAuthScopes(context)

      // Check if user can view this post
      const canView = await scopes.canViewContent('Post', args.id)
      if (!canView) {
        return null // Or throw error
      }

      const postId = parseGlobalId(args.id.toString(), 'Post')
      return prisma.post.findUnique({
        ...query,
        where: { id: postId },
      })
    },
  }),
)
```

### Pattern 5: Complex Authorization Logic

```typescript
builder.mutationField('publishPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],
    resolve: async (query, _parent, args, context) => {
      const scopes = createEnhancedAuthScopes(context)

      // Admin can publish any post
      if (scopes.admin) {
        return publishPost(args.id)
      }

      // Otherwise must be owner with publish permission
      const [isOwner, hasPublishPerm] = await Promise.all([
        scopes.postOwner(args.id),
        scopes.hasPermission('post:publish'),
      ])

      if (!isOwner) {
        throw new AuthorizationError('You can only publish your own posts')
      }

      if (!hasPublishPerm) {
        throw new AuthorizationError('You need publish permission')
      }

      return publishPost(args.id)
    },
  }),
)
```

### Pattern 6: Rate Limiting Integration

```typescript
builder.mutationField('createComment', (t) =>
  t.string({
    grantScopes: ['authenticated'],
    resolve: async (_parent, args, context) => {
      const scopes = createEnhancedAuthScopes(context)

      // Check rate limit
      const withinLimit = await scopes.withinRateLimit(
        'createComment',
        10, // max 10 comments
        3600000, // per hour
      )

      if (!withinLimit) {
        throw new RateLimitError('Too many comments. Please try again later.')
      }

      // ... create comment
    },
  }),
)
```

## Best Practices

1. **Use Basic Scopes in grantScopes**: For simple checks like `authenticated` or `public`, use the `grantScopes` array.

2. **Complex Logic in Resolvers**: For ownership checks, permissions, or complex rules, use EnhancedAuthScopes within the resolver.

3. **Error Handling**: Always throw appropriate errors (AuthorizationError, NotFoundError, etc.) when scope checks fail.

4. **Performance**: The scopes use DataLoaders when available for efficient batching.

5. **Combine Checks**: Use Promise.all() to run multiple scope checks in parallel.

## Migration from Manual Checks

### Before (Manual Check):

```typescript
const existingPost = await prisma.post.findUnique({
  where: { id: postId },
  select: { authorId: true },
})

if (existingPost.authorId !== userId.value) {
  throw new AuthorizationError('You can only modify your own posts')
}
```

### After (Using Scopes):

```typescript
const scopes = createEnhancedAuthScopes(context)
const isOwner = await scopes.postOwner(postId)

if (!isOwner) {
  throw new AuthorizationError('You can only modify your own posts')
}
```

## Future Enhancements

When Pothos adds better support for complex scope objects, we can migrate to using them directly in `grantScopes`:

```typescript
// Future syntax (not currently supported)
grantScopes: {
  authenticated: true,
  postOwner: args.id,
  hasPermission: 'post:edit'
}
```

Until then, use the patterns shown above for implementing sophisticated authorization logic with EnhancedAuthScopes.
