/**
 * User Repository Interface
 * 
 * Defines the contract for user data access.
 * This is a port in hexagonal architecture.
 */

import { Prisma } from '@prisma/client'
import { User } from '../entities/user.entity'
import { Email } from '../value-objects/email.vo'
import { UserId } from '../value-objects/user-id.vo'

export type UserFilter = Prisma.UserWhereInput & {
  emailContains?: string
  nameContains?: string
}

export type UserOrderBy = Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]

export interface IUserRepository {
  // Basic CRUD operations
  findById(id: UserId): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  findByIds(ids: UserId[]): Promise<User[]>
  save(user: User): Promise<User>
  delete(id: UserId): Promise<User | null>

  // Query operations
  findMany(criteria: {
    filter?: UserFilter
    skip?: number
    take?: number
    orderBy?: UserOrderBy
  }): Promise<User[]>

  count(filter?: UserFilter): Promise<number>

  // Business-specific queries
  existsByEmail(email: Email): Promise<boolean>
  search(filter?: UserFilter, options?: {
    skip?: number
    take?: number
    orderBy?: UserOrderBy
  }): Promise<User[]>
}