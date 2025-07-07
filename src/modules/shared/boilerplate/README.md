# Shared Boilerplate - Isolation Pattern

## Overview

This directory contains **boilerplate utilities** that modules should **copy** rather than import directly. This follows the modular monolith isolation pattern where shared code creates coupling risks.

## ⚠️ IMPORTANT: Copy, Don't Import

**DO NOT** import directly from this directory. Instead, copy the utilities you need into your module's local scope.

```typescript
// ❌ BAD - Creates tight coupling
import { validateEmail } from '@/modules/shared/boilerplate/validation'

// ✅ GOOD - Copy into your module
// modules/auth/utils/validation.ts
export function validateEmail(email: string): boolean {
  // Copied implementation from shared boilerplate
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

## Why Copy Instead of Import?

Based on modular monolith best practices:

1. **Prevents Tight Coupling**: Direct imports create hidden dependencies
2. **Enables Evolution**: Each module can modify utilities to fit its needs
3. **Supports Migration**: Modules become self-contained for future extraction
4. **Reduces Breaking Changes**: Shared utility changes don't break multiple modules
5. **Improves Testability**: Modules can be tested in complete isolation

## Boilerplate Categories

### Core Utilities
- `validation/` - Common validation patterns
- `formatting/` - String and data formatting
- `datetime/` - Date manipulation utilities
- `encoding/` - Encoding/decoding helpers

### Database Patterns
- `database/` - Common query patterns
- `pagination/` - Pagination logic templates
- `filtering/` - Filter transformation patterns

### Security Patterns
- `security/` - Authentication helpers
- `hashing/` - Password hashing patterns
- `tokens/` - Token generation utilities

## Migration Strategy

When introducing new shared utilities:

1. **Start in Boilerplate**: Create new utilities here first
2. **Document Patterns**: Include clear usage examples
3. **Version Templates**: Track changes to prevent breaking module copies
4. **Provide Migration Guide**: Document how to update copied code

## Copy Guidelines

When copying boilerplate code:

1. **Create Module Namespace**: Place in `modules/[module]/utils/` or similar
2. **Adapt to Module Needs**: Modify the code for your specific use case
3. **Add Module-Specific Tests**: Test your copied implementation
4. **Document the Source**: Comment where the code was copied from
5. **Track Updates**: Monitor boilerplate changes for security/bug fixes

## Example Structure

```
modules/auth/
├── utils/           # Copied boilerplate utilities
│   ├── validation.ts    # Copied from shared/boilerplate/validation
│   ├── hashing.ts       # Copied from shared/boilerplate/security
│   └── tokens.ts        # Copied from shared/boilerplate/tokens
├── auth.resolver.ts
└── ...

modules/posts/
├── utils/           # Different utilities for posts domain
│   ├── formatting.ts    # Copied from shared/boilerplate/formatting
│   ├── validation.ts    # Modified version for posts
│   └── filters.ts       # Copied from shared/boilerplate/filtering
├── post.resolver.ts
└── ...
```

## Maintenance

### For Boilerplate Maintainers
- Keep utilities small and focused
- Avoid framework-specific dependencies
- Document all parameters and return values
- Provide comprehensive examples
- Version changes with semantic versioning comments

### For Module Developers
- Copy only what you need
- Adapt utilities to your domain
- Add proper error handling for your context
- Write tests for your copied implementation
- Review boilerplate updates periodically

## Benefits of This Pattern

1. **Self-Contained Modules**: Each module includes everything it needs
2. **Independent Evolution**: Modules can evolve utilities independently
3. **Migration Readiness**: Modules are ready for microservice extraction
4. **Reduced Coordination**: Teams don't need to coordinate shared utility changes
5. **Explicit Dependencies**: All dependencies are visible in the module

## Trade-offs

### Advantages
- ✅ True module isolation
- ✅ Independent deployment readiness
- ✅ Reduced coordination overhead
- ✅ Easier testing and debugging

### Disadvantages
- ❌ Code duplication (by design)
- ❌ Manual update propagation
- ❌ Potential inconsistencies across modules
- ❌ More maintenance overhead

The benefits of isolation outweigh the duplication costs in a modular monolith architecture. 