/**
 * Utilities for working with Relay global IDs in tests
 * 
 * These utilities help convert between numeric database IDs and
 * Relay-style global IDs (base64-encoded "Type:id" strings)
 */

/**
 * Convert a numeric ID to a Relay global ID
 * Uses base64 encoding to match Pothos Relay plugin
 * 
 * @param type - The GraphQL type name (e.g., "User", "Post")
 * @param id - The numeric database ID
 * @returns Base64-encoded global ID
 */
export function toGlobalId(type: string, id: number | string): string {
  const str = `${type}:${id}`
  // Base64 encode to match Relay spec
  return Buffer.from(str).toString('base64')
}

/**
 * Parse a global ID back to its components
 * 
 * @param globalId - Base64-encoded global ID
 * @returns Object with type and id fields
 */
export function fromGlobalId(globalId: string): { type: string; id: string } {
  try {
    // Base64 decode
    const decoded = Buffer.from(globalId, 'base64').toString('utf-8')
    const [type, id] = decoded.split(':')
    return { type: type || '', id: id || '' }
  } catch {
    // Fallback for invalid IDs
    return { type: '', id: '' }
  }
}

/**
 * Convert a numeric user ID to a global ID
 */
export function toUserId(id: number): string {
  return toGlobalId('User', id)
}

/**
 * Convert a numeric post ID to a global ID
 */
export function toPostId(id: number): string {
  return toGlobalId('Post', id)
}

/**
 * Extract numeric ID from a global ID
 * 
 * @param globalId - Base64-encoded global ID
 * @returns Numeric database ID
 * @throws Error if ID cannot be parsed as a number
 */
export function extractNumericId(globalId: string): number {
  const { id } = fromGlobalId(globalId)
  const numericId = Number.parseInt(id, 10)

  if (Number.isNaN(numericId)) {
    throw new Error(`Invalid numeric ID in global ID: ${globalId}`)
  }

  return numericId
}
