/**
 * UserId Value Object
 *
 * Represents a user identifier in the domain.
 */

import { ValidationError } from '../app/errors/types'

export class UserId {
  private constructor(private readonly _value: number) { }

  static create(value: number): UserId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new ValidationError(['UserId must be a positive integer'])
    }
    return new UserId(value)
  }

  static from(value: number): UserId {
    return UserId.create(value)
  }

  static generate(): UserId {
    // In a real application, this would be handled by the database
    // For now, we'll use a timestamp-based approach
    return new UserId(Date.now())
  }

  get value(): number {
    return this._value
  }

  equals(other: UserId): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value.toString()
  }
}
