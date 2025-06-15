import type {
    Context,
} from './types.d'

// Context validation helpers
export function validateContext<TVariables = Record<string, unknown>>(context: Context<TVariables>): {
    isValid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (!context.method) {
        errors.push('HTTP method is required')
    }

    if (!context.contentType) {
        errors.push('Content-Type header is required')
    }

    if (context.method === 'POST' && !context.req.body) {
        errors.push('Request body is required for POST requests')
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}
