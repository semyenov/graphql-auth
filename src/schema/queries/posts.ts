import { prisma } from '../../prisma';
import { builder } from '../builder';
import { PostOrderByUpdatedAtInput, UserUniqueInput } from '../inputs';

// Define post queries
builder.queryField('postById', (t) =>
    t.prismaField({
        type: 'Post',
        nullable: true,
        args: {
            id: t.arg.int(),
        },
        resolve: (query, _parent, args) => {
            return prisma.post.findUnique({
                ...query,
                where: { id: args.id || undefined },
            });
        },
    })
);

builder.queryField('feed', (t) =>
    t.prismaField({
        type: ['Post'],
        args: {
            searchString: t.arg.string(),
            skip: t.arg.int(),
            take: t.arg.int(),
            orderBy: t.arg({
                type: PostOrderByUpdatedAtInput,
            }),
        },
        resolve: (query, _parent, args) => {
            const or = args.searchString
                ? {
                    OR: [
                        { title: { contains: args.searchString } },
                        { content: { contains: args.searchString } },
                    ],
                }
                : {};

            return prisma.post.findMany({
                ...query,
                where: {
                    published: true,
                    ...or,
                },
                take: args.take || undefined,
                skip: args.skip || undefined,
                orderBy: args.orderBy || undefined,
            });
        },
    })
);

builder.queryField('draftsByUser', (t) =>
    t.prismaField({
        type: ['Post'],
        nullable: true,
        args: {
            userUniqueInput: t.arg({
                type: UserUniqueInput,
                required: true,
            }),
        },
        resolve: async (query, _parent, args) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: args.userUniqueInput.id || undefined,
                    email: args.userUniqueInput.email || undefined,
                },
            });

            if (!user) return null;

            return prisma.post.findMany({
                ...query,
                where: {
                    authorId: user.id,
                    published: false,
                },
            });
        },
    })
); 