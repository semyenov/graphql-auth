/**
 * GraphQL Error Type Definitions for Pothos
 * 
 * Implements error types for the Pothos Errors plugin
 */

import { builder } from '../../schema/builder';
import {
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError
} from '../../errors';

// Base error interface
const BaseErrorInterface = builder.interfaceRef<Error>('BaseError').implement({
    fields: (t) => ({
        message: t.exposeString('message'),
    }),
});

// Implement ValidationError
builder.objectType(ValidationError, {
    name: 'ValidationError',
    interfaces: [BaseErrorInterface],
    fields: (t) => ({
        code: t.string({ 
            resolve: () => 'VALIDATION_ERROR' 
        }),
        errors: t.field({
            type: 'JSON',
            nullable: true,
            resolve: (error) => error.errors,
        }),
    }),
});

// Implement AuthenticationError
builder.objectType(AuthenticationError, {
    name: 'AuthenticationError',
    interfaces: [BaseErrorInterface],
    fields: (t) => ({
        code: t.string({ 
            resolve: () => 'UNAUTHENTICATED' 
        }),
    }),
});

// Implement AuthorizationError
builder.objectType(AuthorizationError, {
    name: 'AuthorizationError',
    interfaces: [BaseErrorInterface],
    fields: (t) => ({
        code: t.string({ 
            resolve: () => 'FORBIDDEN' 
        }),
    }),
});

// Implement NotFoundError
builder.objectType(NotFoundError, {
    name: 'NotFoundError',
    interfaces: [BaseErrorInterface],
    fields: (t) => ({
        code: t.string({ 
            resolve: () => 'NOT_FOUND' 
        }),
        resource: t.exposeString('resource', { nullable: true }),
        identifier: t.exposeString('identifier', { nullable: true }),
    }),
});

// Implement ConflictError
builder.objectType(ConflictError, {
    name: 'ConflictError',
    interfaces: [BaseErrorInterface],
    fields: (t) => ({
        code: t.string({ 
            resolve: () => 'CONFLICT' 
        }),
        field: t.exposeString('field', { nullable: true }),
    }),
});