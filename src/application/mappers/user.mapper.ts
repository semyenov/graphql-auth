/**
 * User Mapper
 * 
 * Converts between domain entities and DTOs.
 */

import { User } from '../../core/entities/user.entity'
import { Email } from '../../core/value-objects/email.vo'
import { UserId } from '../../core/value-objects/user-id.vo'
import { UserDto } from '../dtos/user.dto'

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id.value,
      email: user.email.value,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  static toDomain(data: {
    id: number
    email: string
    name: string | null
    password: string
    createdAt?: Date
    updatedAt?: Date
  }): User {
    return User.fromPersistence({
      id: UserId.create(data.id),
      email: Email.create(data.email),
      name: data.name,
      passwordHash: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}