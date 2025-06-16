import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import ValidationPlugin from '@pothos/plugin-validation';
import type { EnhancedContext } from '../context/enhanced-context';
import { isProduction } from '../environment';
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
    // Authorization scopes for scope-auth plugin
    AuthScopes: {
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
    plugins: [PrismaPlugin, RelayPlugin, ScopeAuthPlugin, DataloaderPlugin, ValidationPlugin],
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
    // Scope Auth plugin configuration
    scopeAuth: {
        // Recommended to always throw errors on unauthorized access
        authorizeOnSubscribe: true,
        authScopes: async (context: EnhancedContext) => ({
            public: true,
            authenticated: !!context.userId,
            admin: context.user?.role === 'ADMIN',
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
        }),
    },
    // Validation plugin configuration
    validation: {
        validateOnSchemaStart: true,
    },
});
