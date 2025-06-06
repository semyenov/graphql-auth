import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import type { Context } from './context';
import { prisma } from './prisma';

export const builder = new SchemaBuilder<{
    Context: Context;
    PrismaTypes: PrismaTypes;
    Scalars: {
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
        onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
    },
});
