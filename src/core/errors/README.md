# Error Classes Usage in GraphQL Auth Codebase

This document demonstrates how the custom error classes from `src/errors/index.ts` are being used throughout the codebase.

## Overview

The codebase uses a hierarchical error system with specific error classes for different scenarios:

- **AuthenticationError** (401) - When authentication is required but not provided
- **AuthorizationError** (403) - When user lacks permissions
- **ValidationError** (400) - When input validation fails
- **NotFoundError** (404) - When requested resource doesn't exist
- **ConflictError** (409) - When operation conflicts with existing data
- **RateLimitError** (429) - When rate limits are exceeded

## Real Usage Examples

### 1. Authentication Mutations (`src/schema/mutations/auth.ts`)

```typescript
// Login validation
if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
}

if (!isValidPassword) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
}

// Signup conflict
if (existingUser) {
    throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
}
```

### 2. Post Mutations (`src/schema/mutations/posts.ts`)

```typescript
// Authentication check
const userId = getUserId(context)
if (!userId) {
    throw new AuthenticationError()
}

// Resource not found
if (!post) {
    throw new NotFoundError('Post', args.id.toString())
}

// Prisma error handling
if (error.code === 'P2025') {
    throw new NotFoundError('Post', args.id.toString())
}
```

### 3. Permission Rules (`src/permissions/rules.ts`)

```typescript
// Authentication rule
export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    return isAuthenticated(context)
      ? true
      : new AuthenticationError()
  }
)

// Authorization rule
if (!hasRole(context, 'admin')) {
  return new AuthorizationError('Admin privileges required')
}

// Ownership check
if (post.authorId !== userId) {
  throw new AuthorizationError(ERROR_MESSAGES.NOT_POST_OWNER)
}
```

### 4. JWT Utilities (`src/utils/jwt.ts`)

```typescript
// Token verification
if (!decoded.userId) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN)
}

// Token expiration
if (error instanceof jwt.TokenExpiredError) {
    throw new AuthenticationError(ERROR_MESSAGES.TOKEN_EXPIRED)
}

// Invalid token
if (error instanceof jwt.JsonWebTokenError) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN)
}
```

### 5. Context Authentication (`src/context/auth.ts`)

```typescript
// Require authentication helper
export function requireAuthentication<TVariables = Record<string, unknown>>(
    context: Context<TVariables>
): number {
    if (!isAuthenticated(context)) {
        throw new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED)
    }

    if (typeof context.userId !== 'number' || context.userId <= 0) {
        throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
    }

    return context.userId
}
```

### 6. Validation Utilities (`src/utils/validation.ts`)

```typescript
// Input validation with Zod
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      throw new ValidationError(errors)
    }
    throw error
  }
}
```

## Error Normalization Pattern

Throughout the codebase, the `normalizeError` function is used in catch blocks to ensure consistent error handling:

```typescript
try {
    // ... operation
} catch (error) {
    throw normalizeError(error)
}
```

This pattern:
- Converts Prisma errors to appropriate error classes
- Preserves existing BaseError instances
- Wraps unknown errors in a BaseError with proper status codes

## GraphQL Shield Integration

Error classes are returned (not thrown) in GraphQL Shield rules:

```typescript
export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  (_parent, _args, context: Context) => {
    return isAuthenticated(context)
      ? true
      : new AuthenticationError()  // Return, don't throw
  }
)
```

## Error Response Format

All errors are automatically formatted in GraphQL responses:

```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "statusCode": 401
      }
    }
  ]
}
```

## Best Practices Observed

1. **Specific error messages**: Errors include context (e.g., "Post with identifier '123' not found")
2. **Consistent error handling**: All mutations use try-catch with `normalizeError`
3. **Type safety**: Error classes provide strong typing for error handling
4. **Proper HTTP status codes**: Each error maps to appropriate HTTP status
5. **Field-level validation**: ValidationError supports field-specific error messages