/**
 * Core types used throughout the test utilities
 */

import type { User } from '@prisma/client'
import type { JWTPayload } from '../../../src/modules/auth/services/jwt.service'

export interface IntegrationTestContext {
  user: User
  token: string
  decodedToken: JWTPayload
}
