
/**
 * Helper to encode a global ID (same as toGlobalId in tests)
 * @param typename - The GraphQL type name (e.g., "User", "Post")
 * @param id - The numeric database ID
 * @returns Base64-encoded global ID
 */
export function encodeGlobalId(typename: string, id: string | number | bigint): string {
    const str = `${typename}:${id}`
    return Buffer.from(str).toString('base64')
}

/**
 * Helper to decode a global ID (same as fromGlobalId in tests)
 * @param globalId - Base64-encoded global ID
 * @returns Object with typename and id fields
 */
export function decodeGlobalId(globalId: string): { typename: string; id: string } {
    try {
        const decoded = Buffer.from(globalId, 'base64').toString('utf-8')
        const [typename, id] = decoded.split(':')
        return { typename: typename || '', id: id || '' }
    } catch {
        return { typename: '', id: '' }
    }
}


/**
 * Parse global ID with base64 decoding
 * Compatible with Pothos Relay plugin
 * 
 * @param globalId - The global ID to parse
 * @param expectedType - Optional expected type for validation
 * @returns Object with numeric id and typename
 * @throws Error if ID is invalid or doesn't match expected type
 */
export function parseGlobalID(globalId: string, expectedType?: string): { id: number; typename: string } {
    // First check if it's already a numeric ID (for backwards compatibility)
    const numericId = parseInt(globalId, 10)
    if (!isNaN(numericId) && numericId > 0 && globalId === numericId.toString()) {
        return {
            id: numericId,
            typename: expectedType || 'Unknown',
        }
    }

    // Use the builder's decode function
    try {
        const decoded = decodeGlobalId(globalId)
        const id = parseInt(decoded.id, 10)

        // Validate the ID
        if (isNaN(id) || id <= 0) {
            throw new Error(`Invalid ${expectedType || 'resource'} ID`)
        }

        // Validate type if expected
        if (expectedType && decoded.typename !== expectedType) {
            throw new Error(`Expected ${expectedType} ID but got ${decoded.typename}`)
        }

        return {
            id,
            typename: decoded.typename || expectedType || 'Unknown',
        }
    } catch (error) {
        // If parsing fails, throw a clear error
        if (error instanceof Error) {
            throw error
        }
        throw new Error(`Invalid ${expectedType || 'resource'} ID`)
    }
}