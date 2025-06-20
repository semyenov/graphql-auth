# GraphQL Auth Test Suite

This directory contains a comprehensive testing framework for the GraphQL authentication API, featuring sophisticated utilities for unit, integration, performance, and snapshot testing.

## Test Structure

```
test/
├── auth.test.ts            # Authentication (signup/login) tests
├── permissions.test.ts     # Permission system tests
├── posts.test.ts          # Post CRUD operation tests
├── user.test.ts           # User-related tests
├── example-integration.test.ts  # Integration test examples
│
├── test-utils.ts          # Core testing utilities
├── test-data.ts           # Test data factories
├── test-fixtures.ts       # Complex test scenarios
├── relay-utils.ts         # Relay ID conversion utilities
│
├── performance-utils.ts   # Performance testing tools
├── snapshot-utils.ts      # Snapshot testing utilities
├── subscription-utils.ts  # Subscription testing helpers
├── integration-utils.ts   # E2E test flow builder
│
├── setup.ts              # Test environment setup
├── shared-prisma.ts      # Shared Prisma client for tests
├── test-env.ts           # Test environment configuration
└── index.ts              # Consolidated exports
```

## Key Features

### 1. Typed GraphQL Queries

All tests use typed GraphQL operations from `src/gql/` for type safety:

```typescript
import { print } from 'graphql'
import { LoginMutation, SignupMutation } from '../src/gql/mutations'
import { FeedQuery, MeQuery } from '../src/gql/queries'

// Use with test helpers
const data = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(LoginMutation),
  { email: 'test@example.com', password: 'password' },
  context,
)
```

### 2. Test Utilities (`test-utils.ts`)

Core helpers for GraphQL testing:

```typescript
// Create test contexts
const mockContext = createMockContext()
const authContext = createAuthContext('userId')

// Execute operations with helpers
const data = await gqlHelpers.expectSuccessfulQuery(
  server,
  query,
  variables,
  context,
)
const error = await gqlHelpers.expectGraphQLError(
  server,
  query,
  variables,
  context,
  'Expected error',
)
```

### 3. Test Data Factories (`test-data.ts`, `test-fixtures.ts`)

Create consistent test data:

```typescript
// Simple factories
const user = await createTestUser({ email: 'test@example.com' })
const post = await createTestPost({ authorId: user.id, published: true })

// Complex scenarios
const blogScenario = await createBlogScenario() // Multiple users, posts, comments
const permissionScenario = await createPermissionScenario() // Users with different roles
```

### 4. Performance Testing (`performance-utils.ts`)

Measure and benchmark GraphQL operations:

```typescript
// Measure single operation
const { result, metrics } = await measureOperation(
  server,
  operation,
  variables,
  context,
)

// Run benchmarks
const report = await benchmark(server, operation, variables, context, {
  iterations: 100,
  warmup: 10,
})

// Assert performance requirements
assertPerformance(report, {
  maxAverageTime: 50, // 50ms average
  maxP95Time: 100, // 100ms for 95th percentile
  maxMemory: 10 * 1024 * 1024, // 10MB max
})
```

### 5. Snapshot Testing (`snapshot-utils.ts`)

Ensure API response consistency:

```typescript
const snapshotTester = new GraphQLSnapshotTester()

const result = await snapshotTester.testSnapshot(response, {
  name: 'feed-query',
  normalizers: [
    commonNormalizers.timestamps, // Replace timestamps
    commonNormalizers.ids, // Replace IDs
    commonNormalizers.cursors, // Replace cursors
  ],
  redactFields: ['email', 'password'],
})
```

### 6. Integration Testing (`integration-utils.ts`)

Build complex E2E test flows:

```typescript
const flow = new E2ETestFlow(context)

await flow
  .mutation('signup', SignupMutation, { email, password })
  .mutation('login', LoginMutation, { email, password })
  .query('profile', GetMeQuery)
  .assert('has-profile', (results) => {
    const profile = results.get('profile')
    expect(profile.data.me).toBeDefined()
  })
  .execute()
```

### 7. Subscription Testing (`subscription-utils.ts`)

Test GraphQL subscriptions (when implemented):

```typescript
const helper = await createSubscriptionHelper(
  server,
  subscription,
  variables,
  context,
)

// Get events
const event = await helper.getNext()
const events = await helper.getAll(5)

// Test with expectations
await subscriptionTester.expectSubscriptionEvent(
  subscription,
  variables,
  context,
  triggerFn,
  validator,
)
```

### 8. Relay ID Conversion (`relay-utils.ts`)

Convert between numeric and global IDs:

```typescript
import { toPostId, toUserId, extractNumericId } from './relay-utils'

// Convert numeric IDs to global IDs
const globalPostId = toPostId(1) // "UG9zdDox"
const globalUserId = toUserId(42) // "VXNlcjo0Mg=="

// Extract numeric ID from global ID
const numericId = extractNumericId(globalPostId) // 1
```

## Running Tests

```bash
# Run all tests
bun run test

# Run specific test file
bun test auth.test.ts

# Run tests matching pattern
bun test -t "should create user"

# Update snapshots
UPDATE_SNAPSHOTS=true bun test

# Run with coverage
bun run test:coverage

# Run with UI
bun run test:ui
```

## Test Database

- Each test run uses a unique SQLite database file
- Database is automatically created before tests
- Data is cleaned between tests (in `beforeEach`)
- Database file is removed after all tests complete

## Best Practices

### 1. Use Typed Queries

Always use typed queries from `src/gql/`:

```typescript
// ✅ Good
import { FeedQuery } from '../src/gql/queries'
executeOperation(server, print(FeedQuery), variables, context)

// ❌ Bad
executeOperation(server, 'query { feed { id } }', variables, context)
```

### 2. Test Isolation

Each test should be independent:

```typescript
beforeEach(async () => {
  // Database is automatically cleaned by setup.ts
  // Create fresh test data for each test
  testUser = await createTestUser()
})
```

### 3. Comprehensive Assertions

Test both success and error cases:

```typescript
it('should handle authentication', async () => {
  // Test success
  const data = await gqlHelpers.expectSuccessfulMutation(...)
  expect(data.login).toBeDefined()

  // Test failure
  await gqlHelpers.expectGraphQLError(
    server,
    operation,
    invalidVariables,
    context,
    'Invalid credentials'
  )
})
```

### 4. Performance Awareness

Include performance tests for critical paths:

```typescript
it('should meet performance SLA', async () => {
  const report = await benchmark(server, FeedQuery, { first: 20 }, context)
  assertPerformance(report, { maxP95Time: 100 })
})
```

### 5. Snapshot Testing

Use snapshots for API stability:

```typescript
it('should maintain consistent response shape', async () => {
  const result = await snapshotTester.testSnapshot(response, {
    name: 'user-query',
    normalizers: [commonNormalizers.timestamps],
  })
  expect(result.passed).toBe(true)
})
```

## Common Test Patterns

### Authentication Flow

```typescript
const { user, token } = await commonScenarios.authenticationFlow(context, {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
})
```

### Permission Testing

```typescript
await commonScenarios.permissionBoundariesFlow(
  context,
  { owner: ownerContext, other: otherContext },
  postId,
)
```

### CRUD Operations

```typescript
const { posts } = await commonScenarios.postCrudFlow(context, authContext)
```

## Debugging Tests

### Enable Detailed Logging

```typescript
// In test file
console.log('Query result:', JSON.stringify(result, null, 2))
console.log('Performance metrics:', metrics)
```

### Inspect Database State

```typescript
// Check what's in the database
const users = await prisma.user.findMany()
console.log('Users in DB:', users)
```

### Use Test UI

```bash
bun run test:ui
```

## Contributing

When adding new tests:

1. Use typed queries from `src/gql/`
2. Follow existing patterns for consistency
3. Include both positive and negative test cases
4. Add performance tests for new critical operations
5. Update snapshots when API changes are intentional
6. Document complex test scenarios
