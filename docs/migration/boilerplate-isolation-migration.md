# Boilerplate Isolation Migration Guide

## Overview

This guide explains how to migrate modules from direct shared imports to the **boilerplate isolation pattern**, which is a key principle of modular monolith architecture.

## 🎯 Goal

Transform modules from **tight coupling** through shared imports to **loose coupling** through copied utilities.

```typescript
// ❌ BEFORE: Tight coupling through direct imports
import { validateEmail } from '@/modules/shared/validation'
import { prisma } from '@/modules/shared/database'

// ✅ AFTER: Loose coupling through copied utilities
import { validateEmail } from './utils/validation' // Copied from boilerplate
import { prisma } from './utils/database' // Module-specific database client
```

## 📋 Migration Checklist

### Phase 1: Audit Current Dependencies

1. **Identify Direct Imports** - Find all direct imports from shared modules
2. **Categorize Dependencies** - Group by type (validation, database, security, etc.)
3. **Assess Coupling Risk** - Determine which imports create the most coupling

### Phase 2: Copy Boilerplate Utilities

1. **Create Module Utils Directory** - `modules/[module]/utils/`
2. **Copy Required Utilities** - From `modules/shared/boilerplate/`
3. **Adapt to Module Needs** - Modify copied code for specific requirements
4. **Update Module Imports** - Change imports to use local utilities

### Phase 3: Test and Validate

1. **Run Module Tests** - Ensure functionality remains intact
2. **Test in Isolation** - Verify module can work independently
3. **Performance Check** - Confirm no performance degradation

## 🔄 Step-by-Step Migration Process

### Step 1: Identify Current Shared Imports

Run this command to find all shared imports in a module:

```bash
# Find shared imports in auth module
grep -r "from '@/modules/shared" src/modules/auth/
```

Example output:
```
src/modules/auth/auth.resolver.ts:import { prisma } from '@/modules/shared/database'
src/modules/auth/services/token.service.ts:import { ILogger } from '@/modules/shared/interfaces/logger.interface'
```

### Step 2: Create Module Utils Structure

```bash
# Create utils directory for the module
mkdir -p src/modules/auth/utils
mkdir -p src/modules/posts/utils
mkdir -p src/modules/users/utils
```

### Step 3: Copy and Adapt Boilerplate Code

#### Example: Auth Module Validation

**Before** (direct import):
```typescript
// src/modules/auth/auth.resolver.ts
import { validateEmail, validatePassword } from '@/modules/shared/validation'
```

**After** (copied boilerplate):
```typescript
// src/modules/auth/utils/validation.ts
/**
 * Copied from shared/boilerplate/validation/common-validation.ts
 * Version: 1.0.0 (adapted for auth module)
 */

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  // ... copied and adapted implementation
  
  // Auth module specific: Check for common passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'admin']
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more secure password.')
  }
  
  return { valid: errors.length === 0, errors }
}
```

**Update resolver import**:
```typescript
// src/modules/auth/auth.resolver.ts
import { validateEmail, validatePassword } from './utils/validation'
```

### Step 4: Handle Database Access

#### Before (shared database):
```typescript
import { prisma } from '@/modules/shared/database'
```

#### After (module-specific database utilities):
```typescript
// src/modules/auth/utils/database.ts
import { PrismaClient } from '@prisma/client'

// Create module-specific database client (if needed)
// Or copy common database patterns from boilerplate
export async function findUserByEmail(email: string) {
  // Implementation copied from shared/boilerplate/database/query-patterns.ts
  // and adapted for auth module needs
}
```

### Step 5: Update All Module Files

Go through each file in the module and replace shared imports:

```typescript
// ❌ Remove these imports
import { validateEmail } from '@/modules/shared/validation'
import { rateLimiter } from '@/modules/shared/services/rate-limiter.service'

// ✅ Replace with local imports
import { validateEmail } from './utils/validation'
import { rateLimiter } from './utils/rate-limiting'
```

## 📁 Module-Specific Implementation Examples

### Auth Module Structure
```
src/modules/auth/
├── utils/                    # Copied and adapted utilities
│   ├── validation.ts         # Email, password, token validation
│   ├── hashing.ts           # Password hashing utilities
│   ├── tokens.ts            # JWT token generation/verification
│   ├── rate-limiting.ts     # Auth-specific rate limiting
│   └── database.ts          # Auth database query patterns
├── auth.resolver.ts         # Uses local utils
├── services/
└── types/
```

### Posts Module Structure
```
src/modules/posts/
├── utils/                    # Different utilities for posts domain
│   ├── validation.ts         # Post content validation
│   ├── formatting.ts         # Content formatting utilities
│   ├── filtering.ts          # Post search/filter utilities
│   └── database.ts          # Post database patterns
├── post.resolver.ts         # Uses local utils
├── services/
└── types/
```

## ⚠️ Migration Considerations

### What to Copy vs. What to Keep Shared

#### ✅ Copy These (High Coupling Risk):
- **Validation utilities** - Often need domain-specific adaptations
- **Database query patterns** - Different modules have different data access needs
- **Formatting utilities** - Different modules format data differently
- **Security helpers** - May need module-specific security rules

#### ❌ Keep These Shared (Low Coupling Risk):
- **Database client instance** - Single connection pool is efficient
- **Logger interface** - Standard logging interface is beneficial
- **Core types** - Basic TypeScript types can remain shared
- **Configuration constants** - Infrastructure-level config should be centralized

### Breaking Changes to Expect

1. **Import Statement Updates** - All imports need to be updated
2. **Different Utility Signatures** - Copied utilities may have different APIs
3. **Testing Updates** - Tests need to mock local utilities instead of shared ones
4. **Build Process Changes** - Module builds become more independent

### Handling Prisma Database Access

Special consideration for database access patterns:

```typescript
// Option 1: Keep shared Prisma client, copy query patterns
import { prisma } from '@/modules/shared/database'
import { findUserById } from './utils/database' // Copied query pattern

// Option 2: Module-specific database utilities
import { authDatabase } from './utils/database' // Module-specific client wrapper
```

## 🧪 Testing the Migration

### 1. Module Isolation Test
```bash
# Test if module can be built in isolation
cd src/modules/auth
npm run build # Should work without shared dependencies
```

### 2. Functionality Tests
```bash
# Run module-specific tests
npm test src/modules/auth/
```

### 3. Integration Tests
```bash
# Run full integration tests
npm test src/modules/auth/tests/integration/
```

## 📊 Benefits After Migration

### ✅ Achieved Benefits

1. **True Module Isolation** - Modules are self-contained
2. **Independent Evolution** - Modules can evolve utilities independently
3. **Migration Readiness** - Modules ready for microservice extraction
4. **Reduced Coordination** - Teams don't need to coordinate on shared utilities
5. **Better Testing** - Modules can be tested in complete isolation

### 📈 Measurable Improvements

- **Coupling Reduction**: Module dependencies become explicit
- **Build Independence**: Modules can build without shared dependencies
- **Test Isolation**: Module tests don't require shared module setup
- **Code Ownership**: Clear ownership of utilities within modules

## 🔄 Maintenance After Migration

### Regular Tasks

1. **Monitor Boilerplate Updates** - Check for security fixes in shared boilerplate
2. **Update Copied Code** - Manually apply important updates to copied utilities
3. **Module-Specific Adaptations** - Continue evolving copied utilities for module needs
4. **Documentation Updates** - Keep track of which utilities were copied from where

### Evolution Strategy

1. **Start Small** - Begin with one module (e.g., auth)
2. **Learn and Adapt** - Refine the process based on initial experience
3. **Apply to Other Modules** - Roll out to remaining modules
4. **Continuous Improvement** - Keep improving the boilerplate isolation pattern

## 📝 Migration Timeline

### Phase 1 (Week 1-2): Foundation
- [ ] Audit all shared dependencies
- [ ] Create boilerplate directory structure
- [ ] Implement boilerplate utilities

### Phase 2 (Week 3-4): Auth Module Migration
- [ ] Copy validation utilities to auth module
- [ ] Copy security utilities to auth module
- [ ] Update all auth module imports
- [ ] Test auth module in isolation

### Phase 3 (Week 5-6): Other Modules
- [ ] Migrate posts module
- [ ] Migrate users module
- [ ] Migrate OIDC module

### Phase 4 (Week 7-8): Validation & Cleanup
- [ ] Full integration testing
- [ ] Performance validation
- [ ] Documentation updates
- [ ] Team training on new patterns

This migration transforms the codebase into a true modular monolith with isolated, self-contained modules ready for independent evolution or future microservice extraction. 