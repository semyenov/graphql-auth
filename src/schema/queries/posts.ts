
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
import { builder } from '../builder'
import { PostOrderByInput, PostWhereInput } from '../inputs'
import { transformOrderBy, transformPostWhereInput } from '../utils/filter-transform'

// Enhanced post by ID query - accepts global ID with error handling
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
        resolve: async (query, _parent, args, ctx) => {
            try {
                // Decode the global ID to get the numeric ID
                const postId = parseGlobalId(args.id.toString(), 'Post')

                const post = await ctx.repositories.posts.findById(postId)

                // Check if post exists and is accessible
                if (!post) return null;

                // If post is not published, only the author can see it
                if (!post.published && post.authorId !== ctx.userId) {
                    return null;
                }

                return post;
            } catch (error) {
                // Invalid global ID format
                return null;
            }
        },
    })
)

// Enhanced feed query with advanced filtering and ordering
builder.queryField('feed', (t) =>
    t.prismaConnection({
        type: 'Post',
        cursor: 'id',
        args: {
            // Backward compatibility
            searchString: t.arg.string({
                description: 'Search in title and content (legacy - use where.OR instead)',
            }),
            // Enhanced filtering
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
        resolve: (query, _parent, args, ctx) => {
            // Build base where clause for published posts
            let where: any = { published: true };

            // Apply legacy search string
            if (args.searchString) {
                where.OR = [
                    { title: { contains: args.searchString } },
                    { content: { contains: args.searchString } },
                ];
            }

            // Apply advanced filtering
            const advancedWhere = transformPostWhereInput(args.where);
            if (advancedWhere) {
                // Merge with published requirement
                where = {
                    AND: [
                        { published: true },
                        advancedWhere,
                    ],
                };
            }

            // Transform order by
            const orderBy = args.orderBy?.map(transformOrderBy).filter(Boolean) || [{ createdAt: 'desc' }];

            return ctx.repositories.posts.findMany({
                ...query,
                where,
                orderBy,
            });
        },
        // Enhanced totalCount with same filtering logic
        totalCount: (_parent, args, ctx) => {
            let where: any = { published: true };

            if (args.searchString) {
                where.OR = [
                    { title: { contains: args.searchString } },
                    { content: { contains: args.searchString } },
                ];
            }

            const advancedWhere = transformPostWhereInput(args.where);
            if (advancedWhere) {
                where = {
                    AND: [
                        { published: true },
                        advancedWhere,
                    ],
                };
            }

            return ctx.repositories.posts.count(where);
        },
    })
)

// Enhanced drafts query with filtering and ordering
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
        resolve: async (query, _parent, args, ctx) => {
            // Check if user is authenticated
            if (!ctx.userId) {
                return [];
            }

            try {
                // Decode the global ID
                const requestedUserId = parseGlobalId(args.userId.toString(), 'User');

                // Users can only see their own drafts
                if (ctx.userId !== requestedUserId) {
                    return [];
                }

                // Build where clause for unpublished posts by this user
                let where: any = {
                    authorId: requestedUserId,
                    published: false,
                };

                // Apply additional filtering
                const advancedWhere = transformPostWhereInput(args.where);
                if (advancedWhere) {
                    where = {
                        AND: [
                            { authorId: requestedUserId, published: false },
                            advancedWhere,
                        ],
                    };
                }

                // Transform order by
                const orderBy = args.orderBy?.map(transformOrderBy).filter(Boolean) || [{ updatedAt: 'desc' }];

                return ctx.repositories.posts.findMany({
                    ...query,
                    where,
                    orderBy,
                });
            } catch (error) {
                // Invalid global ID format
                return [];
            }
        },
        // Add total count for drafts
        totalCount: async (_parent, args, ctx) => {
            if (!ctx.userId) return 0;

            try {
                const requestedUserId = parseGlobalId(args.userId.toString(), 'User');
                if (ctx.userId !== requestedUserId) return 0;

                let where: any = {
                    authorId: requestedUserId,
                    published: false,
                };

                const advancedWhere = transformPostWhereInput(args.where);
                if (advancedWhere) {
                    where = {
                        AND: [
                            { authorId: requestedUserId, published: false },
                            advancedWhere,
                        ],
                    };
                }

                return ctx.repositories.posts.count(where);
            } catch (error) {
                return 0;
            }
        },
    })
)

// New: All posts query for admin/advanced use cases
builder.queryField('allPosts', (t) =>
    t.prismaConnection({
        type: 'Post',
        cursor: 'id',
        description: 'Get all posts (including unpublished) - requires authentication',
        args: {
            where: t.arg({
                type: PostWhereInput,
                description: 'Filtering options',
            }),
            orderBy: t.arg({
                type: [PostOrderByInput],
                defaultValue: [{ createdAt: 'desc' }],
                description: 'Ordering options',
            }),
        },
        resolve: async (query, _parent, args, ctx) => {
            // Require authentication for this query
            if (!ctx.userId) {
                throw new Error('Authentication required to access all posts');
            }

            // Build where clause
            const where = transformPostWhereInput(args.where) || {};

            // Users can only see their own unpublished posts + all published posts
            const authorFilter = {
                OR: [
                    { published: true },
                    { authorId: ctx.userId, published: false },
                ],
            };

            const finalWhere = Object.keys(where).length > 0
                ? { AND: [authorFilter, where] }
                : authorFilter;

            // Transform order by
            const orderBy = args.orderBy?.map(transformOrderBy).filter(Boolean) || [{ createdAt: 'desc' }];

            return ctx.repositories.posts.findMany({
                ...query,
                where: finalWhere,
                orderBy,
            });
        },
        totalCount: async (_parent, args, ctx) => {
            if (!ctx.userId) return 0;

            const where = transformPostWhereInput(args.where) || {};

            const authorFilter = {
                OR: [
                    { published: true },
                    { authorId: ctx.userId, published: false },
                ],
            };

            const finalWhere = Object.keys(where).length > 0
                ? { AND: [authorFilter, where] }
                : authorFilter;

            return ctx.repositories.posts.count(finalWhere);
        },
    })
) 