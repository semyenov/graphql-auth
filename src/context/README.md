# Context Module Structure

This directory contains the semantic separation of the original monolithic `context.ts` file into focused, maintainable modules.

## Module Overview

### `types.ts`

- **Purpose**: Core context interfaces and type definitions
- **Exports**: `Context`, `TypedContext`, `LoginContext`, `SignupContext`, etc.
- **Dependencies**: GraphQL types, operation types

### `creation.ts`

- **Purpose**: Context creation and initialization logic
- **Exports**: `createContext` function
- **Dependencies**: Types, utils, authentication

### `auth.ts`

- **Purpose**: Authentication and authorization helpers
- **Exports**: `isAuthenticated`, `requireAuthentication`, `hasPermission`, `hasRole`
- **Dependencies**: Context types

### `validation.ts`

- **Purpose**: Context validation and type guards
- **Exports**: `validateContext`, `isLoginContext`, `isSignupContext`, etc.
- **Dependencies**: Context types

## Usage

All exports are re-exported through the main `src/context.ts` file for backward compatibility:

```typescript
import { Context, createContext, isAuthenticated } from '../context'
```

## Benefits

1. **Separation of Concerns**: Each module has a single responsibility
2. **Better Maintainability**: Easier to find and modify specific functionality
3. **Improved Testing**: Modules can be tested in isolation
4. **Type Safety**: Clear dependency relationships and interfaces
5. **Backward Compatibility**: Existing imports continue to work
