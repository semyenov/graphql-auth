import { builder } from '../builder'

// Define Post object type using Relay Node pattern
// prismaNode automatically exposes ALL fields including relations
builder.prismaNode('Post', {
    // Map Prisma's numeric id to Relay's global ID
    id: { field: 'id' },
    fields: (t) => ({
        title: t.exposeString('title'),
        content: t.exposeString('content', { nullable: true }),
        published: t.exposeBoolean('published'),
        viewCount: t.exposeInt('viewCount'),
        author: t.relation('author'),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    }),
}) 