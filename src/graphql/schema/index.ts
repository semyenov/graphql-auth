import { lexicographicSortSchema } from 'graphql'
import { builder } from './builder'

// Import all schema components to register them with the builder
// Order matters: scalars/enums → types → inputs → error types → resolvers
import './enums'
import './scalars'

// Import types BEFORE inputs (as inputs might reference types)
import '../../modules/posts/types/post.types'
import '../../modules/users/types/user.types'

// Import inputs after types
import './inputs'

// Import error types for Pothos Errors plugin
import './error-types'

import '../../modules/auth/auth.resolver'
import '../../modules/posts/post.resolver'
import '../../modules/users/user.resolver'

// OIDC resolver is imported conditionally to avoid early container access
let oidcResolverImported = false

function ensureOidcResolver() {
  if (!oidcResolverImported) {
    try {
      // Only import if container is configured (will be configured in tests and server)
      require('../../../modules/oidc/oidc.resolver')
      oidcResolverImported = true
    } catch (error) {
      // Silently ignore if container is not ready (e.g., during schema generation script)
      if (
        error instanceof Error &&
        !error.message.includes('IOidcProviderService')
      ) {
        throw error
      }
    }
  }
}

// Lazy load schema to ensure all types are registered first
let _schema: ReturnType<typeof builder.toSchema> | null = null

export function buildSchema() {
  if (!_schema) {
    // Ensure OIDC resolver is loaded when building schema
    ensureOidcResolver()

    // Initialize the builder with the provided prisma client
    // Define root types first
    builder.queryType({ description: 'The root query type' })
    builder.mutationType({ description: 'The root mutation type' })
    // Build the schema
    const schema = builder.toSchema()
    _schema = lexicographicSortSchema(schema)
  }
  return _schema
}

// Reset schema cache - only for tests
export function resetSchemaCache() {
  _schema = null
}
