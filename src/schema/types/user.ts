import { builder } from '../builder';

// Define User object type
builder.prismaObject('User', {
    fields: (t: any) => ({
        id: t.expose('id', { type: 'Int' }),
        name: t.expose('name', { type: 'String', nullable: true }),
        email: t.expose('email', { type: 'String' }),
        posts: t.relation('posts'),
    }),
}); 