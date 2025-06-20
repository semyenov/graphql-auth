/**
 * Domain Errors
 * 
 * These errors represent domain-specific business rule violations.
 */

export abstract class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class EntityValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'ENTITY_VALIDATION_ERROR')
  }
}

export class ValueObjectValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALUE_OBJECT_VALIDATION_ERROR')
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with identifier '${id}' not found`, 'ENTITY_NOT_FOUND')
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION')
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Access forbidden') {
    super(message, 'FORBIDDEN')
  }
}