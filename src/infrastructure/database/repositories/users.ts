import { Prisma, PrismaClient, User } from '@prisma/client'
import { BaseRepository } from './base'

// Types for user operations
export type UserWithPassword = User
export type UserCreateData = {
  email: string
  password: string
  name: string | null
}

export type UserPublic = Omit<User, 'password'>

/**
 * Repository for user data access operations
 * Handles all database interactions for User entities
 */
export class UserRepository extends BaseRepository {
  constructor(dbClient?: PrismaClient) {
    super(dbClient)
  }

  /**
   * Find user by ID (without password)
   */
  async findById(id: number): Promise<UserPublic | null> {
    return this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  /**
   * Find user by email (without password)
   */
  async findByEmail(email: string): Promise<UserPublic | null> {
    return this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  /**
   * Find user by email with password (for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    return this.db.user.findUnique({
      where: { email },
    })
  }

  /**
   * Create a new user
   */
  async create(data: UserCreateData): Promise<UserPublic> {
    return this.db.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  /**
   * Update user information
   */
  async update(id: number, data: Partial<Omit<UserCreateData, 'password'>>): Promise<UserPublic> {
    return this.db.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  /**
   * Update user password
   */
  async updatePassword(id: number, hashedPassword: string): Promise<UserPublic> {
    return this.db.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  /**
   * Check if user exists by email
   */
  async exists(email: string): Promise<boolean> {
    const count = await this.db.user.count({
      where: { email },
    })
    return count > 0
  }

  /**
   * Delete user by ID
   */
  async delete(id: number): Promise<UserPublic> {
    return this.db.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  /**
   * Find multiple users with pagination
   */
  async findMany(options: {
    skip?: number
    take?: number
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  } = {}): Promise<UserPublic[]> {
    return this.db.user.findMany({
      ...options,
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  /**
   * Count users matching criteria
   */
  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.db.user.count({ where })
  }

  /**
   * Search users by name or email
   */
  async search(searchTerm: string, options: {
    skip?: number
    take?: number
  } = {}): Promise<UserPublic[]> {
    return this.db.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
      },
      ...options,
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }
}