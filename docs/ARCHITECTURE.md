# GraphQL Authentication Service Architecture

## Overview

This document describes the finalized architecture patterns for the GraphQL Authentication Service. The architecture follows a **Modular Monolith** pattern with clear separation of concerns, type safety, and scalability in mind.

## Core Architecture Principles

### 1. Modular Direct Resolvers Pattern

We use **direct Pothos resolvers** without unnecessary abstraction layers. This approach provides:

- Clear, readable code with business logic close to the GraphQL schema
- Type safety through Pothos and TypeScript
- Optimal performance with direct Prisma access

### 2. Direct Data Access Pattern

Instead of repository patterns, we use **direct Prisma access** for most entities:

- Prisma client is imported directly, not passed through context
- Query optimization through Pothos's query spreading
- DataLoader integration for N+1 query prevention
- Exception: RefreshToken uses repository pattern for token-specific operations

### 3. Dual Authorization System

We implement a comprehensive authorization system using:

- **Pothos Scope Auth Plugin**: For basic authentication checks (`grantScopes`)
- **GraphQL Shield Plugin**: For complex, field-level authorization rules (`shield`)

### 4. Service Layer with Dependency Injection

Business logic is encapsulated in services using:

- Interface-based design for testability
- TSyringe for dependency injection
- Clear separation between interfaces and implementations

## Architecture Layers

### 1. HTTP Layer (`src/server.ts`)

- H3-based HTTP server
- Middleware for CORS, security headers, rate limiting
- Apollo Server integration

### 2. GraphQL Layer (`src/graphql/`)

- **Schema**: Pothos builder with comprehensive plugin setup
- **Context**: Request-scoped context with authentication info and DataLoaders
- **Middleware**: Authentication, rate limiting, validation

### 3. Module Layer (`src/modules/`)

Each module contains:

- **Schema**: GraphQL type definitions
- **Resolvers**: Direct Pothos resolvers with inline business logic
- **Services**: Complex business logic and external integrations
- **Permissions**: Authorization rules and Shield rules
- **Validation**: Zod schemas for input validation
- **Types**: TypeScript interfaces and types

### 4. Infrastructure Layer (`src/app/`)

- **Config**: Environment and application configuration
- **Errors**: Centralized error handling and types
- **Logging**: Structured logging system
- **Services**: Cross-cutting concerns (email, etc.)

### 5. Data Access Layer

- **Prisma Client**: Direct access pattern with query optimization
- **DataLoaders**: Batching and caching for performance
- **Repositories**: Only for complex data operations (RefreshToken)

## Module Structure Pattern

Each feature module follows this structure:

```
modules/[feature]/
├── [feature].schema.ts       # GraphQL type definitions
├── [feature].permissions.ts  # Authorization rules and guards
├── [feature].validation.ts   # Input validation schemas
├── resolvers/
│   └── [feature].resolver.ts # GraphQL resolvers
├── services/                 # Business logic (if needed)
│   └── [feature].service.ts
├── entities/                 # Domain entities (if needed)
│   └── [entity].entity.ts
└── types/                    # TypeScript types
    └── [feature].types.ts
```

## Key Architectural Patterns

### 1. Resolver Pattern

```typescript
builder.mutationField("operationName", (t) =>
  t.prismaField({
    type: "ReturnType",
    grantScopes: ["authenticated"], // Pothos auth
    shield: customShieldRule, // Shield auth
    args: {
      input: t.arg({ type: InputType, required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      // 1. Authentication check (if needed)
      const userId = requireAuthentication(context);

      // 2. Authorization logic (if complex)
      // Shield rules handle most cases

      // 3. Business logic (inline or service call)
      const service = container.resolve<IService>("IService");
      const result = await service.operation(args.input);

      // 4. Data operation with query spreading
      return prisma.model.create({
        ...query, // CRITICAL: Always spread query
        data: result,
      });
    },
  })
);
```

### 2. Service Pattern

```typescript
export interface IFeatureService {
  operation(input: Input): Promise<Output>;
}

@injectable()
export class FeatureService implements IFeatureService {
  constructor(@inject("ITokenService") private tokenService: ITokenService) {}

  async operation(input: Input): Promise<Output> {
    // Business logic here
  }
}
```

### 3. Error Handling Pattern

```typescript
// In resolvers and services
try {
  // Operation
} catch (error) {
  throw normalizeError(error);
}

// In Shield rules
export const customRule = rule({ cache: "strict" })(
  async (_parent, args, context) => {
    try {
      // Authorization logic
      return true;
    } catch (error) {
      return handleRuleError(error);
    }
  }
);
```

### 4. Authentication Pattern

```typescript
// In resolvers
const userId = requireAuthentication(context); // Throws if not authenticated
const userIdOrNull = getAuthenticatedUserId(context); // Returns null if not authenticated

// In context
context.user = decoded ? UserId.create(decoded.userId) : null;
```

## Data Flow

1. **Request** → HTTP Middleware → GraphQL Context Creation
2. **GraphQL** → Schema Resolution → Authorization Checks
3. **Resolver** → Business Logic → Data Access
4. **Response** → Error Formatting → HTTP Response

## Security Architecture

### Authentication

- JWT-based with access and refresh tokens
- Argon2 password hashing (with bcrypt fallback)
- Refresh token rotation for enhanced security
- Email verification flow

### Authorization

- Role-based access control (User, Admin)
- Resource ownership validation
- Field-level permissions with Shield
- Operation-specific authorization rules

### Rate Limiting

- Flexible presets for different operations
- IP-based and user-based limiting
- Configurable through environment

## Testing Strategy

### Unit Tests

- Services and utilities
- Individual resolvers
- Authorization rules

### Integration Tests

- Full GraphQL operations
- Authentication flows
- Module interactions

### Test Utilities

- Typed GraphQL operations with GraphQL Tada
- Test database isolation
- Mock service injection

## Configuration

### Environment Variables

- `DATABASE_URL`: Database connection
- `JWT_SECRET`: Token signing secret
- `NODE_ENV`: Environment mode
- Additional service-specific configs

### Dependency Injection

- Interface-based registration
- Environment-specific overrides
- Test double support

## Performance Considerations

1. **DataLoader Integration**: Automatic batching for N+1 prevention
2. **Query Optimization**: Pothos query spreading for efficient selects
3. **Caching**: Strategic caching in Shield rules
4. **Database Indexes**: Optimized for common queries

## Deployment Architecture

### Development

- Local SQLite database
- Hot reload with Bun
- GraphQL Playground

### Production

- PostgreSQL with Prisma
- Environment-based configuration
- Structured logging
- Health checks

## Future Considerations

1. **Microservices Migration**: Current modular structure supports easy extraction
2. **Event-Driven Architecture**: Services are loosely coupled for event integration
3. **Caching Layer**: Redis integration points identified
4. **Observability**: OpenTelemetry-ready logging structure

## Conventions and Standards

### Code Style

- Biome for formatting and linting
- Strict TypeScript configuration
- No `any` types

### Naming Conventions

- PascalCase for types and interfaces
- camelCase for functions and variables
- UPPER_CASE for constants
- Descriptive names over abbreviations

### File Organization

- Feature-based modules
- Colocation of related code
- Clear import paths

### Git Workflow

- Conventional commits
- Feature branches
- PR-based development

## Anti-Patterns to Avoid

1. **Repository Pattern for Simple Entities**: Use direct Prisma access
2. **Passing Prisma through Context**: Always import directly
3. **Complex Abstraction Layers**: Keep it simple and direct
4. **Mixing Authorization Approaches**: Use Shield rules consistently
5. **Business Logic in Resolvers**: Extract to services when complex

## Decision Log

1. **Direct Resolvers over Abstraction**: Chosen for clarity and performance
2. **Dual Authorization**: Provides flexibility for different auth needs
3. **Service Layer**: Balances simplicity with testability
4. **Module Structure**: Supports both monolith and future microservices
5. **TypeScript Strict Mode**: Ensures type safety throughout

This architecture provides a solid foundation for a scalable, maintainable, and secure GraphQL authentication service.
