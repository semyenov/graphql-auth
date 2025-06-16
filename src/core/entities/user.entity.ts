/**
 * User Entity - Core business entity
 * 
 * This represents the user in our domain model.
 * It's independent of any infrastructure concerns.
 */

import { Email } from '../value-objects/email.vo'
import { UserId } from '../value-objects/user-id.vo'
import { EntityValidationError } from '../errors/domain.errors'

export interface UserProps {
  id: UserId
  email: Email
  name: string | null
  passwordHash: string
  createdAt?: Date
  updatedAt?: Date
}

export class User {
  private constructor(private readonly props: UserProps) {}

  // Factory method for creating a new user
  static create(props: {
    email: string
    name: string | null
    passwordHash: string
  }): User {
    const email = Email.create(props.email)
    const id = UserId.generate()

    return new User({
      id,
      email,
      name: props.name,
      passwordHash: props.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // Factory method for reconstituting from persistence
  static fromPersistence(props: UserProps): User {
    return new User(props)
  }

  // Getters
  get id(): UserId {
    return this.props.id
  }

  get email(): Email {
    return this.props.email
  }

  get name(): string | null {
    return this.props.name
  }

  get passwordHash(): string {
    return this.props.passwordHash
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  // Business methods
  updateProfile(name: string | null): void {
    this.props.name = name
    this.props.updatedAt = new Date()
  }

  changeEmail(newEmail: string): void {
    this.props.email = Email.create(newEmail)
    this.props.updatedAt = new Date()
  }

  updatePassword(newPasswordHash: string): void {
    if (!newPasswordHash || newPasswordHash.length < 6) {
      throw new EntityValidationError('Password hash is invalid')
    }
    this.props.passwordHash = newPasswordHash
    this.props.updatedAt = new Date()
  }

  // Convert to plain object for persistence
  toPersistence(): {
    id: number
    email: string
    name: string | null
    password: string
    createdAt?: Date
    updatedAt?: Date
  } {
    return {
      id: this.props.id.value,
      email: this.props.email.value,
      name: this.props.name,
      password: this.props.passwordHash,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    }
  }
}