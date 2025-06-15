import { getUserId } from '../../context/utils';
import { prisma } from '../../prisma';
import { builder } from '../builder';

// Define user queries
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