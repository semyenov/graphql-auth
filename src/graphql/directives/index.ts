/**
 * GraphQL Directives Index
 *
 * Central export point for all GraphQL directives
 * as specified in IMPROVED-FILE-STRUCTURE.md
 */

export {
  authDirectiveTransformer,
  authDirectiveTypeDefs
} from './auth.directive'
export {
  rateLimitDirectiveTransformer,
  rateLimitDirectiveTypeDefs
} from './rate-limit.directive'

// Combined type definitions for easy schema integration
export const directiveTypeDefs = `
  directive @auth(
    requires: Role = USER
  ) on FIELD_DEFINITION

  directive @rateLimit(
    max: Int = 10
    window: Int = 60000
  ) on FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
  }
`

// Combined directive transformers for schema usage
import { authDirectiveTransformer } from './auth.directive'
import { rateLimitDirectiveTransformer } from './rate-limit.directive'

export const directiveTransformers = {
  auth: authDirectiveTransformer,
  rateLimit: rateLimitDirectiveTransformer,
}
