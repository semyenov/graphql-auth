# Module Architecture Migration Guide

This guide explains how to migrate from the current structure to the new Domain-Driven Design (DDD) architecture.

## Overview

The new architecture introduces a clean separation of concerns with four distinct layers:

1. **Domain Layer** - Pure business logic and entities
2. **Application Layer** - Use cases and orchestration
3. **Infrastructure Layer** - External services and persistence
4. **Presentation Layer** - API endpoints and GraphQL resolvers

## Migration Strategy

### Phase 1: Parallel Implementation
- New structure exists alongside the old code
- Both can work simultaneously during migration
- Start with one module at a time (auth module is implemented as example)

### Phase 2: Gradual Migration
1. **Update imports** - Change imports to use new module structure
2. **Test thoroughly** - Ensure all tests pass with new structure
3. **Remove old code** - Delete old implementations once verified

### Phase 3: Complete Migration
- Remove all old structure
- Update documentation
- Train team on new patterns

## Key Changes

### 1. Value Objects
Old approach:
```typescript
// Direct primitive usage
const userId = 123;
const email = "user@example.com";
```

New approach:
```typescript
// Value objects with validation
const userId = UserId.create(123);
const email = Email.create("user@example.com");
```

### 2. Use Cases
Old approach:
```typescript
// Logic in resolvers
builder.mutationField('signup', (t) => {
  // All business logic here
});
```

New approach:
```typescript
// Dedicated use case classes
const signUpUseCase = container.resolve(SignUpUseCase);
const result = await signUpUseCase.execute(dto);
```

### 3. Repository Pattern
Old approach:
```typescript
// Direct Prisma usage
const user = await prisma.user.findUnique({ where: { email } });
```

New approach:
```typescript
// Repository abstraction
const userRepository = container.resolve<IUserRepository>('IUserRepository');
const user = await userRepository.findByEmail(email);
```

### 4. Dependency Injection
Old approach:
```typescript
// Manual instantiation
const passwordService = new Argon2PasswordService();
```

New approach:
```typescript
// Container-based DI
const passwordHasher = container.resolve<IPasswordHasher>('IPasswordHasher');
```

## Benefits

1. **Testability** - Easy to mock dependencies and test in isolation
2. **Maintainability** - Clear boundaries between layers
3. **Scalability** - Easy to add new features without affecting existing code
4. **Flexibility** - Can swap implementations (e.g., change database)
5. **Type Safety** - Strong contracts between layers
6. **Team Collaboration** - Teams can work on modules independently

## Example: Using the New Auth Module

### Register the module (in server startup):
```typescript
import { AuthModule } from './modules/auth';

// Register all modules
AuthModule.register();
```

### Use in GraphQL resolvers:
```typescript
import { SignUpUseCase } from './modules/auth';

const signUpUseCase = container.resolve(SignUpUseCase);
const result = await signUpUseCase.execute({
  email: args.email,
  password: args.password,
  name: args.name,
});
```

## Testing

The new structure makes testing much easier:

```typescript
describe('SignUpUseCase', () => {
  it('should register a new user', async () => {
    // Mock dependencies
    const mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(mockUser),
    };
    
    const mockPasswordHasher = {
      hash: jest.fn().mockResolvedValue('hashed'),
    };
    
    // Create use case with mocks
    const useCase = new SignUpUseCase(
      mockUserRepo,
      mockPasswordHasher,
      mockTokenService,
      mockEmailService,
    );
    
    // Test
    const result = await useCase.execute(dto);
    expect(result.user.email).toBe(dto.email);
  });
});
```

## Next Steps

1. Review the new auth module implementation
2. Create similar structure for posts and users modules
3. Update all imports to use new structure
4. Run comprehensive tests
5. Remove old implementations
6. Update documentation

## Questions?

Feel free to ask for clarification on any aspect of the new architecture!