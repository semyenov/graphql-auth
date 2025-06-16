
/**
 * Simple global ID parser for development
 * In production, use builder.decodeGlobalID
 */
export function parseGlobalID(globalId: string, expectedType?: string): { id: number; typename: string } {
    return {
        id: parseInt(globalId, 10) || 0,
        typename: expectedType || 'Unknown',
    }
}