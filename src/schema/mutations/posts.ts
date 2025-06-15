import { getUserId } from '../../context/utils';
import { prisma } from '../../prisma';
import { builder } from '../builder';
import { PostCreateInput } from '../inputs';

// Define post mutations
builder.mutationField('createDraft', (t) =>
    t.prismaField({
        type: 'Post',
        args: {
            data: t.arg({
                type: PostCreateInput,
                required: true,
            }),
        },
        resolve: (query, _parent, args, context) => {
            const userId = getUserId(context);
            return prisma.post.create({
                ...query,
                data: {
                    title: args.data.title,
                    content: args.data.content,
                    authorId: userId,
                },
            });
        },
    })
);

builder.mutationField('togglePublishPost', (t) =>
    t.prismaField({
        type: 'Post',
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (query, _parent, args) => {
            try {
                const post = await prisma.post.findUnique({
                    where: { id: args.id },
                    select: { published: true },
                });

                return prisma.post.update({
                    ...query,
                    where: { id: args.id },
                    data: { published: !post?.published },
                });
            } catch (e) {
                throw new Error(
                    `Post with ID ${args.id} does not exist in the database.`,
                    { cause: e },
                );
            }
        },
    })
);

builder.mutationField('incrementPostViewCount', (t) =>
    t.prismaField({
        type: 'Post',
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: (query, _parent, args) => {
            return prisma.post.update({
                ...query,
                where: { id: args.id },
                data: {
                    viewCount: {
                        increment: 1,
                    },
                },
            });
        },
    })
);

builder.mutationField('deletePost', (t) =>
    t.prismaField({
        type: 'Post',
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: (query, _parent, args) => {
            return prisma.post.delete({
                ...query,
                where: { id: args.id },
            });
        },
    })
); 