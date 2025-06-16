import { Prisma } from '@prisma/client'
import { getUserId } from '../../context/utils'
import { prisma } from '../../prisma'
import { builder } from '../builder'
import { parseGlobalID } from '../utils'

// Users query with cursor-based pagination
builder.queryField('users', (t) =>
    t.prismaConnection({
        type: 'User',
        cursor: 'id',
        resolve: (query) => prisma.user.findMany({
            ...query,
            orderBy: { updatedAt: 'desc' } as Prisma.UserOrderByWithRelationInput,
        }),
        totalCount: () => prisma.user.count(),
    })
)

// Current user query   
builder.queryField('me', (t) =>
    t.prismaField({
        type: 'User',
        nullable: true,
        resolve: (query, _parent, _args, context) => {
            const userId = getUserId(context)
            if (!userId) return null

            return prisma.user.findUnique({
                ...query,
                where: { id: userId },
            })
        },
    })
)

// User by ID query - accepts global ID
builder.queryField('user', (t) =>
    t.prismaField({
        type: 'User',
        nullable: true,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (query, _parent, args) => {
            const { id: userId } = parseGlobalID(args.id.toString(), 'User')

            return prisma.user.findUnique({
                ...query,
                where: { id: userId },
            })
        },
    })
) 