# GraphQL Patterns

## Pothos Schema Builder

### Basic Field Definition
```typescript
builder.queryField('fieldName', (t) =>
  t.field({
    type: 'String',
    resolve: () => 'value'
  })
)
```

### Prisma Field with Authorization
```typescript
builder.mutationField('createPost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'],
    shield: isPostOwner,
    resolve: async (query, _parent, args, context) => {
      const userId = requireAuthentication(context)
      
      return prisma.post.create({
        ...query, // ALWAYS spread query first
        data: {
          title: args.title,
          authorId: userId.value,
        },
      })
    },
  }),
)
```

### Type Definitions
```typescript
// In [feature].types.ts
export const UserType = builder.node('User', {
  id: { field: 'id' },
  fields: (t) => ({
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    posts: t.relation('posts', {
      query: (_args, context) => ({
        where: { published: true }
      })
    }),
  }),
})
```

## Shield Rules

### Basic Rules
```typescript
// In [feature].rules.ts
import { rule } from 'graphql-shield'

export const isAuthenticated = rule({ cache: 'contextual' })(
  (_parent, _args, context) => {
    return context.user !== null
  }
)

export const isAdmin = rule({ cache: 'strict' })(
  (_parent, _args, context) => {
    return context.user?.role === 'ADMIN'
  }
)
```

### Complex Rules with Global IDs
```typescript
export const isResourceOwner = rule({ cache: 'strict' })(
  async (_parent, args, context) => {
    if (!context.user) return false
    
    const resourceId = parseGlobalId(args.id, 'Resource')
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId }
    })
    
    return resource?.ownerId === context.user.id
  }
)
```

### Combining Rules
```typescript
import { and, or } from 'graphql-shield'

export const canEditResource = and(
  isAuthenticated,
  or(isAdmin, isResourceOwner)
)
```

## Input Types

### Basic Input
```typescript
const CreatePostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string({ required: true }),
    published: t.boolean({ defaultValue: false }),
  }),
})
```

### With Validation
```typescript
const EmailInput = builder.inputType('EmailInput', {
  fields: (t) => ({
    email: t.string({
      required: true,
      validate: {
        email: true,
      },
    }),
  }),
})
```

## Connections (Relay Pagination)

```typescript
builder.queryField('posts', (t) =>
  t.connection({
    type: PostType,
    resolve: async (_parent, args, _context) => {
      return await resolvePaginatedConnection(
        args,
        async (paginationArgs) => {
          return prisma.post.findMany({
            ...paginationArgs,
            where: { published: true },
            orderBy: { createdAt: 'desc' },
          })
        },
        async () => {
          return prisma.post.count({
            where: { published: true },
          })
        }
      )
    },
  })
)
```

## Error Handling

```typescript
builder.mutationField('riskyOperation', (t) =>
  t.field({
    type: 'String',
    resolve: async () => {
      try {
        // risky operation
        return 'success'
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
)
```

## Context Usage

```typescript
// Getting authenticated user
const userId = requireAuthentication(context) // Throws if not authenticated

// Optional authentication
if (context.user) {
  // authenticated logic
}

// Using DataLoaders
const user = await context.loaders.userById.load(userId)
```