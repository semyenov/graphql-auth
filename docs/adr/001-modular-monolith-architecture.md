# ADR-001: Modular Monolith Architecture

## Status
**Accepted** - 2025-01-16

## Context

The GraphQL Auth project was originally structured as a traditional monolith with scattered business logic, shared constants across domains, and tight coupling between modules. As the project grew, several issues emerged:

1. **Poor Separation of Concerns**: Business logic for different domains (auth, users, posts, OIDC) was mixed throughout the codebase
2. **Tight Coupling**: Modules directly imported and used each other's internal implementations
3. **Shared State**: Domain-specific constants and configurations were centralized, creating dependencies
4. **Testing Complexity**: Difficult to test individual features in isolation
5. **Maintenance Overhead**: Changes in one area often required modifications across multiple unrelated files

We needed to improve modularity while maintaining the benefits of a single deployment unit.

## Decision

We will restructure the application as a **Modular Monolith** with the following characteristics:

### Module Boundaries
- **auth**: Authentication and authorization (JWT, passwords, tokens)
- **users**: User management and profiles  
- **posts**: Content creation and management
- **oidc**: OpenID Connect provider implementation
- **shared**: Cross-cutting concerns and utilities

### Communication Patterns
1. **Client Interfaces**: Each module exposes a well-defined client interface for external interactions
2. **Event-Driven Messaging**: Inter-module communication via pub-sub messaging system
3. **Data Isolation**: Modules access only their own data models through repository patterns

### Architectural Principles
- Single deployment unit (monolith benefits)
- Clear module boundaries (microservices benefits)
- Interface segregation and dependency inversion
- Event-driven communication over direct calls
- Data ownership and isolation per module

## Implementation Strategy

### Phase 1: Constants Refactoring
- Move domain-specific constants to respective modules
- Keep only infrastructure constants in shared app config
- Eliminate cross-domain constant dependencies

### Phase 2: Client Interfaces
- Define `IAuthClient`, `IUsersClient`, `IPostsClient`, `ISharedClient` interfaces
- Specify event types and error classes per module
- Establish clear API contracts between modules

### Phase 3: Messaging System
- Implement `IModuleBus` for pub-sub communication
- Create `InMemoryModuleBus` with async message processing
- Add message history, statistics, and error handling

### Phase 4: Data Isolation
- Create module-specific repository interfaces
- Implement controlled data access patterns
- Enforce data ownership rules through TypeScript interfaces

### Phase 5: Dependency Documentation
- Create `dependencies.json` for each module
- Document external/internal dependencies, provides, events, and data access rules
- Establish clear contracts for module interactions

## Benefits

### Immediate Benefits
1. **Clear Boundaries**: Each module has well-defined responsibilities
2. **Reduced Coupling**: Modules communicate through interfaces, not direct imports
3. **Improved Testing**: Modules can be tested in isolation with mocked dependencies
4. **Better Organization**: Code is organized by business domain rather than technical layer

### Long-term Benefits
1. **Scalability**: Individual modules can be optimized or refactored independently
2. **Team Productivity**: Different teams can work on different modules with minimal conflicts
3. **Migration Path**: Modules can potentially be extracted as microservices later
4. **Maintainability**: Changes are contained within module boundaries

## Trade-offs

### Advantages
- Maintains single deployment unit (simpler ops)
- Shared infrastructure and database
- Type safety across module boundaries
- Event-driven communication patterns
- Clear data ownership

### Disadvantages
- Additional complexity in module communication
- More files and interfaces to maintain
- Potential for over-engineering simple features
- Learning curve for event-driven patterns

## Compliance

### Implementation Requirements
1. All modules MUST expose client interfaces
2. Inter-module communication MUST use the messaging system
3. Data access MUST go through module repositories
4. Modules MUST NOT directly import other modules' internal implementations
5. All dependencies MUST be documented in `dependencies.json`

### Monitoring
- Module message statistics and performance
- Dependency violation detection via code analysis
- Module boundary compliance in CI/CD

## Related Decisions
- [ADR-002: Event-Driven Communication](./002-event-driven-communication.md)
- [ADR-003: Data Isolation Patterns](./003-data-isolation-patterns.md)
- [ADR-004: Module Client Interfaces](./004-module-client-interfaces.md)

## References
- [Modular Monolith: A Primer](https://www.kamilgrzybek.com/design/modular-monolith-primer/)
- [Building Modular Monoliths](https://www.thoughtworks.com/insights/blog/microservices/modular-monoliths)
- [Modular Monolith Architecture](https://martinfowler.com/articles/microservices.html#MonolithFirst) 