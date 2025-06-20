# GraphQL Server with Authentication & Permissions

This example shows how to implement a **GraphQL server with TypeScript** with the following stack:

- [**Apollo Server**](https://github.com/apollographql/apollo-server): HTTP server for GraphQL APIs
- [**Pothos**](https://pothos-graphql.dev/): GraphQL schema definition and resolver implementation
- [**GraphQL Shield**](https://github.com/maticzav/graphql-shield): Authorization/permission layer for GraphQL schemas
- [**Prisma Client**](https://www.prisma.io/docs/concepts/components/prisma-client): Databases access (ORM)
- [**Prisma Migrate**](https://www.prisma.io/docs/concepts/components/prisma-migrate): Database migrations
- [**SQLite**](https://www.sqlite.org/index.html): Local, file-based SQL database

## Contents

- [Getting Started](#getting-started)
- [Using the GraphQL API](#using-the-graphql-api)
- [Evolving the app](#evolving-the-app)
- [Switch to another database (e.g. PostgreSQL, MySQL, SQL Server)](#switch-to-another-database-eg-postgresql-mysql-sql-server)
- [Next steps](#next-steps)

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

## GraphQL Schema & Operations

The GraphQL schema is automatically generated and maintained in [`_docs/schema.graphql`](./_docs/schema.graphql). You can regenerate it at any time using:

```bash
bun run gen:schema
```

### Schema Overview

The API provides the following main types:

#### **Queries**

- `allUsers` - Retrieve all users
- `me` - Get current authenticated user profile
- `feed` - Get published posts with filtering and pagination
- `postById` - Get a specific post by ID
- `draftsByUser` - Get unpublished posts by user

#### **Mutations**

- `signup` - Register a new user account
- `login` - Authenticate and get JWT token
- `createDraft` - Create a new unpublished post
- `togglePublishPost` - Publish/unpublish a post
- `incrementPostViewCount` - Track post views
- `deletePost` - Remove a post

#### **Types**

- `User` - User account with id, name, email, posts
- `Post` - Blog post with metadata, content, author relationship
- `DateTime` - ISO 8601 timestamp scalar

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

### Authorization rules

The following [authorization rules](./src/permissions/index.ts) are defined for the GraphQL API via GraphQL Shield:

| Operation name           | Operation type | Rule                  | Description                                                                              |
| :----------------------- | :------------- | :-------------------- | :--------------------------------------------------------------------------------------- |
| `me`                     | Query          | `isAuthenticatedUser` | Requires a user to be authenticated                                                      |
| `draftsByUser`           | Query          | `isAuthenticatedUser` | Requires a user to be authenticated                                                      |
| `postById`               | Query          | `isAuthenticatedUser` | Requires a user to be authenticated                                                      |
| `createDraft`            | Mutation       | `isAuthenticatedUser` | Requires a user to be authenticated                                                      |
| `deletePost`             | Mutation       | `isPostOwner`         | Requires the authenticated user to be the author of the post to be deleted               |
| `incrementPostViewCount` | Mutation       | `isAuthenticatedUser` | Requires a user to be authenticated                                                      |
| `togglePublishPost`      | Mutation       | `isPostOwner`         | Requires the authenticated user to be the author of the post to be published/unpublished |

The `isAuthenticatedUser` rule requires you to send a valid authentication token. The `isPostOwner` rule additionaly requires the user to whom this authentication token belongs to be the author of the post on which the operation is applied.

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

## Next steps

- Check out the [Prisma docs](https://www.prisma.io/docs)
- [Join our community on Discord](https://pris.ly/discord?utm_source=github&utm_medium=prisma_examples&utm_content=next_steps_section) to share feedback and interact with other users.
- [Subscribe to our YouTube channel](https://pris.ly/youtube?utm_source=github&utm_medium=prisma_examples&utm_content=next_steps_section) for live demos and video tutorials.
- [Follow us on X](https://pris.ly/x?utm_source=github&utm_medium=prisma_examples&utm_content=next_steps_section) for the latest updates.
- Report issues or ask [questions on GitHub](https://pris.ly/github?utm_source=github&utm_medium=prisma_examples&utm_content=next_steps_section).

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
