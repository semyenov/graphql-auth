# Dependency Injection Guide

This guide outlines the dependency injection patterns and best practices used in this GraphQL Auth project.

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Service Registration](#service-registration)
4. [Service Resolution](#service-resolution)
5. [Best Practices](#best-practices)
6. [Testing with DI](#testing-with-di)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

## Overview

We use [TSyringe](https://github.com/microsoft/tsyringe) for dependency injection, which provides:
- Constructor-based injection
- Property injection
- Interface-based registration
- Lifecycle management (Singleton, Scoped, Transient)

### Key Benefits

1. **Testability**: Easy to mock dependencies in tests
2. **Loose Coupling**: Services depend on interfaces, not implementations
3. **Centralized Configuration**: All DI setup in one place
4. **Type Safety**: Full TypeScript support with compile-time checking

## Core Concepts

### 1. Interfaces vs Implementations

Always define interfaces for your services:

```typescript
// auth/interfaces/password.service.interface.ts
export interface IPasswordService {
  hash(password: string): Promise<string>
  verify(password: string, hash: string): Promise<boolean>
}

// auth/services/argon2-password.service.ts
@injectable()
export class Argon2PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password)
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password)
  }
}
```

### 2. Service Lifecycle

- **Singleton**: One instance for the entire application lifetime
- **Scoped**: One instance per request/scope
- **Transient**: New instance every time it's resolved

```typescript
// Singleton - shared across all requests
container.register<IPasswordService>('IPasswordService', {
  useClass: Argon2PasswordService,
}, { lifecycle: Lifecycle.Singleton })

// Scoped - new instance per request
container.register<IRefreshTokenRepository>('IRefreshTokenRepository', {
  useClass: RefreshTokenRepository,
})

// Transient - new instance every resolution
container.register<IEmailService>('IEmailService', {
  useClass: EmailService,
}, { lifecycle: Lifecycle.Transient })
```

## Service Registration

### Basic Registration

```typescript
// Register by interface token
container.register<IPasswordService>('IPasswordService', {
  useClass: Argon2PasswordService,
})

// Register instance
container.registerInstance<AppConfig>('AppConfig', getConfig())

// Register factory
container.register<ILogger>('ILogger', {
  useFactory: (container) => {
    const config = container.resolve<AppConfig>('AppConfig')
    return createLogger(config.logLevel)
  },
})
```

### Advanced Registration

```typescript
// Conditional registration
if (process.env.NODE_ENV === 'production') {
  container.register<IEmailService>('IEmailService', {
    useClass: SendGridEmailService,
  })
} else {
  container.register<IEmailService>('IEmailService', {
    useClass: MockEmailService,
  })
}

// Delayed registration
container.register<IOidcProviderService>('IOidcProviderService', {
  useFactory: () => {
    // Lazy initialization
    return new OidcProviderService()
  },
}, { lifecycle: Lifecycle.Singleton })
```

## Service Resolution

### Using Service Registry (Recommended)

```typescript
import { Services, ServiceFactory } from '@/app/config/service-registry'

// Direct access
const hashedPassword = await Services.password.hash('mypassword')

// With error handling
try {
  const result = await Services.email.sendWelcomeEmail(user)
} catch (error) {
  logger.error('Failed to send email', error)
}

// Scoped logger
const logger = ServiceFactory.createResolverLogger('signup')
```

### Manual Resolution

```typescript
import { container } from 'tsyringe'

// Basic resolution
const passwordService = container.resolve<IPasswordService>('IPasswordService')

// Safe resolution
const emailService = container.tryResolve<IEmailService>('IEmailService')
if (emailService) {
  await emailService.send(message)
}
```

### Constructor Injection

```typescript
@injectable()
export class AuthService {
  constructor(
    @inject('IPasswordService') private passwordService: IPasswordService,
    @inject('ITokenService') private tokenService: ITokenService,
    @inject('ILogger') private logger: ILogger,
  ) {}
  
  async authenticate(email: string, password: string) {
    this.logger.info('Authentication attempt', { email })
    // ... implementation
  }
}
```

## Best Practices

### 1. Always Use Interfaces

```typescript
// ✅ GOOD
@inject('IPasswordService') private passwordService: IPasswordService

// ❌ BAD
@inject('IPasswordService') private passwordService: Argon2PasswordService
```

### 2. Consistent Token Naming

```typescript
// Use constants to prevent typos
export const SERVICE_TOKENS = {
  PASSWORD_SERVICE: 'IPasswordService',
  TOKEN_SERVICE: 'ITokenService',
  EMAIL_SERVICE: 'IEmailService',
} as const

// Registration
container.register(SERVICE_TOKENS.PASSWORD_SERVICE, {
  useClass: Argon2PasswordService,
})

// Resolution
const service = container.resolve(SERVICE_TOKENS.PASSWORD_SERVICE)
```

### 3. Avoid Service Locator Anti-pattern in Business Logic

```typescript
// ❌ BAD - Service locator in business logic
class UserService {
  async createUser(data: CreateUserInput) {
    const passwordService = container.resolve<IPasswordService>('IPasswordService')
    const hashedPassword = await passwordService.hash(data.password)
  }
}

// ✅ GOOD - Constructor injection
@injectable()
class UserService {
  constructor(
    @inject('IPasswordService') private passwordService: IPasswordService
  ) {}
  
  async createUser(data: CreateUserInput) {
    const hashedPassword = await this.passwordService.hash(data.password)
  }
}
```

### 4. Scoped Services for Request Context

```typescript
// For services that need request-specific data
@injectable()
export class RequestScopedService {
  private requestId: string
  
  constructor(@inject('RequestContext') context: RequestContext) {
    this.requestId = context.requestId
  }
}
```

### 5. Graceful Degradation

```typescript
// Handle missing optional services
const cacheService = container.tryResolve<ICacheService>('ICacheService')
if (cacheService) {
  await cacheService.set(key, value)
} else {
  logger.warn('Cache service not available, skipping cache')
}
```

## Testing with DI

### Mocking Services

```typescript
// test/setup.ts
export function setupTestContainer() {
  container.clearInstances()
  
  // Register mocks
  container.register<IPasswordService>('IPasswordService', {
    useValue: {
      hash: jest.fn().mockResolvedValue('hashed'),
      verify: jest.fn().mockResolvedValue(true),
    },
  })
  
  container.register<IEmailService>('IEmailService', {
    useValue: {
      sendWelcomeEmail: jest.fn().mockResolvedValue(true),
      sendPasswordReset: jest.fn().mockResolvedValue(true),
    },
  })
}
```

### Testing Services

```typescript
describe('AuthService', () => {
  let authService: AuthService
  let mockPasswordService: jest.Mocked<IPasswordService>
  
  beforeEach(() => {
    setupTestContainer()
    mockPasswordService = container.resolve('IPasswordService') as any
    authService = container.resolve(AuthService)
  })
  
  it('should hash password on signup', async () => {
    await authService.signup({ email: 'test@example.com', password: 'pass' })
    
    expect(mockPasswordService.hash).toHaveBeenCalledWith('pass')
  })
})
```

### Integration Testing

```typescript
// For integration tests, use real implementations
export function setupIntegrationContainer() {
  container.clearInstances()
  configureContainer() // Use real services
  
  // Override only external services
  container.register<IEmailService>('IEmailService', {
    useClass: MockEmailService,
  })
}
```

## Common Patterns

### 1. Factory Pattern with DI

```typescript
@injectable()
export class ServiceFactory {
  constructor(
    @inject('ILogger') private logger: ILogger,
    @inject('AppConfig') private config: AppConfig,
  ) {}
  
  createService(type: ServiceType): IService {
    switch (type) {
      case ServiceType.EMAIL:
        return this.createEmailService()
      case ServiceType.SMS:
        return this.createSmsService()
      default:
        throw new Error(`Unknown service type: ${type}`)
    }
  }
  
  private createEmailService(): IEmailService {
    if (this.config.email.provider === 'sendgrid') {
      return new SendGridEmailService(this.config.email.apiKey)
    }
    return new SMTPEmailService(this.config.email.smtp)
  }
}
```

### 2. Decorator Pattern

```typescript
@injectable()
export class LoggingEmailService implements IEmailService {
  constructor(
    @inject('IEmailService') private emailService: IEmailService,
    @inject('ILogger') private logger: ILogger,
  ) {}
  
  async send(message: EmailMessage): Promise<void> {
    this.logger.info('Sending email', { to: message.to })
    
    try {
      await this.emailService.send(message)
      this.logger.info('Email sent successfully', { to: message.to })
    } catch (error) {
      this.logger.error('Failed to send email', error)
      throw error
    }
  }
}

// Register decorator
container.register<IEmailService>('BaseEmailService', {
  useClass: SendGridEmailService,
})

container.register<IEmailService>('IEmailService', {
  useFactory: (container) => {
    const baseService = container.resolve<IEmailService>('BaseEmailService')
    const logger = container.resolve<ILogger>('ILogger')
    return new LoggingEmailService(baseService, logger)
  },
})
```

### 3. Strategy Pattern

```typescript
interface IAuthStrategy {
  authenticate(credentials: any): Promise<User>
}

@injectable()
export class JWTAuthStrategy implements IAuthStrategy {
  constructor(@inject('ITokenService') private tokenService: ITokenService) {}
  
  async authenticate(token: string): Promise<User> {
    const payload = await this.tokenService.verify(token)
    return this.findUserById(payload.userId)
  }
}

@injectable()
export class OAuthStrategy implements IAuthStrategy {
  constructor(@inject('IOAuthService') private oauthService: IOAuthService) {}
  
  async authenticate(code: string): Promise<User> {
    const profile = await this.oauthService.getProfile(code)
    return this.findOrCreateUser(profile)
  }
}

// Register strategies
container.register<IAuthStrategy>('JWTStrategy', { useClass: JWTAuthStrategy })
container.register<IAuthStrategy>('OAuthStrategy', { useClass: OAuthStrategy })
```

## Troubleshooting

### Common Issues

1. **"tsyringe requires a reflect polyfill"**
   - Ensure `import 'reflect-metadata'` is the FIRST import in entry points
   - Check `src/main.ts`, `src/app/server.ts`, and `test/test-env.ts`

2. **"Service not registered"**
   - Check that `configureContainer()` is called before resolving services
   - Verify the service token matches registration

3. **"Cannot inject value of type undefined"**
   - Ensure all constructor parameters have `@inject()` decorators
   - Check that injected services are registered

4. **Circular Dependencies**
   - Use lazy injection with `LazyServiceIdentifer`
   - Refactor to remove circular dependency
   - Use factory pattern to break the cycle

### Debug Helpers

```typescript
// Check if service is registered
export function debugContainer() {
  const services = [
    'IPasswordService',
    'ITokenService',
    'IEmailService',
    'ILogger',
  ]
  
  services.forEach(token => {
    try {
      container.resolve(token)
      console.log(`✅ ${token} is registered`)
    } catch {
      console.log(`❌ ${token} is NOT registered`)
    }
  })
}

// List all registrations (requires internal access)
export function listRegistrations() {
  // This is a simplified example
  console.log('Registered services:', Object.keys(container))
}
```

## Migration Guide

If you're updating existing code to use the improved DI:

1. **Extract interfaces** from existing services
2. **Add @injectable()** decorator to service classes
3. **Update imports** to use interfaces instead of concrete classes
4. **Register services** in `container.ts`
5. **Replace direct instantiation** with DI resolution
6. **Update tests** to use mocked services

Example migration:

```typescript
// Before
import { PasswordService } from './password.service'

export class AuthResolver {
  private passwordService = new PasswordService()
  
  async signup(email: string, password: string) {
    const hash = await this.passwordService.hash(password)
    // ...
  }
}

// After
import { Services } from '@/app/config/service-registry'

export class AuthResolver {
  async signup(email: string, password: string) {
    const hash = await Services.password.hash(password)
    // ...
  }
}
```

## Conclusion

Dependency injection provides a powerful way to manage service dependencies in a large application. By following these patterns and best practices, you can create maintainable, testable, and flexible code that scales with your application's needs.