# Constants Directory

This directory contains all application constants organized by domain/concern. All constants should be defined here to maintain a single source of truth.

## Structure

- **`config.ts`** - Configuration-related constants (server, auth, database, etc.)
- **`context.ts`** - GraphQL context and HTTP-related constants
- **`graphql.ts`** - GraphQL-specific constants (types, operations, scalars)
- **`validation.ts`** - Validation limits, patterns, and messages
- **`index.ts`** - Main export file that re-exports all constants

## Usage

Import constants from the main index file:

```typescript
import { AUTH_CONFIG, VALIDATION_MESSAGES, GRAPHQL_TYPES } from '@/constants'
```

Or import from specific modules:

```typescript
import { VALIDATION_LIMITS } from '@/constants/validation'
import { SERVER_CONFIG } from '@/constants/config'
```

## Guidelines

1. **Naming Convention**: Use UPPER_SNAKE_CASE for constant names
2. **Organization**: Group related constants in objects
3. **Type Safety**: Use `as const` assertion for literal types
4. **Documentation**: Add JSDoc comments for complex constants
5. **No Magic Values**: Replace all hardcoded values with constants

## Adding New Constants

1. Identify the appropriate file based on the constant's domain
2. Add the constant following the existing patterns
3. Export it from the main index.ts if needed for backward compatibility
4. Update any code using hardcoded values to use the new constant

## Legacy Support

The `index.ts` file maintains backward compatibility by re-exporting commonly used constants in their original structure. This allows gradual migration without breaking existing code.