/**
 * Email Value Object
 * 
 * Ensures email addresses are valid and provides email-specific behavior.
 */

import { ValueObjectValidationError } from '../errors/domain.errors'

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new ValueObjectValidationError('Email cannot be empty')
    }

    const normalizedEmail = value.trim().toLowerCase()

    if (!this.EMAIL_REGEX.test(normalizedEmail)) {
      throw new ValueObjectValidationError('Invalid email format')
    }

    if (normalizedEmail.length > 255) {
      throw new ValueObjectValidationError('Email cannot exceed 255 characters')
    }

    return new Email(normalizedEmail)
  }

  get value(): string {
    return this._value
  }

  equals(other: Email): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}