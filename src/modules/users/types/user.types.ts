import { builder } from '../../../graphql/schema/builder';
import { prisma } from '../../../prisma';

// Define User object type using Relay Node pattern with DataLoader optimizations
builder.prismaNode('User', {
    // Map Prisma's numeric id to Relay's global ID
    id: { field: 'id' },
    fields: (t) => ({
        name: t.exposeString('name', { nullable: true }),
        email: t.exposeString('email'),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
        // Enhanced posts connection with cursor-based pagination
        posts: t.relatedConnection('posts', {
            cursor: 'id',
            // Enable total count for better UX
            totalCount: true,
            // Configure query options
            query: (args, _context) => ({
                // Add default ordering by creation date (newest first)
                orderBy: { createdAt: 'desc' },
                // Allow filtering by published status
                where: args.published !== undefined
                    ? { published: args.published ?? false }
                    : undefined,
            }),
            // Add additional connection arguments
            args: {
                published: t.arg.boolean({
                    description: 'Filter posts by published status',
                }),
            },
        }),
        // Use DataLoader for drafts count (fallback to direct query)
        draftsCount: t.int({
            description: 'Number of unpublished posts by this user',
            resolve: async (user, _args, _context) => {
                return prisma.post.count({
                    where: { authorId: user.id, published: false }
                });
            },
        }),
        // Use DataLoader for published posts count (fallback to direct query)
        publishedPostsCount: t.int({
            description: 'Number of published posts by this user',
            resolve: async (user, _args, _context) => {
                return prisma.post.count({
                    where: { authorId: user.id, published: true }
                });
            },
        }),
    }),
}) 