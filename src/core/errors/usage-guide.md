# Error Classes Usage Guide

This guide demonstrates how to properly use the custom error classes throughout the GraphQL authentication codebase.

## Error Class Hierarchy

```typescript
BaseError
├── AuthenticationError (401)
├── AuthorizationError (403)
├── ValidationError (400)
├── NotFoundError (404)
├── ConflictError (409)
└── RateLimitError (429)
```

## Import Statement

```typescript
import { 
  AuthenticationError, 
  AuthorizationError, 
  ValidationError, 
  NotFoundError, 
  ConflictError, 
  RateLimitError,
  normalizeError,
  isBaseError 
} from '../errors'
```

## Usage Examples

### 1. AuthenticationError

Use when authentication is required but not provided or invalid.

```typescript
// In resolvers
import { AuthenticationError } from '../../errors'

builder.mutationField('createPost', (t) =>
  t.field({
    type: 'Post',
    resolve: async (parent, args, context) => {
      const userId = getUserId(context)
      if (!userId) {
        throw new AuthenticationError() // Default: "Authentication required"
      }
      
      // Or with custom message
      if (tokenExpired) {
        throw new AuthenticationError('Token has expired')
      }
    }
  })
)

// In context utilities
export function requireAuthentication(context: Context): number {
  if (!isAuthenticated(context)) {
    throw new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED)
  }
  return context.userId
}
```

### 2. AuthorizationError

Use when user lacks permissions for an operation.

```typescript
// In permission rules
import { AuthorizationError } from '../errors'

export const isPostOwner = rule()(async (parent, args, context) => {
  const userId = requireAuthentication(context)
  const post = await prisma.post.findUnique({
    where: { id: args.id },
    select: { authorId: true }
  })
  
  if (post?.authorId !== userId) {
    throw new AuthorizationError('You can only modify your own posts')
  }
  
  return true
})

// In resolvers
if (!hasRole(context, 'admin')) {
  throw new AuthorizationError('Admin privileges required')
}
```

### 3. ValidationError

Use when input validation fails. Supports field-specific errors.

```typescript
// With Zod validation
import { validateInput } from '../utils/validation'

try {
  const data = validateInput(signupSchema, args)
} catch (error) {
  // validateInput throws ValidationError with field errors
  throw error
}

// Manual validation with field errors
throw new ValidationError({
  email: ['Email is already taken', 'Email format is invalid'],
  password: ['Password must be at least 8 characters']
})

// Simple validation error
throw new ValidationError(['Invalid date format', 'End date must be after start date'])

// Custom message
throw new ValidationError(
  { field: ['error'] }, 
  'Please correct the validation errors'
)
```

### 4. NotFoundError

Use when a requested resource doesn't exist.

```typescript
// Basic usage
const user = await prisma.user.findUnique({ where: { id } })
if (!user) {
  throw new NotFoundError('User')
}

// With identifier
const post = await prisma.post.findUnique({ where: { id: postId } })
if (!post) {
  throw new NotFoundError('Post', postId)
}

// In mutations
builder.mutationField('deletePost', (t) =>
  t.field({
    resolve: async (parent, args) => {
      try {
        return await prisma.post.delete({ where: { id: args.id } })
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundError('Post', args.id)
        }
        throw error
      }
    }
  })
)
```

### 5. ConflictError

Use when an operation conflicts with existing data.

```typescript
// Duplicate email during signup
const existingUser = await prisma.user.findUnique({
  where: { email: args.email }
})

if (existingUser) {
  throw new ConflictError('An account with this email already exists')
}

// Unique constraint violation
try {
  await prisma.user.create({ data })
} catch (error) {
  if (error.code === 'P2002') {
    throw new ConflictError('Username is already taken')
  }
  throw error
}
```

### 6. RateLimitError

Use when rate limits are exceeded.

```typescript
// Basic rate limit
const attempts = await rateLimiter.increment(userId)
if (attempts > MAX_LOGIN_ATTEMPTS) {
  throw new RateLimitError()
}

// With retry information
const retryAfter = 60 // seconds
throw new RateLimitError(
  `Too many login attempts. Try again in ${retryAfter} seconds`,
  retryAfter
)
```

## Error Normalization

Use `normalizeError` to convert unknown errors to BaseError instances:

```typescript
import { normalizeError } from '../errors'

builder.mutationField('riskyOperation', (t) =>
  t.field({
    resolve: async (parent, args) => {
      try {
        // Risky operation that might throw various errors
        return await performOperation(args)
      } catch (error) {
        // Converts Prisma errors, standard errors, etc. to BaseError
        throw normalizeError(error)
      }
    }
  })
)
```

## Type Guards

Use type guards for error handling:

```typescript
import { isBaseError, hasErrorCode } from '../errors'

try {
  await someOperation()
} catch (error) {
  if (isBaseError(error)) {
    // error is BaseError, has code and statusCode
    console.log(error.code, error.statusCode)
  }
  
  if (hasErrorCode(error)) {
    // error has code and message properties
    if (error.code === 'P2002') {
      // Handle Prisma unique constraint error
    }
  }
}
```

## Best Practices

1. **Always use specific error classes** instead of generic Error:
   ```typescript
   // ❌ Bad
   throw new Error('Not authenticated')
   
   // ✅ Good
   throw new AuthenticationError()
   ```

2. **Provide meaningful error messages**:
   ```typescript
   // ❌ Bad
   throw new NotFoundError('Resource')
   
   // ✅ Good
   throw new NotFoundError('User', userId)
   ```

3. **Use normalizeError in catch blocks**:
   ```typescript
   try {
     await prisma.user.create({ data })
   } catch (error) {
     throw normalizeError(error)
   }
   ```

4. **Handle Prisma errors appropriately**:
   ```typescript
   catch (error) {
     if (error.code === 'P2002') {
       throw new ConflictError('Email already exists')
     }
     if (error.code === 'P2025') {
       throw new NotFoundError('User', args.id)
     }
     throw normalizeError(error)
   }
   ```

5. **Use field-specific validation errors**:
   ```typescript
   // For form validation
   throw new ValidationError({
     email: ['Invalid format'],
     password: ['Too short', 'Must contain a number']
   })
   ```

## GraphQL Error Response

These errors are automatically formatted in GraphQL responses:

```json
{
  "errors": [
    {
      "message": "Post with identifier '123' not found",
      "extensions": {
        "code": "NOT_FOUND",
        "statusCode": 404
      }
    }
  ]
}
```

## Testing Errors

```typescript
import { expect } from 'vitest'
import { AuthenticationError, NotFoundError } from '../errors'

// Test for specific error
await expect(
  resolver(parent, args, unauthenticatedContext)
).rejects.toThrow(AuthenticationError)

// Test error message
await expect(
  resolver(parent, { id: 999 }, context)
).rejects.toThrow('Post with identifier \'999\' not found')

// Test error properties
try {
  await resolver(parent, args, context)
} catch (error) {
  expect(error).toBeInstanceOf(NotFoundError)
  expect(error.code).toBe('NOT_FOUND')
  expect(error.statusCode).toBe(404)
}
```