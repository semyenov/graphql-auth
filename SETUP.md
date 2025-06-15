# GraphQL Auth Project Setup Guide

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Package Manager**: Bun
- **GraphQL Server**: Apollo Server 4 with Pothos schema builder
- **Database**: Prisma ORM with SQLite
- **Authentication**: JWT tokens with bcryptjs
- **Authorization**: GraphQL Shield middleware
- **HTTP Framework**: H3

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Set up the database:

```bash
bunx prisma migrate dev --name init
bun run seed
```

3. Start the development server:

```bash
bun run dev
```

The server will be available at http://localhost:4000

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run generate` - Generate Prisma client and GraphQL types
- `bun run seed` - Seed the database with sample data

## Database Management

- Create migrations: `bunx prisma migrate dev --name <name>`
- Generate Prisma client: `bunx prisma generate`
- Open Prisma Studio: `bunx prisma studio`

## Project Structure

```
src/
├── builder.ts          # Pothos schema builder configuration
├── context.ts         # GraphQL context setup
├── graphql-env.d.ts   # GraphQL type definitions
├── permissions/       # GraphQL Shield permissions
├── prisma.ts         # Prisma client setup
├── schema.ts         # GraphQL schema definition
├── server.ts         # Apollo Server setup
└── utils.ts          # JWT utilities
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

## Development

1. The project uses Pothos for GraphQL schema building
2. Prisma is used for database access
3. GraphQL Shield handles authorization
4. TypeScript provides type safety throughout

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL="file:./dev.db"
APP_SECRET="your-secret-key"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
