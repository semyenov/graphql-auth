# GraphQL Server with Authentication & Permissions

A production-ready **GraphQL server with TypeScript** demonstrating enterprise-grade patterns and best practices.

## 🚀 Tech Stack

- [**Bun**](https://bun.sh/): Fast all-in-one JavaScript runtime & toolkit
- [**Apollo Server 4**](https://www.apollographql.com/docs/apollo-server/): Modern GraphQL server with H3 integration
- [**Pothos GraphQL**](https://pothos-graphql.dev/): Type-safe, code-first GraphQL schema builder
- [**Prisma ORM**](https://www.prisma.io/): Next-generation TypeScript ORM with migrations
- [**GraphQL Shield**](https://github.com/maticzav/graphql-shield): Declarative permission layer via custom Pothos plugin
- [**JWT Authentication**](https://jwt.io/): Secure token-based authentication with refresh tokens
- [**SQLite**](https://www.sqlite.org/): Local database (easily switchable to PostgreSQL/MySQL)

## ✨ Key Features

### Advanced Pothos Integration
- **7 Pothos Plugins**: Prisma, Relay, Errors, ScopeAuth, Shield, Validation, DataLoader
- **Direct Prisma Access**: Prisma accessed directly (NOT through context) for better performance
- **N+1 Query Prevention**: Automatic query batching with DataLoader
- **Type Safety**: End-to-end type safety without code generation
- **Performance Optimized**: Field-level query optimization with Prisma
- **Dual Authorization**: Combines Pothos Scope Auth with GraphQL Shield for flexible permissions

### Production Features
- **JWT Authentication**: Access & refresh token implementation
- **Authorization**: Role-based and resource-based permissions
- **Error Handling**: Comprehensive error types with descriptive messages
- **Rate Limiting**: Built-in rate limiting for API protection
- **Relay Pagination**: Cursor-based pagination with connections
- **Input Validation**: Zod schema validation with async refinements

## 📚 Documentation

- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [GraphQL Schema & Operations](#graphql-schema--operations)
- [Authentication & Authorization](#authentication--authorization)
- [Advanced Features](#advanced-features)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Deployment](#deployment)

## Installation

### Install Bun

Bun is a fast all-in-one JavaScript runtime & toolkit. Install it for your operating system:

#### macOS & Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

**Terminal Output:**

```
bun was installed successfully to ~/.bun/bin/bun

Added "~/.bun/bin" to $PATH in "~/.bashrc"

To get started, run:
  exec $SHELL
  bun --help
```

#### Windows (WSL)

For Windows users, we recommend using Windows Subsystem for Linux (WSL):

1. Install WSL2 following [Microsoft's official guide](https://docs.microsoft.com/en-us/windows/wsl/install)
2. Open your WSL terminal and run:

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Verify Installation

Confirm Bun is installed correctly:

```bash
bun --version
```

**Terminal Output:**

```
1.2.15
```

## Getting started

### 1. Download example and navigate into the project directory

Download this example:

```bash
bunx try-prisma@latest --template orm/graphql-auth
```

Then, navigate into the project directory:

```bash
cd graphql-auth
```

<details><summary><strong>Alternative:</strong> Clone the entire repo</summary>

Clone this repository:

```bash
git clone git@github.com:prisma/prisma-examples.git --depth=1
```

Install dependencies:

```bash
cd prisma-examples/orm/graphql-auth
bun install
```

</details>

#### [Optional] Switch database to Prisma Postgres

This example uses a local SQLite database by default. If you want to use to [Prisma Postgres](https://prisma.io/postgres), follow these instructions (otherwise, skip to the next step):

1. Set up a new Prisma Postgres instance in the Prisma Data Platform [Console](https://console.prisma.io) and copy the database connection URL.
2. Update the `datasource` block to use `postgresql` as the `provider` and paste the database connection URL as the value for `url`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = "prisma+postgres://accelerate.prisma-data.net/?api_key=ey...."
   }
   ```

   > **Note**: In production environments, we recommend that you set your connection URL via an [environment variable](https://www.prisma.io/docs/orm/more/development-environment/environment-variables/managing-env-files-and-setting-variables), e.g. using a `.env` file.

3. Install the Prisma Accelerate extension:
   ```bash
   bun add @prisma/extension-accelerate
   ```
4. Add the Accelerate extension to the `PrismaClient` instance:

   ```diff
   + import { withAccelerate } from "@prisma/extension-accelerate"

   + const prisma = new PrismaClient().$extends(withAccelerate())
   ```

That's it, your project is now configured to use Prisma Postgres!

### 2. Create and seed the database

Run the following command to create your database. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```bash
bunx prisma migrate dev --name init
```

When `bunx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts) will be executed and your database will be populated with the sample data.

**If you switched to Prisma Postgres in the previous step**, you need to trigger seeding manually (because Prisma Postgres already created an empty database instance for you, so seeding isn't triggered):

```bash
bun run seed
```

### 3. Start the GraphQL server

Launch your GraphQL server with this command:

```bash
bun run dev
```

Navigate to [http://localhost:4000](http://localhost:4000) in your browser to explore the API of your GraphQL server in a [GraphQL Playground](https://github.com/prisma/graphql-playground).

## Quick Start Commands

Here are the most common Bun commands you'll use while developing:

### Install Dependencies

```bash
bun install
```

**Terminal Output:**

```
bun install v1.2.15 (df017990)

Checked 223 installs across 216 packages (no changes) [101.00ms]
```

### Start Development Server

```bash
bun run dev
```

This starts the GraphQL server at [http://localhost:4000](http://localhost:4000).

### Database Commands

#### Reset Database & Re-seed

```bash
bun run db:reset
```

**Terminal Output:**

```
$ bunx prisma migrate reset --force
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

Applying migration `20250606184121_init`

Database reset successful

The following migration(s) have been applied:

migrations/
  └─ 20250606184121_init/
    └─ migration.sql

✔ Generated Prisma Client (v6.9.0) to ./node_modules/@prisma/client in 80ms
✔ Generated Pothos integration to ./types/pothos.ts in 9ms

Running seed command `bun run prisma/seed.ts` ...
Start seeding ...
Created user with id: 1
Created user with id: 2
Created user with id: 3
Seeding finished.

🌱  The seed command has been executed.
```

This command resets your database, applies all migrations, and automatically runs the seed script.

#### Manual Database Seeding

```bash
bun run seed
```

#### Generate Prisma Client

```bash
bun run generate
```

**Terminal Output:**

```
$ bun run generate:prisma && bun run generate:gql
$ prisma generate
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v6.9.0) to ./node_modules/@prisma/client in 95ms
✔ Generated Pothos integration to ./types/pothos.ts in 8ms

$ bunx gql.tada generate-output
✓ Introspection output was generated successfully
```

#### Create Database Migration

```bash
bunx prisma migrate dev --name migration-name
```

### Build for Production

```bash
bun run build
```

### Run Production Server

```bash
bun run start
```

### Other Useful Commands

#### Run Demo Script

```bash
bun run demo
```

#### Clean Build Directory

```bash
bun run clean
```

## Installation Verification

To verify that all Bun commands work correctly in a fresh environment, you can test the installation in a Docker container:

### Using Docker (Optional)

Create a simple Dockerfile to test the installation:

```dockerfile
FROM ubuntu:22.04

# Install curl and basic tools
RUN apt-get update && apt-get install -y curl unzip

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Verify installation
RUN bun --version
```

**Terminal Output for Fresh Installation:**

```bash
# Building the Docker image
docker build -t bun-test .

# The installation output in the container:
+ bun --version
1.2.15
```

### Testing Commands in Fresh Project

After cloning the repository in a fresh environment:

```bash
git clone <repository-url>
cd graphql-auth
bun install
```

**Expected Terminal Output:**

```
bun install v1.2.15 (df017990)

Checked 223 installs across 216 packages (no changes) [65.00ms]
```

Then run the full setup:

```bash
bun run generate && echo "✓ Generate completed" && \
bun run db:reset && echo "✓ Database reset completed"
```

**Expected Terminal Output:**

```
$ bun run generate:prisma && bun run generate:gql
$ prisma generate
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v6.9.0) to ./node_modules/@prisma/client in 85ms
✔ Generated Pothos integration to ./types/pothos.ts in 8ms

$ bunx gql.tada generate-output
✓ Introspection output was generated successfully

✓ Generate completed
$ bunx prisma migrate reset --force
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

Applying migration `20250606184121_init`

Database reset successful

The following migration(s) have been applied:

migrations/
  └─ 20250606184121_init/
    └─ migration.sql

✔ Generated Prisma Client (v6.9.0) to ./node_modules/@prisma/client in 80ms
✔ Generated Pothos integration to ./types/pothos.ts in 9ms

Running seed command `bun run prisma/seed.ts` ...
Start seeding ...
Created user with id: 1
Created user with id: 2
Created user with id: 3
Seeding finished.

🌱  The seed command has been executed.

✓ Database reset completed
```

## Architecture Overview

This project implements a modern GraphQL architecture with clean separation of concerns:

```
src/
├── schema/                     # GraphQL Schema (Pothos)
│   ├── builder.ts             # Schema builder with plugins
│   ├── types/                 # GraphQL type definitions
│   ├── inputs.ts              # Input types & filters
│   └── index.ts               # Schema assembly
├── app/                       # Application layer
│   ├── config/               # Configuration
│   ├── database/            # Database utilities
│   ├── graphql/             # GraphQL utilities
│   └── services/            # Application services
├── context/                   # Request context & auth
├── errors/                    # Error hierarchy
├── permissions/               # GraphQL Shield rules
└── prisma/                    # Database schema & migrations
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## GraphQL Schema & Operations

The GraphQL schema is automatically generated and maintained in [`_docs/schema.graphql`](./_docs/schema.graphql).

### Schema Overview

#### **Queries**

- `me` - Get current authenticated user profile
- `user` - Get user by ID (Relay global ID)
- `users` - List all users
- `searchUsers` - Search users by name or email
- `feed` - Get published posts with filtering and pagination
- `post` - Get a specific post by ID
- `drafts` - Get user's unpublished posts
- `enhancedFeed` - Advanced feed with metadata and performance tracking
- `enhancedUserSearch` - User search with aggregated data
- `postAnalytics` - Aggregated post analytics

#### **Mutations**

##### Authentication
- `signup` - Register a new user account
- `login` - Authenticate and get JWT token
- `loginWithTokens` - Login with refresh token support
- `refreshToken` - Refresh access token
- `logout` - Revoke all refresh tokens

##### Posts
- `createPost` - Create a new post (draft by default)
- `updatePost` - Update existing post
- `deletePost` - Remove a post
- `togglePublishPost` - Publish/unpublish a post
- `incrementPostViewCount` - Track post views

#### **Types**

- `User` - User account with posts connection
- `Post` - Blog post with author relationship
- `PageInfo` - Relay pagination info
- `UserConnection/PostConnection` - Relay connections
- `EnhancedPostConnection` - Connection with metadata
- `PostAnalytics` - Aggregated analytics data

### Advanced Features

#### Relay-Style Pagination

```graphql
query GetFeed($first: Int!, $after: String) {
  feed(first: $first, after: $after) {
    edges {
      node {
        id
        title
        author {
          name
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
      totalCount
    }
  }
}
```

#### Advanced Filtering

```graphql
query FilteredFeed($where: PostWhereInput) {
  feed(where: $where) {
    id
    title
    content
    createdAt
  }
}

# Variables:
{
  "where": {
    "title": {
      "contains": "GraphQL"
    },
    "published": true,
    "createdAt": {
      "gte": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Enhanced Queries with Metadata

```graphql
query EnhancedFeed($search: String) {
  enhancedFeed(searchTerm: $search, first: 10) {
    totalCount
    searchMetadata {
      query
      searchTime
      matchedFields
    }
    edges {
      node {
        id
        title
        viewCount
      }
    }
  }
}
```

### Example Operations

#### cURL Examples

**Register a new user:**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { signup(name: \"Alice\", email: \"alice@example.com\", password: \"secret123\") }"
  }'
```

**Login and get token:**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"alice@example.com\", password: \"secret123\") }"
  }'
```

**Get current user (requires auth token):**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "{ me { id name email } }"
  }'
```

**Create a draft post:**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation { createDraft(data: { title: \"My New Post\", content: \"Hello World!\" }) { id title published } }"
  }'
```

#### GraphQL Playground Examples

**Query: Get published posts with author info**

```graphql
query GetFeed {
  feed(take: 10, orderBy: { updatedAt: desc }) {
    id
    title
    content
    published
    viewCount
    createdAt
    author {
      id
      name
      email
    }
  }
}
```

**Mutation: Create and publish a post**

```graphql
mutation CreateAndPublishPost {
  # First create a draft
  createDraft(
    data: {
      title: "Getting Started with GraphQL"
      content: "GraphQL is a powerful query language..."
    }
  ) {
    id
    title
    published
  }
}

# Then publish it (use the returned ID)
mutation PublishPost {
  togglePublishPost(id: 1) {
    id
    title
    published
    updatedAt
  }
}
```

**Query: Search posts**

```graphql
query SearchPosts($searchTerm: String!) {
  feed(searchString: $searchTerm, take: 5) {
    id
    title
    content
    author {
      name
    }
  }
}

# Query Variables:
# {
#   "searchTerm": "graphql"
# }
```

### Input Types & Validation

**PostCreateInput:**

```graphql
input PostCreateInput {
  title: String! # Required: Post title
  content: String # Optional: Post content/body
}
```

**UserUniqueInput:**

```graphql
input UserUniqueInput {
  id: Int # Either ID or email required
  email: String # for user identification
}
```

**PostOrderByUpdatedAtInput:**

```graphql
input PostOrderByUpdatedAtInput {
  updatedAt: SortOrder! # "asc" or "desc"
}
```

### Authentication

Protected operations require a valid JWT token in the Authorization header:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Protected Operations:**

- `me` - Requires authentication
- `createDraft` - Requires authentication
- `togglePublishPost` - Requires post ownership
- `deletePost` - Requires post ownership
- `draftsByUser` - Requires authentication
- `postById` - Requires authentication
- `incrementPostViewCount` - Requires authentication

### Error Handling

**Common Error Responses:**

```json
{
  "errors": [
    {
      "message": "Not Authorised!",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["me"]
    }
  ],
  "data": null
}
```

```json
{
  "errors": [
    {
      "message": "No user found for email: wrong@email.com",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["login"]
    }
  ],
  "data": null
}
```

## Using the GraphQL API

The schema that specifies the API operations of your GraphQL server is defined in [`_docs/schema.graphql`](./_docs/schema.graphql). Below are a number of operations that you can send to the API using the GraphQL Playground.

Feel free to adjust any operation by adding or removing fields. The GraphQL Playground helps you with its auto-completion and query validation features.

### Retrieve all published posts and their authors

```graphql
query {
  feed {
    id
    title
    content
    published
    author {
      id
      name
      email
    }
  }
}
```

<details><summary><strong>See more API operations</strong></summary>

### Register a new user

You can send the following mutation in the Playground to sign up a new user and retrieve an authentication token for them:

```graphql
mutation {
  signup(name: "Sarah", email: "sarah@prisma.io", password: "HelloWorld42") {
    token
  }
}
```

### Log in an existing user

This mutation will log in an existing user by requesting a new authentication token for them.

```graphql
mutation {
  login(email: "sarah@prisma.io", password: "HelloWorld42") {
    token
  }
}
```

If you seeded the database with sample data in step 2. of this README, you can use the following `email` and `password` combinations (from [`prisma/seed.ts`](./prisma/seed.ts)) for the `login` mutation as well:

| Email               | Password         |
| :------------------ | :--------------- |
| `alice@prisma.io`   | `myPassword42`   |
| `nilu@prisma.io`    | `random42`       |
| `mahmoud@prisma.io` | `iLikeTurtles42` |

### Check whether a user is currently logged in with the `me` query

For this query, you need to make sure a valid authentication token is sent along with the `Bearer`-prefix in the `Authorization` header of the request:

```json
{
  "Authorization": "Bearer __YOUR_TOKEN__"
}
```

With a real token, this looks similar to this:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanAydHJyczFmczE1MGEwM3kxaWl6c285IiwiaWF0IjoxNTQzNTA5NjY1fQ.Vx6ad6DuXA0FSQVyaIngOHYVzjKwbwq45flQslnqX04"
}
```

Inside the Playground, you can set HTTP headers in the bottom-left corner:

![](https://imgur.com/ToRcCTj.png)

Once you've set the header, you can send the following query to check whether the token is valid:

```graphql
{
  me {
    id
    name
    email
  }
}
```

### Create a new draft

You need to be logged in for this query to work, i.e. an authentication token that was retrieved through a `signup` or `login` mutation needs to be added to the `Authorization` header in the GraphQL Playground.

```graphql
mutation {
  createDraft(
    data: {
      title: "Join the Prisma Discord"
      content: "https://pris.ly/discord"
    }
  ) {
    id
    published
  }
}
```

### Publish an existing post

You need to be logged in for this query to work, i.e. an authentication token that was retrieved through a `signup` or `login` mutation needs to be added to the `Authorization` header in the GraphQL Playground. The authentication token must belong to the user who created the post.

```graphql
mutation {
  togglePublishPost(id: __POST_ID__) {
    id
    published
  }
}
```

Note that you need to replace the `__POST_ID__` placeholder with an actual `id` from a `Post` record in the database, e.g.`5`:

```graphql
mutation {
  togglePublishPost(id: 5) {
    id
    published
  }
}
```

### Search for posts with a specific title or content

```graphql
{
  feed(searchString: "prisma") {
    id
    title
    content
    published
  }
}
```

### Retrieve a single post

You need to be logged in for this query to work, i.e. an authentication token that was retrieved through a `signup` or `login` mutation needs to be added to the `Authorization` header in the GraphQL Playground.

```graphql
{
  postById(id: __POST_ID__) {
    id
    title
    content
    published
  }
}
```

Note that you need to replace the `__POST_ID__` placeholder with an actual `id` from a `Post` record in the database, e.g.`5`:

```graphql
{
  postById(id: 5) {
    id
    title
    content
    published
  }
}
```

### Delete a post

You need to be logged in for this query to work, i.e. an authentication token that was retrieved through a `signup` or `login` mutation needs to be added to the `Authorization` header in the GraphQL Playground. The authentication token must belong to the user who created the post.

```graphql
mutation {
  deletePost(id: __POST_ID__) {
    id
  }
}
```

Note that you need to replace the `__POST_ID__` placeholder with an actual `id` from a `Post` record in the database, e.g.`5`:

```graphql
mutation {
  deletePost(id: 5) {
    id
  }
}
```

### Retrieve the drafts of a user

You need to be logged in for this query to work, i.e. an authentication token that was retrieved through a `signup` or `login` mutation needs to be added to the `Authorization` header in the GraphQL Playground.

```graphql
{
  draftsByUser(userUniqueInput: { email: "mahmoud@prisma.io" }) {
    id
    title
    content
    published
    author {
      id
      name
      email
    }
  }
}
```

</details>

### Authenticating GraphQL requests

In this example, you authenticate your GraphQL requests using the `Authorization` header field of the HTTP requests which are sent from clients to your GraphQL server. The required authentication token is returned by successful `signup` and `login` mutations.

Using the GraphQL Playground, the `Authorization` header can be configured in the **HTTP HEADERS** tab in the bottom-left corner of the GraphQL Playground. The values for the HTTP headers are defined in JSON format. Note that the authentication token needs to be sent with the `Bearer `-prefix:

```json
{
  "Authorization": "Bearer __YOUR_TOKEN__"
}
```

With a "real" authentication token, it looks similar to this:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanAydHJyczFmczE1MGEwM3kxaWl6c285IiwiaWF0IjoxNTQzNTA5NjY1fQ.Vx6ad6DuXA0FSQVyaIngOHYVzjKwbwq45flQslnqX04"
}
```

As mentioned before, you can set HTTP headers in the bottom-left corner of the GraphQL Playground:

![](https://imgur.com/ToRcCTj.png)

## Authentication & Authorization

### JWT Authentication

The API uses JWT tokens for authentication with support for refresh tokens:

```typescript
// Login response includes both tokens
{
  "data": {
    "loginWithTokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
      "user": {
        "id": "VXNlcjox",
        "email": "user@example.com"
      }
    }
  }
}
```

### Authorization System

The project implements dual authorization layers that work together:

#### 1. GraphQL Shield Plugin (Custom Pothos Plugin)

Declarative permission rules defined inline with field definitions:

```typescript
builder.mutationField('updatePost', (t) =>
  t.prismaField({
    type: 'Post',
    grantScopes: ['authenticated'], // Pothos Scope Auth
    shield: and(isAuthenticatedUser, isPostOwner), // GraphQL Shield rules
    args: { /* ... */ },
    resolve: async (query, _parent, args, context) => {
      // Implementation
    },
  }),
)
```

Common Shield rules:

| Rule                | Description                                    |
| :------------------ | :--------------------------------------------- |
| `isAuthenticatedUser` | Requires valid JWT token                     |
| `isPostOwner`       | Requires user to be the post author           |
| `isPublic`          | Allows public access                          |
| `rateLimitSensitiveOperations` | Rate limits sensitive operations |

#### 2. Pothos Scope Auth Plugin

Dynamic, context-aware authorization:

```typescript
// Field-level authorization
builder.queryField('adminData', (t) =>
  t.field({
    type: 'AdminData',
    authScopes: {
      authenticated: true,
      hasPermission: 'admin:read',
    },
    resolve: () => getAdminData(),
  })
)

// Resource-based authorization
builder.mutationField('updatePost', (t) =>
  t.field({
    type: 'Post',
    authScopes: (parent, args, context) => ({
      canEditContent: ['Post', args.id],
    }),
    resolve: (parent, args) => updatePost(args),
  })
)
```

Available scopes:
- `authenticated` - User is logged in
- `hasPermission(permission)` - User has specific permission
- `canViewContent(type, id)` - Can view specific content
- `canEditContent(type, id)` - Can edit specific content
- `withinTimeLimit(action, limit)` - Time-based restrictions
- `postOwner(postId)` - User owns the post
- And more...

See [Enhanced Authorization](./src/core/auth/scopes.ts) for full scope implementation.

## Advanced Features

### Performance Optimizations

1. **N+1 Query Prevention**: DataLoader automatically batches and caches database queries
2. **Field-Level Optimization**: Prisma only selects fields requested by GraphQL
3. **Query Complexity Limiting**: Prevents resource-intensive queries
4. **Rate Limiting**: Configurable rate limits per operation

### Error Handling

Comprehensive error hierarchy with descriptive messages:

```typescript
// Error types with proper HTTP status codes
- AuthenticationError (401): "Authentication required"
- AuthorizationError (403): "You can only modify your own posts"
- ValidationError (400): Field-specific validation errors
- NotFoundError (404): "Post with ID 'xyz' not found"
- ConflictError (409): "Email already exists"
- RateLimitError (429): "Too many requests"
```

### Input Validation

Zod-based validation with async refinements:

```graphql
mutation CreatePost($title: String!, $content: String!) {
  createPost(title: $title, content: $content) {
    id
    title
  }
}

# Validation rules:
# - Title: 3-100 characters, unique per user
# - Content: Minimum 10 characters
# - Async check for duplicate titles
```

## Development Guide

### Project Structure

```
graphql-auth/
├── src/
│   ├── schema/                 # GraphQL schema definition
│   ├── app/                   # Application layer
│   ├── context/               # Request context
│   ├── errors/                # Error classes
│   ├── permissions/           # Authorization rules
│   └── utils/                 # Utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data
├── test/                      # Test suite
└── _docs/                     # Generated docs
```

### Common Development Tasks

#### Adding a New Feature

1. **Update Database Schema**:
   ```bash
   # Edit prisma/schema.prisma
   bunx prisma migrate dev --name add-feature
   ```

2. **Define GraphQL Types**:
   ```typescript
   // src/schema/types/feature.ts
   builder.prismaObject('Feature', {
     fields: (t) => ({
       id: t.exposeID('id'),
       name: t.exposeString('name'),
     }),
   });
   ```

3. **Create Resolver**:
   ```typescript
   // src/modules/feature/resolvers/feature.resolver.ts
   builder.mutationField('createFeature', (t) =>
     t.prismaField({
       type: 'Feature',
       args: {
         name: t.arg.string({ required: true }),
       },
       resolve: async (query, parent, args, context) => {
         return prisma.feature.create({
           ...query,
           data: args,
         });
       },
     })
   );
   ```

4. **Add Permissions**:
   ```typescript
   // src/permissions/shield-config.ts
   Mutation: {
     createFeature: isAuthenticatedUser,
   }
   ```

### Environment Variables

```bash
# .env
DATABASE_URL="file:./dev.db"     # SQLite database
JWT_SECRET="your-secret-key"      # JWT signing secret
BCRYPT_ROUNDS=10                  # Password hashing rounds
NODE_ENV="development"            # Environment mode
```

## Testing

Comprehensive test suite with:

- **Unit Tests**: Business logic and utilities
- **Integration Tests**: GraphQL operations
- **E2E Tests**: Complete user flows
- **Performance Tests**: Query complexity and response times

```bash
# Run all tests
bun test

# Run specific test file
bun test auth.test.ts

# Run with coverage
bun test --coverage

# Run tests in watch mode
bun test --watch
```

See [Test Documentation](./test/README.md) for detailed testing guide.

## Deployment

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

### Database Migration

```bash
# Apply migrations in production
bunx prisma migrate deploy
```

### Environment Setup

1. Set production environment variables
2. Configure database connection (PostgreSQL recommended)
3. Set up reverse proxy (nginx/caddy)
4. Enable HTTPS
5. Configure monitoring (APM, logs)

## Evolving the app

Evolving the application typically requires two steps:

1. Migrate your database using Prisma Migrate
1. Update your application code

For the following example scenario, assume you want to add a "profile" feature to the app where users can create a profile and write a short bio about themselves.

### 1. Migrate your database using Prisma Migrate

The first step is to add a new table, e.g. called `Profile`, to the database. You can do this by adding a new model to your [Prisma schema file](./prisma/schema.prisma) file and then running a migration afterwards:

```diff
// ./prisma/schema.prisma

model User {
  id      Int      @default(autoincrement()) @id
  name    String?
  email   String   @unique
  posts   Post[]
+ profile Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

+model Profile {
+  id     Int     @default(autoincrement()) @id
+  bio    String?
+  user   User    @relation(fields: [userId], references: [id])
+  userId Int     @unique
+}
```

Once you've updated your data model, you can execute the changes against your database with the following command:

```bash
bunx prisma migrate dev --name add-profile
```

This adds another migration to the `prisma/migrations` directory and creates the new `Profile` table in the database.

### 2. Update your application code

You can now use your `PrismaClient` instance to perform operations against the new `Profile` table. Those operations can be used to implement queries and mutations in the GraphQL API.

#### 2.1. Add the `Profile` type to your GraphQL schema

First, add a new GraphQL type using Pothos:

```diff
// ./src/schema.ts

+builder.prismaObject('Profile', {
+  fields: (t) => ({
+    id: t.exposeInt('id'),
+    bio: t.exposeString('bio', { nullable: true }),
+    user: t.relation('user'),
+  }),
+});

// Update the User object to include profile relation
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    posts: t.relation('posts'),
+   profile: t.relation('profile', { nullable: true }),
  }),
});
```

With Pothos, types are automatically included when you define them with the builder, so no additional configuration is needed.

Note that in order to resolve any type errors, your development server needs to be running so that the Pothos types can be generated. If it's not running, you can start it with `bun run dev`.

#### 2.2. Add a `createProfile` GraphQL mutation

```diff
// ./src/schema.ts

+// Define input type for user selection
+const UserUniqueInput = builder.inputType('UserUniqueInput', {
+  fields: (t) => ({
+    id: t.int({ required: false }),
+    email: t.string({ required: false }),
+  }),
+});

+// Add the mutation
+builder.mutationField('addProfileForUser', (t) =>
+  t.prismaField({
+    type: 'Profile',
+    args: {
+      userUniqueInput: t.arg({ type: UserUniqueInput, required: true }),
+      bio: t.arg.string({ required: false }),
+    },
+    resolve: async (query, root, args, context) => {
+      return context.prisma.profile.create({
+        ...query,
+        data: {
+          bio: args.bio,
+          user: {
+            connect: {
+              id: args.userUniqueInput.id || undefined,
+              email: args.userUniqueInput.email || undefined,
+            }
+          }
+        }
+      })
+    }
+  })
+);
```

Finally, you can test the new mutation like this:

```graphql
mutation {
  addProfileForUser(
    userUniqueInput: { email: "mahmoud@prisma.io" }
    bio: "I like turtles"
  ) {
    id
    bio
    user {
      id
      name
    }
  }
}
```

<details><summary>Expand to view more sample Prisma Client queries on <code>Profile</code></summary>

Here are some more sample Prisma Client queries on the new <code>Profile</code> model:

##### Create a new profile for an existing user

```ts
const profile = await prisma.profile.create({
  data: {
    bio: 'Hello World',
    user: {
      connect: { email: 'alice@prisma.io' },
    },
  },
})
```

##### Create a new user with a new profile

```ts
const user = await prisma.user.create({
  data: {
    email: 'john@prisma.io',
    name: 'John',
    profile: {
      create: {
        bio: 'Hello World',
      },
    },
  },
})
```

##### Update the profile of an existing user

```ts
const userWithUpdatedProfile = await prisma.user.update({
  where: { email: 'alice@prisma.io' },
  data: {
    profile: {
      update: {
        bio: 'Hello Friends',
      },
    },
  },
})
```

</details>

## Switch to another database (e.g. PostgreSQL, MySQL, SQL Server, MongoDB)

If you want to try this example with another database than SQLite, you can adjust the the database connection in [`prisma/schema.prisma`](./prisma/schema.prisma) by reconfiguring the `datasource` block.

Learn more about the different connection configurations in the [docs](https://www.prisma.io/docs/reference/database-reference/connection-urls).

<details><summary>Expand for an overview of example configurations with different databases</summary>

### PostgreSQL

For PostgreSQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
}
```

Here is an example connection string with a local PostgreSQL database:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://janedoe:mypassword@localhost:5432/notesapi?schema=public"
}
```

### MySQL

For MySQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://USER:PASSWORD@HOST:PORT/DATABASE"
}
```

Here is an example connection string with a local MySQL database:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://janedoe:mypassword@localhost:3306/notesapi"
}
```

### Microsoft SQL Server

Here is an example connection string with a local Microsoft SQL Server database:

```prisma
datasource db {
  provider = "sqlserver"
  url      = "sqlserver://localhost:1433;initial catalog=sample;user=sa;password=mypassword;"
}
```

### MongoDB

Here is an example connection string with a local MongoDB database:

```prisma
datasource db {
  provider = "mongodb"
  url      = "mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
}
```

</details>

## 📖 Additional Documentation

- [**POTHOS_INTEGRATION_GUIDE.md**](./POTHOS_INTEGRATION_GUIDE.md) - Comprehensive Pothos patterns and plugins
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Detailed architecture documentation
- [**CLAUDE.md**](./CLAUDE.md) - AI assistant integration guide
- [**NAMING-CONVENTIONS.md**](./NAMING-CONVENTIONS.md) - Code style and naming standards

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards
4. Add tests for new features
5. Submit a pull request

## 📚 Resources

### Documentation
- [Pothos GraphQL Documentation](https://pothos-graphql.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)

### Community
- [Pothos Discord](https://discord.gg/mYjxFuTW)
- [Prisma Discord](https://pris.ly/discord)
- [GraphQL Discord](https://discord.graphql.org/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Pothos GraphQL](https://github.com/hayes/pothos) by Michael Hayes
- [Prisma](https://github.com/prisma/prisma) team for the amazing ORM
- [Apollo GraphQL](https://github.com/apollographql) for the server framework
- All contributors and maintainers of the dependencies

## AI Development Assistance

This project is configured with **Context7 MCP** (Model Context Protocol) to provide enhanced AI assistance. Context7 understands the project's architecture, patterns, and conventions to generate consistent, high-quality code.

### Setup Context7 MCP

1. **Install the MCP server**:

   ```bash
   bun add -D @context7/mcp-server
   ```

2. **Configure Claude Desktop** (add to `claude_desktop_config.json`):

   ```json
   {
     "mcpServers": {
       "context7": {
         "command": "context7-mcp",
         "args": ["--project", "/path/to/graphql-auth"]
       }
     }
   }
   ```

3. **Initialize Context7**:
   ```bash
   bunx context7 init
   ```

See [CONTEXT7.md](./CONTEXT7.md) for detailed setup instructions and usage examples.

### Benefits

With Context7 MCP, AI assistants will:

- Understand Pothos GraphQL patterns and best practices
- Follow Prisma ORM conventions (always spread `query` parameter)
- Apply DataLoader patterns for N+1 prevention
- Maintain consistent error handling
- Use Relay-style connections and global IDs
- Respect JWT authentication patterns
