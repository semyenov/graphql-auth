import { builder } from '../builder';

// Define Post object type
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