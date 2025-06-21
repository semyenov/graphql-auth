/**
 * Simple value object implementations
 * Replacing the deleted value-objects directory with minimal implementations
 */

/**
 * UserId value object for type-safe user ID handling
 */
export class UserId {
  constructor(public readonly value: number) {}

  static create(value: number): UserId {
    return new UserId(value)
  }

  toString(): string {
    return String(this.value)
  }
}

/**
 * PostId value object for type-safe post ID handling
 */
export class PostId {
  constructor(public readonly value: number) {}

  static create(value: number): PostId {
    return new PostId(value)
  }

  toString(): string {
    return String(this.value)
  }
}

/**
 * Email value object for type-safe email handling
 */
export class Email {
  constructor(public readonly value: string) {}

  static create(value: string): Email {
    return new Email(value.toLowerCase().trim())
  }

  toString(): string {
    return this.value
  }
}
