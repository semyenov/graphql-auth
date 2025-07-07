# Module Structure

This directory follows a modular monolith architecture where each module is self-contained with its own resolvers, services, types, and tests.

## Module Organization

Each module follows this structure:

```
modules/[feature]/
├── [feature].resolver.ts     # GraphQL resolvers (Pothos)
├── [feature].rules.ts        # Shield authorization rules
├── [feature].types.ts        # GraphQL type definitions
├── services/                 # Business logic services
│   ├── *.service.ts         # Service implementations
│   └── *.service.test.ts    # Unit tests for services
├── tests/                    # Test organization
│   ├── integration/         # Integration tests
│   └── unit/               # Unit tests (if not with services)
├── entities/                # Domain entities (if needed)
├── interfaces/             # Service interfaces
└── types/                  # TypeScript type definitions
```

## Modules

### `app/`
Core application services and middleware:
- Rate limiting service
- Security middleware
- Logging utilities

### `auth/`
Authentication and authorization:
- JWT handling
- Token services (access & refresh)
- Password hashing
- Login attempt tracking
- Authentication guards

### `posts/`
Post management:
- Post CRUD operations
- Publishing/unpublishing
- View counting
- Post ownership rules

### `users/`
User management:
- User queries
- User profile operations
- User-specific data access

### `shared/`
Shared utilities used across modules:
- **connections/**: Relay connection utilities (pagination, global IDs)
- **errors/**: Error handling utilities
- **filtering/**: GraphQL filter utilities
- **loaders/**: DataLoader implementations
- **pagination/**: Pagination utilities

### `oidc/` (in /modules directory)
OpenID Connect provider:
- OIDC provider service
- Client management
- Session management
- OIDC-specific resolvers

## Best Practices

1. **Keep modules self-contained**: Each module should have minimal dependencies on other modules
2. **Use dependency injection**: For complex services, use TSyringe for DI
3. **Test placement**: Keep unit tests next to the code they test, integration tests in `tests/integration/`
4. **Direct imports**: Import Prisma directly, never through context (see ADR-003)
5. **Service layer**: Extract complex business logic to services, keep resolvers simple