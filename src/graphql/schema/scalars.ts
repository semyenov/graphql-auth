import {
  DateTimeResolver,
  GraphQLDID,
  GraphQLJSON,
  GraphQLUUID,
  ObjectIDResolver,
} from 'graphql-scalars'
import { builder } from './builder'

// Add DateTime scalar
builder.scalarType('DateTime', {
  serialize: DateTimeResolver.serialize,
  parseValue: DateTimeResolver.parseValue,
  parseLiteral: DateTimeResolver.parseLiteral,
})

builder.scalarType('JSON', {
  serialize: GraphQLJSON.serialize,
  parseValue: GraphQLJSON.parseValue,
  parseLiteral: GraphQLJSON.parseLiteral,
})

builder.scalarType('ObjectID', {
  serialize: ObjectIDResolver.serialize,
  parseValue: ObjectIDResolver.parseValue,
  parseLiteral: ObjectIDResolver.parseLiteral,
})

builder.scalarType('DID', {
  serialize: GraphQLDID.serialize,
  parseValue: GraphQLDID.parseValue,
  parseLiteral: GraphQLDID.parseLiteral,
})

builder.scalarType('UUID', {
  serialize: GraphQLUUID.serialize,
  parseValue: GraphQLUUID.parseValue,
  parseLiteral: GraphQLUUID.parseLiteral,
})
