import { IRules, rule, shield } from 'graphql-shield'
import { Context, GraphQLAPISchema } from '../context'
import { prisma } from '../prisma'
import { getUserId } from '../utils'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
    const userId = getUserId(context)
    return userId ? true : new Error('User is not authenticated')
  }),
  isPostOwner: rule()(async (_parent, args: { id: string }, context: Context) => {
    if (!args.id) {
      return new Error('No post ID provided')
    }
    const userId = getUserId(context)
    if (!userId) {
      return new Error('User is not authenticated')
    }
    const post = await prisma.post
      .findUnique({
        where: {
          id: Number(args.id),
        },
      })
    if (!post) {
      return new Error('Post not found')
    }
    return (Number(userId) === post.authorId) ? true : new Error('User is not the owner of the post')
  }),
} satisfies IRules

export const permissions = shield<GraphQLAPISchema, Context, any>({
  Query: {
    me: rules.isAuthenticatedUser,
    draftsByUser: rules.isAuthenticatedUser,
    postById: rules.isAuthenticatedUser,
  },
  Mutation: {
    createDraft: rules.isAuthenticatedUser,
    deletePost: rules.isPostOwner,
    // incrementPostViewCount is public - no auth required
    togglePublishPost: rules.isPostOwner,
  },
}, {
  allowExternalErrors: true
})
