# Module Boundary Fix Report

Generated: 2025-07-07T05:41:36.893Z

## Summary

- **Total Violations**: 15
- **Auto-Fixed**: 0
- **Manual Fixes Required**: 15

## Auto-Fixed Violations



## Manual Fixes Required


### 🛠️ cross-module-internal

- **File**: `src/modules/users/user.types.ts:2`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/users/user.resolver.ts:17`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/auth/auth.resolver.ts:24`
- **Original**: `import { RateLimitPresets } from '@/modules/shared/services/rate-limiter.service'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/auth/auth.resolver.ts:23`
- **Original**: `import { isAuthenticatedUser } from '@/modules/shared/rules/common.rules'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/auth/auth.resolver.ts:22`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/oidc/oidc.types.ts:2`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/oidc/oidc.resolver.ts:4`
- **Original**: `import { isAdmin } from '@/modules/shared/rules/common.rules'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/oidc/oidc.resolver.ts:3`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/posts/post.resolver.ts:17`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/posts/post.rules.ts:10`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/auth/services/verification-token.service.ts:15`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/auth/services/login-attempt.service.ts:15`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/auth/repositories/auth-data.repository.ts:16`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/oidc/services/prisma-adapter.service.ts:3`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



### 🛠️ cross-module-internal

- **File**: `src/modules/oidc/services/oidc-provider.service.ts:8`
- **Original**: `import { prisma } from '@/modules/shared/database'`
- **Action Required**: Manual fix required - Use module facade: '@/modules/shared/shared.module'



## Next Steps

1. **Review Auto-Fixes**: Verify that auto-fixed imports work correctly
2. **Manual Fixes**: Address remaining violations using the guidance above
3. **Validate**: Run `npm run validate:boundaries` to confirm all fixes
4. **Test**: Ensure all tests still pass after boundary changes

## Common Manual Fix Patterns

### Service Dependencies
Replace direct service imports with dependency injection:
```typescript
// Before
import { AuthService } from '@/modules/auth/services/auth.service'

// After
constructor(
  @inject('IAuthClient') private authClient: IAuthClient
) {}
```

### Database Access
Use shared module facade instead of direct database imports:
```typescript
// Before
import { prisma } from '@/modules/shared/database/prisma'

// After
import { SharedModule } from '@/modules/shared/shared.module'
// Use SharedModule.getDatabaseClient() in your service
```

### Type Imports
Import types through client interfaces:
```typescript
// Before
import type { AuthUser } from '@/modules/auth/types/auth.types'

// After
import type { AuthUser } from '@/modules/auth/client/auth.client.interface'
```
