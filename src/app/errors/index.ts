/**
 * Core Errors Module Exports
 *
 * Central barrel exports for all error handling functionality following the
 * IMPROVED-FILE-STRUCTURE.md specification.
 */

// Error constants
export {
  ERROR_CATEGORIES,
  ERROR_CODE_CATEGORIES,
  ERROR_CODES,
  ERROR_LEVEL_CODES,
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
  REPORTABLE_ERROR_CODES,
  WARN_LEVEL_CODES,
} from './constants'
// Error formatters
export {
  formatDevelopmentError,
  formatGraphQLError,
  formatLogError,
  formatMonitoringError,
  formatProductionError,
  formatRestError,
  formatStackTrace,
  formatUserError,
  formatValidationError,
} from './formatters'
// Error handlers
export {
  createErrorResponse,
  handleAuthError,
  handleDatabaseError,
  handleGraphQLError,
  handleRateLimitError,
  hasErrorCode,
  isBaseError,
  logError,
  normalizeError,
  shouldReportError,
} from './handlers'
// Error types
export {
  AuthenticationError,
  AuthorizationError,
  BaseError,
  BusinessRuleError,
  ConflictError,
  EntityNotFoundError,
  EntityValidationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  TimeoutError,
  ValidationError,
} from './types'
