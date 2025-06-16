import { builder } from '../builder';

// Define User object type using Relay Node pattern
// prismaNode automatically exposes ALL fields including relations
builder.prismaNode('User', {
    // Map Prisma's numeric id to Relay's global ID
    id: { field: 'id' },
    fields: (t) => ({
        name: t.exposeString('name', { nullable: true }),
        email: t.exposeString('email'),
        // Enhanced posts connection with cursor-based pagination
        posts: t.relatedConnection('posts', {
            cursor: 'id',
            // Enable total count for better UX
            totalCount: true,
            // Configure query options
            query: (args, context) => ({
                // Add default ordering by creation date (newest first)
                orderBy: { createdAt: 'desc' },
                // Allow filtering by published status
                where: args.published !== undefined
                    ? { published: args.published }
                    : undefined,
            }),
            // Add additional connection arguments
            args: {
                published: t.arg.boolean({
                    description: 'Filter posts by published status',
                }),
            },
        }),
        // Add convenience field for drafts count
        draftsCount: t.int({
            description: 'Number of unpublished posts by this user',
            resolve: async (user, args, context) => {
                return context.repositories.posts.count({
                    authorId: user.id,
                    published: false,
                });
            },
        }),
        // Add convenience field for published posts count
        publishedPostsCount: t.int({
            description: 'Number of published posts by this user',
            resolve: async (user, args, context) => {
                return context.repositories.posts.count({
                    authorId: user.id,
                    published: true,
                });
            },
        }),
    }),
}) 