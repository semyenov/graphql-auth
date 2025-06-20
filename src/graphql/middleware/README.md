# GraphQL Shield Permissions

This module implements a comprehensive permission system using GraphQL Shield to protect your GraphQL API.

## Overview

GraphQL Shield provides a declarative way to add authorization to your GraphQL server using rule-based permissions. Our implementation includes:

- **Authentication rules** - Verify user identity
- **Ownership rules** - Ensure users can only access their own data
- **Field-level protection** - Hide sensitive data based on context
- **Smart caching** - Optimize permission checks with contextual and strict caching

## Rule Types

### Authentication Rules

- `isAuthenticatedUser` - Requires a valid authenticated user
- `isAdmin` - Requires admin role (future use)

### Ownership Rules

- `isPostOwner` - For mutations/queries with post ID in arguments
- `isPostOwnerField` - For field-level permissions using parent data
- `isOwnerOrAdmin` - For accessing user-specific data

## Permission Structure

### Query Permissions

- **Public**: `feed`, `allUsers`, `postById`
- **Authenticated**: `me`
- **Owner-only**: `draftsByUser`

### Mutation Permissions

- **Public**: `login`, `signup`, `incrementPostViewCount`
- **Authenticated**: `createDraft`
- **Owner-only**: `deletePost`, `togglePublishPost`

### Type-Level Permissions

#### User Type

- **Public fields**: `id`, `email`, `name`
- **Protected fields**: `posts` (requires authentication)

#### Post Type

- **Public fields**: `id`, `title`, `published`, `createdAt`, `updatedAt`, `viewCount`, `author`
- **Protected fields**: `content` (visible if published OR user is author)

## Caching Strategy

- **Contextual caching**: Used for authentication checks (per request context)
- **Strict caching**: Used for ownership checks (cached by specific parameters)

## Usage

```typescript
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'

// Apply permissions to your schema
const protectedSchema = applyMiddleware(schema, permissions)
```

## Error Handling

- **Authentication errors**: "User is not authenticated"
- **Authorization errors**: "User is not the owner of the post"
- **Field-level errors**: "Draft content is private"

The system uses `allowExternalErrors: true` to pass through application-specific errors while maintaining security.

## Development

Set `NODE_ENV=development` to enable Shield's debug mode for detailed permission logging.

## Extension

To add new rules:

1. Define the rule in the `rules` object
2. Apply it to the appropriate Query/Mutation/Type in the permissions tree
3. Export it for reuse if needed

Example:

```typescript
const isEditor = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    return context.security.roles.includes('editor')
      ? true
      : new Error('User is not an editor')
  },
)
```
