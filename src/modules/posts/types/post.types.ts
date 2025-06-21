import { builder } from '../../../graphql/schema/builder'

// Define Post object type using Relay Node pattern
// prismaNode automatically exposes ALL fields including relations
export const PostNode = builder.prismaNode('Post', {
  // Map Prisma's numeric id to Relay's global ID
  id: { field: 'id' },
  fields: (t) => ({
    title: t.exposeString('title', {
      description: 'The title of the post',
    }),
    content: t.exposeString('content', {
      nullable: true,
      description: 'The content/body of the post',
    }),
    published: t.exposeBoolean('published', {
      description: 'Whether the post is published and visible to the public',
    }),
    viewCount: t.exposeInt('viewCount', {
      description: 'Number of times this post has been viewed',
    }),
    author: t.relation('author', {
      description: 'The user who created this post',
    }),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
      description: 'When the post was first created',
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'DateTime',
      description: 'When the post was last modified',
    }),
    // Add computed fields for better UX
    excerpt: t.string({
      nullable: true,
      description:
        'A short excerpt from the post content (first 150 characters)',
      resolve: (post) => {
        if (!post.content) return null
        return post.content.length > 150
          ? `${post.content.substring(0, 150)}...`
          : post.content
      },
    }),
    wordCount: t.int({
      description: 'Approximate word count of the post content',
      resolve: (post) => {
        if (!post.content) return 0
        return post.content.trim().split(/\s+/).length
      },
    }),
    readingTimeMinutes: t.int({
      description:
        'Estimated reading time in minutes (assuming 200 words per minute)',
      resolve: (post) => {
        if (!post.content) return 0
        const wordCount = post.content.trim().split(/\s+/).length
        return Math.ceil(wordCount / 200)
      },
    }),
    isOwner: t.boolean({
      description: 'Whether the current user is the owner of this post',
      resolve: (post, _args, context) => {
        return context.userId?.value === post.authorId
      },
    }),
  }),
})
