/**
 * Parse global ID with base64 decoding
 * Compatible with Pothos Relay plugin
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

    // Try base64 decode
    try {
        const decoded = Buffer.from(globalId, 'base64').toString('utf-8')
        const [type, idStr] = decoded.split(':')
        const id = parseInt(idStr || '0', 10)

        // Validate the ID
        if (isNaN(id) || id <= 0) {
            throw new Error(`Invalid ${expectedType || 'resource'} ID`)
        }

        return {
            id,
            typename: type || expectedType || 'Unknown',
        }
    } catch (error) {
        // If all parsing fails, throw a clear error
        throw new Error(`Invalid ${expectedType || 'resource'} ID`)
    }
}