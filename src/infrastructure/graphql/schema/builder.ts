/**
 * GraphQL Schema Builder
 * 
 * Configured for our clean architecture.
 */

import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import RelayPlugin from '@pothos/plugin-relay'
import { prisma } from '../../../prisma'
import { GraphQLContext } from '../context/graphql-context'

export const builder = new SchemaBuilder<{
  Context: GraphQLContext
  Scalars: {
    DateTime: {
      Input: Date
      Output: Date
    }
  }
}>({
  plugins: [RelayPlugin, PrismaPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
  },
  relay: {
    clientMutationId: 'omit',

    cursorType: 'String',
    nodeQueryOptions: false,
    nodesQueryOptions: false,
  },
})

// Add root types
builder.queryType({
  description: 'The query root type',
})

builder.mutationType({
  description: 'The mutation root type',
})

// Add DateTime scalar
builder.scalarType('DateTime', {
  serialize: (date) => date.toISOString(),
  parseValue: (value) => new Date(value as string),
})