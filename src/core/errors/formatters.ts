/**
 * Core Error Formatters
 * 
 * Error formatting utilities for different output formats following the 
 * IMPROVED-FILE-STRUCTURE.md specification.
 */

import { BaseError } from './types'

/**
 * Format error for GraphQL response
 */
export function formatGraphQLError(error: BaseError) {
  return {
    message: error.message,
    extensions: {
      code: error.code,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Format error for REST API response
 */
export function formatRestError(error: BaseError) {
  return {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Format error for logging
 */
export function formatLogError(error: BaseError, context?: Record<string, any>) {
  return {
    level: getLogLevel(error),
    message: error.message,
    error: {
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
    },
    context,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Format error for monitoring/alerting systems
 */
export function formatMonitoringError(error: BaseError, context?: Record<string, any>) {
  return {
    alertLevel: getAlertLevel(error),
    service: 'graphql-auth',
    error: {
      type: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    },
    context,
    timestamp: new Date().toISOString(),
    fingerprint: generateErrorFingerprint(error),
  }
}

/**
 * Format validation error with field details
 */
export function formatValidationError(error: BaseError & { errors?: any }) {
  const base = formatGraphQLError(error)
  
  if (error.errors) {
    return {
      ...base,
      extensions: {
        ...base.extensions,
        validationErrors: error.errors
      }
    }
  }
  
  return base
}

/**
 * Format error for user display (sanitized)
 */
export function formatUserError(error: BaseError) {
  // Only show safe error messages to users
  const safeMessages: Record<string, string> = {
    'UNAUTHENTICATED': 'Please log in to continue',
    'FORBIDDEN': 'You do not have permission to perform this action',
    'NOT_FOUND': 'The requested resource was not found',
    'CONFLICT': 'This action conflicts with existing data',
    'RATE_LIMIT_EXCEEDED': 'Too many requests. Please try again later',
    'VALIDATION_ERROR': error.message, // Validation errors are safe to show
  }
  
  return {
    message: safeMessages[error.code] || 'An error occurred. Please try again',
    code: error.code,
  }
}

/**
 * Get appropriate log level for error
 */
function getLogLevel(error: BaseError): string {
  if (error.statusCode >= 500) {
    return 'error'
  } else if (error.statusCode >= 400) {
    return 'warn'
  } else {
    return 'info'
  }
}

/**
 * Get alert level for monitoring
 */
function getAlertLevel(error: BaseError): string {
  if (error.statusCode >= 500) {
    return 'critical'
  } else if (error.statusCode >= 400) {
    return 'warning'
  } else {
    return 'info'
  }
}

/**
 * Generate unique fingerprint for error grouping
 */
function generateErrorFingerprint(error: BaseError): string {
  const base = `${error.name}:${error.code}`
  // You could add more sophisticated fingerprinting logic here
  return Buffer.from(base).toString('base64').slice(0, 16)
}

/**
 * Format error stack trace for debugging
 */
export function formatStackTrace(error: BaseError): string[] {
  if (!error.stack) {
    return []
  }
  
  return error.stack
    .split('\n')
    .slice(1) // Remove the first line (error message)
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

/**
 * Create development-friendly error format
 */
export function formatDevelopmentError(error: BaseError, context?: Record<string, any>) {
  return {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: formatStackTrace(error),
    context,
    timestamp: new Date().toISOString(),
    type: error.constructor.name,
  }
}

/**
 * Create production-friendly error format (sanitized)
 */
export function formatProductionError(error: BaseError) {
  return {
    message: error.statusCode >= 500 ? 'Internal server error' : error.message,
    code: error.code,
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
  }
}