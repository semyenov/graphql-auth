# Test Suite

This directory contains the test suite for the GraphQL authentication server using Vitest.

## Test Structure

```
test/
├── auth.test.ts        # Authentication (signup/login) tests
├── posts.test.ts       # Post CRUD operation tests
├── user.test.ts        # User query and mutation tests
├── permissions.test.ts # Authorization and permission tests
├── setup.ts            # Test database setup and teardown
├── test-env.ts         # Test environment configuration
├── test-utils.ts       # Core test utilities and helpers
├── relay-utils.ts      # Relay global ID conversion utilities
├── test-data.ts        # Test data factory functions
└── index.ts            # Consolidated exports for all test utilities
```

## Key Utilities

### Context Creation

```typescript
import { createMockContext, createAuthContext } from './test-utils'

// Create unauthenticated context
const context = createMockContext()

// Create authenticated context with user ID
const authContext = createAuthContext('1')
```

### Global ID Conversion (Relay)

The test utilities use the same ID encoding/decoding logic as the Pothos Relay plugin
configured in `src/schema/builder.ts`, ensuring consistency between tests and production.

```typescript
import { toPostId, toUserId, extractNumericId } from './relay-utils'

// Convert numeric IDs to global IDs
const globalPostId = toPostId(1) // "UG9zdDox"
const globalUserId = toUserId(42) // "VXNlcjo0Mg=="

// Extract numeric ID from global ID
const numericId = extractNumericId(globalPostId) // 1
```

### Test Data Creation

```typescript
import {
  createTestUser,
  createTestPost,
  createUserWithPosts,
} from './test-data'

// Create a test user
const user = await createTestUser({
  email: 'test@example.com',
  password: 'secure123',
  name: 'Test User',
})

// Create a user with posts
const { user, posts } = await createUserWithPosts({
  postCount: 5,
  publishedPosts: 2,
})
```

### GraphQL Operation Helpers

```typescript
import { gqlHelpers } from './test-utils'

// Execute and expect successful query/mutation
const data = await gqlHelpers.expectSuccessfulQuery(
  server,
  query,
  variables,
  context,
)

// Execute and expect error
await gqlHelpers.expectGraphQLError(
  server,
  operation,
  variables,
  context,
  'Expected error message',
)
```

## Running Tests

```bash
# Run all tests
bun run test

# Run specific test file
bun test test/auth.test.ts

# Run tests matching pattern
bun run test -t "should create draft"

# Run tests in watch mode
bun run test -- --watch

# Run with coverage
bun run test:coverage
```

## Test Database

- Each test run uses a unique SQLite database file
- Database is automatically created before tests
- Data is cleaned between tests (in `beforeEach`)
- Database file is removed after all tests complete

## Writing New Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { print } from 'graphql'
import {
  createTestServer,
  createAuthContext,
  gqlHelpers,
  toPostId,
  createTestUser,
} from './'

describe('Feature', () => {
  const server = createTestServer()

  beforeEach(async () => {
    // Setup test data if needed
    // Database is automatically cleaned between tests
  })

  it('should work correctly', async () => {
    const user = await createTestUser()

    const data = await gqlHelpers.expectSuccessfulQuery(
      server,
      print(YourQuery),
      { id: toPostId(1) },
      createAuthContext(user.id.toString()),
    )

    expect(data).toBeDefined()
  })
})
```

## Type Safety

All test utilities are fully typed:

- GraphQL operations use generated types from `src/gql/`
- Test data factories return proper Prisma types
- Context creation functions return typed `Context`
- Global ID utilities maintain type safety throughout

## Best Practices

1. **Use factory functions** for consistent test data
2. **Use global ID converters** when testing Relay mutations
3. **Clean data in setup.ts** not in individual tests
4. **Use gqlHelpers** for cleaner test code
5. **Import from test index** for better organization
6. **Test both success and error cases**
7. **Use descriptive test names** that explain the scenario

