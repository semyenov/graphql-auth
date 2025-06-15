# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Package Manager**: Bun.sh
- **GraphQL Server**: Apollo Server 4 with Pothos schema builder
- **Database**: Prisma ORM with SQLite (dev.db)
- **Authentication**: JWT tokens with bcryptjs
- **Authorization**: GraphQL Shield middleware
- **HTTP Framework**: H3
- **Type Safety**: 
  - GraphQL Tada for compile-time GraphQL typing
  - fetchdts for typed HTTP requests

## Essential Commands

### Development
```bash
bun run dev                  # Start development server on port 4000
bun run build               # Build for production
bun run start               # Start production server
```

### Database Management
```bash
bunx prisma migrate dev --name <name>  # Create/apply database migrations
bunx prisma generate                   # Generate Prisma client
bunx prisma studio                     # Open database GUI
bun run seed                          # Seed database with sample data
bun run db:reset                      # Reset database (delete and recreate)
```

### Code Generation
```bash
bun run generate            # Generate all types (Prisma + GraphQL)
bun run generate:prisma     # Generate Prisma client only
bun run generate:gql        # Generate GraphQL types only
bun run gen:schema          # Generate GraphQL schema file
```

## Code Style

The project uses Prettier with the following configuration:
- No semicolons
- Single quotes
- Trailing commas

## Architecture Overview

### GraphQL Schema Definition
The project uses **Pothos** (not Nexus as mentioned in README) for type-safe GraphQL schema construction:

- `src/builder.ts` - Pothos builder with Prisma plugin configuration
- `src/schema.ts` - All GraphQL type definitions and resolvers
- `src/permissions/index.ts` - GraphQL Shield rules for authorization

### Key Patterns

1. **Prisma-First Development**: Database models are defined in `prisma/schema.prisma`, then exposed via GraphQL
2. **JWT Authentication**: Tokens are passed via `Authorization: Bearer <token>` header
3. **Context-Based Auth**: User ID is extracted from JWT and passed through GraphQL context
4. **Permission Rules**: 
   - `isAuthenticatedUser` - Requires valid JWT
   - `isPostOwner` - Requires user to own the resource
5. **Type-Safe GraphQL Operations**: Use GraphQL Tada for compile-time typed queries/mutations
6. **Query Optimization**: Always spread `...query` in Prisma resolvers for automatic optimization

### Adding New Features

1. **New Database Model**:
   ```bash
   # 1. Add model to prisma/schema.prisma
   # 2. Run migration
   bunx prisma migrate dev --name add-feature
   # 3. Add GraphQL type in src/schema.ts using builder.prismaObject()
   ```

2. **New GraphQL Field**:
   ```typescript
   // In src/schema.ts
   builder.queryField('fieldName', (t) =>
     t.prismaField({
       type: 'ModelName',
       resolve: (query, root, args, ctx) => ctx.prisma.model.findMany()
     })
   )
   ```

3. **Protected Endpoints**: Add permission rules in `src/permissions/index.ts`

## Project Structure

```
src/
├── server.ts           # Apollo Server setup with H3
├── schema.ts           # GraphQL schema definitions (Pothos)
├── builder.ts          # Pothos builder configuration
├── context.ts          # GraphQL context (auth extraction)
├── prisma.ts           # Prisma client instance
├── utils.ts            # JWT utilities
├── generate-schema.ts  # Schema generation script
└── permissions/        # GraphQL Shield authorization
    ├── index.ts        # Permission middleware
    └── rules.ts        # Auth rule definitions

prisma/
├── schema.prisma       # Database models
├── seed.ts             # Database seeding
└── migrations/         # Migration history

_docs/
├── audit-report.md     # Security audit findings
└── schema.graphql      # Generated GraphQL schema

types/
└── pothos/             # Generated Pothos types

.pothos/
└── types.d.ts          # Pothos type definitions

graphql-env.d.ts        # GraphQL Tada environment
```

## Authentication & Authorization Flow

### Public Endpoints (No Auth Required)
- `Query.feed` - List published posts
- `Query.allUsers` - List all users
- `Mutation.signup` - Create new account
- `Mutation.login` - Authenticate user

### Protected Endpoints (JWT Required)
- `Query.me` - Current user profile
- `Query.draftsByUser` - User's draft posts
- `Query.postById` - Get specific post
- `Mutation.createDraft` - Create new post

### Owner-Only Endpoints (Resource Ownership)
- `Mutation.deletePost` - Delete own posts
- `Mutation.togglePublishPost` - Publish/unpublish own posts

## Testing GraphQL Endpoints

GraphQL Playground available at http://localhost:4000

**Public query example**:
```graphql
query { feed { id title author { name } } }
```

**Authenticated query example** (set Authorization header):
```graphql
mutation {
  login(email: "alice@prisma.io", password: "myPassword42") {
    token
  }
}
```

## Pothos Schema Patterns

### Object Type Definition
```typescript
// Always use builder.prismaObject for Prisma models
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    posts: t.relation('posts'), // Auto-resolved by Prisma plugin
  }),
})
```

### Query Fields with Prisma
```typescript
builder.queryField('feed', (t) =>
  t.prismaField({
    type: ['Post'],
    resolve: (query, _parent, _args, _context) =>
      prisma.post.findMany({
        ...query, // IMPORTANT: Always spread query for optimization
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      }),
  })
)
```

### Mutations with Auth
```typescript
builder.mutationField('createDraft', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      data: t.arg({ type: PostCreateInput, required: true }),
    },
    resolve: (query, _parent, args, context) => {
      const userId = getUserId(context) // Extract from JWT
      return prisma.post.create({
        ...query,
        data: {
          ...args.data,
          authorId: userId,
        },
      })
    },
  })
)
```

### Input Types
```typescript
const PostCreateInput = builder.inputType('PostCreateInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string(),
  }),
})
```

## Type-Safe GraphQL with GraphQL Tada

### Define Typed Queries
```typescript
// In src/context.ts
import { graphql } from '@/gql'

export const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`)

// Export types for use elsewhere
export type LoginResult = ResultOf<typeof LoginMutation>
export type LoginVariables = VariablesOf<typeof LoginMutation>
```

### Type Flow Integration
1. **GraphQL Schema** → Pothos generates schema.graphql
2. **GraphQL Tada** → Reads schema and generates types
3. **TypeScript** → Provides compile-time type safety
4. **Runtime** → GraphQL Shield enforces permissions

## Permission Patterns

### Define Permission Rules
```typescript
// In src/permissions/index.ts
const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),
  
  isPostOwner: rule()(async (_parent, args, context) => {
    const userId = getUserId(context)
    const author = await context.prisma.post
      .findUnique({ where: { id: Number(args.id) } })
      .author()
    return userId === author.id
  }),
}
```

### Apply Permissions to Schema
```typescript
export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
    draftsByUser: rules.isAuthenticatedUser,
    // feed is PUBLIC (no rule = open access)
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
    deletePost: rules.isPostOwner,
    // signup/login are PUBLIC
  },
})
```

## Development Workflow Best Practices

1. **Type Generation Workflow**:
   ```bash
   # After schema changes, regenerate everything
   bun run generate
   
   # Or regenerate specific types
   bun run generate:prisma  # After database changes
   bun run generate:gql     # After GraphQL schema changes
   ```

2. **Adding Features Checklist**:
   - [ ] Update Prisma schema if needed
   - [ ] Run migrations: `bunx prisma migrate dev`
   - [ ] Add GraphQL types in `src/schema.ts`
   - [ ] Define permissions in `src/permissions/index.ts`
   - [ ] Add typed queries in `src/context.ts` if needed
   - [ ] Regenerate types: `bun run generate`
   - [ ] Test in GraphQL Playground

3. **Authentication Headers**:
   ```bash
   # Get token via login
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"mutation { login(email: \"test@example.com\", password: \"password\") { token } }"}'
   
   # Use token in subsequent requests
   curl -X POST http://localhost:4000/graphql \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query":"{ me { id email name } }"}'
   ```

## Common Issues

- **Port conflicts**: Server runs on port 4000 by default
- **Database errors**: Delete `prisma/dev.db` and re-run migrations
- **Type errors**: Run `bun run generate` to regenerate types
- **Auth errors**: Ensure JWT token format is correct and user exists in DB
- **Permission denied**: Check that the correct permission rule is applied and JWT is valid

## Pothos Schema Patterns

### Object Types
```typescript
// Define Prisma-backed objects
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    posts: t.relation('posts')
  })
})
```

### Query Fields
```typescript
builder.queryField('users', (t) =>
  t.prismaField({
    type: ['User'],
    resolve: (query, root, args, ctx) => {
      // IMPORTANT: Always spread ...query for Prisma optimizations
      return ctx.prisma.user.findMany({ ...query })
    }
  })
)
```

### Mutations with Auth
```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    args: {
      title: t.arg.string({ required: true }),
      content: t.arg.string()
    },
    resolve: async (query, root, args, ctx) => {
      const userId = ctx.userId
      if (!userId) throw new Error('Not authenticated')
      
      return ctx.prisma.post.create({
        ...query,
        data: {
          title: args.title,
          content: args.content || null,
          authorId: userId
        }
      })
    }
  })
)
```

## Type-Safe GraphQL with GraphQL Tada

### Define Typed Queries
```typescript
import { graphql } from '../graphql-env'

const GetUserQuery = graphql(`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`)

// Export types
export type GetUserResult = ResultOf<typeof GetUserQuery>
export type GetUserVariables = VariablesOf<typeof GetUserQuery>
```

### Type Flow
1. Prisma generates database types
2. Pothos uses Prisma types to build GraphQL schema
3. GraphQL Tada reads schema to provide typed queries
4. fetchdts provides typed HTTP client wrappers

## Permission Patterns

### Define Rules
```typescript
// src/permissions/rules.ts
export const isAuthenticatedUser = rule({ cache: 'contextual' })(
  async (parent, args, ctx) => Boolean(ctx.userId)
)

export const isPostOwner = rule({ cache: 'contextual' })(
  async (parent, { id }, ctx) => {
    const post = await ctx.prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    })
    return post?.authorId === ctx.userId
  }
)
```

### Apply to Schema
```typescript
// src/permissions/index.ts
export const permissions = shield({
  Query: {
    me: isAuthenticatedUser,
    drafts: isAuthenticatedUser
  },
  Mutation: {
    createDraft: isAuthenticatedUser,
    deletePost: isPostOwner
  }
})
```

## Development Workflow

### Adding a Feature
1. Update Prisma schema if needed
2. Run `bunx prisma migrate dev --name feature-name`
3. Run `bun run generate` to update all types
4. Add GraphQL types/resolvers in `src/schema.ts`
5. Add permissions in `src/permissions/index.ts`
6. Test with GraphQL Playground

### Testing Authentication
```bash
# Get auth token
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(email: \"alice@prisma.io\", password: \"myPassword42\") { token } }"}'

# Use token in requests
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"{ me { id email } }"}'
```

