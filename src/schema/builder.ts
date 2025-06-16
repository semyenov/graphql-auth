import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import type { Context } from '../context';
import { isProduction } from '../environment';
import { prisma } from '../prisma';

export const builder = new SchemaBuilder<{
    Context: Context;
    PrismaTypes: PrismaTypes;
    Scalars: {
        ID: {
            Input: string;
            Output: string;
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
        exposeDescriptions: true,
        filterConnectionTotalCount: true,
        onUnusedQuery: isProduction ? null : 'warn',
    },
});
