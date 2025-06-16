/**
 * Rate Limiting Plugin for Pothos
 * 
 * Provides rate limiting directives and helpers for GraphQL operations
 */

import type { FieldRef } from '@pothos/core'
import type { EnhancedContext } from '../../context/enhanced-context'
import { rateLimiter, type RateLimiterOptions } from '../services/rate-limiter.service'
import { RateLimitError } from '../../errors'
import { builder } from '../../schema/builder'

/**
 * Rate limit configuration for a field
 */
export interface RateLimitConfig {
    key: string // Rate limit key (e.g., 'login', 'signup')
    identifier?: (args: any, context: EnhancedContext) => string // Custom identifier function
    points?: number // Override default points
    options?: Partial<RateLimiterOptions> // Override default options
    skipIf?: (args: any, context: EnhancedContext) => boolean | Promise<boolean> // Skip rate limiting conditionally
}

/**
 * Gets the identifier for rate limiting
 */
function getRateLimitIdentifier(
    config: RateLimitConfig,
    args: any,
    context: EnhancedContext
): string {
    if (config.identifier) {
        return config.identifier(args, context)
    }

    // Default identifiers based on common patterns
    if (context.userId) {
        return `user:${context.userId.value}`
    }

    // For unauthenticated requests, use IP address
    const ip = context.request?.ip || 
                context.request?.headers?.['x-forwarded-for'] || 
                context.request?.connection?.remoteAddress ||
                'unknown'
    
    return `ip:${ip}`
}

/**
 * Creates a rate-limited field
 */
export function rateLimitedField<TReturn>(
    config: RateLimitConfig & {
        type: string | FieldRef<unknown>
        description?: string
        resolve: (args: any, context: EnhancedContext) => Promise<TReturn> | TReturn
        args?: any
        authScopes?: any
        nullable?: boolean
    }
) {
    return (t: any) =>
        t.field({
            type: config.type as any,
            description: config.description,
            nullable: config.nullable,
            authScopes: config.authScopes,
            args: config.args,
            resolve: async (root: any, args: any, context: EnhancedContext, info: any) => {
                // Check if rate limiting should be skipped
                if (config.skipIf && await config.skipIf(args, context)) {
                    return config.resolve(args, context)
                }

                // Get rate limiter options
                const rateLimitKey = config.key
                const identifier = getRateLimitIdentifier(config, args, context)
                const options = config.options || {}

                // Apply rate limiting
                await rateLimiter.consume(
                    rateLimitKey,
                    identifier,
                    options as RateLimiterOptions,
                    config.points
                )

                // Execute the resolver
                return config.resolve(args, context)
            },
        })
}

/**
 * Rate limiting middleware for existing fields
 */
export async function applyRateLimit(
    config: RateLimitConfig,
    args: any,
    context: EnhancedContext
): Promise<void> {
    // Check if rate limiting should be skipped
    if (config.skipIf && await config.skipIf(args, context)) {
        return
    }

    // Get rate limiter options
    const rateLimitKey = config.key
    const identifier = getRateLimitIdentifier(config, args, context)
    const options = config.options || {}

    // Apply rate limiting
    await rateLimiter.consume(
        rateLimitKey,
        identifier,
        options as RateLimiterOptions,
        config.points
    )
}

/**
 * Helper to create rate limit configurations
 */
export const createRateLimitConfig = {
    // For authentication operations - use email as identifier
    forAuth: (operation: 'login' | 'signup' | 'passwordReset'): RateLimitConfig => ({
        key: operation,
        identifier: (args) => `email:${args.email?.toLowerCase() || 'unknown'}`,
    }),

    // For user-specific operations
    forUser: (operation: string, pointsPerRequest: number = 1): RateLimitConfig => ({
        key: `user:${operation}`,
        identifier: (_args, context) => context.userId ? `user:${context.userId.value}` : 'anonymous',
        points: pointsPerRequest,
    }),

    // For IP-based operations
    forIp: (operation: string, pointsPerRequest: number = 1): RateLimitConfig => ({
        key: `ip:${operation}`,
        identifier: (_args, context) => {
            const ip = context.request?.ip || 
                       context.request?.headers?.['x-forwarded-for'] || 
                       context.request?.connection?.remoteAddress ||
                       'unknown'
            return `ip:${ip}`
        },
        points: pointsPerRequest,
    }),

    // For expensive operations
    forExpensive: (operation: string): RateLimitConfig => ({
        key: `expensive:${operation}`,
        identifier: (_args, context) => context.userId ? `user:${context.userId.value}` : 'anonymous',
        points: 1,
        options: {
            points: 10,
            duration: 3600, // 1 hour
        },
    }),
}

/**
 * GraphQL directive for rate limiting (future enhancement)
 */
export function rateLimitDirective() {
    // This could be implemented as a custom directive in the future
    // For now, we use the functional approach above
}