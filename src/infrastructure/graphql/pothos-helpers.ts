/**
 * Pothos GraphQL Helper Functions
 * 
 * Provides reusable patterns and utilities for Pothos schema building
 */

import type { FieldRef, InputFieldMap, InputFieldRef, SchemaTypes } from '@pothos/core';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { z } from 'zod';
import type { Context } from '../../context/context-direct';
import { AuthenticationError } from '../../errors';
import { builder } from '../../schema/builder';

/**
 * Creates a mutation field that requires authentication
 */
export function createAuthenticatedMutation<TArgs extends Record<string, unknown>, TReturn>(
    name: string,
    config: {
        description?: string;
        resolve: (args: TArgs, context: Context) => Promise<TReturn> | TReturn;
        type: string | FieldRef<SchemaTypes>;
        errors?: Array<typeof Error>;
        args: (t: typeof builder['args']) => InputFieldMap;
    }
) {
    return builder.mutationField(name, (t) =>
        t.field({
            type: config.type as any,
            description: config.description,
            authScopes: {
                authenticated: true,
            },
            errors: config.errors ? { types: config.errors } : undefined,
            args: config.args(t.arg),
            resolve: async (_root, args: TArgs, context: Context) => {
                if (!context.userId) {
                    throw new AuthenticationError('You must be logged in to perform this action');
                }
                return config.resolve(args, context);
            },
        })
    );
}

/**
 * Creates a standardized Prisma connection field with common patterns
 */
export function createPrismaConnection<TModel extends keyof PrismaTypes>(
    model: TModel,
    options: {
        description?: string;
        defaultWhere?: Record<string, unknown>;
        defaultOrderBy?: Record<string, unknown>;
        authScopes?: Record<string, unknown>;
        additionalArgs?: (t: typeof builder['args']) => Record<string, InputFieldRef<SchemaTypes>>;
    } = {}
) {
    return (t: any) =>
        t.prismaConnection({
            type: model,
            cursor: 'id',
            description: options.description,
            authScopes: options.authScopes,
            totalCount: true,
            args: options.additionalArgs?.(t.arg),
            resolve: (query: any, _root: any, args: any, ctx: Context) => {
                const where = { ...options.defaultWhere, ...args.where };
                const orderBy = args.orderBy || options.defaultOrderBy || { createdAt: 'desc' };

                return ctx.prisma[model.toLowerCase() as Lowercase<TModel>].findMany({
                    ...query,
                    where,
                    orderBy,
                });
            },
        });
}

/**
 * Creates a date field with consistent formatting
 */
export function createDateField(fieldName: string, options?: {
    description?: string;
    nullable?: boolean;
}) {
    return (t: any) =>
        t.expose(fieldName, {
            type: 'DateTime',
            nullable: options?.nullable,
            description: options?.description || `The ${fieldName} timestamp`,
        });
}

/**
 * Creates a computed field with caching support
 */
export function createComputedField<TParent, TReturn>(
    name: string,
    config: {
        description?: string;
        type: string | FieldRef<SchemaTypes>;
        resolve: (parent: TParent, context: Context) => Promise<TReturn> | TReturn;
        nullable?: boolean;
    }
) {
    return (t: any) =>
        t.field({
            type: config.type as any,
            nullable: config.nullable,
            description: config.description,
            resolve: async (parent: TParent, _args: any, context: Context) => {
                return config.resolve(parent, context);
            },
        });
}

/**
 * Validation schemas for common patterns
 */
export const commonValidations = {
    email: z.string().email('Invalid email format').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    content: z.string().max(10000, 'Content too long').optional(),
    id: z.string().regex(/^[A-Za-z0-9+/=]+$/, 'Invalid ID format'),
    pagination: {
        first: z.number().min(1).max(100).optional(),
        last: z.number().min(1).max(100).optional(),
        after: z.string().optional(),
        before: z.string().optional(),
    },
};

/**
 * Creates a validated string argument
 */
export function createValidatedStringArg(
    name: string,
    schema: z.ZodString,
    options?: {
        description?: string;
        required?: boolean;
        defaultValue?: string;
    }
) {
    return (t: typeof builder['args']) =>
        t.string({
            required: options?.required ?? true,
            description: options?.description,
            defaultValue: options?.defaultValue,
            validate: {
                schema,
            },
        });
}

/**
 * Creates an interface for common patterns
 */
export function createTimestampedInterface() {
    const Timestamped = builder.interfaceRef<{
        createdAt: Date;
        updatedAt: Date
    }>('Timestamped');

    builder.interfaceType(Timestamped, {
        description: 'An object with timestamp fields',
        fields: (t) => ({
            createdAt: t.expose('createdAt', {
                type: 'DateTime',
                description: 'When this object was created',
            }),
            updatedAt: t.expose('updatedAt', {
                type: 'DateTime',
                description: 'When this object was last updated',
            }),
        }),
    });

    return Timestamped;
}

/**
 * Helper for creating field-level authorization
 */
export function withFieldAuth<TParent, TReturn>(
    authCheck: (parent: TParent, context: Context) => boolean | Promise<boolean>,
    field: {
        type: string | FieldRef<SchemaTypes>;
        nullable?: boolean;
        description?: string;
        resolve: (parent: TParent, context: Context) => Promise<TReturn> | TReturn;
    }
) {
    return (t: any) =>
        t.field({
            type: field.type as any,
            nullable: field.nullable ?? true,
            description: field.description,
            resolve: async (parent: TParent, _args: any, context: Context) => {
                const hasAuth = await authCheck(parent, context);
                if (!hasAuth) {
                    return field.nullable ? null : undefined;
                }
                return field.resolve(parent, context);
            },
        });
}

/**
 * Creates a batch loader for DataLoader plugin
 */
export function createBatchLoader<TKey, TResult>(
    name: string,
    loadFn: (keys: readonly TKey[], context: Context) => Promise<(TResult | Error)[]>
) {
    return {
        [name]: loadFn,
    };
}