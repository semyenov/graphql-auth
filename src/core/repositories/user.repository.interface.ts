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

export interface IUserRepository {
  // Basic CRUD operations
  findById(id: UserId): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
  findByIds(ids: UserId[]): Promise<User[]>
  save(user: User): Promise<User>
  delete(id: UserId): Promise<User | null>

  // Query operations
  findMany(criteria: {
    searchTerm?: string
    skip?: number
    take?: number
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]>

  count(criteria?: {
    emailContains?: string
    nameContains?: string
  }): Promise<number>

  // Business-specific queries
  existsByEmail(email: Email): Promise<boolean>
  search(searchTerm: string, options?: {
    skip?: number
    take?: number
  }): Promise<User[]>
}