# Context Module Structure

This directory contains a **clean, maintainable, and type-safe** GraphQL context system designed with **clean code principles** and **single responsibility**.

## 🏗️ Architecture Overview

The context module is organized into focused, well-documented modules that follow clean code standards:

```
src/context/
├── constants.ts      # Centralized constants and configuration
├── types.ts         # Comprehensive type definitions
├── creation.ts      # Context creation orchestration
├── utils.ts         # Reusable utility functions
├── auth.ts          # Authentication & authorization
├── validation.ts    # Context validation & type guards
└── README.md        # This documentation
```

## 📚 Module Responsibilities

### `constants.ts`

- **Purpose**: Centralized constants to eliminate magic values
- **Exports**: `ERROR_MESSAGES`, `OPERATION_NAMES`, `DEFAULT_VALUES`, `HEADER_KEYS`
- **Benefits**: Type-safe constants, consistent error messages, maintainable configuration

### `types.ts`

- **Purpose**: Comprehensive, type-safe context interfaces
- **Exports**: `Context`, `TypedContext`, `AuthenticatedContext`, `OperationName`
- **Features**:
  - Operation-specific contexts with proper typing
  - Helper types for type inference
  - Authentication-aware context types
  - Readonly properties for immutability

### `creation.ts`

- **Purpose**: Orchestrates context creation with clean separation of concerns
- **Exports**: `createContext` function
- **Features**:
  - Comprehensive error handling
  - Step-by-step context assembly
  - Proper request validation
  - Clean, testable architecture

### `utils.ts`

- **Purpose**: Reusable utility functions for context processing
- **Exports**: Header extraction, metadata creation, security context helpers
- **Benefits**:
  - Single responsibility functions
  - Comprehensive documentation
  - Testable in isolation
  - Consistent data processing

### `auth.ts`

- **Purpose**: Type-safe authentication and authorization utilities
- **Exports**: `isAuthenticated`, `requireAuthentication`, `hasPermission`, `hasRole`
- **Features**:
  - Enhanced type guards with proper narrowing
  - Comprehensive permission checking
  - Multiple permission validation strategies
  - Clear error messages using constants

### `validation.ts`

- **Purpose**: Context validation with structured error reporting
- **Exports**: `validateContext`, `ValidationResult`, operation type guards
- **Features**:
  - Immutable validation results
  - Operation-specific validation
  - Comprehensive authentication checks
  - Type-safe operation name validation

## 🚀 Key Improvements (Clean Code)

### 1. **Single Responsibility Principle**

Each module has one clear purpose and is independently testable.

### 2. **Dependency Inversion**

Utilities are extracted and injected, making the system modular and testable.

### 3. **Constants Over Magic Values**

All magic strings and values are centralized in `constants.ts` with clear naming.

### 4. **Comprehensive Documentation**

Every function has JSDoc with examples, parameter descriptions, and usage guidance.

### 5. **Type Safety Enhancement**

- Operation-specific contexts with proper variable typing
- Authentication-aware type guards
- Helper types for better type inference

### 6. **Error Handling**

- Structured validation results
- Consistent error messages
- Proper error propagation

### 7. **Immutability**

- Readonly properties where appropriate
- Frozen validation results
- Immutable constant objects

## 📖 Usage Examples

### Basic Context Usage

```typescript
import { createContext, isAuthenticated, validateContext } from '../context'

// Context creation (handled by Apollo Server)
const context = await createContext({ req })

// Validation
const validation = validateContext(context)
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors)
}

// Authentication check
if (isAuthenticated(context)) {
  // TypeScript knows context.userId is number
  const userId = context.userId
}
```

### Operation-Specific Type Guards

```typescript
import { isLoginContext, isCreateDraftContext, LoginContext } from '../context'

function handleOperation(context: Context) {
  if (isLoginContext(context)) {
    // TypeScript knows this is LoginContext
    const { email, password } = context.variables
  }

  if (isCreateDraftContext(context)) {
    // TypeScript knows this is CreateDraftContext
    const { title, content } = context.variables
  }
}
```

### Permission-Based Authorization

```typescript
import { hasPermission, hasAllPermissions, PERMISSIONS } from '../context'

// Single permission
if (hasPermission(context, PERMISSIONS.WRITE_POSTS)) {
  // User can create posts
}

// Multiple permissions required
if (
  hasAllPermissions(context, [PERMISSIONS.READ_POSTS, PERMISSIONS.WRITE_POSTS])
) {
  // User has full post access
}
```

### Comprehensive Validation

```typescript
import {
  validateContextComprehensive,
  validateAuthentication,
} from '../context'

// Full validation (basic + operation-specific + auth)
const result = validateContextComprehensive(context)

// Just authentication validation
const authResult = validateAuthentication(context)
```

## 🧪 Testing Benefits

Each module can be tested in isolation:

```typescript
// Test utilities separately
import { extractHeaders, createRequestMetadata } from '../context/utils'

// Test validation logic
import { validateContext, isLoginContext } from '../context/validation'

// Test authentication helpers
import { isAuthenticated, hasPermission } from '../context/auth'
```

## 🔄 Backward Compatibility

All exports are re-exported through the main `src/context.ts` file, ensuring existing imports continue to work:

```typescript
// ✅ Still works
import { Context, createContext, isAuthenticated } from '../context'

// ✅ New functionality available
import { OPERATION_NAMES, validateContextComprehensive } from '../context'
```

## 🏆 Clean Code Principles Applied

1. **Meaningful Names**: Clear, intention-revealing function and variable names
2. **Small Functions**: Each function does one thing well
3. **Comments**: Code explains what, comments explain why
4. **Error Handling**: Structured error handling with clear messages
5. **Consistency**: Consistent code style and patterns throughout
6. **DRY**: Common functionality extracted into reusable utilities
7. **Type Safety**: Comprehensive TypeScript usage for compile-time safety
