import { DateTimeResolver } from 'graphql-scalars';
import { builder } from './builder';

// Add DateTime scalar
builder.scalarType('DateTime', {
    serialize: DateTimeResolver.serialize,
    parseValue: DateTimeResolver.parseValue,
    parseLiteral: DateTimeResolver.parseLiteral,
}); 