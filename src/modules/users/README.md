# Users Module

This module handles user management functionality including user queries, profile operations, user search, and user-specific data access. It demonstrates clean separation of concerns with minimal business logic and strong authorization controls.

## Features

- **User Profile Management**: View and update user profiles
- **User Search**: Search users by name and email with pagination
- **User Statistics**: Post counts, drafts, and activity metrics
- **Privacy Controls**: Profile visibility and data access controls
- **Relay Integration**: Global IDs and cursor-based pagination
- **DataLoader Optimization**: Efficient batching for user-related queries

## Architecture

```
modules/users/
├── user.resolver.ts              # GraphQL resolvers for user operations
├── user.rules.ts                 # Shield authorization rules
├── user.types.ts                 # TypeScript type definitions
├── interfaces/
│   └── user.repository.interface.ts  # Repository interface (future extension)
└── tests/
    └── users.integration.test.ts     # Integration tests for user operations
```

## GraphQL API

### Queries

```graphql
# Get current user information (authenticated)
query Me {
  me {
    id
    email
    name
    emailVerified
    emailVerifiedAt
    createdAt
    postCount
    publishedPostsCount
    draftsCount
  }
}

# Get a specific user by ID or email
query GetUser {
  user(where: { id: 1 }) {
    id
    name
    email  # Only visible to user themselves or admins
    postCount
    publishedPostsCount
    createdAt
    posts(first: 5, where: { published: true }) {
      edges {
        node {
          id
          title
          excerpt
        }
      }
    }
  }
}

# Search users with pagination
query SearchUsers {
  searchUsers(
    input: { query: "john" }
    first: 10
    orderBy: { name: asc }
  ) {
    edges {
      node {
        id
        name
        postCount
        publishedPostsCount
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

# Get all users (admin only)
query AllUsers {
  users(first: 20, orderBy: { createdAt: desc }) {
    edges {
      node {
        id
        name
        email
        emailVerified
        postCount
        createdAt
      }
    }
    totalCount
  }
}
```

### Mutations

```graphql
# Update user profile
mutation UpdateUserProfile {
  updateUserProfile(input: {
    name: "John Doe"
    email: "john.doe@example.com"
  }) {
    id
    name
    email
    updatedAt
  }
}
```

## User Types and Fields

### User Type

```graphql
type User implements Node {
  id: ID!                    # Global Relay ID
  email: String             # Private field (only visible to self/admin)
  name: String
  emailVerified: Boolean    # Email verification status
  emailVerifiedAt: DateTime # When email was verified
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Computed statistics
  postCount: Int!           # Total posts (published + drafts)
  publishedPostsCount: Int! # Published posts only
  publishedPostCount: Int!  # Alias for publishedPostsCount
  draftsCount: Int!         # Draft posts only
  
  # Relations
  posts(
    first: Int
    after: String
    where: PostWhereInput
    orderBy: PostOrderByInput
  ): UserPostsConnection!
}
```

### Input Types

```graphql
input UpdateUserInput {
  name: String
  email: String
}

input UserUniqueInput {
  id: Int
  email: String
}

input UserSearchInput {
  query: String  # Search in name and email fields
}

input UserWhereInput {
  name: StringFilter
  email: StringFilter
}

input UserOrderByInput {
  id: SortOrder = asc
  name: SortOrder
  email: SortOrder
}
```

## Authorization Rules

The module implements privacy-conscious authorization:

```typescript
// Self or admin access for sensitive data
export const canAccessUserData = rule({ cache: 'strict' })(
  async (_parent, args, context) => {
    const currentUserId = context.userId?.value
    
    if (!currentUserId) {
      return new AuthenticationError('Authentication required')
    }
    
    // Parse target user ID from arguments
    const targetUserId = args.where?.id || args.id
    
    // Users can access their own data
    if (currentUserId === targetUserId) {
      return true
    }
    
    // Admins can access any user data
    if (context.user?.role === 'admin') {
      return true
    }
    
    return new ForbiddenError('You can only access your own user data')
  }
)

// Profile update restrictions
export const canUpdateProfile = rule({ cache: 'strict' })(
  async (_parent, _args, context) => {
    const userId = requireAuthentication(context)
    
    // Users can only update their own profile
    // Admin override could be added here if needed
    return true
  }
)

// Search access (public with rate limiting)
export const canSearchUsers = rule({ cache: 'contextual' })(
  async (_parent, _args, _context) => {
    // Public access with rate limiting applied at resolver level
    return true
  }
)
```

## Privacy and Data Access

### Field-Level Privacy

Different fields have different visibility rules:

```typescript
// Public fields (visible to everyone)
- id, name, postCount, publishedPostsCount, createdAt

// Private fields (only visible to self or admin)
- email, emailVerified, emailVerifiedAt, draftsCount

// Computed fields respect privacy
- posts connection filters based on ownership and publish status
```

### Email Visibility Logic

```typescript
// Email field resolver with privacy controls
email: t.field({
  type: 'String',
  nullable: true,
  resolve: (user, _args, context) => {
    const currentUserId = context.userId?.value
    
    // User can see their own email
    if (currentUserId === user.id) {
      return user.email
    }
    
    // Admins can see any email
    if (context.user?.role === 'admin') {
      return user.email
    }
    
    // Others cannot see email
    return null
  },
}),
```

## User Statistics

### Efficient Count Calculations

User statistics are calculated efficiently using DataLoaders:

```typescript
// Published posts count
publishedPostsCount: t.field({
  type: 'Int',
  resolve: async (user, _args, context) => {
    return context.loaders.publishedPostsCountByAuthor.load(user.id)
  },
}),

// Draft posts count (private)
draftsCount: t.field({
  type: 'Int',
  nullable: true,
  resolve: async (user, _args, context) => {
    // Only visible to self or admin
    const currentUserId = context.userId?.value
    if (currentUserId !== user.id && context.user?.role !== 'admin') {
      return null
    }
    
    return context.loaders.draftPostsCountByAuthor.load(user.id)
  },
}),
```

## Search Functionality

### Text Search Implementation

User search supports fuzzy matching across name and email fields:

```typescript
// Search implementation
const searchUsers = async (query: string, pagination: PaginationArgs) => {
  const searchTerms = query.trim().split(/\s+/).map(term => 
    `%${term.toLowerCase()}%`
  )
  
  return prisma.user.findMany({
    where: {
      OR: searchTerms.flatMap(term => [
        { name: { contains: term, mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
      ]),
    },
    ...pagination,
  })
}
```

## Usage Examples

### Getting User Information

```typescript
// Get current user
const meResult = await gql.query(MeQuery, {}, {
  authorization: `Bearer ${token}`
})

// Get specific user (public info only unless it's yourself)
const userResult = await gql.query(GetUserQuery, {
  where: { id: 123 }
})

// Get user with posts
const userWithPostsResult = await gql.query(GetUserQuery, {
  where: { email: "user@example.com" },
  postsFirst: 5,
  postsWhere: { published: true }
})
```

### Updating Profile

```typescript
// Update user profile
const updateResult = await gql.mutate(UpdateUserProfileMutation, {
  input: {
    name: "Updated Name",
    email: "newemail@example.com"
  }
}, { authorization: `Bearer ${token}` })
```

### Searching Users

```typescript
// Search users by name
const searchResult = await gql.query(SearchUsersQuery, {
  input: { query: "john doe" },
  first: 10,
  orderBy: { name: 'asc' }
})

// Paginate through results
const nextPageResult = await gql.query(SearchUsersQuery, {
  input: { query: "john doe" },
  first: 10,
  after: searchResult.data.searchUsers.pageInfo.endCursor
})
```

## Extension Points

### Adding User Profile Fields

1. **Update Prisma schema** with new fields
2. **Run migration**: `bunx prisma migrate dev --name add_user_fields`
3. **Update GraphQL type** in `user.resolver.ts`
4. **Add to UpdateUserInput** if field should be editable
5. **Consider privacy implications** and update field resolvers accordingly

Example - Adding a "bio" field:

```typescript
// In user.resolver.ts
builder.prismaObject('User', {
  fields: (t) => ({
    // ... existing fields
    bio: t.exposeString('bio', { nullable: true }),
  }),
})

// Update input type
const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    name: t.string(),
    email: t.string(),
    bio: t.string(), // New field
  }),
})
```

### Custom User Roles

Extend user roles beyond the basic user/admin system:

```typescript
// Add role-based field visibility
role: t.field({
  type: UserRoleEnum,
  resolve: (user, _args, context) => {
    // Only admins and the user themselves can see roles
    if (canAccessUserData(user.id, context)) {
      return user.role
    }
    return 'USER' // Default public role
  },
}),

// Add role-based authorization rules
export const hasRole = (requiredRole: string) => rule()(
  async (_parent, _args, context) => {
    const user = context.user
    if (!user || !hasRoleOrHigher(user.role, requiredRole)) {
      return new ForbiddenError(`${requiredRole} role required`)
    }
    return true
  }
)
```

### Advanced Search Features

Add more sophisticated search capabilities:

```typescript
// Enhanced search with filters
input UserSearchInput {
  query: String
  verified: Boolean      # Filter by email verification
  joinedAfter: DateTime  # Filter by registration date
  minPosts: Int         # Filter by post count
  roles: [UserRole!]    # Filter by user roles
}

// Implement in resolver
const advancedSearch = (input: UserSearchInput) => {
  const where: Prisma.UserWhereInput = {
    AND: [
      // Text search
      input.query ? {
        OR: [
          { name: { contains: input.query, mode: 'insensitive' } },
          { email: { contains: input.query, mode: 'insensitive' } },
        ]
      } : {},
      
      // Additional filters
      input.verified !== undefined ? { emailVerified: input.verified } : {},
      input.joinedAfter ? { createdAt: { gte: input.joinedAfter } } : {},
      input.roles?.length ? { role: { in: input.roles } } : {},
    ]
  }
  
  return prisma.user.findMany({ where })
}
```

### User Repository Pattern

For complex user data operations, implement the repository pattern:

```typescript
// Implement IUserRepository interface
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }
  
  async findActiveUsers(limit: number): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        posts: { some: { published: true } }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  }
  
  async getUserStatistics(userId: number): Promise<UserStats> {
    // Complex aggregation queries
  }
}
```

## Performance Considerations

### DataLoader Integration

The module leverages DataLoaders for efficient data fetching:

```typescript
// Efficient user loading
const users = await context.loaders.userById.loadMany([1, 2, 3])

// Efficient statistics loading
const postCounts = await context.loaders.publishedPostsCountByAuthor.loadMany([1, 2, 3])
```

### Query Optimization

Uses Pothos query spreading for optimal database queries:

```typescript
return prisma.user.findMany({
  ...query, // Only includes requested fields
  where: transformedWhere,
  orderBy: transformedOrderBy,
})
```

## Testing

Run user-specific tests:

```bash
# Integration tests
bun test src/modules/users/tests/users.integration.test.ts

# Test specific scenarios
bun test -t "should update user profile"
bun test -t "should respect privacy rules"
```

## Dependencies

- **@prisma/client**: Database access
- **graphql-shield**: Authorization rules
- **@pothos/plugin-relay**: Relay connections and global IDs
- **@pothos/plugin-prisma**: Prisma integration 