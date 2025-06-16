/**
 * PostId Value Object
 * 
 * Represents a post identifier in the domain.
 */

import { ValueObjectValidationError } from '../errors/domain.errors'

export class PostId {
  private constructor(private readonly _value: number) { }

  static create(value: number): PostId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new ValueObjectValidationError('PostId must be a positive integer')
    }
    return new PostId(value)
  }

  static generate(): PostId {
    // In a real application, this would be handled by the database
    // For now, we'll use a timestamp-based approach
    return new PostId(Date.now())
  }

  get value(): number {
    return this._value
  }

  equals(other: PostId): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value.toString()
  }
}