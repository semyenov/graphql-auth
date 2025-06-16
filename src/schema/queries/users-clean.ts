import type { EnhancedContext } from '../../context/enhanced-context'
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

