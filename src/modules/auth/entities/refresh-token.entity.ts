/**
 * RefreshToken Entity
 *
 * Represents a refresh token for authentication.
 */

export interface RefreshTokenProps {
  token: string
  userId: number
  family: string
  revoked: boolean
  expiresAt: Date
  createdAt: Date
}

export class RefreshToken {
  readonly id: string
  private props: RefreshTokenProps

  private constructor(id: string, props: RefreshTokenProps) {
    this.id = id
    this.props = props
  }

  /**
   * Create a new refresh token
   */
  static create(props: {
    token: string
    userId: number
    family: string
    expiresAt: Date
  }): RefreshToken {
    return new RefreshToken(props.token, {
      ...props,
      revoked: false,
      createdAt: new Date(),
    })
  }

  /**
   * Reconstitute from persistence
   */
  static reconstitute(id: string, props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(id, props)
  }

  // Getters
  get token(): string {
    return this.props.token
  }

  get userId(): number {
    return this.props.userId
  }

  get family(): string {
    return this.props.family
  }

  get revoked(): boolean {
    return this.props.revoked
  }

  get expiresAt(): Date {
    return this.props.expiresAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  // Business methods
  revoke(): void {
    this.props.revoked = true
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt
  }

  isValid(): boolean {
    return !(this.revoked || this.isExpired())
  }

  toJSON(): RefreshTokenProps {
    return {
      token: this.props.token,
      userId: this.props.userId,
      family: this.props.family,
      revoked: this.props.revoked,
      expiresAt: this.props.expiresAt,
      createdAt: this.props.createdAt,
    }
  }
}
