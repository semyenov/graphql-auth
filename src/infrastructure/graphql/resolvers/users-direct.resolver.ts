/**
 * Users GraphQL Resolvers (Direct Implementation)
 * 
 * Implements user operations directly in Pothos resolvers without use cases.
 */

import { container } from 'tsyringe'
import { z } from 'zod'
import type { EnhancedContext } from '../../../context/enhanced-context'
import { NotFoundError } from '../../../errors'
import { builder } from '../../../schema/builder'
import { parseAndValidateGlobalId } from '../../../shared/infrastructure/graphql/relay-helpers'
import { requireAuthentication } from '../../../context/auth'
import type { ILogger } from '../../../core/services/logger.interface'
import { transformUserWhereInput, transformOrderBy } from '../utils/filter-transform'

// Get logger from container
const getLogger = () => container.resolve<ILogger>('ILogger')

// Get user by ID query
builder.queryField('userDirect', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    description: 'Get a user by ID',
    authScopes: {
      $granted: 'public',
    },
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'userDirect' })
      const userId = await parseAndValidateGlobalId(args.id.toString(), 'User')
      
      logger.info('Fetching user by ID', { userId })
      
      const user = await context.prisma.user.findUnique({
        ...query,
        where: { id: userId },
      })
      
      if (!user) {
        logger.warn('User not found', { userId })
        return null
      }
      
      return user
    },
  })
)

// Get all users query with filtering and pagination
builder.queryField('usersDirect', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    description: 'Get all users with optional filtering',
    authScopes: {
      $granted: 'public',
    },
    args: {
      where: t.arg({ type: 'UserWhereInput' }),
      orderBy: t.arg({ type: ['UserOrderByInput'] }),
    },
    resolve: (query, _parent, args, context) => {
      const whereClause = args.where ? transformUserWhereInput(args.where) : undefined
      const orderByClause = args.orderBy?.map(transformOrderBy) || [{ id: 'asc' }]
      
      return context.prisma.user.findMany({
        ...query,
        where: whereClause,
        orderBy: orderByClause,
      })
    },
    totalCount: (_parent, args, context) => {
      const whereClause = args.where ? transformUserWhereInput(args.where) : undefined
      return context.prisma.user.count({ where: whereClause })
    },
  })
)

// Search users query
builder.queryField('searchUsersDirect', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    description: 'Search users by name or email',
    authScopes: {
      $granted: 'public',
    },
    args: {
      search: t.arg.string({
        required: true,
        validate: {
          schema: z.string().min(1).max(100),
        },
      }),
    },
    resolve: (query, _parent, args, context) => {
      const logger = getLogger().child({ resolver: 'searchUsersDirect' })
      logger.info('Searching users', { searchTerm: args.search })
      
      return context.prisma.user.findMany({
        ...query,
        where: {
          OR: [
            { name: { contains: args.search, mode: 'insensitive' } },
            { email: { contains: args.search, mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
      })
    },
    totalCount: (_parent, args, context) => {
      return context.prisma.user.count({
        where: {
          OR: [
            { name: { contains: args.search, mode: 'insensitive' } },
            { email: { contains: args.search, mode: 'insensitive' } },
          ],
        },
      })
    },
  })
)

// User type field resolvers
builder.prismaObjectField('User', 'postsDirect', (t) =>
  t.relatedConnection('posts', {
    cursor: 'id',
    description: 'Posts created by this user',
    args: {
      published: t.arg.boolean({
        required: false,
        description: 'Filter by published status',
      }),
    },
    query: (args, _context) => ({
      where: args.published !== undefined 
        ? { published: args.published }
        : undefined,
      orderBy: { createdAt: 'desc' },
    }),
    totalCount: true,
  })
)

builder.prismaObjectField('User', 'postCount', (t) =>
  t.int({
    description: 'Total number of posts by this user',
    resolve: async (user, _args, context) => {
      return context.prisma.post.count({
        where: { authorId: user.id },
      })
    },
  })
)

builder.prismaObjectField('User', 'publishedPostCount', (t) =>
  t.int({
    description: 'Number of published posts by this user',
    resolve: async (user, _args, context) => {
      return context.prisma.post.count({
        where: { 
          authorId: user.id,
          published: true,
        },
      })
    },
  })
)

// Update user profile mutation
const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    name: t.string({
      required: false,
      validate: {
        schema: z.string().min(1).max(100).optional(),
      },
    }),
    email: t.string({
      required: false,
      validate: {
        schema: z.string().email().optional(),
      },
    }),
  }),
})

builder.mutationField('updateUserProfile', (t) =>
  t.prismaField({
    type: 'User',
    description: 'Update the current user profile',
    authScopes: {
      $granted: 'authenticated',
    },
    args: {
      input: t.arg({
        type: UpdateUserInput,
        required: true,
      }),
    },
    resolve: async (query, _parent, args, context: EnhancedContext) => {
      const logger = getLogger().child({ resolver: 'updateUserProfile' })
      const userId = requireAuthentication(context)
      
      logger.info('Updating user profile', { userId: userId.value })
      
      // Build update data
      const updateData: any = {}
      if (args.input.name !== undefined) updateData.name = args.input.name
      if (args.input.email !== undefined) {
        // Check if email is already taken
        const existingUser = await context.prisma.user.findUnique({
          where: { email: args.input.email },
          select: { id: true },
        })
        
        if (existingUser && existingUser.id !== userId.value) {
          throw new ConflictError('Email already in use')
        }
        
        updateData.email = args.input.email
      }
      
      const user = await context.prisma.user.update({
        ...query,
        where: { id: userId.value },
        data: updateData,
      })
      
      logger.info('User profile updated', { userId: userId.value })
      
      return user
    },
  })
)