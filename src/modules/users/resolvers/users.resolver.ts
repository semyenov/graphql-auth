/**
 * Users GraphQL Resolvers (Direct Implementation)
 *
 * Implements user operations directly in Pothos resolvers without use cases.
 */

import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { ConflictError } from '../../../app/errors/types'
import {
  isAuthenticatedUser,
  isPublic,
  or,
} from '../../../graphql/middleware/rules'
import { builder } from '../../../graphql/schema/builder'
import {
  UserOrderByInput,
  UserWhereInput,
} from '../../../graphql/schema/inputs'
import {
  transformOrderBy,
  transformUserWhereInput,
} from '../../../graphql/schema/utils/filter-transform'
import { prisma } from '../../../prisma'
// import type { ILogger } from '../../../app/services/logger.interface'
import { parseGlobalId } from '../../../utils/relay'
import { requireAuthentication } from '../../auth/guards/auth.guards'

// Get logger from container
// const getLogger = () => container.resolve<ILogger>('ILogger')

// Get user by ID query
builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    description: 'Get a user by ID',
    shield: or(isPublic, isAuthenticatedUser),
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, _context) => {
      // const logger = getLogger().child({ resolver: 'user' })
      const userId = parseGlobalId(args.id.toString(), 'User')

      // logger.info('Fetching user by ID', { userId })

      const user = await prisma.user.findUnique({
        ...query,
        where: { id: userId },
      })

      if (!user) {
        // logger.warn('User not found', { userId })
        return null
      }

      return user
    },
  }),
)

// Get all users query with filtering and pagination
builder.queryField('users', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    description: 'Get all users with optional filtering',
    shield: isPublic,
    args: {
      where: t.arg({ type: UserWhereInput, required: false }),
      orderBy: t.arg({ type: UserOrderByInput, required: false }),
    },
    resolve: (query, _parent, args, _context) => {
      return prisma.user.findMany({
        ...query,
        where: args.where ? transformUserWhereInput(args.where) : undefined,
        orderBy: args.orderBy ? transformOrderBy(args.orderBy) : { id: 'asc' },
      })
    },
    totalCount: (_parent, args, _context) => {
      const whereClause = args.where
        ? transformUserWhereInput(args.where)
        : undefined
      return prisma.user.count({ where: whereClause })
    },
  }),
)

// Search users query
builder.queryField('searchUsers', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    description: 'Search users by name or email',
    shield: isPublic,
    args: {
      search: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1).max(100),
        },
      }),
    },
    resolve: (query, _parent, args, _context) => {
      // const logger = getLogger().child({ resolver: 'searchUsers' })
      // logger.info('Searching users', { searchTerm: args.search })

      return prisma.user.findMany({
        ...query,
        where: {
          OR: [
            { name: { contains: args.search } },
            { email: { contains: args.search } },
          ],
        },
        orderBy: { name: 'asc' },
      })
    },
    totalCount: (_parent, args, _context) => {
      return prisma.user.count({
        where: {
          OR: [
            { name: { contains: args.search } },
            { email: { contains: args.search } },
          ],
        },
      })
    },
  }),
)

// User type field resolvers

builder.prismaObjectField('User', 'postCount', (t) =>
  t.int({
    description: 'Total number of posts by this user',
    resolve: async (user, _args, _context) => {
      return prisma.post.count({
        where: { authorId: user.id },
      })
    },
  }),
)

builder.prismaObjectField('User', 'publishedPostCount', (t) =>
  t.int({
    description: 'Number of published posts by this user',
    resolve: async (user, _args, _context) => {
      return prisma.post.count({
        where: {
          authorId: user.id,
          published: true,
        },
      })
    },
  }),
)

// Update user profile mutation
const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    name: t.string({
      required: false,
      validate: {
        schema: z.string().min(1).max(100),
      },
    }),
    email: t.string({
      required: false,
      validate: {
        schema: z.string().email(),
      },
    }),
  }),
})

builder.mutationField('updateUserProfile', (t) =>
  t.prismaField({
    type: 'User',
    description: 'Update the current user profile',
    shield: isAuthenticatedUser,
    args: {
      input: t.arg({
        type: UpdateUserInput,
        required: true,
      }),
    },
    resolve: async (query, _parent, args, context) => {
      // const logger = getLogger().child({ resolver: 'updateUserProfile' })
      const userId = requireAuthentication(context)

      // logger.info('Updating user profile', { userId: userId.value })

      // Build update data
      const updateData: Prisma.UserUpdateInput = {}
      if (args.input.name !== undefined)
        updateData.name = args.input.name ?? null
      if (args.input.email !== undefined) {
        // Check if email is already taken
        const existingUser = await prisma.user.findUnique({
          where: { email: args.input.email },
          select: { id: true },
        })

        if (existingUser && existingUser.id !== userId.value) {
          throw new ConflictError('Email already in use')
        }

        updateData.email = args.input.email ?? undefined
      }

      const user = await prisma.user.update({
        ...query,
        where: { id: userId.value },
        data: updateData,
      })

      // logger.info('User profile updated', { userId: userId.value })

      return user
    },
  }),
)
