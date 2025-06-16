import { prisma } from '../../../../prisma'
import { AuthUser, User } from '../../domain/types'

/**
 * Repository for user data access
 * Encapsulates all database operations for users
 */
export class UserRepository {
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  async findByEmailWithPassword(email: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    })
  }

  async create(data: {
    email: string
    password: string
    name: string | null
  }): Promise<User> {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }

  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    })
    return count > 0
  }
}