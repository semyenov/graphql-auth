import { applyMiddleware } from 'graphql-middleware';
import { permissions } from '../permissions';
import { builder } from './builder';

// Define root types first
builder.queryType({});
builder.mutationType({});

// Import all schema components to register them with the builder
// Order matters: scalars/enums → types → inputs → queries/mutations
import './enums';
import './inputs';
import './scalars';

import './types/post';
import './types/user';

import './mutations/auth';
import './mutations/posts';
import './queries/posts';
import './queries/users';

// Build the schema
const pothosSchema = builder.toSchema();

// Export the schema with permissions middleware applied
export const schema = applyMiddleware(pothosSchema, permissions); 