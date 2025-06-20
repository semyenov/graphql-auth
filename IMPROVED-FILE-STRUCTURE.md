# Improved Modular File Structure

This document proposes a better organized, more modular file structure for the GraphQL authentication project that improves maintainability, scalability, and developer experience.

## Problems with Current Structure

1. **Mixed Concerns**: Business logic scattered across multiple directories
2. **Duplicate Concepts**: Similar files in different locations (e.g., multiple error directories)
3. **Unclear Boundaries**: Hard to understand what belongs where
4. **Legacy Cruft**: Old DDD structure mixed with new direct resolver pattern
5. **Testing Complexity**: Test files not well organized by feature

## Proposed Structure

```
src/
├── app/                              # Application entry points
│   ├── server.ts                     # Main server setup
│   ├── config/                       # Application configuration
│   │   ├── index.ts                  # Config exports
│   │   ├── database.ts               # Database configuration
│   │   ├── auth.ts                   # Auth configuration
│   │   └── environment.ts            # Environment variables
│   └── middleware/                   # Application-level middleware
│       ├── cors.ts
│       ├── rate-limiting.ts
│       └── logging.ts
│
├── modules/                          # Feature modules (domain-driven)
│   ├── auth/                         # Authentication module
│   │   ├── auth.types.ts             # Module-specific types
│   │   ├── auth.schema.ts            # GraphQL schema definitions
│   │   ├── auth.resolvers.ts         # GraphQL resolvers
│   │   ├── auth.service.ts           # Business logic
│   │   ├── auth.repository.ts        # Data access (if needed)
│   │   ├── auth.validation.ts        # Input validation schemas
│   │   ├── auth.permissions.ts       # Authorization rules
│   │   └── auth.test.ts              # Module tests
│   │
│   ├── posts/                        # Posts module
│   │   ├── posts.types.ts
│   │   ├── posts.schema.ts
│   │   ├── posts.resolvers.ts
│   │   ├── posts.service.ts
│   │   ├── posts.validation.ts
│   │   ├── posts.permissions.ts
│   │   └── posts.test.ts
│   │
│   ├── users/                        # Users module
│   │   ├── users.types.ts
│   │   ├── users.schema.ts
│   │   ├── users.resolvers.ts
│   │   ├── users.service.ts
│   │   ├── users.validation.ts
│   │   ├── users.permissions.ts
│   │   └── users.test.ts
│   │
│   └── shared/                       # Shared module utilities
│       ├── pagination/
│       │   ├── pagination.types.ts
│       │   ├── pagination.utils.ts
│       │   └── pagination.test.ts
│       ├── filtering/
│       │   ├── filter.types.ts
│       │   ├── filter.utils.ts
│       │   └── filter.test.ts
│       └── connections/
│           ├── relay.types.ts
│           ├── relay.utils.ts
│           └── relay.test.ts
│
├── graphql/                          # GraphQL infrastructure
│   ├── schema/                       # Schema building and assembly
│   │   ├── builder.ts                # Pothos builder configuration
│   │   ├── index.ts                  # Schema assembly
│   │   ├── scalars.ts                # Custom scalars
│   │   └── plugins/                  # Schema plugins
│   │       ├── auth-scope.plugin.ts
│   │       ├── validation.plugin.ts
│   │       └── error.plugin.ts
│   │
│   ├── context/                      # GraphQL context
│   │   ├── context.types.ts          # Context type definitions
│   │   ├── context.factory.ts        # Context creation
│   │   ├── context.auth.ts           # Authentication helpers
│   │   └── context.utils.ts          # Context utilities
│   │
│   ├── directives/                   # Custom GraphQL directives
│   │   ├── auth.directive.ts
│   │   ├── rate-limit.directive.ts
│   │   └── index.ts
│   │
│   └── middleware/                   # GraphQL-specific middleware
│       ├── error-handler.ts
│       ├── query-complexity.ts
│       └── performance.ts
│
├── core/                             # Core business logic and shared utilities
│   ├── auth/                         # Authentication core
│   │   ├── types.ts                  # Auth types and interfaces
│   │   ├── tokens.ts                 # JWT token handling
│   │   ├── scopes.ts                 # Authorization scopes
│   │   ├── permissions.ts            # Permission system
│   │   └── guards.ts                 # Auth guards and decorators
│   │
│   ├── validation/                   # Validation system
│   │   ├── schemas.ts                # Common Zod schemas
│   │   ├── validators.ts             # Custom validators
│   │   ├── sanitizers.ts             # Input sanitization
│   │   └── rules.ts                  # Validation rules
│   │
│   ├── errors/                       # Error handling system
│   │   ├── types.ts                  # Error type definitions
│   │   ├── handlers.ts               # Error handlers
│   │   ├── formatters.ts             # Error formatters
│   │   └── constants.ts              # Error messages and codes
│   │
│   ├── logging/                      # Logging system
│   │   ├── logger.ts                 # Logger interface and factory
│   │   ├── formatters.ts             # Log formatters
│   │   └── transports.ts             # Log transports
│   │
│   └── utils/                        # Core utilities
│       ├── crypto.ts                 # Cryptographic utilities
│       ├── dates.ts                  # Date utilities
│       ├── strings.ts                # String utilities
│       └── types.ts                  # Type utilities
│
├── data/                             # Data access layer
│   ├── database/                     # Database configuration
│   │   ├── client.ts                 # Prisma client setup
│   │   ├── migrations/               # Database migrations
│   │   └── seeds/                    # Database seeds
│   │
│   ├── loaders/                      # DataLoader implementations
│   │   ├── user.loader.ts
│   │   ├── post.loader.ts
│   │   ├── base.loader.ts
│   │   └── index.ts
│   │
│   ├── repositories/                 # Repository pattern (if needed)
│   │   ├── base.repository.ts
│   │   ├── user.repository.ts
│   │   └── post.repository.ts
│   │
│   └── cache/                        # Caching layer
│       ├── redis.ts
│       ├── memory.ts
│       └── index.ts
│
├── lib/                              # External libraries and adapters
│   ├── prisma/                       # Prisma-specific utilities
│   │   ├── client.ts
│   │   ├── extensions.ts
│   │   └── helpers.ts
│   │
│   ├── apollo/                       # Apollo Server configuration
│   │   ├── server.ts
│   │   ├── plugins.ts
│   │   └── formatters.ts
│   │
│   └── external/                     # External service adapters
│       ├── email.ts
│       ├── storage.ts
│       └── notifications.ts
│
├── types/                            # Global type definitions
│   ├── global.d.ts                   # Global type augmentations
│   ├── environment.d.ts              # Environment types
│   ├── prisma.d.ts                   # Prisma type extensions
│   └── graphql.d.ts                  # GraphQL type definitions
│
└── constants/                        # Application constants
    ├── auth.ts                       # Auth-related constants
    ├── validation.ts                 # Validation constants
    ├── errors.ts                     # Error codes and messages
    └── index.ts                      # Constant exports

test/                                 # Test files (mirrors src structure)
├── modules/                          # Module tests
│   ├── auth/
│   │   ├── auth.integration.test.ts
│   │   ├── auth.unit.test.ts
│   │   └── auth.e2e.test.ts
│   ├── posts/
│   │   ├── posts.integration.test.ts
│   │   ├── posts.unit.test.ts
│   │   └── posts.e2e.test.ts
│   └── users/
│       ├── users.integration.test.ts
│       ├── users.unit.test.ts
│       └── users.e2e.test.ts
│
├── core/                             # Core functionality tests
│   ├── auth/
│   │   ├── tokens.test.ts
│   │   ├── scopes.test.ts
│   │   └── permissions.test.ts
│   ├── validation/
│   │   ├── schemas.test.ts
│   │   └── validators.test.ts
│   └── errors/
│       ├── handlers.test.ts
│       └── formatters.test.ts
│
├── utils/                            # Test utilities
│   ├── factories/                    # Test data factories
│   │   ├── user.factory.ts
│   │   ├── post.factory.ts
│   │   └── auth.factory.ts
│   ├── fixtures/                     # Test fixtures
│   │   ├── database.fixtures.ts
│   │   └── graphql.fixtures.ts
│   ├── helpers/                      # Test helpers
│   │   ├── database.helpers.ts
│   │   ├── auth.helpers.ts
│   │   └── graphql.helpers.ts
│   └── mocks/                        # Mocks and stubs
│       ├── services.mocks.ts
│       └── external.mocks.ts
│
├── performance/                      # Performance tests
│   ├── load.test.ts
│   ├── stress.test.ts
│   └── benchmarks.test.ts
│
└── setup/                            # Test setup and configuration
    ├── global.setup.ts
    ├── database.setup.ts
    └── test.config.ts
```

## Key Improvements

### 1. **Module-Based Organization**

- Each feature is a self-contained module with all related files
- Clear separation between business domains
- Easy to find and modify feature-specific code

### 2. **Consistent File Naming**

- Each module follows the same naming pattern: `{module}.{type}.ts`
- Easy to understand what each file contains
- Consistent import patterns across the codebase

### 3. **Clear Separation of Concerns**

- **app/**: Application setup and configuration
- **modules/**: Feature-specific business logic
- **graphql/**: GraphQL infrastructure and utilities
- **core/**: Shared business logic and utilities
- **data/**: Data access and persistence
- **lib/**: External library adapters
- **types/**: Type definitions
- **constants/**: Application constants

### 4. **Improved Test Organization**

- Tests mirror the source structure
- Separate unit, integration, and e2e tests
- Shared test utilities and factories
- Performance testing separated

### 5. **Better Scalability**

- Easy to add new modules without affecting existing code
- Clear boundaries between different parts of the system
- Shared utilities are well-organized and reusable

## Migration Strategy

### Phase 1: Core Infrastructure

1. Move shared utilities to `core/`
2. Reorganize GraphQL infrastructure into `graphql/`
3. Consolidate configuration in `app/config/`

### Phase 2: Module Extraction

1. Extract auth module to `modules/auth/`
2. Extract posts module to `modules/posts/`
3. Extract users module to `modules/users/`

### Phase 3: Data Layer

1. Consolidate data access in `data/`
2. Organize loaders and repositories
3. Set up caching layer

### Phase 4: Test Reorganization

1. Reorganize tests to mirror source structure
2. Create test utilities and factories
3. Set up performance testing

### Phase 5: Cleanup

1. Remove legacy files and directories
2. Update imports throughout the codebase
3. Update documentation

## Benefits

### 1. **Maintainability**

- Easy to find and modify code
- Clear ownership of features
- Reduced coupling between modules

### 2. **Scalability**

- Easy to add new features
- Team members can work on different modules independently
- Clear boundaries for code reviews

### 3. **Developer Experience**

- Predictable file locations
- Consistent patterns across modules
- Easy onboarding for new developers

### 4. **Testing**

- Clear test organization
- Easy to run tests for specific features
- Comprehensive test coverage

### 5. **Performance**

- Better tree-shaking with module boundaries
- Lazy loading potential for modules
- Clear data access patterns

## Example Module: Auth

```typescript
// modules/auth/auth.types.ts
export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export interface LoginInput {
  email: string
  password: string
}

// modules/auth/auth.schema.ts
import { builder } from '../../graphql/schema/builder'

builder.objectType('User', {
  // User type definition
})

builder.inputType('LoginInput', {
  // Login input definition
})

// modules/auth/auth.resolvers.ts
import { builder } from '../../graphql/schema/builder'
import { AuthService } from './auth.service'

const authService = new AuthService()

builder.mutationField('login', (t) =>
  t.field({
    type: 'AuthPayload',
    args: {
      input: t.arg({ type: 'LoginInput', required: true }),
    },
    resolve: (parent, args, context) => {
      return authService.login(args.input, context)
    },
  }),
)

// modules/auth/auth.service.ts
import { AuthUser, LoginInput } from './auth.types'
import { Context } from '../../graphql/context/context.types'

export class AuthService {
  async login(input: LoginInput, context: Context): Promise<AuthUser> {
    // Business logic implementation
  }
}

// modules/auth/auth.test.ts
import { AuthService } from './auth.service'

describe('AuthService', () => {
  // Module-specific tests
})
```

This modular structure provides a clear, scalable foundation for the GraphQL authentication project that will grow well with the team and requirements.
