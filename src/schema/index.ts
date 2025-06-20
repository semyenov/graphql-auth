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
import './types/user';
import './types/post';

// Import inputs after types
import './inputs';

// Import error types for Pothos Errors plugin
import './error-types';

// Import enhanced schema components
import './loadable-objects';
import './result-types';
import './enhanced-connections';

// OLD: Clean architecture resolvers with use cases (commented out - using direct resolvers now)
// import '../infrastructure/graphql/resolvers/auth.resolver';
// import '../infrastructure/graphql/resolvers/posts.resolver';
// import '../infrastructure/graphql/resolvers/users.resolver';

// OLD: auth-tokens.resolver (keep for backward compatibility during migration)
import '../infrastructure/graphql/resolvers/auth-tokens.resolver';

// NEW: Direct Pothos resolvers (without use cases)
import '../infrastructure/graphql/resolvers/auth-direct.resolver';
import '../infrastructure/graphql/resolvers/posts-direct.resolver';
import '../infrastructure/graphql/resolvers/users-direct.resolver';
import '../infrastructure/graphql/resolvers/auth-tokens-direct.resolver';

// NEW: Enhanced resolvers with advanced Pothos features
import '../infrastructure/graphql/resolvers/enhanced-queries.resolver';
import '../infrastructure/graphql/resolvers/posts-safe.resolver';

// Import enhanced validation examples
import '../infrastructure/graphql/validation/enhanced-validations';

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

// Export a getter that builds the schema on first access
export const schema = getSchema; 