/**
 * Example implementations showing how to use Pothos Relay plugin patterns
 * These are not active in the current schema but demonstrate the migration path
 */

import { Prisma } from '@prisma/client'
import { prisma } from '../prisma'
import { builder } from './builder'

// 1. Define the Node interface (automatically done by Relay plugin)
// This allows global object identification across your schema

// 2. Convert Post type to use Relay Node pattern
export const RelayPost = builder.prismaNode('Post', {
  // Automatically generates 'id' field with global ID encoding
  id: { field: 'id' }, // Maps Prisma's numeric id to Relay's global ID
  fields: (t) => ({
    // Use the new field helpers from Pothos-Prisma plugin
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    title: t.exposeString('title'),
    content: t.exposeString('content', { nullable: true }),
    published: t.exposeBoolean('published'),
    viewCount: t.exposeInt('viewCount'),
    author: t.relation('author'),
  }),
})

// 3. Convert User type to use Relay Node pattern
export const RelayUser = builder.prismaNode('User', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    posts: t.relation('posts'),
  }),
})

// 4. Implement cursor-based pagination for feed query
export const relayFeedQuery = builder.queryField('relayFeed', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id', // Use id field for cursor
    args: {
      searchString: t.arg.string(),
      onlyPublished: t.arg.boolean({ defaultValue: true }),
    },
    resolve: (query, _parent, args) => {
      const where: Prisma.PostWhereInput = {
        ...(args.onlyPublished && { published: true }),
        ...(args.searchString && {
          OR: [
            { title: { contains: args.searchString } },
            { content: { contains: args.searchString } },
          ],
        }),
      }

      return prisma.post.findMany({
        ...query, // IMPORTANT: Includes cursor, limit, and order handling
        where,
        orderBy: { createdAt: 'desc' }, // Default ordering for stable pagination
      })
    },
    // Optional: Custom connection fields
    totalCount(_parent, args, _context, _info): Promise<number> {
      const where = {
        ...(args.onlyPublished && { published: true }),
        ...(args.searchString && {
          OR: [
            { title: { contains: args.searchString } },
            { content: { contains: args.searchString } },
          ],
        }),
      }
      return prisma.post.count({ where }) as Promise<number>
    },
  }),
)

// 5. User's posts with pagination
export const userPostsConnection = builder.queryField('userPosts', (t) =>
  t.prismaConnection({
    type: 'Post',
    cursor: 'id',
    args: {
      userId: t.arg.id({ required: true }),
      includeUnpublished: t.arg.boolean({ defaultValue: false }),
    },
    resolve: async (query, _parent, args, _ctx) => {
      // Decode the global ID to get the numeric ID
      const numericId = parseGlobalID(args.userId as string)
      if (typeof numericId !== 'number') {
        throw new Error('Invalid user ID')
      }

      return prisma.post.findMany({
        ...query,
        where: {
          authorId: numericId,
          ...(!args.includeUnpublished && { published: true }),
        },
        orderBy: { createdAt: 'desc' },
      })
    },
  }),
)


// 8. Parse global ID
export const parseGlobalID = (id: string) => {
  return parseInt(id, 10)
}

// Example of how to use these in client code:
/*
// Old offset-based query:
query GetFeed($skip: Int, $take: Int) {
  feed(skip: $skip, take: $take) {
    id
    title
    author { name }
  }
}

// New cursor-based query:
query GetRelayFeed($first: Int, $after: String) {
  relayFeed(first: $first, after: $after) {
    edges {
      cursor
      node {
        id  # This is now a global ID
        title
        author { name }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

// Fetching by global ID:
query GetPost($id: ID!) {
  node(id: $id) {
    ... on Post {
      title
      content
      author { name }
    }
  }
}
*/