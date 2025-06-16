import { builder } from '../builder'

// Define User object type using Relay Node pattern
// prismaNode automatically exposes ALL fields including relations
builder.prismaNode('User', {
    // Map Prisma's numeric id to Relay's global ID
    id: { field: 'id' },
    fields: (t) => ({
        name: t.exposeString('name', { nullable: true }),
        email: t.exposeString('email'),
        posts: t.relation('posts'),
    }),
}) 