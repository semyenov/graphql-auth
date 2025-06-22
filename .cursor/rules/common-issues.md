# Common Issues and Solutions

## Type Errors

### Issue: Type mismatch after schema changes
```bash
# Solution: Regenerate all types
bun run generate
```

### Issue: `any` type errors from Biome
```bash
# Fix with unsafe mode
bun run check:fix --unsafe
```

## Database Issues

### Issue: Migration conflicts
```bash
# Reset database and reapply migrations
bun run db:reset
```

### Issue: Test database not clean
```bash
# Force reset test database
rm test-db.db
bun test --run
```

## Authentication Issues

### Issue: "Not authorized" error
Check:
1. JWT token is valid and not expired
2. User exists in database
3. Shield rules are correctly implemented
4. `grantScopes` includes required scope

### Issue: Global ID parsing fails
```typescript
// Ensure ID is properly encoded
const globalId = toGlobalId('Post', numericId)

// Decode in Shield rules
const numericId = parseGlobalId(args.id, 'Post')
```

## Test Issues

### Issue: Test using undefined user
```typescript
// Wrong
const { context } = await createAuthenticatedContext()

// Correct
const { context } = await createAuthenticatedContextFromScratch()
// OR
const user = await createTestUser()
const context = createAuthenticatedContext(user)
```

### Issue: GraphQL test type errors
```typescript
// Always use typed operations
import { print } from 'graphql'
import { MyQuery } from '../src/gql/queries'

await executeOperation(server, print(MyQuery), variables, context)
```

## OIDC Issues

### Issue: oidc-provider warnings about Node version
This warning can be ignored when using Bun.

### Issue: OIDC tests failing
Ensure mocks are properly set up:
```typescript
beforeEach(() => {
  createMocks()
  const callbackHandler = vi.fn().mockResolvedValue(undefined)
  mockProvider.callback.mockReturnValue(callbackHandler)
})
```

## Prisma Issues

### Issue: Prisma client not generated
```bash
bunx prisma generate
```

### Issue: Circular dependency with Prisma
Never import Prisma from context. Always use direct import:
```typescript
import { prisma } from '../../../prisma'
```

## Performance Issues

### Issue: N+1 queries
Use DataLoaders from context:
```typescript
const users = await context.loaders.userById.loadMany(userIds)
```

### Issue: Slow Shield rules
Add caching to rules:
```typescript
export const myRule = rule({ cache: 'strict' })(
  async (_parent, args, context) => {
    // rule logic
  }
)
```

## Build Issues

### Issue: Build fails
```bash
# Clean and rebuild
bun run clean
bun run build
```

### Issue: Module not found in production
Ensure all dependencies are in `dependencies`, not `devDependencies`.