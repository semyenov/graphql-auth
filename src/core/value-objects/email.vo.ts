/**
 * Email Value Object
 * 
 * Ensures email addresses are valid and provides email-specific behavior.
 */

import { VALIDATION_LIMITS, VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../constants/validation'
import { ValidationError } from '../../core/errors/types'

export class Email {
  private constructor(private readonly _value: string) { }

  static create(value: string): Email {
    if (!value || value.trim().length === 0) {
      throw new ValidationError([VALIDATION_MESSAGES.EMAIL_REQUIRED])
    }

    const normalizedEmail = value.trim().toLowerCase()

    if (!VALIDATION_PATTERNS.EMAIL.test(normalizedEmail)) {
      throw new ValidationError([VALIDATION_MESSAGES.EMAIL_INVALID])
    }

    if (normalizedEmail.length > VALIDATION_LIMITS.EMAIL_MAX_LENGTH) {
      throw new ValidationError([VALIDATION_MESSAGES.EMAIL_TOO_LONG])
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