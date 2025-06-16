/**
 * Users GraphQL Resolvers
 * 
 * Handles user-related GraphQL operations using clean architecture.
 */

import type { EnhancedContext } from '../../../context/enhanced-context'
import { builder } from '../../../schema/builder'
import { UserSearchInput } from '../../../schema/inputs'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import { normalizeGraphQLError } from '../errors/graphql-error-handler'

builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    description: 'Get the currently authenticated user',
    resolve: async (query, _parent, _args, context: EnhancedContext) => {
      try {
        if (!context.userId) {
          return null
        }

        // Return the user with Prisma query for field selection
        return context.prisma.user.findUnique({
          ...query,
          where: { id: context.userId.value },
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Get user by ID query
builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    description: 'Get a user by their ID',
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      try {
        const numericId = parseGlobalId(args.id.toString(), 'User')

        // Return the user with Prisma query for field selection
        return context.prisma.user.findUnique({
          ...query,
          where: { id: numericId },
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
  })
)

// Search users query
builder.queryField('searchUsers', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    description: 'Search for users by name or email',
    args: {
      search: t.arg({ type: UserSearchInput }),
      first: t.arg({ type: 'Int', defaultValue: 10 }),
      after: t.arg({ type: 'String', defaultValue: '0' }),
    },
    resolve: async (query, _root, args, context: EnhancedContext) => {
      try {
        const result = await context.useCases.users.searchUsers.execute({
          searchTerm: args.search?.query ?? '',
        })

        // Convert to Prisma-compatible format for the connection
        return context.prisma.user.findMany({
          ...query,
          where: { id: { in: result.users.map(u => u.id) } },
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
    totalCount: async (_parent, args, context: EnhancedContext) => {
      try {
        const result = await context.useCases.users.searchUsers.execute({
          searchTerm: args.search?.query ?? '',
        })
        return result.totalCount
      } catch (error) {
        return 0
      }
    },
  })
)