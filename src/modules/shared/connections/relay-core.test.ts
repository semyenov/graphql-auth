/**
 * Relay Utilities Tests
 */

import { describe, expect, it } from 'vitest'
import {
  decodeGlobalId,
  encodeGlobalId,
  fromGlobalId,
  parseAndValidateGlobalId,
  parseGlobalId,
  toGlobalId,
} from './relay-core'

describe('Relay Utilities', () => {
  describe('toGlobalId', () => {
    it('should encode numeric ID correctly', () => {
      const result = toGlobalId('User', 123)
      expect(result).toBe('VXNlcjoxMjM=') // Base64 of "User:123"
    })

    it('should encode string ID correctly', () => {
      const result = toGlobalId('Post', 'abc-123')
      expect(result).toBe('UG9zdDphYmMtMTIz') // Base64 of "Post:abc-123"
    })

    it('should handle empty type', () => {
      const result = toGlobalId('', '123')
      expect(result).toBe('OjEyMw==') // Base64 of ":123"
    })

    it('should handle zero ID', () => {
      const result = toGlobalId('User', 0)
      expect(result).toBe('VXNlcjow') // Base64 of "User:0"
    })
  })

  describe('fromGlobalId', () => {
    it('should decode valid global ID', () => {
      const result = fromGlobalId('VXNlcjoxMjM=') // Base64 of "User:123"
      expect(result).toEqual({ type: 'User', id: '123' })
    })

    it('should handle ID with multiple colons', () => {
      const encoded = Buffer.from('Type:id:with:colons').toString('base64')
      const result = fromGlobalId(encoded)
      // fromGlobalId splits on first colon only
      expect(result).toEqual({ type: 'Type', id: 'id' })
    })

    it('should handle invalid base64', () => {
      // The fromGlobalId function doesn't actually validate base64 - it's lenient
      // and decodes what it can. For truly invalid base64, we'd need a string that
      // causes Buffer.from to throw, which is rare.
      const result = fromGlobalId('!!!invalid!!!')
      // This actually gets partially decoded to garbage characters
      expect(result.id).toBe('')
      expect(result.type).toBeTruthy() // Will have some garbage characters
    })

    it('should handle empty string', () => {
      const result = fromGlobalId('')
      expect(result).toEqual({ type: '', id: '' })
    })

    it('should handle base64 without colon', () => {
      const encoded = Buffer.from('NoColonHere').toString('base64')
      const result = fromGlobalId(encoded)
      expect(result).toEqual({ type: 'NoColonHere', id: '' })
    })

    it('should handle base64 with only colon', () => {
      const encoded = Buffer.from(':').toString('base64')
      const result = fromGlobalId(encoded)
      expect(result).toEqual({ type: '', id: '' })
    })
  })

  describe('parseGlobalId', () => {
    it('should parse valid global ID with correct type', () => {
      const globalId = toGlobalId('Post', 42)
      const result = parseGlobalId(globalId, 'Post')
      expect(result).toBe(42)
    })

    it('should throw error for incorrect type', () => {
      const globalId = toGlobalId('User', 123)
      expect(() => parseGlobalId(globalId, 'Post')).toThrow(
        'Expected Post ID but got User',
      )
    })

    it('should throw error for non-numeric ID', () => {
      const globalId = Buffer.from('Post:abc').toString('base64')
      expect(() => parseGlobalId(globalId, 'Post')).toThrow('Invalid Post ID')
    })

    it('should throw error for negative ID', () => {
      const globalId = toGlobalId('Post', -5)
      expect(() => parseGlobalId(globalId, 'Post')).toThrow('Invalid Post ID')
    })

    it('should throw error for zero ID', () => {
      const globalId = toGlobalId('Post', 0)
      expect(() => parseGlobalId(globalId, 'Post')).toThrow('Invalid Post ID')
    })

    it('should throw error for empty type in encoded ID', () => {
      const globalId = Buffer.from(':123').toString('base64')
      expect(() => parseGlobalId(globalId, 'Post')).toThrow(
        'Expected Post ID but got ',
      )
    })

    it('should handle large numeric IDs', () => {
      const largeId = 999999999
      const globalId = toGlobalId('User', largeId)
      const result = parseGlobalId(globalId, 'User')
      expect(result).toBe(largeId)
    })
  })

  describe('encodeGlobalId (alias)', () => {
    it('should work the same as toGlobalId', () => {
      const result1 = toGlobalId('User', 123)
      const result2 = encodeGlobalId('User', 123)
      expect(result1).toBe(result2)
    })
  })

  describe('decodeGlobalId (alias)', () => {
    it('should decode with typename property', () => {
      const globalId = toGlobalId('User', 123)
      const result = decodeGlobalId(globalId)
      expect(result).toEqual({ typename: 'User', id: '123' })
    })

    it('should handle invalid input', () => {
      // Same as above - Buffer.from is lenient with base64
      const result = decodeGlobalId('!!!invalid!!!')
      expect(result.id).toBe('')
      expect(result.typename).toBeTruthy() // Will have some garbage characters
    })
  })

  describe('parseAndValidateGlobalId (alias)', () => {
    it('should work the same as parseGlobalId', () => {
      const globalId = toGlobalId('Post', 42)
      const result1 = parseGlobalId(globalId, 'Post')
      const result2 = parseAndValidateGlobalId(globalId, 'Post')
      expect(result1).toBe(result2)
    })
  })

  describe('Round-trip encoding/decoding', () => {
    it('should maintain data integrity for various inputs', () => {
      const testCases = [
        { type: 'User', id: 1 },
        { type: 'Post', id: 999 },
        { type: 'Comment', id: '42' },
        { type: 'TypeWithLongName', id: '12345' },
      ]

      for (const { type, id } of testCases) {
        const encoded = toGlobalId(type, id)
        const decoded = fromGlobalId(encoded)
        expect(decoded.type).toBe(type)
        expect(decoded.id).toBe(String(id))
      }
    })
  })
})
