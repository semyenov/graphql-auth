import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import ErrorsPlugin from '@pothos/plugin-errors';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import ValidationPlugin from '@pothos/plugin-validation';
import type { EnhancedContext } from '../context/enhanced-context-direct';
import { isProduction } from '../environment';
import {
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    NotFoundError,
    ValidationError
} from '../errors';
import { prisma } from '../prisma';
import { decodeGlobalId, encodeGlobalId, parseGlobalId } from '../shared/infrastructure/graphql/relay-helpers';
/**
 * SchemaBuilder configuration for Pothos with Prisma and Relay plugins
 * 
 * The Relay plugin configuration uses the same ID encoding/decoding
 * as the test utilities to ensure consistency across the codebase.
 */
export const builder = new SchemaBuilder<{
    Context: EnhancedContext;
    PrismaTypes: PrismaTypes;
    // Error types for the errors plugin
    Errors: {
        ValidationError: typeof ValidationError;
        AuthenticationError: typeof AuthenticationError;
        AuthorizationError: typeof AuthorizationError;
        NotFoundError: typeof NotFoundError;
        ConflictError: typeof ConflictError;
    };
    // Authorization scopes for scope-auth plugin
    ScopeAuthScopes: {
        public: boolean;
        authenticated: boolean;
        admin: boolean;
        postOwner: (postId: string | number) => boolean | Promise<boolean>;
        userOwner: (userId: string | number) => boolean | Promise<boolean>;
    };
    Scalars: {
        ID: {
            Input: string | number | bigint;
            Output: {
                typename: string;
                id: string | number | bigint;
            };
        };
        DID: {
            Input: string;
            Output: string;
        };
        UUID: {
            Input: string;
            Output: string;
        };
        JSON: {
            Input: any;
            Output: any;
        };
        ObjectID: {
            Input: string;
            Output: string;
        };
        DateTime: {
            Input: Date;
            Output: Date;
        };
    };
}>({
    plugins: [PrismaPlugin, RelayPlugin, ErrorsPlugin, ScopeAuthPlugin, DataloaderPlugin, ValidationPlugin],
    prisma: {
        client: prisma,
        // Enable field-level selection optimization and descriptions
        exposeDescriptions: true,
        filterConnectionTotalCount: true,
        // Validation handled by Pothos automatically
        // Error handling for unused queries in development
        onUnusedQuery: isProduction ? null : 'warn',
    },
    relay: {
        // Use the same ID encoding as our test utilities
        // This ensures consistency between tests and production
        encodeGlobalID: (typename, id) => encodeGlobalId(typename, id as string | number),
        decodeGlobalID: (globalID) => {
            const { type, id } = decodeGlobalId(globalID)
            return { typename: type, id }
        },
        // Modern Relay options for better performance and developer experience
        clientMutationId: 'omit', // Omit clientMutationId field from mutations (Relay modern style)
        cursorType: 'String', // Use String for cursor type instead of opaque cursor
        nodeQueryOptions: false, // Disable automatic node query field generation
        nodesQueryOptions: false, // Disable automatic nodes query field generation
        // PageInfo fields are included by default in Relay implementation
    },
    // Errors plugin configuration
    errors: {
        defaultTypes: [Error],
        // Map our custom errors to GraphQL error extensions
        directResult: false,
    },
    // Authorization plugin configuration
    scopeAuth: {
        authScopes(context: EnhancedContext) {
            return {
                public: true,
                authenticated: () => !!context.userId,
                admin: () => context.user?.role === 'admin',
                postOwner: async (postId: string | number) => {
                    if (!context.userId) return false;
                    const numericPostId = typeof postId === 'string' ? parseGlobalId(postId, 'Post') : postId;
                    const post = await context.prisma.post.findUnique({
                        where: { id: numericPostId },
                        select: { authorId: true },
                    });
                    return post?.authorId === context.userId.value;
                },
                userOwner: async (userId: string | number) => {
                    if (!context.userId) return false;
                    const numericUserId = typeof userId === 'string' ? parseGlobalId(userId, 'User') : userId;
                    return numericUserId === context.userId.value;
                },
            }
        },
    },
    validationOptions: {
        validationError: (error) => {
            console.error(error);
            return error;
        },
    },
});
