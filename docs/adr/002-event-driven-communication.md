# ADR-002: Event-Driven Communication Between Modules

## Status
**Accepted** - 2025-01-16

## Context

In our modular monolith architecture (see [ADR-001](./001-modular-monolith-architecture.md)), modules need to communicate with each other while maintaining loose coupling. Traditional approaches include:

1. **Direct Method Calls**: Tight coupling, hard to test, circular dependencies
2. **Shared Services**: Violates module boundaries, creates hidden dependencies  
3. **Database-level Integration**: Breaks data isolation, fragile
4. **Synchronous APIs**: Over-engineering for intra-process communication

We needed a communication pattern that maintains module boundaries while providing reliable, traceable inter-module communication.

## Decision

We will implement **Event-Driven Communication** using a pub-sub messaging system with the following characteristics:

### Message Bus Architecture
- `IModuleBus` interface for standardized messaging
- `InMemoryModuleBus` implementation for single-process communication
- Support for both synchronous and asynchronous message processing

### Event Types
```typescript
// Auth Module Events
USER_REGISTERED, AUTH_LOGIN_SUCCESS, AUTH_LOGOUT, 
PASSWORD_CHANGED, ACCOUNT_LOCKED, EMAIL_VERIFIED

// Posts Module Events  
POST_CREATED, POST_PUBLISHED, POST_UPDATED, POST_DELETED,
POST_MODERATED, POST_COMMENT_ADDED

// Users Module Events
USER_PROFILE_UPDATED, USER_DEACTIVATED, USER_FOLLOWED,
USER_SEARCH_PERFORMED, USER_CONTENT_VIEWED

// Shared Module Events
RATE_LIMIT_EXCEEDED, EMAIL_SENT, CACHE_HIT, SECURITY_VIOLATION
```

### Message Structure
```typescript
interface ModuleMessage {
  id: string
  type: string
  source: string
  target?: string
  payload: unknown
  timestamp: Date
  metadata?: Record<string, unknown>
}
```

## Implementation Details

### Publishing Messages
```typescript
// From auth module
await messageBus.publish({
  type: 'USER_REGISTERED',
  source: 'auth',
  payload: { userId: user.id, email: user.email }
})
```

### Subscribing to Messages
```typescript
// In users module
messageBus.subscribe('USER_REGISTERED', async (message) => {
  await this.usersService.createUserProfile(message.payload.userId)
})
```

### Message Processing
- **Asynchronous by Default**: Non-blocking message processing
- **Error Handling**: Failed handlers don't affect other subscribers
- **Logging**: All messages and errors are logged for debugging
- **Statistics**: Message counts, processing times, error rates

## Benefits

### Decoupling
- Modules don't need direct references to each other
- Publishers don't know who (if anyone) is listening
- Subscribers can be added/removed without affecting publishers

### Scalability
- Multiple subscribers can handle the same event type
- Async processing prevents blocking operations
- Message history enables audit trails and debugging

### Testability
- Easy to mock the message bus for unit tests
- Can verify expected messages were published
- Can trigger event handlers independently

### Flexibility
- New subscribers can be added without code changes to publishers
- Event-driven workflows can evolve independently
- Supports eventual consistency patterns

## Trade-offs

### Advantages
- Loose coupling between modules
- Natural audit trail of system events
- Easy to add new event subscribers
- Supports async processing patterns
- Excellent for complex workflows

### Disadvantages  
- More complex than direct method calls
- Harder to track execution flow across modules
- Potential for message ordering issues
- Event schema evolution challenges
- Debugging distributed across event handlers

## Guidelines

### When to Use Events
- ✅ Module needs to notify others of state changes
- ✅ Multiple modules care about the same event
- ✅ Workflow spans multiple modules
- ✅ Audit trail is important

### When NOT to Use Events
- ❌ Simple request/response patterns
- ❌ Need immediate response with data
- ❌ Single subscriber only
- ❌ Critical error handling required

### Event Design Principles
1. **Events are Facts**: Past tense, immutable, represent something that happened
2. **Rich Payloads**: Include enough data to avoid requiring additional queries
3. **Backward Compatibility**: Event schemas should evolve carefully
4. **Idempotent Handlers**: Handle duplicate events gracefully

## Message Bus Implementation

### Core Interface
```typescript
interface IModuleBus {
  publish(message: Omit<ModuleMessage, 'id' | 'timestamp'>): Promise<void>
  subscribe<T>(eventType: string, handler: MessageHandler<T>): MessageSubscription
  unsubscribe(subscription: MessageSubscription): void
  getStatistics(): MessageBusStatistics
}
```

### Statistics and Monitoring
- Message publish/subscribe counts
- Handler execution times
- Error rates per event type
- Active subscription counts

## Migration Strategy

### Phase 1: Infrastructure
- Implement `IModuleBus` and `InMemoryModuleBus`
- Add message publishing to existing operations
- Create event type definitions

### Phase 2: Critical Events
- User registration/authentication events
- Post creation/publication events
- Security-related events

### Phase 3: Workflow Events
- Complex multi-module workflows
- Background processing triggers
- Analytics and metrics events

### Phase 4: Optimization
- Message batching for high-volume events
- Event replay for debugging
- Performance monitoring and tuning

## Compliance

### Implementation Requirements
1. All inter-module notifications MUST use events
2. Events MUST be immutable after publishing
3. Event handlers MUST be idempotent
4. Failed event handlers MUST NOT crash the system
5. All events MUST be logged for audit purposes

### Event Schema Management
- Event types registered in module dependencies.json
- Payload schemas documented per module
- Breaking changes require new event types
- Deprecated events supported for transition periods

## Related Decisions
- [ADR-001: Modular Monolith Architecture](./001-modular-monolith-architecture.md)
- [ADR-004: Module Client Interfaces](./004-module-client-interfaces.md)

## References
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [Building Event-Driven Microservices](https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/)
- [Domain Events Pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation) 