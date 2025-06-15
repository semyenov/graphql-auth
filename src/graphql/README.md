# GraphQL Module Structure

This directory contains GraphQL-related functionality separated from the main context module for better organization.

## Module Overview

### `types.ts`

- **Purpose**: Core GraphQL types, interfaces, and schema definitions
- **Exports**:
  - HTTP types: `HTTPMethod`, `MimeType`
  - Schema types: `GraphQLPost`, `GraphQLUser`, `GraphQLMutation`, `GraphQLQuery`
  - Input types: `PostCreateInput`, `UserUniqueInput`, `SortOrder`
  - Request/Response types: `GraphQLRequestBody`, `GraphQLResponse`
- **Dependencies**: GraphQL environment types

### `operations.ts`

- **Purpose**: GraphQL operations, mutations, and queries
- **Exports**:
  - Operations: `LoginMutation`, `SignupMutation`, `CreateDraftMutation`, etc.
  - Result types: `LoginResult`, `LoginVariables`, `CreateDraftResult`, etc.
- **Dependencies**: gql.tada for type-safe GraphQL

### `utils.ts`

- **Purpose**: GraphQL utility functions and helpers
- **Exports**:
  - Execution: `executeGraphQL`, `createTypedRequest`
  - Input creators: `createPostInput`, `createPostOrderBy`, `createUserUniqueInput`
- **Dependencies**: GraphQL types

## Usage

All exports are re-exported through the main `src/context.ts` file:

```typescript
import {
  GraphQLResponse,
  LoginMutation,
  executeGraphQL,
  createPostInput,
} from '../context'
```

## Type Safety

All GraphQL operations are fully type-safe using `gql.tada`:

```typescript
const result = await executeGraphQL<LoginVariables, LoginResult>(
  LoginMutation,
  { email, password },
)
```

## Benefits

1. **Type Safety**: Full TypeScript integration with GraphQL schema
2. **Code Organization**: Clear separation of GraphQL concerns
3. **Reusability**: Utility functions for common GraphQL patterns
4. **Schema Integration**: Direct integration with generated schema types
