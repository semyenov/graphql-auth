# ADR-003: Data Isolation Patterns Between Modules

## Status
**Accepted** - 2025-01-16

## Context

In our modular monolith architecture (see [ADR-001](./001-modular-monolith-architecture.md)), we use a shared database across all modules. This presents challenges:

1. **Data Ownership**: Which module is responsible for which data models?
2. **Access Control**: How to prevent modules from accessing data they shouldn't?
3. **Consistency**: How to maintain data integrity across module boundaries?
4. **Migration Path**: How to support potential future microservices extraction?

Traditional shared database approaches often lead to:
- Tight coupling through shared data models
- Unclear responsibility for data changes
- Difficulty testing modules in isolation
- Complex migration to separate services

## Decision

We will implement **Data Isolation Patterns** that maintain clear ownership while sharing a single database:

### Data Ownership Model
- **auth**: Owns User, RefreshToken, VerificationToken, LoginAttempt
- **posts**: Owns Post model
- **oidc**: Owns OidcClient, OidcGrant, OidcSession, OidcCode, OidcAccessToken, OidcRefreshToken
- **users**: Manages User data but shares ownership with auth
- **shared**: Provides utilities but owns no data models

### Access Control Patterns
1. **Module Repositories**: Each module has repository interfaces for controlled data access
2. **Read-only Access**: Modules can read specific models they don't own
3. **Restricted Access**: Modules cannot access certain sensitive models
4. **Event-based Updates**: Cross-module data changes via events, not direct modification

## Implementation Strategy

### Repository Pattern per Module

#### Auth Data Repository
```typescript
interface IAuthDataRepository {
  // User operations (owns)
  findUserById(id: string): Promise<User | null>
  createUser(data: CreateUserInput): Promise<User>
  updateUser(id: string, data: UpdateUserInput): Promise<User>
  
  // Refresh token operations (owns)
  createRefreshToken(data: CreateRefreshTokenInput): Promise<RefreshToken>
  findRefreshToken(token: string): Promise<RefreshToken | null>
  revokeRefreshToken(token: string): Promise<void>
  
  // Cannot access: Post, OIDC models
}
```

#### Posts Data Repository
```typescript
interface IPostsDataRepository {
  // Post operations (owns)
  createPost(data: CreatePostInput): Promise<Post>
  updatePost(id: string, data: UpdatePostInput): Promise<Post>
  deletePost(id: string): Promise<void>
  
  // User operations (readonly)
  findUserById(id: string): Promise<Pick<User, 'id' | 'email' | 'name'>>
  
  // Cannot access: RefreshToken, VerificationToken, OIDC models
}
```

### Data Access Rules

#### Ownership (Full CRUD Access)
- Module has complete control over the data model
- Can create, read, update, delete records
- Responsible for data validation and business rules
- Can modify schema through migrations

#### Read-only Access
- Module can query specific fields of the model
- Cannot modify data directly
- Must use events to request changes
- Limited to non-sensitive fields

#### Restricted Access
- Module cannot access the model at all
- Typically sensitive data (tokens, passwords)
- Must request data through events or client interfaces
- Enforced through repository interface design

### Data Consistency Patterns

#### Immediate Consistency
- Within module boundaries (same aggregate)
- Single database transaction
- Strong consistency guarantees

#### Eventual Consistency
- Across module boundaries
- Event-driven updates
- Acceptable for most cross-module data

## Module Data Access Matrix

| Module | User | Post | RefreshToken | VerificationToken | LoginAttempt | OIDC Models |
|--------|------|------|-------------|------------------|-------------|-------------|
| auth   | Own  | ❌   | Own         | Own              | Own         | ❌          |
| posts  | Read | Own  | ❌          | ❌               | ❌          | ❌          |
| users  | Shared| Read| ❌          | ❌               | ❌          | ❌          |
| oidc   | Read | ❌   | ❌          | ❌               | ❌          | Own         |
| shared | Util | Util | Util        | Util             | Util        | Util        |

Legend:
- **Own**: Full CRUD access and responsibility
- **Read**: Read-only access to non-sensitive fields
- **Shared**: Collaborative ownership with specific responsibilities
- **Util**: Provides utilities (pagination, filtering) but no direct access
- **❌**: No access allowed

## Data Repository Implementation

### Module-Specific Repositories
Each module implements its own repository that provides controlled access:

```typescript
// auth/repositories/auth-data.repository.ts
@injectable()
export class AuthDataRepository implements IAuthDataRepository {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  // Only exposes methods for models this module owns or can read
  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async createRefreshToken(data: CreateRefreshTokenInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data })
  }

  // Cannot access Post or OIDC models - not in interface
}
```

### TypeScript Enforcement
Repository interfaces enforce access control at compile time:

```typescript
interface IPostsDataRepository {
  // Can read User but only specific fields
  findUserById(id: string): Promise<Pick<User, 'id' | 'email' | 'name'>>
  
  // Cannot access RefreshToken - method not in interface
  // findRefreshToken() - This would be a TypeScript error
}
```

## Cross-Module Data Operations

### Event-Driven Updates
When one module needs to trigger changes in another module's data:

```typescript
// posts module wants to update user statistics
await messageBus.publish({
  type: 'POST_CREATED',
  source: 'posts',
  payload: { postId: post.id, authorId: post.authorId }
})

// users module subscribes and updates its own data
messageBus.subscribe('POST_CREATED', async (message) => {
  await this.usersRepository.incrementPostCount(message.payload.authorId)
})
```

### Client Interface Requests
For immediate data needs across modules:

```typescript
// posts module needs user data
const user = await this.usersClient.getUserProfile(authorId)
if (user.canCreatePosts) {
  await this.postsRepository.createPost(postData)
}
```

## Benefits

### Clear Ownership
- Each data model has a clear owner
- Responsibility for data integrity is well-defined
- Business rules are enforced by the owning module

### Controlled Access
- TypeScript interfaces prevent unauthorized data access
- Repository pattern provides controlled APIs
- Sensitive data is protected from cross-module access

### Migration Ready
- Clear data boundaries support microservices extraction
- Event-driven patterns work across process boundaries
- Repository interfaces can be replaced with API calls

### Testing Isolation
- Modules can be tested with mock repositories
- Data dependencies are explicit and controllable
- Integration tests can focus on specific data flows

## Trade-offs

### Advantages
- Clear data ownership and responsibility
- Compile-time access control through TypeScript
- Supports future microservices migration
- Enables isolated testing
- Reduces accidental coupling

### Disadvantages
- More complex than direct database access
- Additional repository layer to maintain
- Potential performance overhead from abstraction
- Need to design cross-module data flows carefully

## Guidelines

### Data Access Principles
1. **Own What You Control**: Modules should own data they have business rules for
2. **Read What You Need**: Modules can read non-sensitive data from other modules
3. **Event for Changes**: Cross-module data changes must use events
4. **Interface for Queries**: Cross-module data queries should use client interfaces

### Repository Design
1. Only expose methods for models the module should access
2. Use specific return types (Pick<>) for read-only access
3. Include business logic validation in repository methods
4. Throw module-specific errors for data violations

### Migration Considerations
1. Repository interfaces can be replaced with HTTP clients
2. Event system works across process boundaries
3. Data models can be moved to separate databases
4. Shared utilities can become libraries

## Compliance

### Implementation Requirements
1. All data access MUST go through module repositories
2. Modules MUST NOT import Prisma client directly (except through repositories)
3. Cross-module data changes MUST use events or client interfaces
4. Repository interfaces MUST enforce access control
5. Data ownership MUST be documented in dependencies.json

### Monitoring
- Repository method usage tracking
- Cross-module data access patterns
- Event-driven data consistency monitoring
- Performance impact of abstraction layers

## Related Decisions
- [ADR-001: Modular Monolith Architecture](./001-modular-monolith-architecture.md)
- [ADR-002: Event-Driven Communication](./002-event-driven-communication.md)
- [ADR-004: Module Client Interfaces](./004-module-client-interfaces.md)

## References
- [Data Management in Microservices](https://microservices.io/patterns/data/database-per-service.html)
- [Repository Pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design)
- [Database-per-service Pattern](https://microservices.io/patterns/data/database-per-service.html) 