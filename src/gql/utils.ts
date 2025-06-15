import { print } from 'graphql'
import type {
    GraphQLOperationMeta,
    GraphQLResponse
} from '../context/types'

// =============================================================================
// DEVELOPMENT UTILITIES
// =============================================================================

export const devUtils = {
    // Print any GraphQL document for debugging
    print: (query: any) => print(query),

    // Log GraphQL operations for debugging
    logOperation: (operation: GraphQLOperationMeta, result: GraphQLResponse) => {
        console.log(`[GraphQL ${operation.operationType.toUpperCase()}] ${operation.operationName || 'Anonymous'}`)
        if (operation.variables) {
            console.log('Variables:', JSON.stringify(operation.variables, null, 2))
        }
        if (result.errors) {
            console.error('Errors:', result.errors)
        }
        if (result.data) {
            console.log('Data:', JSON.stringify(result.data, null, 2))
        }
    },

    // Validate GraphQL response
    validateResponse: <T>(response: GraphQLResponse<T>): T => {
        if (response.errors && response.errors.length > 0) {
            throw new Error(`GraphQL Error: ${response.errors.map(e => e.message).join(', ')}`)
        }
        if (!response.data) {
            throw new Error('GraphQL response contains no data')
        }
        return response.data
    }
} 