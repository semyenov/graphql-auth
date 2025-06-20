# Context7 MCP Setup for GraphQL Auth

This document provides setup instructions for Context7 MCP (Model Context Protocol) to enhance AI assistance for the GraphQL Auth project.

## What is Context7 MCP?

Context7 MCP provides contextual awareness to AI assistants by:

- Understanding your project's architecture and patterns
- Providing smart code suggestions based on existing conventions
- Maintaining consistency across the codebase
- Offering sequential task planning for complex features

## Installation

### 1. Install Context7 MCP Server

```bash
# Using npm
npm install -g @context7/mcp-server

# Using bun (recommended for this project)
bun add -g @context7/mcp-server

# Or install locally as dev dependency
bun add -D @context7/mcp-server
```

### 2. Configure Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "context7-mcp",
      "args": ["--project", "/Users/aleksandrsemenov/Projects/graphql-auth"],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 3. Initialize Context7

```bash
# Initialize Context7 in the project
context7 init

# Or if installed locally
bunx context7 init
```

## Project Configuration

The `.context7rc` file is already configured with:

### Architecture Patterns

- **Pothos GraphQL**: Schema builder with plugins
- **Prisma ORM**: Database layer with SQLite
- **JWT Authentication**: Token-based auth with refresh tokens
- **DataLoader Integration**: N+1 query prevention
- **Relay Connections**: Cursor-based pagination
- **Scope Auth**: Declarative authorization
- **Error Handling**: Normalized error hierarchy

### Key Context Files

- `CLAUDE.md`: Project documentation and rules
- `src/schema/**/*.ts`: GraphQL schema definitions
- `src/infrastructure/graphql/resolvers/**/*.ts`: Resolver implementations
- `src/infrastructure/graphql/dataloaders/**/*.ts`: DataLoader configurations
- `src/context/**/*.ts`: Request context and auth
- `src/errors/**/*.ts`: Error handling patterns
- `test/**/*.ts`: Test utilities and examples
- `prisma/schema.prisma`: Database schema

## Usage Examples

### 1. Code Generation

Context7 will understand your patterns and generate code that follows:

- Pothos schema patterns
- Prisma query optimizations
- Error handling conventions
- Testing patterns

### 2. Architecture Decisions

When asking about architectural changes, Context7 will consider:

- Existing DataLoader patterns
- Relay connection conventions
- Authentication flow
- Error handling hierarchy

### 3. Feature Development

For new features, Context7 will:

- Suggest appropriate resolver patterns
- Recommend DataLoader usage
- Ensure proper error handling
- Maintain type safety

## Project-Specific Patterns

### GraphQL Resolvers

```typescript
// Context7 understands this pattern
builder.queryField('posts', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    resolve: (query, root, args, ctx) => {
      return ctx.prisma.post.findMany({
        ...query, // Always spread query
        where: { published: true },
      })
    },
  }),
)
```

### DataLoader Usage

```typescript
// Context7 knows to use DataLoaders for N+1 prevention
const user = new DataLoader<number, User | null>(async (userIds) => {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
  })
  return userIds.map((id) => users.find((user) => user.id === id) || null)
})
```

### Error Handling

```typescript
// Context7 follows the error hierarchy
try {
  // Your code
} catch (error) {
  throw normalizeError(error) // Converts to proper BaseError
}
```

## Troubleshooting

### Common Issues

1. **MCP Server Not Found**

   ```bash
   # Ensure global installation
   npm list -g @context7/mcp-server
   # Or use local installation
   bunx context7-mcp --help
   ```

2. **Configuration Issues**

   - Verify `.context7rc` exists in project root
   - Check Claude Desktop configuration
   - Ensure correct project path

3. **Context Not Loading**
   - Verify all context files exist
   - Check file permissions
   - Restart Claude Desktop

### Getting Help

- [Context7 Documentation](https://github.com/context7/mcp-server)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/model-context-protocol-mcp)

## Benefits for This Project

With Context7 MCP, AI assistants will:

1. **Understand Pothos Patterns**: Know when to use `prismaConnection`, `prismaField`, etc.
2. **Follow Prisma Best Practices**: Always spread `query` parameter, use proper typing
3. **Maintain Error Consistency**: Use the established error hierarchy
4. **Apply DataLoader Patterns**: Prevent N+1 queries automatically
5. **Respect Authentication**: Follow the JWT + refresh token pattern
6. **Use Relay Conventions**: Global IDs, cursor pagination, connections

This ensures that all AI-generated code follows your established patterns and maintains consistency across the codebase.
