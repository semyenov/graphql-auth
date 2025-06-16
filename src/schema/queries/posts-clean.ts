import type { EnhancedContext } from '../../context/enhanced-context'
import { PostId } from '../../core/value-objects/post-id.vo'
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
import { builder } from '../builder'

// Enhanced post by ID query - uses clean architecture
builder.queryField('post', (t) =>
    t.prismaField({
        type: 'Post',
        nullable: true,
        args: {
            id: t.arg.id({
                required: true,
                description: 'Global ID of the post to retrieve',
            }),
        },
        resolve: async (query, _parent, args, ctx: EnhancedContext) => {
            try {
                // Decode the global ID to get the numeric ID
                const postId = parseGlobalId(args.id.toString(), 'Post')

                // Use the get post use case
                const postDto = await ctx.useCases.posts.get.execute({
                    postId: PostId.create(postId),
                    userId: ctx.userId || undefined,
                })

                if (!postDto) return null

                // Fetch the full post data with Prisma query optimization
                // Use the prisma client directly with the query parameter
                // Convert string ID to number for Prisma
                return ctx.prisma.post.findUnique({
                    ...query,
                    where: { id: postDto.id },
                })
            } catch (error) {
                // Post not found or not accessible
                return null
            }
        },
    })
)

