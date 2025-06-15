import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { env } from '../../environment';
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
        resolve: async (_parent, { email, password, name }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });
            return sign({ userId: user.id }, env.APP_SECRET);
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
                throw new Error('No user found with that email');
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }
            return sign({ userId: user.id }, env.APP_SECRET);
        },
    })
); 