/**
 * Prisma User Repository
 * 
 * Implements the user repository interface using Prisma.
 */

import { Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import { User } from '../../../core/entities/user.entity'
import { IUserRepository, UserFilter, UserOrderBy } from '../../../core/repositories/user.repository.interface'
import { Email } from '../../../core/value-objects/email.vo'
import { UserId } from '../../../core/value-objects/user-id.vo'

@injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) { }

  async findById(id: UserId): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id: id.value },
    })

    if (!data) return null

    // Map database fields to entity properties
    return User.fromPersistence({
      id: UserId.from(data.id),
      email: Email.create(data.email),
      name: data.name,
      passwordHash: data.password, // Map 'password' field to 'passwordHash'
      createdAt: new Date(), // Default value since not in schema
      updatedAt: new Date(), // Default value since not in schema
    })
  }

  async findByEmail(email: Email): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email: email.value },
    })

    if (!data) return null

    // Map database fields to entity properties
    return User.fromPersistence({
      id: UserId.from(data.id),
      email: Email.create(data.email),
      name: data.name,
      passwordHash: data.password, // Map 'password' field to 'passwordHash'
      createdAt: new Date(), // Default value since not in schema
      updatedAt: new Date(), // Default value since not in schema
    })
  }

  async findByIds(ids: UserId[]): Promise<User[]> {
    const data = await this.prisma.user.findMany({
      where: {
        id: { in: ids.map(id => id.value) },
      },
    })

    return data.map(user => User.fromPersistence({
      id: UserId.from(user.id),
      email: Email.create(user.email),
      name: user.name,
      passwordHash: user.password, // Map 'password' field to 'passwordHash'
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  }

  async save(user: User): Promise<User> {
    const data = user.toPersistence()

    // For new users (ID is 0 or very large timestamp), create without specifying ID
    // to let the database auto-increment handle it
    if (data.id === 0 || data.id > 1000000000) {
      const saved = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.password,
        },
      })
      return User.fromPersistence({
        id: UserId.from(saved.id),
        email: Email.create(saved.email),
        name: saved.name,
        passwordHash: saved.password,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      })
    }

    // For existing users, update
    const saved = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    })

    return User.fromPersistence({
      id: UserId.from(saved.id),
      email: Email.create(saved.email),
      name: saved.name,
      passwordHash: saved.password,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    })
  }

  async delete(id: UserId): Promise<User | null> {
    const data = await this.prisma.user.delete({
      where: { id: id.value },
    })

    if (!data) return null

    return User.fromPersistence({
      id: UserId.from(data.id),
      email: Email.create(data.email),
      name: data.name,
      passwordHash: data.password,
      createdAt: new Date(), // Default value since not in schema
      updatedAt: new Date(), // Default value since not in schema
    })
  }

  async findMany(criteria: {
    searchTerm?: string
    skip?: number
    take?: number
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { searchTerm, skip = 0, take = 10, orderBy } = criteria
    const trimmedSearchTerm = searchTerm?.trim()
    if (!trimmedSearchTerm) {
      return []
    }

    const data = await this.prisma.user.findMany({
      skip,
      take,
      orderBy,
      where: {
        OR: [
          { email: { contains: trimmedSearchTerm } },
          { name: { contains: trimmedSearchTerm } },
        ],
      },
    })

    return data.map(user => User.fromPersistence({
      id: UserId.from(user.id),
      email: Email.create(user.email),
      name: user.name,
      passwordHash: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  }

  async count(criteria?: {
    emailContains?: string
    nameContains?: string
  }): Promise<number> {
    const where: any = {}

    if (criteria?.emailContains) {
      where.email = { contains: criteria.emailContains }
    }

    if (criteria?.nameContains) {
      where.name = { contains: criteria.nameContains }
    }

    return this.prisma.user.count({ where })
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.value },
    })
    return count > 0
  }

  async search(filter?: UserFilter, options?: {
    skip?: number
    take?: number
    orderBy?: UserOrderBy
  }): Promise<User[]> {
    const { skip = 0, take = 10, orderBy } = options || {}
    const where: UserFilter = {
      ...filter,
    }

    if (where.emailContains || where.nameContains) {
      where.OR = []
      if (where.emailContains) {
        where.OR.push({ email: { contains: where.emailContains } })
      }
      if (where.nameContains) {
        where.OR.push({ name: { contains: where.nameContains } })
      }
    }

    const data = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
    })

    return data.map(user => User.fromPersistence({
      id: UserId.from(user.id),
      email: Email.create(user.email),
      name: user.name,
      passwordHash: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  }
}