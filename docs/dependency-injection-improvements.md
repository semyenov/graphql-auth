# Dependency Injection Improvements

## Overview

This document summarizes the comprehensive dependency injection improvements implemented in the GraphQL Auth project.

## Key Improvements

### 1. Service Registry Pattern

Created a centralized `service-registry.ts` that provides:
- **Type-safe service access** through the `Services` class
- **Service token constants** to prevent typos
- **Factory methods** for creating specialized loggers
- **Helper utilities** for service management

```typescript
// Before
const passwordService = container.resolve<IPasswordService>('IPasswordService')

// After
const passwordService = Services.password
```

### 2. Interface-Based Registration

All services are now registered using interfaces:
- Better testability and mockability
- Clear separation between interfaces and implementations
- Proper lifecycle management (Singleton, Scoped, Transient)

```typescript
container.register<IPasswordService>(
  SERVICE_TOKENS.PASSWORD_SERVICE,
  { useClass: Argon2PasswordService },
  { lifecycle: Lifecycle.Singleton }
)
```

### 3. Enhanced Authentication Features

Added comprehensive auth features:
- **Email verification** with tokens
- **Password reset** functionality
- **Account lockout** protection
- **Login attempt** tracking
- **Verification token** management

### 4. Improved Developer Experience

- No more manual `container.resolve()` calls
- IntelliSense support through the Services registry
- Consistent service access patterns
- Decorator support for automatic injection

## Service Registry API

### Core Services
- `Services.config` - Application configuration
- `Services.logger` - Logging service
- `Services.createLogger(context)` - Create scoped logger

### Auth Services
- `Services.password` - Password hashing service
- `Services.token` - JWT token service
- `Services.refreshToken` - Refresh token repository
- `Services.loginAttempt` - Login attempt tracking
- `Services.verificationToken` - Email/password reset tokens

### Shared Services
- `Services.email` - Email sending service
- `Services.rateLimiter` - Rate limiting service

### OIDC Services
- `Services.oidcProvider` - OIDC provider service

## Factory Functions

### ServiceFactory
- `createResolverLogger(name)` - Logger for GraphQL resolvers
- `createServiceLogger(name)` - Logger for services
- `getAuthServices()` - Get all auth-related services
- `isServiceRegistered(token)` - Check if service is registered

## Implementation Details

### Container Configuration

The container is configured in `src/app/config/container.ts`:
1. Core infrastructure (config, logger, database)
2. Authentication services
3. Shared services
4. OIDC services

### Lifecycle Management

- **Singleton**: Stateless services (password, token, email)
- **Scoped**: Per-request services (refresh token repository)
- **Instance**: Pre-configured instances (logger, rate limiter)

### Error Handling

All services follow consistent error handling patterns:
- Use domain-specific error types
- Log errors with appropriate context
- Return meaningful error messages

## Migration Guide

### For Resolvers

Replace direct container calls:
```typescript
// Old
const passwordService = container.resolve<IPasswordService>('IPasswordService')

// New
const passwordService = Services.password
```

### For Logging

Use factory methods:
```typescript
// Old
const logger = getLogger()

// New
const logger = ServiceFactory.createResolverLogger('myResolver')
```

### For Tests

The Services registry works in tests:
```typescript
// Configure container first
configureContainer()

// Then use services
const result = await Services.password.hash('password123')
```

## Benefits

1. **Type Safety**: Full TypeScript support with interfaces
2. **Maintainability**: Centralized service management
3. **Testability**: Easy to mock services for testing
4. **Performance**: Lazy loading of services
5. **Developer Experience**: Better IntelliSense and fewer imports

## Future Enhancements

1. **Service Health Checks**: Add health check methods to services
2. **Service Metrics**: Track service usage and performance
3. **Dynamic Registration**: Allow runtime service registration
4. **Service Decorators**: More decorator patterns for injection