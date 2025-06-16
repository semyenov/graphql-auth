# Naming Conventions

## File Naming

### General Rules
- Use **kebab-case** for all file names
- Be descriptive but concise
- Group related files with common prefixes

### Specific Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Domain Types | `types.ts` or `[entity].types.ts` | `user.types.ts` |
| Domain Services | `[entity]-[action].service.ts` | `post-authorization.service.ts` |
| Use Cases | `[action]-[entity].use-case.ts` | `create-post.use-case.ts` |
| Repositories | `[entity].repository.ts` | `user.repository.ts` |
| GraphQL Resolvers | `[entity].resolver.ts` or `[entity].[type].ts` | `auth.resolver.ts`, `post.mutations.ts` |
| Test Files | `[file-name].test.ts` | `signup.use-case.test.ts` |
| Interfaces | `[entity].interface.ts` | `repository.interface.ts` |
| Constants | `[domain].constants.ts` | `auth.constants.ts` |
| Utilities | `[function].utils.ts` | `validation.utils.ts` |

## Code Naming

### Classes
```typescript
// Use PascalCase for classes
// Suffix with type (Service, UseCase, Repository, etc.)
export class PasswordService { }
export class SignupUseCase { }
export class UserRepository { }
```

### Interfaces
```typescript
// Use PascalCase with 'I' prefix or descriptive name
export interface User { }           // Domain entity
export interface IUserRepository { } // Repository interface
export interface CreatePostData { }  // Data transfer object
```

### Functions and Methods
```typescript
// Use camelCase for functions
// Use verb-noun pattern
export function validatePassword(password: string): boolean { }
export function createUser(data: UserData): User { }
export async function findUserById(id: number): Promise<User> { }
```

### Constants
```typescript
// Use UPPER_SNAKE_CASE for constants
export const MAX_PASSWORD_LENGTH = 128
export const DEFAULT_PAGE_SIZE = 20
export const AUTH_TOKEN_HEADER = 'Authorization'
```

### Variables
```typescript
// Use camelCase for variables
// Be descriptive
const userEmail = 'user@example.com'
const isAuthenticated = true
const postCount = 42
```

### Types and Enums
```typescript
// Use PascalCase for types
type UserId = number
type EmailAddress = string

// Use PascalCase for enums
// Use singular names
enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}
```

## Directory Naming

- Use **kebab-case** for directories
- Use plural for collections: `use-cases/`, `repositories/`
- Use singular for modules: `auth/`, `post/`
- Be consistent within each feature

## GraphQL Naming

### Schema Types
```graphql
# Use PascalCase for types
type User {
  id: ID!
  email: String!
}

# Use PascalCase for inputs
input CreatePostInput {
  title: String!
  content: String
}
```

### Queries and Mutations
```graphql
# Use camelCase for queries/mutations
type Query {
  getUser(id: ID!): User
  listPosts(first: Int): PostConnection
}

type Mutation {
  createPost(input: CreatePostInput!): Post
  updateUser(id: ID!, data: UpdateUserInput!): User
}
```

## Import Organization

```typescript
// 1. External imports (npm packages)
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

// 2. Internal absolute imports
import { User } from '@/features/auth/domain/types'
import { config } from '@/config'

// 3. Internal relative imports (same feature)
import { PasswordService } from '../services/password.service'
import { CreateUserData } from './types'

// 4. Type imports (if separate)
import type { Request, Response } from 'express'
```

## Best Practices

1. **Be Consistent**: Follow the same pattern throughout the codebase
2. **Be Descriptive**: Names should clearly indicate purpose
3. **Avoid Abbreviations**: Use `password` not `pwd`, `configuration` not `cfg`
4. **Use Domain Language**: Match naming with business domain terms
5. **Avoid Generic Names**: Don't use `data`, `info`, `manager` without context