/**
 * Auth Module Configuration
 *
 * Configuration for the authentication module.
 */

export interface AuthConfig {
  jwt: {
    accessTokenSecret: string
    refreshTokenSecret: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
  }
  bcrypt: {
    rounds: number
  }
  email: {
    verificationTokenExpiresIn: number
    resetTokenExpiresIn: number
  }
}

export const authConfig: AuthConfig = {
  jwt: {
    accessTokenSecret: process.env.JWT_SECRET || 'your-secret-key',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    accessTokenExpiresIn: 15 * 60 * 1000,
    refreshTokenExpiresIn: 7 * 24 * 60 * 60 * 1000,
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  },
  email: {
    verificationTokenExpiresIn: 24 * 60 * 60 * 1000,
    resetTokenExpiresIn: 1 * 60 * 60 * 1000,
  },
}
