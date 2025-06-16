/**
 * GraphQL snapshot testing utilities
 */

import type { GraphQLResponse } from '@apollo/server'
import { createHash } from 'crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { diff } from 'jest-diff'
import { join } from 'path'

export interface SnapshotOptions {
  name: string
  directory?: string
  update?: boolean
  normalizers?: Array<(data: any) => any>
  redactFields?: string[]
}

export interface SnapshotResult {
  passed: boolean
  message?: string
  diff?: string
  actual?: any
  expected?: any
}

/**
 * Create a snapshot tester for GraphQL responses
 */
export class GraphQLSnapshotTester {
  private snapshotDir: string
  private updateSnapshots: boolean

  constructor(options: { baseDir?: string; update?: boolean } = {}) {
    this.snapshotDir = options.baseDir || join(process.cwd(), '__snapshots__')
    this.updateSnapshots = options.update || process.env.UPDATE_SNAPSHOTS === 'true'

    // Ensure snapshot directory exists
    if (!existsSync(this.snapshotDir)) {
      mkdirSync(this.snapshotDir, { recursive: true })
    }
  }

  /**
   * Test a GraphQL response against a snapshot
   */
  async testSnapshot(
    response: GraphQLResponse,
    options: SnapshotOptions,
  ): Promise<SnapshotResult> {
    const normalized = this.normalizeResponse(response, options)
    const snapshotPath = this.getSnapshotPath(options)

    if (this.updateSnapshots || !existsSync(snapshotPath)) {
      // Write/update snapshot
      this.writeSnapshot(snapshotPath, normalized)
      return {
        passed: true,
        message: this.updateSnapshots ? 'Snapshot updated' : 'Snapshot created',
      }
    }

    // Compare with existing snapshot
    const expected = this.readSnapshot(snapshotPath)
    const passed = this.compareSnapshots(normalized, expected)

    if (!passed) {
      const diffString = diff(expected, normalized, {
        aAnnotation: 'Expected',
        bAnnotation: 'Received',
        expand: false,
      })

      return {
        passed: false,
        message: 'Snapshot mismatch',
        diff: diffString || undefined,
        actual: normalized,
        expected,
      }
    }

    return { passed: true }
  }

  /**
   * Test multiple GraphQL operations in sequence
   */
  async testSequence(
    operations: Array<{
      name: string
      response: GraphQLResponse
      normalizers?: Array<(data: any) => any>
    }>,
    baseOptions: Omit<SnapshotOptions, 'name'>,
  ): Promise<Map<string, SnapshotResult>> {
    const results = new Map<string, SnapshotResult>()

    for (const operation of operations) {
      const result = await this.testSnapshot(operation.response, {
        ...baseOptions,
        name: operation.name,
        normalizers: operation.normalizers || baseOptions.normalizers,
      })
      results.set(operation.name, result)
    }

    return results
  }

  /**
   * Normalize GraphQL response for consistent snapshots
   */
  private normalizeResponse(response: GraphQLResponse, options: SnapshotOptions): any {
    let normalized = JSON.parse(JSON.stringify(response))

    // Apply default normalizers
    normalized = this.applyDefaultNormalizers(normalized)

    // Redact sensitive fields
    if (options.redactFields) {
      normalized = this.redactFields(normalized, options.redactFields)
    }

    // Apply custom normalizers
    if (options.normalizers) {
      for (const normalizer of options.normalizers) {
        normalized = normalizer(normalized)
      }
    }

    return normalized
  }

  /**
   * Apply default normalizers
   */
  private applyDefaultNormalizers(data: any): any {
    const normalized = JSON.parse(JSON.stringify(data))

    // Sort arrays for consistent ordering
    const sortArrays = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(sortArrays).sort((a, b) => {
          const aStr = JSON.stringify(a)
          const bStr = JSON.stringify(b)
          return aStr.localeCompare(bStr)
        })
      }
      if (obj && typeof obj === 'object') {
        const sorted: any = {}
        Object.keys(obj)
          .sort()
          .forEach(key => {
            sorted[key] = sortArrays(obj[key])
          })
        return sorted
      }
      return obj
    }

    return sortArrays(normalized)
  }

  /**
   * Redact sensitive fields
   */
  private redactFields(data: any, fields: string[]): any {
    const redact = (obj: any, path: string = ''): any => {
      if (Array.isArray(obj)) {
        return obj.map((item, index) => redact(item, `${path}[${index}]`))
      }
      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key
          if (fields.some(field => currentPath.endsWith(field))) {
            result[key] = '[REDACTED]'
          } else {
            result[key] = redact(value, currentPath)
          }
        }
        return result
      }
      return obj
    }

    return redact(data)
  }

  /**
   * Get snapshot file path
   */
  private getSnapshotPath(options: SnapshotOptions): string {
    const dir = options.directory
      ? join(this.snapshotDir, options.directory)
      : this.snapshotDir

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    return join(dir, `${options.name}.snapshot.json`)
  }

  /**
   * Write snapshot to file
   */
  private writeSnapshot(path: string, data: any): void {
    writeFileSync(path, JSON.stringify(data, null, 2))
  }

  /**
   * Read snapshot from file
   */
  private readSnapshot(path: string): any {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content)
  }

  /**
   * Compare two snapshots
   */
  private compareSnapshots(actual: any, expected: any): boolean {
    return JSON.stringify(actual) === JSON.stringify(expected)
  }
}

/**
 * Common normalizers for GraphQL responses
 */
export const commonNormalizers = {
  /**
   * Replace timestamps with placeholders
   */
  timestamps: (data: any): any => {
    const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/g
    const jsonStr = JSON.stringify(data)
    const normalized = jsonStr.replace(timestampRegex, '[TIMESTAMP]')
    return JSON.parse(normalized)
  },

  /**
   * Replace IDs with placeholders
   */
  ids: (data: any): any => {
    const replaceIds = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(replaceIds)
      }
      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'id' || key.endsWith('Id')) {
            result[key] = `[${key.toUpperCase()}]`
          } else {
            result[key] = replaceIds(value)
          }
        }
        return result
      }
      return obj
    }
    return replaceIds(data)
  },

  /**
   * Replace JWT tokens with placeholders
   */
  tokens: (data: any): any => {
    const tokenRegex = /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*/g
    const jsonStr = JSON.stringify(data)
    const normalized = jsonStr.replace(tokenRegex, '[JWT_TOKEN]')
    return JSON.parse(normalized)
  },

  /**
   * Replace cursors with placeholders
   */
  cursors: (data: any): any => {
    const replaceCursors = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(replaceCursors)
      }
      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'cursor' || key === 'endCursor' || key === 'startCursor') {
            result[key] = '[CURSOR]'
          } else {
            result[key] = replaceCursors(value)
          }
        }
        return result
      }
      return obj
    }
    return replaceCursors(data)
  },

  /**
   * Sort edges by a field
   */
  sortEdges: (field: string) => (data: any): any => {
    const sortByField = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(sortByField)
      }
      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'edges' && Array.isArray(value)) {
            result[key] = value.sort((a, b) => {
              const aVal = a.node?.[field]
              const bVal = b.node?.[field]
              if (aVal === undefined || bVal === undefined) return 0
              return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
            })
          } else {
            result[key] = sortByField(value)
          }
        }
        return result
      }
      return obj
    }
    return sortByField(data)
  },
}

/**
 * Create a hash of GraphQL response for change detection
 */
export function hashResponse(response: GraphQLResponse): string {
  const normalized = JSON.stringify(response, Object.keys(response).sort())
  return createHash('sha256').update(normalized).digest('hex')
}

/**
 * Assert snapshot matches
 */
export function assertSnapshot(
  actual: GraphQLResponse,
  expected: GraphQLResponse,
  options?: { message?: string },
): void {
  const actualNormalized = JSON.stringify(actual, null, 2)
  const expectedNormalized = JSON.stringify(expected, null, 2)

  if (actualNormalized !== expectedNormalized) {
    const diffString = diff(expectedNormalized, actualNormalized, {
      aAnnotation: 'Expected',
      bAnnotation: 'Received',
      expand: false,
    })

    throw new Error(
      `${options?.message || 'Snapshot mismatch'}\n\n${diffString}`,
    )
  }
}