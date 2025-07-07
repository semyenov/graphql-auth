# Module Interface Boundaries

## Overview

The **Module Interface Boundaries** pattern ensures that modules only expose well-defined public APIs while hiding internal implementation details. This is implemented using the **Facade Pattern** where each module has a single entry point that controls access to its functionality.

## 🎯 Goals

1. **Encapsulation**: Hide internal module complexity behind simple interfaces
2. **Controlled Access**: Prevent direct access to internal module files
3. **Stable APIs**: Provide consistent interfaces that don't change frequently
4. **Explicit Dependencies**: Make inter-module dependencies clearly visible
5. **Migration Readiness**: Prepare modules for potential extraction as microservices

## 📁 Module Facade Structure

Each module exposes its public API through a `[module-name].module.ts` file:

```
src/modules/
├── auth/
│   ├── auth.module.ts          # ← Public API facade (ONLY import point)
│   ├── services/               # ← Internal implementation (hidden)
│   ├── repositories/           # ← Internal implementation (hidden)
│   └── utils/                  # ← Internal implementation (hidden)
├── posts/
│   ├── posts.module.ts         # ← Public API facade (ONLY import point)
│   └── ...                     # ← Internal implementation (hidden)
└── users/
    ├── users.module.ts         # ← Public API facade (ONLY import point)
    └── ...                     # ← Internal implementation (hidden)
```

## 🔒 Import Rules

### ✅ ALLOWED: Import from module facades

```typescript
// ✅ CORRECT: Import from public module API
import { AuthModule, validateEmail, isAuthenticated } from '@/modules/auth/auth.module'
import { PostsModule, POST_CONSTANTS } from '@/modules/posts/posts.module'
import { UsersModule, USER_CONSTANTS } from '@/modules/users/users.module'
import { SharedModule, prisma, ILogger } from '@/modules/shared/shared.module'
```

### ❌ FORBIDDEN: Import from internal module files

```typescript
// ❌ WRONG: Direct import from internal files
import { TokenService } from '@/modules/auth/services/token.service'
import { PostRepository } from '@/modules/posts/repositories/post.repository'
import { validatePassword } from '@/modules/auth/utils/validation'
```

## 📋 What Each Facade Exposes

### Auth Module (`auth.module.ts`)

```typescript
// Types (public API only)
export type { AuthTokens, AuthResponse, AuthRole }

// Constants (module-specific)
export { AUTH_CONSTANTS, AUTH_ERROR_MESSAGES, ROLE_HIERARCHY }

// Validation utilities (public helpers)
export { validateEmail, validatePassword, validateAuthCredentials }

// Authentication guards (public helpers)
export { isAuthenticated, requireAuthentication, hasRole, hasPermission }

// Client interface (inter-module communication)
export type { IAuthClient, AuthModuleEvents }

// Health check (operational)
export { getAuthModuleHealth }

// Module metadata (introspection)
export { AuthModule }
```

### Posts Module (`posts.module.ts`)

```typescript
// Constants (module-specific)
export { POST_CONSTANTS, POST_ERROR_MESSAGES, POST_STATUS }

// Types from constants
export type { PostStatus, PostOrderBy, PostErrorMessage }

// Client interface (inter-module communication)
export type { IPostsClient, PostsModuleEvents }

// Health check (operational)
export { getPostsModuleHealth }

// Module metadata (introspection)
export { PostsModule }

// Note: GraphQL types are automatically available through schema
```

### Users Module (`users.module.ts`)

```typescript
// Constants (module-specific)
export { USER_CONSTANTS, USER_ERROR_MESSAGES, USER_STATUS, USER_ROLES }

// Types from constants
export type { UserRole, UserStatus, UserOrderBy }

// Client interface (inter-module communication)
export type { IUsersClient, UsersModuleEvents }

// Health check (operational)
export { getUsersModuleHealth }

// Module metadata (introspection)
export { UsersModule }
```

### Shared Module (`shared.module.ts`)

```typescript
// Infrastructure interfaces (safe to share)
export type { ILogger, LogLevel, IRateLimiterService }

// Database client (infrastructure level)
export { prisma }

// Relay utilities (GraphQL infrastructure)
export { encodeGlobalId, decodeGlobalId, fromGlobalId }

// Common types (infrastructure level)
export type { Connection, Edge, PageInfo, CursorPaginationArgs }
export type { StringFilter, NumberFilter, DateFilter }

// Rate limiter presets (infrastructure level)
export { RateLimitPresets }

// Client interface (inter-module communication)
export type { ISharedClient, SharedModuleEvents }

// Health check (operational)
export { getSharedModuleHealth }

// Module metadata (introspection)
export { SharedModule }
```

## 🚫 What Facades DO NOT Expose

### Internal Services
```typescript
// ❌ NOT EXPOSED: Internal business logic
TokenService, PasswordService, PostService, UserService
```

### Internal Repositories
```typescript
// ❌ NOT EXPOSED: Data access implementations
AuthDataRepository, PostRepository, UserRepository
```

### Internal Utilities
```typescript
// ❌ NOT EXPOSED: Implementation utilities
// These should be copied from boilerplate, not imported
```

### GraphQL Resolvers
```typescript
// ❌ NOT EXPOSED: GraphQL implementation details
AuthResolver, PostResolver, UserResolver
// Note: GraphQL types are available through schema, not direct imports
```

## 🔄 Inter-Module Communication

Modules communicate through **three approved channels**:

### 1. Client Interfaces (Programmatic)
```typescript
// Use dependency injection to get module clients
const authClient = container.resolve<IAuthClient>('AuthClient')
const userClient = container.resolve<IUsersClient>('UsersClient')

// Call methods through client interface
const user = await authClient.getCurrentUser(token)
const profile = await userClient.getUserProfile(userId)
```

### 2. Event-Driven (Async)
```typescript
// Publish events for async communication
moduleBus.publish('user.registered', { userId, email })
moduleBus.publish('post.published', { postId, authorId })

// Subscribe to events from other modules
moduleBus.subscribe('auth.user.verified', async (event) => {
  // Handle user verification in posts module
})
```

### 3. GraphQL API (External)
```typescript
// Use GraphQL operations for complex queries
const GET_USER_POSTS = graphql(`
  query GetUserPosts($userId: ID!) {
    user(id: $userId) {
      posts {
        id
        title
        published
      }
    }
  }
`)
```

## 🏥 Health Checks

Each module provides health check functionality:

```typescript
import { getAuthModuleHealth } from '@/modules/auth/auth.module'
import { getPostsModuleHealth } from '@/modules/posts/posts.module'

// Check individual module health
const authHealth = await getAuthModuleHealth()
console.log(authHealth.status) // 'healthy' | 'degraded' | 'unhealthy'

// Check dependencies
console.log(authHealth.dependencies.database) // boolean
console.log(authHealth.dependencies.tokenService) // boolean
```

## 📊 Module Metadata

Each module exposes metadata for introspection:

```typescript
import { AuthModule, PostsModule } from '@/modules/auth/auth.module'

console.log(AuthModule.name)            // 'auth'
console.log(AuthModule.version)         // '1.0.0'
console.log(AuthModule.capabilities)    // ['user-authentication', 'jwt-tokens', ...]
console.log(AuthModule.dependencies)    // ['shared.logger', 'shared.database', ...]
console.log(AuthModule.graphqlResolvers) // ['signup', 'login', 'logout', ...]
```

## 🔧 Implementation Guidelines

### Creating a Module Facade

1. **Create the facade file** - `[module-name].module.ts`
2. **Re-export public types** - Only types that other modules need
3. **Re-export constants** - Module-specific constants that others might use
4. **Re-export utilities** - Public helper functions (validation, guards, etc.)
5. **Export client interface** - For inter-module communication
6. **Export health check** - For operational monitoring
7. **Export module metadata** - For introspection
8. **Freeze the module object** - Prevent modification

### Example Module Facade Template

```typescript
/**
 * [Module] Module - Public API Facade
 * 
 * This file defines the ONLY way other modules can interact with this module.
 * It implements the facade pattern to enforce strict module boundaries.
 * 
 * ⚠️ Other modules MUST only import from this file, never from internal files.
 */

// Re-export client interface
export type { I[Module]Client, [Module]ModuleEvents } from './client/[module].client.interface'

// Re-export public constants
export { [MODULE]_CONSTANTS, [MODULE]_ERROR_MESSAGES } from './constants'

// Re-export public types
export type { [Module]Status, [Module]Role } from './constants'

// Re-export public utilities (if any)
export { validate[Module]Input } from './utils/validation'

// Health check interface
export interface [Module]ModuleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  dependencies: Record<string, boolean>
  lastChecked: Date
}

// Health check function
export async function get[Module]ModuleHealth(): Promise<[Module]ModuleHealth> {
  // Implementation
}

// Module metadata
export const [Module]Module = {
  name: '[module]',
  version: '1.0.0',
  description: '[Module] management module',
  capabilities: [],
  dependencies: [],
  graphqlResolvers: []
} as const

Object.freeze([Module]Module)
```

## 🛡️ Enforcement Mechanisms

### 1. ESLint Rules (Future)
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "@/modules/*/services/*",
          "@/modules/*/repositories/*", 
          "@/modules/*/utils/*",
          "!@/modules/*/*.module"
        ]
      }
    ]
  }
}
```

### 2. TypeScript Path Mapping
```json
{
  "compilerOptions": {
    "paths": {
      "@/modules/auth": ["src/modules/auth/auth.module.ts"],
      "@/modules/posts": ["src/modules/posts/posts.module.ts"],
      "@/modules/users": ["src/modules/users/users.module.ts"],
      "@/modules/shared": ["src/modules/shared/shared.module.ts"]
    }
  }
}
```

### 3. Build-Time Validation
```typescript
// scripts/validate-module-boundaries.ts
// Check that no files import from internal module directories
```

## 📈 Benefits

### 1. **Clear Boundaries**
- Explicit public APIs for each module
- Hidden implementation details
- Controlled inter-module dependencies

### 2. **Better Testing**
- Mock module facades instead of internal services
- Test modules in isolation
- Clear interfaces make testing easier

### 3. **Easier Refactoring**
- Internal changes don't affect other modules
- Stable public APIs reduce breaking changes
- Clear upgrade paths for API changes

### 4. **Migration Readiness**
- Modules are self-contained with clear interfaces
- Easy to extract as microservices
- Well-defined communication patterns

### 5. **Team Coordination**
- Clear ownership boundaries
- Explicit contracts between teams
- Reduced coordination overhead

## 🔄 Migration Strategy

### Phase 1: Create Facades
- [ ] Create module facade files
- [ ] Define public APIs
- [ ] Export necessary types and utilities

### Phase 2: Update Imports
- [ ] Update all inter-module imports to use facades
- [ ] Remove direct imports from internal files
- [ ] Test that everything still works

### Phase 3: Enforce Boundaries
- [ ] Add ESLint rules to prevent direct imports
- [ ] Update TypeScript path mapping
- [ ] Add build-time validation

### Phase 4: Documentation & Training
- [ ] Document facade patterns
- [ ] Train team on new import rules
- [ ] Create migration guides for future modules

This pattern transforms the codebase into a collection of well-encapsulated modules with clear boundaries, making it easier to maintain, test, and potentially extract into separate services.

# Module Interface Boundaries - Enforcement Rules

## Overview

This document establishes strict rules for module visibility and inter-module communication in our modular monolith architecture. These rules ensure modules remain loosely coupled and ready for potential microservice extraction.

## Core Principles

### 1. Interface-Only Communication
Modules MUST communicate only through their published client interfaces, never through direct imports of internal implementations.

### 2. Facade Pattern Enforcement
Each module exposes a single facade file (`[module].module.ts`) that defines the complete public API.

### 3. Explicit Dependencies
All inter-module dependencies must be declared in `dependencies.json` files and enforced at build time.

## Module Visibility Rules

### ✅ ALLOWED Imports

1. **Module Facade Only**
   ```typescript
   // ✅ GOOD - Through module facade
   import type { IAuthClient } from '@/modules/auth/auth.module'
   import type { IUsersClient } from '@/modules/users/users.module'
   import type { ISharedClient } from '@/modules/shared/shared.module'
   ```

2. **Type-Only Imports**
   ```typescript
   // ✅ GOOD - Type-only imports from client interfaces
   import type { AuthUser, AuthTokens } from '@/modules/auth/client/auth.client.interface'
   ```

3. **Infrastructure Interfaces**
   ```typescript
   // ✅ GOOD - Shared infrastructure interfaces
   import type { ILogger } from '@/modules/shared/interfaces/logger.interface'
   ```

### ❌ FORBIDDEN Imports

1. **Direct Internal Access**
   ```typescript
   // ❌ BAD - Direct access to internal services
   import { TokenService } from '@/modules/auth/services/token.service'
   import { UserService } from '@/modules/users/services/user.service'
   ```

2. **Cross-Module Implementation Details**
   ```typescript
   // ❌ BAD - Accessing other module's internals
   import { validatePassword } from '@/modules/auth/utils/validation'
   import { formatUserName } from '@/modules/users/utils/formatting'
   ```

3. **Direct Database Access from Other Modules**
   ```typescript
   // ❌ BAD - Database should be accessed through shared module facade
   import { prisma } from '@/modules/shared/database/prisma'
   ```

## Module Structure Enforcement

### Required Module Structure
```
modules/[module]/
├── [module].module.ts           # 🔒 FACADE - Single public entry point
├── client/
│   └── [module].client.interface.ts  # 📝 CLIENT INTERFACE
├── dependencies.json            # 📋 DEPENDENCY DECLARATION
├── [module].resolver.ts         # 🔒 INTERNAL - GraphQL resolvers
├── [module].rules.ts           # 🔒 INTERNAL - Authorization rules
├── services/                   # 🔒 INTERNAL - Business logic
├── repositories/               # 🔒 INTERNAL - Data access
├── interfaces/                 # 🔒 INTERNAL - Service interfaces
├── types/                      # 🔒 INTERNAL - Domain types
├── utils/                      # 🔒 INTERNAL - Module utilities
├── guards/                     # 🔒 INTERNAL - Auth guards
└── tests/                      # 🔒 INTERNAL - Tests
```

### Import Rules by File Type

#### 1. Module Facades (`[module].module.ts`)
```typescript
// ✅ ALLOWED
export type { IModuleClient } from './client/module.client.interface'
export { moduleConstants } from './constants'
export { getModuleHealth } from './health'

// ❌ FORBIDDEN
export { InternalService } from './services/internal.service'
export * from './repositories/'
```

#### 2. Client Interfaces (`client/[module].client.interface.ts`)
```typescript
// ✅ ALLOWED - Only types and interfaces
export interface IModuleClient { /* ... */ }
export interface ModuleEvents { /* ... */ }
export class ModuleClientError extends Error { /* ... */ }

// ❌ FORBIDDEN - No implementations
export class ConcreteService implements IModuleClient { /* ... */ }
```

#### 3. Internal Files (resolvers, services, etc.)
```typescript
// ✅ ALLOWED - Same module imports
import { validateInput } from './utils/validation'
import type { IModuleService } from './interfaces/module.service.interface'

// ✅ ALLOWED - Other module facades
import type { IAuthClient } from '@/modules/auth/auth.module'

// ❌ FORBIDDEN - Other module internals
import { AuthService } from '@/modules/auth/services/auth.service'
```

## Violation Detection

### 1. Automated Linting Rules

Create `.eslintrc.module-boundaries.js`:
```javascript
module.exports = {
  rules: {
    // Prevent cross-module internal imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/modules/*/services/*', '!@/modules/shared/services/*'],
            message: 'Do not import services directly from other modules. Use client interfaces.'
          },
          {
            group: ['@/modules/*/repositories/*'],
            message: 'Do not import repositories from other modules. Use client interfaces.'
          },
          {
            group: ['@/modules/*/utils/*', '!@/modules/shared/utils/*'],
            message: 'Do not import utilities from other modules. Copy to your module or use client interface.'
          },
          {
            group: ['@/modules/*/types/*'],
            message: 'Import types through module facades or client interfaces only.'
          }
        ]
      }
    ]
  }
}
```

### 2. Architecture Tests

Create `test/architecture/module-boundaries.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { analyzeModuleDependencies } from './utils/dependency-analyzer'

describe('Module Boundary Enforcement', () => {
  it('should not have direct cross-module imports', async () => {
    const violations = await analyzeModuleDependencies()
    expect(violations).toHaveLength(0)
  })

  it('should only import through module facades', async () => {
    const moduleImports = await getModuleImports()
    for (const [module, imports] of moduleImports) {
      for (const importPath of imports) {
        if (importPath.startsWith('@/modules/') && !importPath.endsWith('.module')) {
          expect(importPath).toMatch(/\.(module|client\.interface)$/)
        }
      }
    }
  })
})
```

### 3. Build-Time Validation

Create `scripts/validate-module-boundaries.ts`:
```typescript
#!/usr/bin/env tsx

import { validateModuleBoundaries } from './utils/boundary-validator'

async function main() {
  const violations = await validateModuleBoundaries()
  
  if (violations.length > 0) {
    console.error('❌ Module boundary violations detected:')
    for (const violation of violations) {
      console.error(`  ${violation.file}: ${violation.message}`)
    }
    process.exit(1)
  }
  
  console.log('✅ All module boundaries are properly enforced')
}

main().catch(console.error)
```

## Current Violations and Migration Plan

### Phase 1: Infrastructure Cleanup
1. **Container Configuration**: Move to interface-based registration only
2. **GraphQL Schema**: Access modules through facades only
3. **Test Setup**: Use module facades in test utilities

### Phase 2: Direct Database Access
1. **Prisma Access**: Only through shared module facade
2. **DataLoader Access**: Through shared module client interface
3. **Connection Utilities**: Through shared module exports

### Phase 3: Service Layer Isolation
1. **Service Imports**: Replace with client interface calls
2. **Utility Functions**: Copy to module scope or use shared client
3. **Type Imports**: Through client interfaces only

### Migration Commands

```bash
# 1. Install boundary checker
npm install --save-dev eslint-plugin-boundaries

# 2. Run boundary analysis
npm run analyze:boundaries

# 3. Fix automatic violations
npm run fix:boundaries

# 4. Validate boundaries
npm run validate:boundaries
```

## Enforcement Timeline

### Week 1: Detection and Documentation
- [x] Document boundary rules
- [x] Create violation detection tools
- [ ] Analyze current violations
- [ ] Create migration plan

### Week 2: Infrastructure Layer
- [ ] Fix container configuration
- [ ] Update GraphQL schema assembly
- [ ] Clean up test utilities

### Week 3: Service Layer
- [ ] Replace service imports with client calls
- [ ] Migrate utility functions
- [ ] Update type imports

### Week 4: Validation and Testing
- [ ] Enable automated boundary checking
- [ ] Add CI/CD validation
- [ ] Document compliance

## Benefits of Enforcement

1. **Loose Coupling**: Modules become truly independent
2. **Migration Ready**: Clean boundaries enable microservice extraction
3. **Team Autonomy**: Teams can work on modules independently
4. **Reduced Coordination**: Changes in one module don't break others
5. **Better Testing**: Modules can be tested in complete isolation

## Exception Handling

### Temporary Violations
For legacy code that cannot be immediately migrated:
```typescript
// eslint-disable-next-line no-restricted-imports
import { LegacyService } from '@/modules/other/services/legacy.service'
// TODO: Replace with client interface by [DATE]
```

### Documentation Requirements
All exceptions must include:
1. **Reason**: Why the exception is necessary
2. **Timeline**: When it will be fixed
3. **Migration Plan**: How it will be resolved
4. **Owner**: Who is responsible for the fix

## Monitoring and Compliance

### Automated Checks
- **Pre-commit hooks**: Prevent boundary violations
- **CI/CD pipeline**: Block merges with violations
- **Dependency analysis**: Track module coupling metrics
- **Architecture tests**: Ensure boundaries remain intact

### Manual Reviews
- **Architecture review**: Monthly boundary compliance check
- **Code review**: Boundary violation detection
- **Migration tracking**: Progress on violation remediation 