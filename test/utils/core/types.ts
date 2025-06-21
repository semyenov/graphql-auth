/**
 * Core types used throughout the test utilities
 */

import type { User } from '@prisma/client'
import type { JWTPayload } from '../../../src/utils/jwt'

export interface IntegrationTestContext {
  user: User
  token: string
  decodedToken: JWTPayload
}
