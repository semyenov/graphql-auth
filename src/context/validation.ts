import { CONTEXT_CONTEXT_ERROR_MESSAGES, OPERATION_NAMES } from './constants'
import type {
    Context,
    CreateDraftContext,
    GetMeContext,
    GetPostsContext,
    LoginContext,
    SignupContext
} from './types'

/**
 * Context validation utilities and type guards
 * 
 * This module provides comprehensive validation for GraphQL contexts and
 * type-safe guards for operation-specific context types.
 */

/**
 * Validation result interface for better error reporting
 */
export interface ValidationResult {
    readonly isValid: boolean
    readonly errors: readonly string[]
}

/**
 * Creates a validation result object
 */
function createValidationResult(errors: string[]): ValidationResult {
    return {
        isValid: errors.length === 0,
        errors: Object.freeze([...errors])
    }
}

/**
 * Validates the basic structure and requirements of a GraphQL context
 * 
 * @param context - The context to validate
 * @returns Validation result with errors if any
 * 
 * @example
 * ```typescript
 * const result = validateContext(context);
 * if (!result.isValid) {
 *   console.error('Context validation failed:', result.errors);
 * }
 * ```
 */
export function validateContext<TVariables = Record<string, unknown>>(
    context: Context<TVariables>
): ValidationResult {
    const errors: string[] = []

    // Validate HTTP method
    if (!context.method) {
        errors.push(CONTEXT_ERROR_MESSAGES.HTTP_METHOD_REQUIRED)
    }

    // Validate content type
    if (!context.contentType) {
        errors.push(CONTEXT_ERROR_MESSAGES.CONTENT_TYPE_REQUIRED)
    }

    // Validate request body for POST requests
    if (context.method === 'POST' && !context.req.body) {
        errors.push(CONTEXT_ERROR_MESSAGES.REQUEST_BODY_REQUIRED)
    }

    // Validate security context structure
    if (!context.security) {
        errors.push('Security context is missing')
    }

    // Validate metadata structure
    if (!context.metadata) {
        errors.push('Request metadata is missing')
    } else {
        if (typeof context.metadata.startTime !== 'number') {
            errors.push('Request start time must be a valid timestamp')
        }
    }

    return createValidationResult(errors)
}

/**
 * Validates authentication requirements for operations that require authentication
 * 
 * @param context - The context to validate
 * @returns Validation result for authentication requirements
 */
export function validateAuthentication<TVariables = Record<string, unknown>>(
    context: Context<TVariables>
): ValidationResult {
    const errors: string[] = []

    if (!context.security.isAuthenticated) {
        errors.push(CONTEXT_ERROR_MESSAGES.AUTHENTICATION_REQUIRED)
    }

    if (context.security.isAuthenticated && !context.userId) {
        errors.push(CONTEXT_ERROR_MESSAGES.INVALID_USER_ID)
    }

    return createValidationResult(errors)
}

/**
 * Type guard: Checks if context is for Login operation
 * 
 * @param context - The context to check
 * @returns True if context is LoginContext
 */
export function isLoginContext(context: Context): context is LoginContext {
    return context.operationName === OPERATION_NAMES.LOGIN
}

/**
 * Type guard: Checks if context is for Signup operation
 * 
 * @param context - The context to check  
 * @returns True if context is SignupContext
 */
export function isSignupContext(context: Context): context is SignupContext {
    return context.operationName === OPERATION_NAMES.SIGNUP
}

/**
 * Type guard: Checks if context is for CreateDraft operation
 * 
 * @param context - The context to check
 * @returns True if context is CreateDraftContext
 */
export function isCreateDraftContext(context: Context): context is CreateDraftContext {
    return context.operationName === OPERATION_NAMES.CREATE_DRAFT
}

/**
 * Type guard: Checks if context is for GetMe operation
 * 
 * @param context - The context to check
 * @returns True if context is GetMeContext
 */
export function isGetMeContext(context: Context): context is GetMeContext {
    return context.operationName === OPERATION_NAMES.GET_ME
}

/**
 * Type guard: Checks if context is for GetPosts operation
 * 
 * @param context - The context to check
 * @returns True if context is GetPostsContext
 */
export function isGetPostsContext(context: Context): context is GetPostsContext {
    return context.operationName === OPERATION_NAMES.GET_POSTS
}

/**
 * Validates if an operation name is supported
 * 
 * @param operationName - The operation name to validate
 * @returns True if the operation is supported
 */
export function isValidOperationName(operationName: string | undefined): boolean {
    if (!operationName) {
        return false
    }

    return Object.values(OPERATION_NAMES).includes(operationName as any)
}

/**
 * Validates operation-specific context requirements
 * 
 * @param context - The context to validate
 * @returns Validation result for operation-specific requirements
 */
export function validateOperationContext<TVariables = Record<string, unknown>>(
    context: Context<TVariables>
): ValidationResult {
    const errors: string[] = []

    // Validate operation name
    if (!isValidOperationName(context.operationName)) {
        errors.push(CONTEXT_ERROR_MESSAGES.INVALID_OPERATION_NAME)
    }

    // Validate authentication for operations that require it
    const requiresAuth = [
        OPERATION_NAMES.CREATE_DRAFT,
        OPERATION_NAMES.GET_ME
    ].includes(context.operationName as any)

    if (requiresAuth) {
        const authValidation = validateAuthentication(context)
        errors.push(...authValidation.errors)
    }

    return createValidationResult(errors)
}

/**
 * Performs comprehensive context validation including basic, authentication, and operation-specific checks
 * 
 * @param context - The context to validate comprehensively
 * @returns Combined validation result
 */
export function validateContextComprehensive<TVariables = Record<string, unknown>>(
    context: Context<TVariables>
): ValidationResult {
    const errors: string[] = []

    // Basic context validation
    const basicValidation = validateContext(context)
    errors.push(...basicValidation.errors)

    // Operation-specific validation
    const operationValidation = validateOperationContext(context)
    errors.push(...operationValidation.errors)

    return createValidationResult(errors)
} 