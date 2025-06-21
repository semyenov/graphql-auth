/**
 * Core types used throughout the test utilities
 */

import type { User } from '@prisma/client'
import type { JwtPayload } from '../../../src/modules/auth/types/auth.types'

export interface IntegrationTestContext {
  user: User
  token: string
  decodedToken: JwtPayload
}