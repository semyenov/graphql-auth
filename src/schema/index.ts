import { applyMiddleware } from 'graphql-middleware';
import { permissions } from '../permissions';
import { builder } from './builder';

// Define root types first
builder.queryType({});
builder.mutationType({});

// Import all schema components to register them with the builder
// Order matters: scalars/enums → types → inputs → error types → resolvers
import './enums';
import './scalars';

// Import types BEFORE inputs (as inputs might reference types)
import './types/post';
import './types/user';

// Import inputs after types
import './inputs';

// Import error types for Pothos Errors plugin
import './error-types';

import '../infrastructure/graphql/resolvers/auth-tokens.resolver';
import '../infrastructure/graphql/resolvers/auth.resolver';
import '../infrastructure/graphql/resolvers/posts.resolver';
import '../infrastructure/graphql/resolvers/users.resolver';

// Lazy load schema to ensure all types are registered first
let _schema: ReturnType<typeof applyMiddleware> | null = null;

export function getSchema() {
  if (!_schema) {
    // Build the schema
    const pothosSchema = builder.toSchema();
    // Apply permissions middleware
    _schema = applyMiddleware(pothosSchema, permissions);
  }
  return _schema;
}
