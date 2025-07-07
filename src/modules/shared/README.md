# Shared Module

This module contains reusable utilities, services, and components that are shared across all other modules in the application. It provides the foundational building blocks for pagination, filtering, connections, error handling, and common business logic.

## Features

- **Relay Connections**: Cursor-based pagination with metadata support
- **Advanced Filtering**: Type-safe filter transformations for database queries
- **Pagination Utilities**: Offset and cursor-based pagination helpers
- **DataLoader Services**: Efficient batching for N+1 query prevention
- **Error Handling**: Centralized error processing and normalization
- **Common Rules**: Reusable authorization rules for Shield
- **Service Interfaces**: Contracts for cross-module service communication
- **Test Utilities**: Shared testing helpers and mock data

## Architecture

```
modules/shared/
├── connections/                    # Relay connection utilities
│   ├── index.ts                   # Public API exports
│   ├── relay-core.ts              # Core Relay connection logic
│   ├── relay-core.test.ts         # Core logic tests
│   ├── relay.test.ts              # Integration tests
│   ├── relay.types.ts             # TypeScript type definitions
│   └── relay.utils.ts             # Helper utilities
├── database/                      # Database utilities
│   ├── index.ts                   # Database exports
│   └── prisma.ts                  # Prisma client utilities
├── errors/                        # Error handling
│   └── error-handler.test.ts      # Error handling tests
├── filtering/                     # Query filtering
│   ├── filter.test.ts             # Filter transformation tests
│   ├── filter.types.ts            # Filter type definitions
│   └── filter.utils.ts            # Filter transformation logic
├── interfaces/                    # Service interfaces
│   ├── logger.interface.ts        # Logging interface
│   └── rate-limiter.service.interface.ts  # Rate limiting interface
├── loaders/                       # DataLoader implementations
│   ├── loaders.test.ts            # DataLoader tests
│   └── loaders.ts                 # User and post loaders
├── middleware/                    # Shared middleware utilities
│   ├── rule-utils.ts              # Authorization rule helpers
│   └── utils-clean.ts             # Cleaned utility functions
├── pagination/                    # Pagination utilities
│   ├── pagination.test.ts         # Pagination tests
│   ├── pagination.types.ts        # Pagination type definitions
│   └── pagination.utils.ts        # Pagination logic
├── rules/                         # Common authorization rules
│   └── common.rules.ts            # Shared Shield rules
├── services/                      # Shared services
│   ├── email.service.ts           # Email service implementation
│   ├── rate-limiter.service.test.ts  # Rate limiter tests
│   └── rate-limiter.service.ts    # Rate limiting service
└── tests/                         # Integration tests
    ├── direct-resolvers.test.ts   # Direct resolver pattern tests
    ├── rate-limiting-simple.test.ts  # Simple rate limiting tests
    └── rate-limiting.test.ts      # Advanced rate limiting tests
```

## Relay Connections

### Core Connection API

The shared module provides a robust implementation of the Relay Connection specification:

```typescript
import { createConnection } from '@/modules/shared/connections'

// Basic connection with cursor pagination
const connection = await createConnection({
  query: prisma.post.findMany,
  args: { first: 10, after: cursor },
  transform: (posts) => posts, // Optional transformation
})

// Connection with total count
const connectionWithCount = await createConnection({
  query: prisma.post.findMany,
  countQuery: prisma.post.count,
  args: { first: 10 },
  includeTotalCount: true,
})
```

### Connection Types

```typescript
interface Connection<T> {
  edges: Array<{
    node: T
    cursor: string
  }>
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor?: string
    endCursor?: string
  }
  totalCount?: number
}

interface ConnectionArgs {
  first?: number
  after?: string
  last?: number
  before?: string
}
```

### Advanced Connection Features

```typescript
// Connection with metadata and custom cursors
const advancedConnection = await createConnection({
  query: prisma.post.findMany,
  args: { first: 10, after: cursor },
  cursorFromNode: (node) => encodeCursor('Post', node.id, node.createdAt),
  transform: (posts) => posts.map(addComputedFields),
  includeTotalCount: true,
  maxLimit: 100, // Prevent excessive page sizes
})
```

## Filtering System

### Type-Safe Query Filters

The filtering system provides type-safe transformations from GraphQL input to Prisma queries:

```typescript
import { transformFilters } from '@/modules/shared/filtering'

// Define filter input types
const PostWhereInput = builder.inputType('PostWhereInput', {
  fields: (t) => ({
    title: t.field({ type: StringFilter }),
    published: t.field({ type: BooleanFilter }),
    createdAt: t.field({ type: DateTimeFilter }),
    author: t.field({ type: UserWhereInput }),
  }),
})

// Transform GraphQL filters to Prisma where clauses
const where = transformFilters(input, {
  title: 'string',
  published: 'boolean',
  createdAt: 'datetime',
  author: 'relation',
})
```

### Filter Types

```typescript
// String filters
interface StringFilter {
  equals?: string
  not?: string
  in?: string[]
  notIn?: string[]
  contains?: string
  startsWith?: string
  endsWith?: string
  mode?: 'default' | 'insensitive'
}

// Numeric filters
interface IntFilter {
  equals?: number
  not?: number
  in?: number[]
  notIn?: number[]
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}

// Date filters
interface DateTimeFilter {
  equals?: Date
  not?: Date
  in?: Date[]
  notIn?: Date[]
  lt?: Date
  lte?: Date
  gt?: Date
  gte?: Date
}
```

## DataLoader Services

### Efficient Data Loading

DataLoaders prevent N+1 queries by batching database requests:

```typescript
import { createUserLoader, createPostLoader } from '@/modules/shared/loaders'

// In GraphQL context
const loaders = {
  userById: createUserLoader(),
  postsByAuthorId: createPostLoader(),
  publishedPostsCountByAuthor: createPostsCountLoader({ published: true }),
  draftPostsCountByAuthor: createPostsCountLoader({ published: false }),
}

// Usage in resolvers
const user = await context.loaders.userById.load(userId)
const posts = await context.loaders.postsByAuthorId.load(authorId)
```

### Custom DataLoaders

```typescript
// Create custom loaders for specific use cases
export const createCustomLoader = <K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<V[]>
) => {
  return new DataLoader(batchLoadFn, {
    cache: true,
    maxBatchSize: 100,
  })
}

// Example: Batch load user statistics
const userStatsLoader = createCustomLoader(async (userIds: number[]) => {
  const stats = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      _count: {
        select: {
          posts: true,
          publishedPosts: { where: { published: true } },
        }
      }
    }
  })
  
  return userIds.map(id => 
    stats.find(stat => stat.id === id) || { postCount: 0, publishedCount: 0 }
  )
})
```

## Pagination Utilities

### Offset-Based Pagination

```typescript
import { calculatePagination, createPaginationInfo } from '@/modules/shared/pagination'

// Calculate offset and limit from page-based args
const { offset, limit } = calculatePagination({
  page: 2,
  pageSize: 20,
  maxPageSize: 100,
})

// Create pagination metadata
const paginationInfo = createPaginationInfo({
  totalItems: 150,
  currentPage: 2,
  pageSize: 20,
})
```

### Cursor-Based Pagination

```typescript
import { decodeCursor, encodeCursor } from '@/modules/shared/connections'

// Encode cursors for stable pagination
const cursor = encodeCursor('Post', post.id, post.createdAt)

// Decode cursors for query construction
const { id, timestamp } = decodeCursor(cursor, 'Post')
```

## Error Handling

### Centralized Error Processing

```typescript
import { normalizeError, createErrorResponse } from '@/modules/shared/errors'

// Normalize various error types
const normalizedError = normalizeError(error, {
  includeStackTrace: process.env.NODE_ENV === 'development',
  sanitizeMessages: true,
})

// Create consistent error responses
const errorResponse = createErrorResponse({
  code: 'VALIDATION_ERROR',
  message: 'Invalid input provided',
  field: 'email',
  details: { format: 'email' },
})
```

## Rate Limiting Service

### Flexible Rate Limiting

```typescript
import { RateLimiterService } from '@/modules/shared/services'

// Create rate limiter with custom rules
const rateLimiter = new RateLimiterService({
  points: 100,        // Number of requests
  duration: 900,      // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
})

// Apply rate limiting
await rateLimiter.consume(userId.toString(), 1)

// Check remaining points
const remaining = await rateLimiter.get(userId.toString())
```

### Rate Limiting Presets

```typescript
// Predefined rate limiting configurations
export const RATE_LIMITS = {
  AUTH: { points: 5, duration: 900 },      // 5 attempts per 15 min
  SEARCH: { points: 100, duration: 60 },   // 100 searches per minute
  CREATE_POST: { points: 10, duration: 3600 }, // 10 posts per hour
  API_GENERAL: { points: 1000, duration: 3600 }, // 1000 requests per hour
}
```

## Common Authorization Rules

### Reusable Shield Rules

```typescript
import { isAuthenticated, isAdmin, isOwner } from '@/modules/shared/rules'

// Basic authentication
export const isAuthenticated = rule()(
  async (_parent, _args, context) => {
    return context.userId ? true : new AuthenticationError()
  }
)

// Admin role check
export const isAdmin = rule()(
  async (_parent, _args, context) => {
    return context.user?.role === 'admin' ? true : new ForbiddenError()
  }
)

// Resource ownership check
export const isOwner = (getOwnerId: (args: any) => number) => rule()(
  async (_parent, args, context) => {
    const userId = requireAuthentication(context)
    const ownerId = getOwnerId(args)
    
    return userId.value === ownerId ? true : new ForbiddenError()
  }
)
```

## Email Service

### Transactional Email Support

```typescript
import { EmailService } from '@/modules/shared/services'

// Send verification email
await EmailService.sendVerificationEmail({
  to: user.email,
  name: user.name,
  verificationUrl: `${baseUrl}/verify?token=${token}`,
})

// Send password reset email
await EmailService.sendPasswordResetEmail({
  to: user.email,
  name: user.name,
  resetUrl: `${baseUrl}/reset?token=${token}`,
})

// Send custom email
await EmailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<p>Custom HTML content</p>',
  text: 'Custom text content',
})
```

## Service Interfaces

### Logger Interface

```typescript
interface ILogger {
  debug(message: string, meta?: Record<string, any>): void
  info(message: string, meta?: Record<string, any>): void
  warn(message: string, meta?: Record<string, any>): void
  error(message: string, error?: Error, meta?: Record<string, any>): void
}

// Usage in services
export class SomeService {
  constructor(
    @inject(SERVICE_TOKENS.LOGGER) private logger: ILogger
  ) {}
  
  async doSomething() {
    this.logger.info('Operation started', { operation: 'doSomething' })
    // ... implementation
  }
}
```

### Rate Limiter Interface

```typescript
interface IRateLimiterService {
  consume(key: string, points?: number): Promise<void>
  get(key: string): Promise<{ remainingPoints: number; msBeforeNext: number }>
  reset(key: string): Promise<void>
  block(key: string, secDuration: number): Promise<void>
}
```

## Usage Examples

### Building a Paginated Query

```typescript
// In a resolver
builder.queryField('posts', (t) =>
  t.connection({
    type: 'Post',
    args: {
      where: t.arg({ type: PostWhereInput }),
      orderBy: t.arg({ type: PostOrderByInput }),
    },
    resolve: async (_parent, args, context) => {
      // Transform filters
      const where = transformFilters(args.where, POST_FILTER_CONFIG)
      const orderBy = transformOrderBy(args.orderBy, POST_ORDER_CONFIG)
      
      // Create connection
      return createConnection({
        query: (queryArgs) => prisma.post.findMany({
          ...queryArgs,
          where,
          orderBy,
        }),
        countQuery: () => prisma.post.count({ where }),
        args,
        includeTotalCount: true,
      })
    },
  }),
)
```

### Implementing Rate-Limited Mutations

```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    args: { input: t.arg({ type: CreatePostInput, required: true }) },
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      
      // Apply rate limiting
      await context.services.rateLimiter.consume(
        `create_post:${userId.value}`,
        1
      )
      
      // Create post
      return prisma.post.create({
        ...query,
        data: {
          ...args.input,
          authorId: userId.value,
        },
      })
    },
  }),
)
```

## Extension Points

### Adding New Filter Types

```typescript
// Define new filter type
const GeoLocationFilter = builder.inputType('GeoLocationFilter', {
  fields: (t) => ({
    near: t.field({ type: GeoPointInput }),
    radius: t.float(),
    unit: t.field({ type: DistanceUnit }),
  }),
})

// Add transformation logic
const transformGeoFilter = (filter: GeoLocationFilter) => {
  if (!filter.near) return {}
  
  return {
    location: {
      // Custom Prisma query for geospatial data
    }
  }
}
```

### Custom DataLoader Strategies

```typescript
// Implement custom caching strategy
export const createCachedLoader = <K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<V[]>,
  cacheKeyFn: (key: K) => string,
  ttl: number = 300000 // 5 minutes
) => {
  const cache = new Map<string, { value: V; expires: number }>()
  
  return new DataLoader(async (keys) => {
    const now = Date.now()
    const results: V[] = []
    const uncachedKeys: K[] = []
    
    // Check cache first
    for (const key of keys) {
      const cacheKey = cacheKeyFn(key)
      const cached = cache.get(cacheKey)
      
      if (cached && cached.expires > now) {
        results.push(cached.value)
      } else {
        uncachedKeys.push(key)
      }
    }
    
    // Fetch uncached data
    if (uncachedKeys.length > 0) {
      const freshData = await batchLoadFn(uncachedKeys)
      
      // Update cache
      freshData.forEach((value, index) => {
        const cacheKey = cacheKeyFn(uncachedKeys[index])
        cache.set(cacheKey, { value, expires: now + ttl })
      })
      
      results.push(...freshData)
    }
    
    return results
  })
}
```

## Performance Considerations

### Connection Optimization

- **Cursor Encoding**: Uses Base64 encoding with type safety
- **Query Spreading**: Leverages Pothos query optimization
- **Count Queries**: Optional total count calculation
- **Limit Enforcement**: Prevents excessive page sizes

### DataLoader Best Practices

- **Batch Size Limits**: Configurable maximum batch sizes
- **Cache Management**: Automatic cache invalidation
- **Error Handling**: Graceful handling of partial failures
- **Memory Usage**: Bounded cache sizes with TTL

## Testing

Run shared module tests:

```bash
# All shared tests
bun test src/modules/shared/

# Specific test suites
bun test src/modules/shared/connections/
bun test src/modules/shared/filtering/
bun test src/modules/shared/pagination/
bun test src/modules/shared/loaders/

# Integration tests
bun test src/modules/shared/tests/
```

## Dependencies

- **dataloader**: Efficient batching for database queries
- **@prisma/client**: Database access
- **graphql-shield**: Authorization rule utilities
- **@pothos/plugin-relay**: Relay connection support
- **rate-limiter-flexible**: Rate limiting implementation
- **nodemailer**: Email service support (optional) 