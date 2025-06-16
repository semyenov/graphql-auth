# Architecture Overview

This project follows a **Domain-Driven Design (DDD)** approach with a **feature-based modular architecture**.

## Directory Structure

```
src/
├── config/                    # Application configuration
│   └── index.ts              # Centralized config management
│
├── features/                  # Feature-based modules
│   ├── auth/                 # Authentication feature
│   │   ├── domain/           # Business logic and entities
│   │   │   ├── types.ts      # Domain models and interfaces
│   │   │   └── services/     # Domain services
│   │   ├── application/      # Use cases / Application services
│   │   │   └── use-cases/    # Business operations
│   │   ├── infrastructure/   # External interfaces
│   │   │   ├── repositories/ # Data access layer
│   │   │   └── services/     # External services (JWT, etc)
│   │   └── presentation/     # GraphQL layer
│   │       └── resolvers/    # GraphQL resolvers
│   │
│   ├── posts/                # Posts feature
│   │   └── ... (same structure)
│   │
│   └── users/                # Users feature
│       └── ... (same structure)
│
├── shared/                    # Shared modules
│   ├── domain/               # Shared domain concepts
│   │   └── types/            # Common domain types
│   ├── infrastructure/       # Shared infrastructure
│   │   ├── container/        # Dependency injection
│   │   └── graphql/          # GraphQL utilities
│   └── presentation/         # Shared presentation utilities
│
├── schema/                    # GraphQL schema (legacy structure)
│   ├── builder.ts            # Pothos builder configuration
│   ├── types/                # GraphQL type definitions
│   ├── queries/              # Query resolvers
│   └── mutations/            # Mutation resolvers
│
├── context/                   # GraphQL context
├── permissions/               # Authorization rules
├── errors/                    # Error handling
├── constants/                 # Application constants
└── utils/                     # General utilities
```

## Architectural Layers

### 1. Domain Layer (`domain/`)
- **Purpose**: Contains business logic and rules
- **Contents**: Entities, value objects, domain services, domain events
- **Dependencies**: None (pure business logic)
- **Example**: `PasswordService`, `PostAuthorizationService`

### 2. Application Layer (`application/`)
- **Purpose**: Orchestrates business operations
- **Contents**: Use cases, application services, DTOs
- **Dependencies**: Domain layer only
- **Example**: `SignupUseCase`, `CreatePostUseCase`

### 3. Infrastructure Layer (`infrastructure/`)
- **Purpose**: Implements external interfaces
- **Contents**: Repositories, external service adapters
- **Dependencies**: Domain and Application layers
- **Example**: `UserRepository`, `TokenService`

### 4. Presentation Layer (`presentation/`)
- **Purpose**: Handles external communication (GraphQL)
- **Contents**: Resolvers, GraphQL-specific logic
- **Dependencies**: All layers through use cases
- **Example**: GraphQL resolvers

## Key Principles

### 1. Dependency Direction
- Dependencies flow inward: Presentation → Application → Domain
- Domain layer has no external dependencies
- Infrastructure implements interfaces defined in Domain/Application

### 2. Feature Isolation
- Each feature is self-contained with its own layers
- Features communicate through well-defined interfaces
- Shared code is explicitly placed in `shared/` modules

### 3. Separation of Concerns
- Business logic is separated from framework code
- GraphQL resolvers are thin, delegating to use cases
- Database access is isolated in repositories

### 4. Testability
- Each layer can be tested independently
- Use cases can be tested without GraphQL or database
- Dependency injection enables easy mocking

## Migration Strategy

The codebase is transitioning from a flat structure to this layered architecture:

1. **Legacy Code**: Remains in `schema/` directory
2. **New Features**: Implemented in `features/` directory
3. **Gradual Migration**: Move code piece by piece
4. **Backward Compatibility**: Maintain existing GraphQL API

## Benefits

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Easy to add new features
3. **Testability**: Each layer can be tested in isolation
4. **Flexibility**: Easy to change frameworks or databases
5. **Team Collaboration**: Clear boundaries between modules