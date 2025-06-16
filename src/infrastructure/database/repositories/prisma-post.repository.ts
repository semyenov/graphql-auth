/**
 * Prisma Post Repository
 * 
 * Implements the post repository interface using Prisma.
 */

import { Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import { PostMapper } from '../../../application/mappers/post.mapper'
import { Post } from '../../../core/entities/post.entity'
import { IPostRepository, PostFilter, PostOrderBy } from '../../../core/repositories/post.repository.interface'
import { PostId } from '../../../core/value-objects/post-id.vo'
import { UserId } from '../../../core/value-objects/user-id.vo'

@injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) { }

  async findById(id: PostId): Promise<Post | null> {
    const data = await this.prisma.post.findUnique({
      where: { id: id.value },
    })
    return data ? PostMapper.toDomain(data) : null
  }

  async findByIds(ids: PostId[]): Promise<Post[]> {
    const data = await this.prisma.post.findMany({
      where: {
        id: { in: ids.map(id => id.value) },
      },
    })
    return data.map(PostMapper.toDomain)
  }

  async save(post: Post): Promise<Post> {
    const data = post.toPersistence()

    // For new posts (ID is 0 or very large timestamp), create without specifying ID
    // to let the database auto-increment handle it
    if (data.id === 0 || data.id > 1000000000) {
      const saved = await this.prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          published: data.published,
          viewCount: data.viewCount,
          authorId: data.authorId,
        },
      })
      return PostMapper.toDomain(saved)
    }

    // For existing posts, update
    const saved = await this.prisma.post.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
        viewCount: data.viewCount,
        updatedAt: data.updatedAt,
      },
    })

    return PostMapper.toDomain(saved)
  }

  async delete(id: PostId): Promise<Post | null> {
    const data = await this.prisma.post.delete({
      where: { id: id.value },
    })
    return data ? PostMapper.toDomain(data) : null
  }

  async findMany(criteria: {
    filter?: PostFilter
    skip?: number
    take?: number
    orderBy?: PostOrderBy
  }): Promise<Post[]> {
    const { filter, skip = 0, take = 10, orderBy } = criteria
    const where = this.buildWhereClause(filter)

    const data = await this.prisma.post.findMany({
      where,
      skip,
      take,
      orderBy
    })

    return data.map(PostMapper.toDomain)
  }

  async count(filter?: PostFilter): Promise<number> {
    const where = this.buildWhereClause(filter)
    return this.prisma.post.count({ where })
  }

  async findByAuthor(
    authorId: UserId,
    options?: {
      includeUnpublished?: boolean
      skip?: number
      take?: number
    }
  ): Promise<Post[]> {
    const { includeUnpublished = false, skip = 0, take = 10 } = options || {}

    const data = await this.prisma.post.findMany({
      where: {
        authorId: authorId.value,
        ...(includeUnpublished ? {} : { published: true }),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    })

    return data.map(PostMapper.toDomain)
  }

  async findPublished(options?: {
    searchString?: string
    skip?: number
    take?: number
    orderBy?: PostOrderBy
  }): Promise<Post[]> {
    const { searchString, skip = 0, take = 10, orderBy } = options || {}

    const where: Prisma.PostWhereInput = {
      published: true,
      ...(searchString && {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }),
    }

    const data = await this.prisma.post.findMany({
      where,
      skip,
      take,
      orderBy
    })

    return data.map(PostMapper.toDomain)
  }

  async countPublished(searchString?: string): Promise<number> {
    const where: Prisma.PostWhereInput = {
      published: true,
      ...(searchString && {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }),
    }

    return this.prisma.post.count({ where })
  }

  async bulkDelete(ids: PostId[]): Promise<number> {
    const result = await this.prisma.post.deleteMany({
      where: {
        id: { in: ids.map(id => id.value) },
      },
    })
    return result.count
  }

  async bulkUpdatePublished(ids: PostId[], published: boolean): Promise<number> {
    const result = await this.prisma.post.updateMany({
      where: {
        id: { in: ids.map(id => id.value) },
      },
      data: { published },
    })
    return result.count
  }

  private buildWhereClause(filter?: PostFilter): Prisma.PostWhereInput {
    if (!filter) return {}

    const where: Prisma.PostWhereInput = {}

    if (filter.published !== undefined) {
      where.published = filter.published
    }

    if (filter.authorId) {
      where.authorId = filter.authorId.value
    }

    if (filter.titleContains || filter.contentContains) {
      where.OR = []
      if (filter.titleContains) {
        where.OR.push({ title: { contains: filter.titleContains } })
      }
      if (filter.contentContains) {
        where.OR.push({ content: { contains: filter.contentContains } })
      }
    }

    return where
  }
}