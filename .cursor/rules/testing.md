# Testing Guidelines

## Test Structure

### Unit Tests
- Place next to the file being tested when possible
- Use `.test.ts` suffix
- Mock external dependencies with vitest

### Integration Tests
- Place in `test/modules/[feature]/`
- Test full GraphQL operations with database
- Use real implementations, not mocks

## Test Utilities

### Context Creation
```typescript
// For new test user with auth context
const { user, token, context } = await createAuthenticatedContextFromScratch()

// For existing user
const context = createAuthenticatedContext(existingUser)

// For unauthenticated requests
const context = createMockContext()
```

### GraphQL Testing
```typescript
import { print } from 'graphql'
import { LoginMutation } from '../src/gql/mutations'

// Always use typed operations
const result = await gqlHelpers.expectSuccessfulMutation(
  server,
  print(LoginMutation),
  variables,
  context
)

// For expected errors
await gqlHelpers.expectGraphQLError(
  server,
  print(LoginMutation),
  variables,
  context,
  'Expected error message'
)
```

## Database Management

### Test Setup
- Each test file gets a clean database via `test/setup.ts`
- Database is reset between test files automatically
- Use transactions for test isolation when needed

### Test Data
```typescript
// Create test user with specific data
const user = await createTestUser({
  email: 'test@example.com',
  password: 'password123',
  role: 'ADMIN' // optional
})
```

## Common Patterns

### Testing Protected Resolvers
```typescript
it('should require authentication', async () => {
  await gqlHelpers.expectGraphQLError(
    server,
    print(ProtectedQuery),
    {},
    createMockContext(), // Unauthenticated
    'Not authorized'
  )
})
```

### Testing Permissions
```typescript
it('should require admin role', async () => {
  const { context } = await createAuthenticatedContextFromScratch() // Regular user
  
  await gqlHelpers.expectGraphQLError(
    server,
    print(AdminOnlyMutation),
    {},
    context,
    'Insufficient permissions'
  )
})
```

### Testing OIDC
```typescript
// OIDC tests should mock the provider
beforeEach(() => {
  createMocks() // Fresh mocks for each test
  
  const callbackHandler = vi.fn().mockResolvedValue(undefined)
  mockProvider.callback.mockReturnValue(callbackHandler)
  
  container.register('IOidcProviderService', {
    useValue: mockOidcService
  })
})
```

## Running Tests

```bash
# All tests
bun test --run

# Specific file
bun test test/modules/auth/auth.test.ts

# Pattern matching
bun test -t "should create user"

# With coverage
bun test --coverage

# Watch mode
bun test --watch
```