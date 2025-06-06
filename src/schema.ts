import { compare, hash } from 'bcryptjs';
import { applyMiddleware } from 'graphql-middleware';
import { DateTimeResolver } from 'graphql-scalars';
import { sign } from 'jsonwebtoken';
import { builder } from './builder';
import { permissions } from './permissions';
import { prisma } from './prisma';
import { APP_SECRET, getUserId } from './utils';

// Add DateTime scalar
builder.scalarType('DateTime', {
    serialize: DateTimeResolver.serialize,
    parseValue: DateTimeResolver.parseValue,
    parseLiteral: DateTimeResolver.parseLiteral,
});

// Define Query and Mutation root types
builder.queryType({});
builder.mutationType({});

// Define enums and input types
const SortOrder = builder.enumType('SortOrder', {
    values: ['asc', 'desc'] as const,
});

const PostOrderByUpdatedAtInput = builder.inputType('PostOrderByUpdatedAtInput', {
    fields: (t) => ({
        updatedAt: t.field({
            type: SortOrder,
            required: true,
        }),
    }),
});

const UserUniqueInput = builder.inputType('UserUniqueInput', {
    fields: (t) => ({
        id: t.int(),
        email: t.string(),
    }),
});

const PostCreateInput = builder.inputType('PostCreateInput', {
    fields: (t) => ({
        title: t.string({ required: true }),
        content: t.string(),
    }),
});

// Define object types
builder.prismaObject('User', {
    fields: (t: any) => ({
        id: t.expose('id', { type: 'Int' }),
        name: t.expose('name', { type: 'String', nullable: true }),
        email: t.expose('email', { type: 'String' }),
        posts: t.relation('posts'),
    }),
});

builder.prismaObject('Post', {
    fields: (t: any) => ({
        id: t.expose('id', { type: 'Int' }),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
        title: t.expose('title', { type: 'String' }),
        content: t.exposeString('content', { nullable: true }),
        published: t.exposeBoolean('published'),
        viewCount: t.exposeInt('viewCount'),
        author: t.relation('author'),
    }),
});

// Define queries
builder.queryField('allUsers', (t) =>
    t.prismaField({
        type: ['User'],
        resolve: () => prisma.user.findMany(),
    })
);

builder.queryField('me', (t) =>
    t.prismaField({
        type: 'User',
        nullable: true,
        resolve: (query, _parent, _args, context) => {
            const userId = getUserId(context);
            return prisma.user.findUnique({
                ...query,
                where: { id: Number(userId) },
            });
        },
    })
);

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

// Define mutations
builder.mutationField('signup', (t) =>
    t.field({
        type: 'String',
        args: {
            name: t.arg.string(),
            email: t.arg.string({ required: true }),
            password: t.arg.string({ required: true }),
        },
        resolve: async (_parent, args) => {
            const hashedPassword = await hash(args.password, 10);
            const user = await prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                    password: hashedPassword,
                },
            });
            return sign({ userId: user.id }, APP_SECRET);
        },
    })
);

builder.mutationField('login', (t) =>
    t.field({
        type: 'String',
        args: {
            email: t.arg.string({ required: true }),
            password: t.arg.string({ required: true }),
        },
        resolve: async (_parent, { email, password }) => {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new Error(`No user found for email: ${email}`);
            }
            const passwordValid = await compare(password, user.password);
            if (!passwordValid) {
                throw new Error('Invalid password');
            }
            return sign({ userId: user.id }, APP_SECRET);
        },
    })
);

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

const pothosSchema = builder.toSchema();
export const schema = applyMiddleware(pothosSchema, permissions);