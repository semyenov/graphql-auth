// This file ensures that GraphQL is loaded from a single location
// to prevent "Cannot use GraphQLObjectType from another module" errors

// Force require graphql from the root node_modules
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// Get the absolute path to the graphql module
const graphqlPath = path.join(__dirname, '..', 'node_modules', 'graphql')

// Pre-load graphql to ensure it's cached
try {
  require(graphqlPath)
} catch (error) {
  console.error('Failed to pre-load GraphQL:', error)
}

// Export to ensure this module is included
export const graphqlPreloaded = true
