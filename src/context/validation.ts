import type {
    Context,
    CreateDraftContext,
    GetMeContext,
    GetPostByIdContext,
    LoginContext,
    SignupContext
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

// Type guards for specific operation contexts
export function isLoginContext(context: Context): context is LoginContext {
    return context.operationName === 'Login'
}

export function isSignupContext(context: Context): context is SignupContext {
    return context.operationName === 'Signup'
}

export function isCreateDraftContext(context: Context): context is CreateDraftContext {
    return context.operationName === 'CreateDraft'
}

export function isGetMeContext(context: Context): context is GetMeContext {
    return context.operationName === 'GetMe'
}

export function isGetPostByIdContext(context: Context): context is GetPostByIdContext {
    return context.operationName === 'GetPostById'
} 