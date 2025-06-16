/**
 * Users GraphQL Resolvers
 * 
 * Handles user-related GraphQL operations using clean architecture.
 */

import type { EnhancedContext } from '../../../context/enhanced-context-direct'
import { builder } from '../../../schema/builder'
import { UserOrderByInput, UserSearchInput, UserWhereInput } from '../../../schema/inputs'
import { parseGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import { transformOrderBy, transformUserWhereInput } from '../../../schema/utils/filter-transform'
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

// Get all users query with filtering and ordering
builder.queryField('users', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    description: 'Get all users with advanced filtering and pagination',
    args: {
      where: t.arg({
        type: UserWhereInput,
        description: 'Filtering options for users',
      }),
      orderBy: t.arg({
        type: [UserOrderByInput],
        defaultValue: [{ id: 'asc' }],
        description: 'Ordering options (default: by ID ascending)',
      }),
    },
    resolve: async (query, _parent, args, ctx: EnhancedContext) => {
      try {
        // Apply filtering
        const where = transformUserWhereInput(args.where) || {}
        const orderBy = transformOrderBy(args.orderBy) || { id: 'asc' }

        return ctx.prisma.user.findMany({
          ...query,
          where,
          orderBy,
        })
      } catch (error) {
        throw normalizeGraphQLError(error)
      }
    },
    totalCount: async (_parent, args, ctx: EnhancedContext) => {
      try {
        const where = transformUserWhereInput(args.where) || {}
        return ctx.prisma.user.count({ where })
      } catch (error) {
        return 0
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