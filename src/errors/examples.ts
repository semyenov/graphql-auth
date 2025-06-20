/**
 * Practical examples of using error classes in the GraphQL authentication codebase
 * 
 * This file demonstrates real-world usage patterns for each error type
 */

import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../prisma'
import {
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    NotFoundError,
    RateLimitError,
    ValidationError,
    normalizeError,
} from './index'

// =============================================================================
// Authentication Examples
// =============================================================================

/**
 * Example: Require authentication in a resolver
 */
export async function createPostResolver(
    _parent: unknown,    // eslint-disable-line @typescript-eslint/no-unused-vars
    args: { title: string; content?: string },
    context: { userId?: number }
) {
    // Check if user is authenticated
    if (!context.userId) {
        throw new AuthenticationError()
    }

    // Proceed with authenticated user
    return prisma.post.create({
        data: {
            title: args.title,
            content: args.content,
            authorId: context.userId,
        },
    })
}

/**
 * Example: Custom authentication error messages
 */
export async function loginResolver(
    _parent: unknown,    // eslint-disable-line @typescript-eslint/no-unused-vars
    args: { email: string; password: string }
) {
    const user = await prisma.user.findUnique({
        where: { email: args.email },
    })

    if (!user) {
        // Don't reveal whether email exists
        throw new AuthenticationError('Invalid email or password')
    }

    const validPassword = await bcrypt.compare(args.password, user.password)
    if (!validPassword) {
        throw new AuthenticationError('Invalid email or password')
    }

    // Return token...
}

// =============================================================================
// Authorization Examples
// =============================================================================

/**
 * Example: Check resource ownership
 */
export async function updatePostResolver(
    _parent: unknown,
    args: { id: number; title: string },
    context: { userId?: number }
) {
    if (!context.userId) {
        throw new AuthenticationError()
    }

    const post = await prisma.post.findUnique({
        where: { id: args.id },
        select: { authorId: true },
    })

    if (!post) {
        throw new NotFoundError('Post', args.id.toString())
    }

    if (post.authorId !== context.userId) {
        throw new AuthorizationError('You can only edit your own posts')
    }

    return prisma.post.update({
        where: { id: args.id },
        data: { title: args.title },
    })
}

/**
 * Example: Role-based authorization
 */
export async function adminOnlyResolver(
    _parent: unknown,
    _args: unknown,
    context: { userId?: number; roles?: string[] }
) {
    if (!context.userId) {
        throw new AuthenticationError()
    }

    if (!context.roles?.includes('admin')) {
        throw new AuthorizationError('Admin access required')
    }

    // Perform admin operation...
}

// =============================================================================
// Validation Examples
// =============================================================================

/**
 * Example: Field-specific validation errors
 */
export async function signupResolver(
    _parent: unknown,
    args: { email: string; password: string; name?: string }
) {
    const errors: Record<string, string[]> = {}

    // Validate email
    if (!args.email.includes('@')) {
        errors.email = ['Invalid email format']
    }

    // Validate password
    if (args.password.length < 8) {
        errors.password = ['Password must be at least 8 characters']
    }
    if (!/\d/.test(args.password)) {
        errors.password = [...(errors.password || []), 'Password must contain a number']
    }

    // Throw if any errors
    if (Object.keys(errors).length > 0) {
        throw new ValidationError(errors)
    }

    // Continue with signup...
}

/**
 * Example: Using Zod with ValidationError
 */
const postSchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().max(10000).optional(),
    tags: z.array(z.string()).max(5).optional(),
})

export function validatePostInput(input: unknown) {
    try {
        return postSchema.parse(input)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string[]> = {}

            error.errors.forEach((err) => {
                const field = err.path.join('.')
                if (!fieldErrors[field]) {
                    fieldErrors[field] = []
                }
                fieldErrors[field].push(err.message)
            })

            throw new ValidationError(fieldErrors)
        }
        throw error
    }
}

// =============================================================================
// NotFound Examples
// =============================================================================

/**
 * Example: Resource not found
 */
export async function getPostResolver(
    _parent: unknown,
    args: { id: number }
) {
    const post = await prisma.post.findUnique({
        where: { id: args.id },
    })

    if (!post) {
        throw new NotFoundError('Post', args.id.toString())
    }

    return post
}

/**
 * Example: Handle Prisma not found errors
 */
export async function deletePostResolver(
    _parent: unknown,
    args: { id: number }
) {
    try {
        return await prisma.post.delete({
            where: { id: args.id },
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Post', args.id.toString())
            }
        }
        throw normalizeError(error)
    }
}

// =============================================================================
// Conflict Examples
// =============================================================================

/**
 * Example: Handle duplicate entries
 */
export async function createUserResolver(
    _parent: unknown,
    args: { email: string; name: string, password: string }
) {
    try {
        return await prisma.user.create({
            data: args,
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // Unique constraint violation
                const target = error.meta?.target as string[]
                if (target?.includes('email')) {
                    throw new ConflictError('An account with this email already exists')
                }
                throw new ConflictError('This user already exists')
            }
        }
        throw normalizeError(error)
    }
}


// =============================================================================
// Rate Limit Examples
// =============================================================================

/**
 * Example: Simple rate limiting
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

export async function rateLimitedLoginResolver(
    _parent: unknown,
    args: { email: string; password: string }
) {
    const now = Date.now()
    const attempts = loginAttempts.get(args.email)

    if (attempts && attempts.resetAt > now) {
        if (attempts.count >= 5) {
            const retryInSeconds = Math.ceil((attempts.resetAt - now) / 1000)
            throw new RateLimitError(
                `Too many login attempts. Try again in ${retryInSeconds} seconds`,
                retryInSeconds
            )
        }
        attempts.count++
    } else {
        loginAttempts.set(args.email, {
            count: 1,
            resetAt: now + 15 * 60 * 1000, // 15 minutes
        })
    }

    // Proceed with login...
}

// =============================================================================
// Error Normalization Examples
// =============================================================================

/**
 * Example: Comprehensive error handling
 */
export async function complexOperationResolver(
    _parent: unknown,
    args: { id: number; data: unknown },
    context: { userId?: number }
) {
    try {
        // Check authentication
        if (!context.userId) {
            throw new AuthenticationError()
        }

        // Validate input
        const validatedData = validatePostInput(args.data)

        // Check resource exists and ownership
        const resource = await prisma.post.findUnique({
            where: { id: args.id },
            select: { authorId: true },
        })

        if (!resource) {
            throw new NotFoundError('Post', args.id.toString())
        }

        if (resource.authorId !== context.userId) {
            throw new AuthorizationError('You do not own this resource')
        }

        // Perform update
        return await prisma.post.update({
            where: { id: args.id },
            data: validatedData,
        })
    } catch (error) {
        // normalizeError handles all error types appropriately
        throw normalizeError(error)
    }
}

/**
 * Example: Error handling in GraphQL Shield rules
 */
import { rule } from 'graphql-shield'

export const isAuthenticated = rule({ cache: 'contextual' })(
    async (_parent, _args, context) => {
        if (!context.userId) {
            // Return error instead of throwing in rules
            return new AuthenticationError()
        }
        return true
    }
)

export const isResourceOwner = rule({ cache: 'strict' })(
    async (_parent, args: { id: string }, context: { userId?: number }) => {
        if (!context.userId) {
            return new AuthenticationError()
        }

        const resource = await prisma.post.findUnique({
            where: { id: parseInt(args.id, 10) },
            select: { authorId: true },
        })

        if (!resource) {
            return new NotFoundError('Post', args.id.toString())
        }

        if (resource.authorId !== context.userId) {
            return new AuthorizationError('You do not own this resource')
        }

        return true
    }
)