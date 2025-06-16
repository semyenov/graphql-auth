import { Context } from '../../context'
import { requireAuthentication } from '../../context/auth'
import { AuthorizationError, NotFoundError } from '../../errors'
import { prisma } from '../../prisma'
import { parseGlobalID } from '../utils'

/**
 * Post validation result containing the post data and parsed ID
 */
export interface PostValidationResult {
  post: {
    id: number
    authorId: number | null
    published?: boolean
  }
  postId: number
}

/**
 * Validates that a post exists and optionally checks ownership
 * 
 * @param globalId - The global ID of the post
 * @param context - The GraphQL context
 * @param checkOwnership - Whether to verify the user owns the post
 * @returns The validated post data and numeric ID
 * @throws NotFoundError if post doesn't exist
 * @throws AuthorizationError if user doesn't own the post (when checkOwnership is true)
 */
export async function validatePostAccess(
  globalId: string,
  context: Context,
  checkOwnership = true
): Promise<PostValidationResult> {
  // Ensure user is authenticated
  const userId = requireAuthentication(context)

  // Parse the global ID to get numeric ID
  const { id: postId } = parseGlobalID(globalId, 'Post')

  // Fetch the post with minimal data
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      authorId: true,
      published: true,
    },
  })

  if (!post) {
    throw new NotFoundError('Post', globalId)
  }

  // Check ownership if required
  if (checkOwnership && post.authorId !== userId) {
    throw new AuthorizationError('You can only modify your own posts')
  }

  return { post, postId }
}

/**
 * Creates a draft post with the provided data
 * 
 * @param title - The post title
 * @param content - The post content (optional)
 * @param userId - The author's user ID
 * @param query - Prisma query options
 * @returns The created post
 */
export async function createDraftPost(
  title: string,
  content: string | null | undefined,
  userId: number,
  query: any
) {
  return await prisma.post.create({
    ...query,
    data: {
      title,
      content: content ?? null,
      authorId: userId,
      published: false, // All posts start as drafts
    },
  })
}

/**
 * Toggles the publication status of a post
 * 
 * @param postId - The numeric post ID
 * @param currentStatus - The current publication status
 * @param query - Prisma query options
 * @returns The updated post
 */
export async function togglePostPublication(
  postId: number,
  currentStatus: boolean,
  query: any
) {
  return await prisma.post.update({
    ...query,
    where: { id: postId },
    data: { published: !currentStatus },
  })
}

/**
 * Safely deletes a post by ID
 * 
 * @param postId - The numeric post ID
 * @param query - Prisma query options
 * @returns The deleted post
 */
export async function deletePostById(postId: number, query: any) {
  return await prisma.post.delete({
    ...query,
    where: { id: postId },
  })
}

/**
 * Increments the view count of a post
 * 
 * @param postId - The numeric post ID
 * @param query - Prisma query options
 * @returns The updated post
 */
export async function incrementPostViews(postId: number, query: any) {
  return await prisma.post.update({
    ...query,
    where: { id: postId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
}