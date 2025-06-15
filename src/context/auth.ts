import type { Context } from './types.d'

// Enhanced context helpers with better typing
export function isAuthenticated<TVariables = Record<string, unknown>>(context: Context<TVariables>): boolean {
    return context.security.isAuthenticated
}

export function requireAuthentication<TVariables = Record<string, unknown>>(context: Context<TVariables>): number {
    if (!context.security.isAuthenticated || !context.userId) {
        throw new Error('Authentication required')
    }
    return context.userId
}

export function hasPermission<TVariables = Record<string, unknown>>(context: Context<TVariables>, permission: string): boolean {
    return context.security.permissions?.includes(permission) || false
}

export function hasRole<TVariables = Record<string, unknown>>(
    context: Context<TVariables>,
    role: string,
): boolean {
    return context.security.roles?.includes(role) || false
} 