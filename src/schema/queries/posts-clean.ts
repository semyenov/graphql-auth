import type { EnhancedContext } from '../../context/enhanced-context'
import { PostId } from '../../core/value-objects/post-id.vo'
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
import { builder } from '../builder'
import { PostOrderByInput, PostWhereInput } from '../inputs'
import { transformOrderBy } from '../utils/filter-transform'

// Enhanced post by ID query - uses clean architecture
builder.queryField('post', (t) =>
    t.prismaField({
        type: 'Post',
        nullable: true,
        args: {
            id: t.arg.id({
                required: true,
                description: 'Global ID of the post to retrieve',
            }),
        },
        resolve: async (query, _parent, args, ctx: EnhancedContext) => {
            try {
                // Decode the global ID to get the numeric ID
                const postId = parseGlobalId(args.id.toString(), 'Post')

                // Use the get post use case
                const postDto = await ctx.useCases.posts.get.execute({
                    postId: PostId.create(postId),
                    userId: ctx.userId || undefined,
                })

                if (!postDto) return null

                // Fetch the full post data with Prisma query optimization
                // Use the prisma client directly with the query parameter
                // Convert string ID to number for Prisma
                return ctx.prisma.post.findUnique({
                    ...query,
                    where: { id: parseInt(postDto.id, 10) },
                })
            } catch (error) {
                // Post not found or not accessible
                return null
            }
        },
    })
)

// Enhanced feed query using clean architecture
builder.queryField('feed', (t) =>
    t.prismaConnection({
        type: 'Post',
        cursor: 'id',
        args: {
            searchString: t.arg.string({
                description: 'Search in title and content',
            }),
            where: t.arg({
                type: PostWhereInput,
                description: 'Advanced filtering options',
            }),
            orderBy: t.arg({
                type: [PostOrderByInput],
                defaultValue: [{ createdAt: 'desc' }],
                description: 'Ordering options (default: newest first)',
            }),
        },
        resolve: async (query, _parent, args, ctx: EnhancedContext) => {
            // Use the get feed use case for business logic
            const result = await ctx.useCases.posts.getFeed.execute({
                searchString: args.searchString ?? undefined,
                skip: query.skip ?? 0,
                take: query.take ?? 10,
                orderBy: args.orderBy?.map(transformOrderBy).filter(Boolean),
            })

            // Return posts with Prisma optimization
            // Convert string IDs to numbers for Prisma
            const postIds = result.posts.map(p => parseInt(p.id, 10))
            return ctx.prisma.post.findMany({
                ...query,
                where: { id: { in: postIds } },
                orderBy: args.orderBy?.map(transformOrderBy).filter(Boolean) || [{ createdAt: 'desc' }],
            })
        },
        totalCount: async (_parent, args, ctx: EnhancedContext) => {
            const result = await ctx.useCases.posts.getFeed.execute({
                searchString: args.searchString ?? undefined,
            })
            return result.totalCount
        },
    })
)

// Enhanced drafts query using clean architecture
builder.queryField('drafts', (t) =>
    t.prismaConnection({
        type: 'Post',
        cursor: 'id',
        nullable: true,
        args: {
            userId: t.arg.id({
                required: true,
                description: 'Global ID of the user whose drafts to retrieve',
            }),
            where: t.arg({
                type: PostWhereInput,
                description: 'Additional filtering options for drafts',
            }),
            orderBy: t.arg({
                type: [PostOrderByInput],
                defaultValue: [{ updatedAt: 'desc' }],
                description: 'Ordering options (default: most recently updated first)',
            }),
        },
        resolve: async (query, _parent, args, ctx: EnhancedContext) => {
            // Check if user is authenticated
            if (!ctx.userId) {
                return []
            }

            try {
                // Decode the global ID
                const requestedUserId = parseGlobalId(args.userId.toString(), 'User')

                // Use the get user drafts use case
                const result = await ctx.useCases.posts.getUserDrafts.execute({
                    requestedUserId: requestedUserId.toString(),
                    currentUserId: ctx.userId.toString(),
                    skip: query.skip ?? 0,
                    take: query.take ?? 10,
                    orderBy: args.orderBy?.map(transformOrderBy).filter(Boolean),
                })

                // Return drafts with Prisma optimization
                // Convert string IDs to numbers for Prisma
                const draftIds = result.drafts.map(d => parseInt(d.id, 10))
                return ctx.prisma.post.findMany({
                    ...query,
                    where: { id: { in: draftIds } },
                    orderBy: args.orderBy?.map(transformOrderBy).filter(Boolean) || [{ updatedAt: 'desc' }],
                })
            } catch (error) {
                // Invalid user ID or unauthorized access
                return []
            }
        },
        totalCount: async (_parent, args, ctx: EnhancedContext) => {
            if (!ctx.userId) return 0

            try {
                const requestedUserId = parseGlobalId(args.userId.toString(), 'User')
                const result = await ctx.useCases.posts.getUserDrafts.execute({
                    requestedUserId: requestedUserId.toString(),
                    currentUserId: ctx.userId.toString(),
                })
                return result.totalCount
            } catch (error) {
                return 0
            }
        },
    })
)