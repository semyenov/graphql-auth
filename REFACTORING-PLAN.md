# File Structure Refactoring Implementation Plan

This document provides a detailed step-by-step plan to implement the improved modular file structure as outlined in `IMPROVED-FILE-STRUCTURE.md`.

## Overview

We will reorganize the codebase from the current mixed structure to a clean, modular architecture following these principles:
- Module-based organization by feature
- Clear separation of concerns
- Consistent naming patterns
- Improved test organization

## Implementation Phases

### Phase 1: Core Infrastructure Setup
**Goal**: Create the foundation directories and move shared infrastructure

#### Phase 1.1: Application Layer Setup
```bash
# Create app structure
mkdir -p src/app/config
mkdir -p src/app/middleware

# Move server files
mv src/server.ts src/app/server.ts
mv src/main.ts src/app/main.ts (if exists)

# Move and reorganize config
mv src/config/* src/app/config/
mv src/environment.ts src/app/config/environment.ts
```

**Files to create/move:**
- `src/app/server.ts` ← `src/server.ts`
- `src/app/config/index.ts` ← `src/config/index.ts`
- `src/app/config/database.ts` (new - extract from existing)
- `src/app/config/auth.ts` (new - extract from existing)
- `src/app/config/environment.ts` ← `src/environment.ts`

#### Phase 1.2: Core Utilities Setup
```bash
# Create core structure
mkdir -p src/core/auth
mkdir -p src/core/validation
mkdir -p src/core/errors
mkdir -p src/core/logging
mkdir -p src/core/utils

# Move error handling
mv src/errors/* src/core/errors/

# Move validation utilities
mv src/utils/validation.ts src/core/validation/
```

**Files to create/move:**
- `src/core/auth/types.ts` (new - consolidate auth types)
- `src/core/auth/tokens.ts` ← extract from existing token utils
- `src/core/auth/scopes.ts` ← `src/infrastructure/graphql/authorization/enhanced-scopes.ts`
- `src/core/auth/permissions.ts` ← extract from permissions
- `src/core/validation/schemas.ts` (new - common Zod schemas)
- `src/core/errors/types.ts` ← `src/errors/index.ts`
- `src/core/logging/logger.ts` ← `src/infrastructure/logging/*`

#### Phase 1.3: GraphQL Infrastructure
```bash
# Create graphql structure
mkdir -p src/graphql/schema/plugins
mkdir -p src/graphql/context
mkdir -p src/graphql/directives
mkdir -p src/graphql/middleware

# Move schema files
mv src/schema/* src/graphql/schema/

# Move context files
mv src/context/* src/graphql/context/
```

**Files to create/move:**
- `src/graphql/schema/builder.ts` ← `src/schema/builder.ts`
- `src/graphql/schema/index.ts` ← `src/schema/index.ts`
- `src/graphql/context/context.types.ts` ← `src/context/types.d.ts`
- `src/graphql/context/context.factory.ts` ← `src/context/creation.ts`

### Phase 2: Module Extraction
**Goal**: Extract feature-specific code into self-contained modules

#### Phase 2.1: Auth Module
```bash
# Create auth module
mkdir -p src/modules/auth

# Extract auth-related files
# This will involve creating new files and moving logic
```

**Files to create:**
- `src/modules/auth/auth.types.ts` - Auth-specific types
- `src/modules/auth/auth.schema.ts` - GraphQL schema definitions
- `src/modules/auth/auth.resolvers.ts` ← extract from existing resolvers
- `src/modules/auth/auth.service.ts` - Business logic
- `src/modules/auth/auth.validation.ts` - Input validation
- `src/modules/auth/auth.permissions.ts` - Authorization rules
- `src/modules/auth/auth.test.ts` ← consolidate auth tests

#### Phase 2.2: Posts Module
```bash
# Create posts module
mkdir -p src/modules/posts
```

**Files to create:**
- `src/modules/posts/posts.types.ts`
- `src/modules/posts/posts.schema.ts`
- `src/modules/posts/posts.resolvers.ts` ← `src/infrastructure/graphql/resolvers/posts.resolver.ts`
- `src/modules/posts/posts.service.ts`
- `src/modules/posts/posts.validation.ts`
- `src/modules/posts/posts.permissions.ts`
- `src/modules/posts/posts.test.ts` ← `test/posts.test.ts`

#### Phase 2.3: Users Module
```bash
# Create users module
mkdir -p src/modules/users
```

**Files to create:**
- `src/modules/users/users.types.ts`
- `src/modules/users/users.schema.ts`
- `src/modules/users/users.resolvers.ts` ← `src/infrastructure/graphql/resolvers/users.resolver.ts`
- `src/modules/users/users.service.ts`
- `src/modules/users/users.validation.ts`
- `src/modules/users/users.permissions.ts`
- `src/modules/users/users.test.ts` ← `test/user.test.ts`

#### Phase 2.4: Shared Module Utilities
```bash
# Create shared module utilities
mkdir -p src/modules/shared/pagination
mkdir -p src/modules/shared/filtering
mkdir -p src/modules/shared/connections
```

**Files to create:**
- `src/modules/shared/pagination/pagination.types.ts`
- `src/modules/shared/pagination/pagination.utils.ts`
- `src/modules/shared/filtering/filter.types.ts`
- `src/modules/shared/connections/relay.types.ts` ← `src/shared/infrastructure/graphql/relay-helpers.ts`

### Phase 3: Data Layer Consolidation
**Goal**: Organize data access patterns

```bash
# Create data structure
mkdir -p src/data/database
mkdir -p src/data/loaders
mkdir -p src/data/repositories
mkdir -p src/data/cache
```

**Files to create/move:**
- `src/data/database/client.ts` ← `src/prisma.ts`
- `src/data/loaders/index.ts` ← `src/infrastructure/graphql/dataloaders/loaders.ts`
- `src/data/loaders/user.loader.ts` (extract from existing)
- `src/data/loaders/post.loader.ts` (extract from existing)

### Phase 4: Test Reorganization
**Goal**: Mirror source structure in tests

```bash
# Create test structure
mkdir -p test/modules/auth
mkdir -p test/modules/posts
mkdir -p test/modules/users
mkdir -p test/core/auth
mkdir -p test/core/validation
mkdir -p test/core/errors
mkdir -p test/utils/factories
mkdir -p test/utils/fixtures
mkdir -p test/utils/helpers
mkdir -p test/utils/mocks
mkdir -p test/performance
mkdir -p test/setup
```

**Files to reorganize:**
- `test/modules/auth/auth.integration.test.ts` ← `test/auth.test.ts`
- `test/modules/posts/posts.integration.test.ts` ← `test/posts.test.ts`
- `test/modules/users/users.integration.test.ts` ← `test/user.test.ts`
- `test/utils/factories/user.factory.ts` (extract from test-utils)
- `test/utils/helpers/database.helpers.ts` ← `test/test-utils.ts`

### Phase 5: Import Updates and Cleanup
**Goal**: Update all imports and remove legacy files

#### Import Update Strategy
1. **Create import mapping file** to track old → new paths
2. **Use find/replace** to update imports systematically
3. **Update package.json scripts** if needed
4. **Remove empty directories** and legacy files

#### Import Mapping Examples
```typescript
// Old → New mappings
'../errors' → '../../core/errors'
'../context/enhanced-context-direct' → '../../graphql/context/context.types'
'../infrastructure/graphql/resolvers' → '../../modules/{module}/{module}.resolvers'
'../prisma' → '../../data/database/client'
```

### Phase 6: Validation and Testing
**Goal**: Ensure everything works after restructuring

1. **Run TypeScript compiler** to check for import errors
2. **Run all tests** to ensure functionality is preserved
3. **Update documentation** to reflect new structure
4. **Update build scripts** if necessary

## Risk Mitigation

### Backup Strategy
1. **Create branch** before starting refactoring
2. **Commit frequently** after each phase
3. **Run tests** after each major change

### Incremental Approach
1. **One phase at a time** - complete each phase fully before moving to next
2. **Keep old files** until new structure is proven to work
3. **Update imports gradually** - test after each module extraction

### Testing Strategy
1. **Run tests after each phase** to catch issues early
2. **Create integration tests** for module boundaries
3. **Verify GraphQL schema** still generates correctly

## Success Criteria

✅ **Phase 1 Complete**: Core infrastructure properly organized  
✅ **Phase 2 Complete**: All features extracted to modules  
✅ **Phase 3 Complete**: Data layer consolidated  
✅ **Phase 4 Complete**: Tests mirror source structure  
✅ **Phase 5 Complete**: All imports updated, legacy files removed  
✅ **Phase 6 Complete**: All tests passing, documentation updated  

## Expected Benefits After Implementation

1. **Improved Maintainability**: Clear module boundaries
2. **Better Developer Experience**: Predictable file locations
3. **Enhanced Scalability**: Easy to add new features
4. **Clearer Testing**: Organized test structure
5. **Team Collaboration**: Clear ownership of modules

## Timeline Estimation

- **Phase 1**: 2-3 hours (infrastructure setup)
- **Phase 2**: 4-6 hours (module extraction)
- **Phase 3**: 1-2 hours (data layer)
- **Phase 4**: 2-3 hours (test reorganization)
- **Phase 5**: 2-4 hours (import updates)
- **Phase 6**: 1-2 hours (validation)

**Total Estimated Time**: 12-20 hours

This refactoring will significantly improve the codebase organization and set a solid foundation for future development!