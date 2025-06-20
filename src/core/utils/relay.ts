/**
 * Shared Relay helpers for GraphQL
 */

/**
 * Encodes a database ID into a Relay global ID
 */
export function toGlobalId(type: string, id: number | string): string {
  const str = `${type}:${id}`
  return Buffer.from(str).toString('base64')
}

/**
 * Decodes a Relay global ID into type and database ID
 */
export function fromGlobalId(globalId: string): { type: string; id: string } {
  try {
    const decoded = Buffer.from(globalId, 'base64').toString('utf-8')
    const [type, id] = decoded.split(':')
    return { type: type || '', id: id || '' }
  } catch {
    return { type: '', id: '' }
  }
}

/**
 * Parses a global ID and returns the numeric ID
 * @throws Error if the ID is invalid
 */
export function parseGlobalId(globalId: string, expectedType: string): number {
  const decoded = fromGlobalId(globalId)

  if (decoded.type !== expectedType) {
    throw new Error(`Expected ${expectedType} ID but got ${decoded.type}`)
  }

  const id = Number.parseInt(decoded.id, 10)
  if (Number.isNaN(id) || id <= 0) {
    throw new Error(`Invalid ${expectedType} ID`)
  }

  return id
}

/**
 * Alias for toGlobalId for backward compatibility with Pothos builder
 */
export const encodeGlobalId = toGlobalId

/**
 * Alias for fromGlobalId for backward compatibility with Pothos builder
 */
export const decodeGlobalId = (globalId: string) => {
  const { type, id } = fromGlobalId(globalId)
  return { typename: type, id }
}

/**
 * Alias for parseGlobalId for backward compatibility
 */
export const parseAndValidateGlobalId = parseGlobalId
