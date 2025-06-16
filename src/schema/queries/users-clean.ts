import type { EnhancedContext } from '../../context/enhanced-context'
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
import { builder } from '../builder'
import { UserOrderByInput, UserWhereInput } from '../inputs'
import { transformOrderBy, transformUserWhereInput } from '../utils/filter-transform'

// Enhanced users query with filtering and ordering - uses clean architecture
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
            // Apply filtering
            const where = transformUserWhereInput(args.where) || {}
            const orderBy = transformOrderBy(args.orderBy) || { id: 'asc' }

            return ctx.prisma.user.findMany({
                ...query,
                where,
                orderBy,
            })
        },
        totalCount: (_parent, args, ctx: EnhancedContext) => {
            const where = transformUserWhereInput(args.where) || {}
            return ctx.prisma.user.count({ where })
        },
    })
)

// Current user query - uses clean architecture
builder.queryField('me', (t) =>
    t.prismaField({
        type: 'User',
        nullable: true,
        description: 'Get the currently authenticated user',
        resolve: async (query, _parent, _args, ctx: EnhancedContext) => {
            if (!ctx.userId) return null

            try {
                // Use the get current user use case
                const userDto = await ctx.useCases.users.getCurrentUser.execute({
                    userId: ctx.userId.toString(),
                })

                if (!userDto) return null

                // Fetch the full user data with Prisma query optimization
                return ctx.prisma.user.findUnique({
                    ...query,
                    where: { id: parseInt(userDto.id) },
                })
            } catch (error) {
                return null
            }
        },
    })
)

// Enhanced user by ID query - uses clean architecture
builder.queryField('user', (t) =>
    t.prismaField({
        type: 'User',
        nullable: true,
        args: {
            id: t.arg.id({
                required: true,
                description: 'Global ID of the user to retrieve',
            }),
        },
        resolve: async (query, _parent, args, ctx: EnhancedContext) => {
            try {
                // Decode the global ID
                const userId = parseGlobalId(args.id.toString(), 'User')

                // Use the get user by id use case
                const userDto = await ctx.useCases.users.getUserById.execute({
                    userId: userId.toString(),
                })

                if (!userDto) return null

                // Fetch the full user data with Prisma query optimization
                return ctx.prisma.user.findUnique({
                    ...query,
                    where: { id: parseInt(userDto.id) },
                })
            } catch (error) {
                // Invalid global ID format or user not found
                return null
            }
        },
    })
)

// Search users query - uses clean architecture
builder.queryField('searchUsers', (t) =>
    t.prismaConnection({
        type: 'User',
        cursor: 'id',
        description: 'Search users by name or email',
        args: {
            searchTerm: t.arg.string({
                required: true,
                description: 'Search term to match against name or email',
            }),
            orderBy: t.arg({
                type: [UserOrderByInput],
                defaultValue: [{ name: 'asc' }],
                description: 'Ordering options (default: by name ascending)',
            }),
        },
        resolve: async (query, _parent, args, ctx: EnhancedContext) => {
            // Use the search users use case
            const result = await ctx.useCases.users.searchUsers.execute({
                searchTerm: args.searchTerm,
                skip: query.skip ?? 0,
                take: query.take ?? 10,
            })

            // Return users with Prisma optimization
            const userIds = result.users.map(u => parseInt(u.id))
            if (userIds.length === 0) return []

            return ctx.prisma.user.findMany({
                ...query,
                where: { id: { in: userIds } },
            })
        },
        totalCount: async (_parent, args, ctx: EnhancedContext) => {
            const result = await ctx.useCases.users.searchUsers.execute({
                searchTerm: args.searchTerm,
            })
            return result.totalCount
        },
    })
)