# Authentication Module

This module provides comprehensive authentication and authorization services for the GraphQL Auth application, including JWT token management, password hashing, login attempt tracking, and refresh token rotation.

## Features

- **JWT Authentication**: Access and refresh token generation and verification
- **Secure Password Hashing**: Argon2 password hashing with configurable parameters
- **Account Lockout Protection**: Configurable failed login attempt tracking and account lockout
- **Refresh Token Rotation**: Single-use refresh tokens with family-based revocation
- **Email Verification**: Token-based email verification system
- **Password Reset**: Secure password reset flow with time-limited tokens
- **GraphQL Integration**: Pothos resolvers with Shield authorization rules

## Architecture

```
modules/auth/
├── auth.resolver.ts              # Main GraphQL resolvers (signup, login, me, logout)
├── auth.rules.ts                 # Shield authorization rules
├── entities/
│   └── refresh-token.entity.ts   # RefreshToken domain entity
├── guards/
│   └── auth.guards.ts           # Authentication guard functions
├── interfaces/                   # Service interfaces for dependency injection
│   ├── login-attempt.service.interface.ts
│   ├── password.service.interface.ts
│   ├── refresh-token.repository.interface.ts
│   ├── token.service.interface.ts
│   └── verification-token.service.interface.ts
├── repositories/
│   └── refresh-token.repository.ts  # Refresh token persistence
├── services/                     # Business logic services
│   ├── argon2-password.service.ts    # Argon2 password hashing
│   ├── jwt.service.ts               # JWT utilities
│   ├── login-attempt.service.ts     # Login attempt tracking
│   ├── token.service.ts             # Token generation and management
│   └── verification-token.service.ts # Email verification and password reset
├── tests/
│   ├── integration/
│   │   └── auth.integration.test.ts  # End-to-end auth flow tests
│   └── permissions.test.ts          # Authorization rule tests
└── types/
    └── auth.types.ts               # TypeScript type definitions
```

## GraphQL API

### Mutations

```graphql
# User registration
mutation Signup {
  signup(email: "user@example.com", password: "securepass", name: "John Doe")
}

# User authentication
mutation Login {
  login(email: "user@example.com", password: "securepass")
}

# Token-based authentication (returns both access and refresh tokens)
mutation LoginWithTokens {
  loginWithTokens(email: "user@example.com", password: "securepass") {
    accessToken
    refreshToken
  }
}

# Refresh access token
mutation RefreshToken {
  refreshToken(refreshToken: "your-refresh-token") {
    accessToken
    refreshToken
  }
}

# User logout
mutation Logout {
  logout
}
```

### Queries

```graphql
# Get current user information (requires authentication)
query Me {
  me {
    id
    email
    name
    emailVerified
  }
}
```

## Core Services

### Password Service (`IPasswordService`)

Handles secure password hashing using Argon2:

```typescript
interface IPasswordService {
  hash(password: string): Promise<string>
  verify(password: string, hash: string): Promise<boolean>
  needsRehash?(hash: string): Promise<boolean>
}
```

**Implementation**: `Argon2PasswordService`
- Memory cost: 65536 KB (configurable)
- Time cost: 3 iterations (configurable)
- Parallelism: 4 threads (configurable)

### Token Service (`ITokenService`)

Manages JWT token generation and refresh token rotation:

```typescript
interface ITokenService {
  generateTokens(user: { id: number; email: string }): Promise<AuthTokens>
  verifyAccessToken(token: string): Promise<string | null>
  refreshTokens(refreshToken: string): Promise<AuthTokens>
  revokeAllTokens(userId: number): Promise<void>
}
```

**Features**:
- Access tokens: 1 hour expiration
- Refresh tokens: Single-use with family-based revocation
- Automatic token rotation on refresh

### Login Attempt Service (`ILoginAttemptService`)

Provides account lockout protection:

```typescript
interface ILoginAttemptService {
  recordAttempt(options: LoginAttemptOptions): Promise<LoginAttempt>
  isAccountLocked(email: string): Promise<{ locked: boolean; remainingMinutes?: number }>
  checkAccountLockout(email: string): Promise<void>
  clearFailedAttempts(email: string): Promise<number>
}
```

**Default Configuration**:
- Max attempts: 5 failed logins
- Lockout duration: 15 minutes
- Check window: 15 minutes

### Verification Token Service (`IVerificationTokenService`)

Handles email verification and password reset tokens:

```typescript
interface IVerificationTokenService {
  createEmailVerificationToken(userId: number): Promise<string>
  verifyEmailToken(token: string): Promise<VerificationResult>
  createPasswordResetToken(email: string): Promise<string>
  verifyPasswordResetToken(token: string): Promise<VerificationResult>
}
```

**Token Lifetimes**:
- Email verification: 24 hours
- Password reset: 1 hour

## Authorization Rules

The module provides Shield authorization rules in `auth.rules.ts`:

```typescript
// Basic authentication check
export const isAuthenticated = rule()(
  async (_parent, _args, context) => {
    return context.userId ? true : new AuthenticationError()
  }
)

// Admin role check
export const isAdmin = rule()(
  async (_parent, _args, context) => {
    // Implementation for admin role verification
  }
)
```

## Authentication Guards

Helper functions for resolver-level authentication:

```typescript
import { requireAuthentication, isAuthenticated } from './guards/auth.guards'

// In resolvers
const userId = requireAuthentication(context) // Throws if not authenticated
const isAuth = isAuthenticated(context)       // Returns boolean
```

## Usage Examples

### Basic Authentication Flow

```typescript
// 1. User registration
const signupResult = await gql.mutate(SignupMutation, {
  email: 'user@example.com',
  password: 'securepassword',
  name: 'John Doe'
})

// 2. User login
const loginResult = await gql.mutate(LoginMutation, {
  email: 'user@example.com',
  password: 'securepassword'
})

// 3. Access protected resources
const userResult = await gql.query(MeQuery, {}, {
  authorization: `Bearer ${loginResult.data.login}`
})
```

### Using Services Directly

```typescript
import { Services } from '@/app/config/service-registry'

// Hash a password
const hashedPassword = await Services.password.hash('userpassword')

// Generate tokens
const tokens = await Services.token.generateTokens({ 
  id: user.id, 
  email: user.email 
})

// Check account lockout
await Services.loginAttempt.checkAccountLockout('user@example.com')
```

## Extension Points

### Adding New Authentication Methods

1. **Create a new service interface** in `interfaces/`
2. **Implement the service** in `services/`
3. **Register in DI container** (`src/app/config/container.ts`)
4. **Add resolver methods** in `auth.resolver.ts`
5. **Create authorization rules** in `auth.rules.ts`

### Custom Password Hashing

To replace Argon2 with a different algorithm:

1. **Implement `IPasswordService`** interface
2. **Register new implementation** in container:
   ```typescript
   container.register<IPasswordService>(
     SERVICE_TOKENS.PASSWORD_SERVICE,
     { useClass: YourPasswordService }
   )
   ```

### Enhanced Account Lockout

Customize lockout behavior by extending `LoginAttemptService`:

```typescript
export class CustomLoginAttemptService extends LoginAttemptService {
  // Override methods to customize behavior
  async isAccountLocked(email: string) {
    // Custom lockout logic
  }
}
```

## Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-secret-key-here

# Password Hashing (Argon2)
ARGON2_MEMORY_COST=65536    # Memory cost in KB
ARGON2_TIME_COST=3          # Time cost (iterations)
ARGON2_PARALLELISM=4        # Number of threads

# Account Lockout (optional - defaults shown)
AUTH_MAX_ATTEMPTS=5         # Max failed login attempts
AUTH_LOCKOUT_DURATION=15    # Lockout duration in minutes
AUTH_CHECK_WINDOW=15        # Check window in minutes
```

### Service Registry Access

All auth services are available through the centralized service registry:

```typescript
import { Services } from '@/app/config/service-registry'

// Access any auth service
Services.password.hash(password)
Services.token.generateTokens(user)
Services.loginAttempt.recordAttempt(options)
Services.verificationToken.createEmailVerificationToken(userId)
```

## Security Considerations

- **JWT Secrets**: Use strong, randomly generated secrets in production
- **Password Complexity**: Enforce password complexity rules at the application level
- **Rate Limiting**: Auth mutations are rate-limited (see `src/graphql/schema/plugins/rate-limit.plugin.ts`)
- **Token Storage**: Store refresh tokens securely (httpOnly cookies recommended)
- **Account Enumeration**: Login responses don't reveal whether email exists
- **Timing Attacks**: Password verification uses constant-time comparison

## Testing

Run auth-specific tests:

```bash
# Integration tests
bun test src/modules/auth/tests/integration/

# Service unit tests
bun test src/modules/auth/services/

# Permission tests
bun test src/modules/auth/tests/permissions.test.ts
```

## Dependencies

- **argon2**: Password hashing
- **jsonwebtoken**: JWT token handling
- **tsyringe**: Dependency injection
- **@prisma/client**: Database access
- **graphql-shield**: Authorization rules 