import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '../../prisma';
import { builder } from '../builder';

// Define authentication mutations
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
            return sign({ userId: user.id }, process.env.APP_SECRET || '');
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
            return sign({ userId: user.id }, process.env.APP_SECRET || '');
        },
    })
); 