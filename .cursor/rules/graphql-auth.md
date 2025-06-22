# GraphQL Auth Project Rules

## Architecture Guidelines

### Direct Prisma Access Pattern
- **ALWAYS** import Prisma directly: `import { prisma } from '../../../prisma'`
- **NEVER** include Prisma in GraphQL context
- This is a core architectural decision (ADR-003)

### Pothos Resolver Pattern
When using `t.prismaField`, **ALWAYS** spread the `query` parameter first:
```typescript
resolve: async (query, _parent, args, context) => {
  return prisma.entity.create({
    ...query, // CRITICAL: Always spread first
    data: { ... }
  })
}
```

### Dual Authorization System
- Use `grantScopes` for simple authentication/role checks
- Use `shield` for complex business logic rules
- Both can be used together on the same resolver

## Code Style

### TypeScript
- No `any` types - use `unknown` or specific types
- Prefix unused parameters with underscore: `_parent`, `_args`
- Use value objects for IDs (e.g., `UserId.create()`)

### Error Handling
- Always use `normalizeError()` for caught errors
- Use domain-specific error classes from `src/errors/`
- Include appropriate error codes and status codes

### Testing
- Use GraphQL Tada typed operations from `src/gql/`
- Never use raw GraphQL strings in tests
- Use `createAuthenticatedContextFromScratch()` for new test users
- Use `createAuthenticatedContext(user)` for existing users

## Module Structure
```
modules/[feature]/
├── [feature].resolver.ts     # Pothos resolvers with inline logic
├── [feature].rules.ts        # Shield rules for authorization
├── [feature].types.ts        # GraphQL type definitions
├── services/                 # Complex business logic only
│   └── [feature].service.ts
└── types/                    # TypeScript types
```

## DI Container Pattern
- Services use TSyringe for dependency injection
- Register interfaces in `src/app/config/container.ts`
- Use `@injectable()` decorator on service classes
- Inject dependencies via constructor with `@inject('InterfaceName')`

## Global IDs
- All entities use Relay-style global IDs
- Format: Base64("EntityType:numericId")
- Use `parseGlobalId()` to decode in Shield rules

## OIDC Implementation
- OIDC provider is mounted at `/oidc` and `/.well-known`
- GraphQL operations for OIDC management require admin role
- Sessions are stored in database with provider integration
- Use `IOidcProviderService` interface for all OIDC operations

## Performance
- DataLoaders are available in `context.loaders`
- Shield rules should use `{ cache: 'strict' }` when possible
- Pothos query spreading enables automatic query optimization

## Environment
- Use `process.env` with proper types
- Required: `DATABASE_URL`, `JWT_SECRET`
- Optional: `OIDC_ISSUER`, `OIDC_JWKS_PATH`, `PORT`, `HOST`