import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import type { EnhancedContext } from '../context/enhanced-context';
import { isProduction } from '../environment';
import { prisma } from '../prisma';
import { decodeGlobalId, encodeGlobalId } from '../shared/infrastructure/graphql/relay-helpers';
/**
 * SchemaBuilder configuration for Pothos with Prisma and Relay plugins
 * 
 * The Relay plugin configuration uses the same ID encoding/decoding
 * as the test utilities to ensure consistency across the codebase.
 */
export const builder = new SchemaBuilder<{
    Context: EnhancedContext;
    PrismaTypes: PrismaTypes;
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
    plugins: [PrismaPlugin, RelayPlugin],
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
});
