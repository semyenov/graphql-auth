import { prisma } from '../../../../prisma'
import { Post, CreatePostData, UpdatePostData, PostFilters } from '../../domain/types'

/**
 * Repository for post data access
 */
export class PostRepository {
  async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
    })
  }

  async findMany(filters: PostFilters = {}): Promise<Post[]> {
    return prisma.post.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: CreatePostData & { published: boolean }): Promise<Post> {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
        authorId: data.authorId,
      },
    })
  }

  async update(id: number, data: UpdatePostData): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
    })
  }

  async delete(id: number): Promise<Post> {
    return prisma.post.delete({
      where: { id },
    })
  }

  async incrementViewCount(id: number): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }

  async count(filters: PostFilters = {}): Promise<number> {
    return prisma.post.count({
      where: filters,
    })
  }
}