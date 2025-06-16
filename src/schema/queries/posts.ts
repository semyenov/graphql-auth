
import { prisma } from '../../prisma'
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
import { builder } from '../builder'

// Post by ID query - now accepts a global ID
builder.queryField('post', (t) =>
    t.prismaField({
        type: 'Post',
        nullable: true,
        args: {
            id: t.arg.id({ required: true }),
        },
        resolve: async (query, _parent, args) => {
            // Decode the global ID to get the numeric ID
            const postId = parseGlobalId(args.id.toString(), 'Post')

            return prisma.post.findUnique({
                ...query,
                where: { id: postId },
            })
        },
    })
)

// Feed query with cursor-based pagination
builder.queryField('feed', (t) =>
    t.prismaConnection({
        type: 'Post',
        cursor: 'id',
        args: {
            searchString: t.arg.string(),
        },
        resolve: (query, _parent, args) => {
            const where = {
                published: true,
                ...(args.searchString && {
                    OR: [
                        { title: { contains: args.searchString } },
                        { content: { contains: args.searchString } },
                    ],
                }),
            }

            return prisma.post.findMany({
                ...query,
                where,
                orderBy: { createdAt: 'desc' },
            })
        },
        // Add totalCount field to the connection
        totalCount: (_parent, args) => {
            const where = {
                published: true,
                ...(args.searchString && {
                    OR: [
                        { title: { contains: args.searchString } },
                        { content: { contains: args.searchString } },
                    ],
                }),
            }
            return prisma.post.count({ where })
        },
    })
)

// User drafts with cursor-based pagination
builder.queryField('drafts', (t) =>
    t.prismaConnection({
        type: 'Post',
        cursor: 'id',
        nullable: true,
        args: {
            userId: t.arg.id({ required: true }),
        },
        resolve: async (query, _parent, args, ctx) => {
            // Check if user is authenticated and requesting their own drafts
            if (!ctx.userId) {
                return []
            }

            // Decode the global ID
            const requestedUserId = parseGlobalId(args.userId.toString(), 'User')

            // Users can only see their own drafts
            if (ctx.userId !== requestedUserId) {
                return []
            }

            return prisma.post.findMany({
                ...query,
                where: {
                    authorId: requestedUserId,
                    published: false,
                },
                orderBy: { updatedAt: 'desc' },
            })
        },
    })
) 