/**
 * GraphQL snapshot testing utilities
 */

import { createHash } from 'crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { GraphQLResponse } from '@apollo/server'
import { diff } from 'jest-diff'

export interface SnapshotOptions {
  name: string
  directory?: string
  update?: boolean
  normalizers?: Array<(data: unknown) => unknown>
  redactFields?: string[]
}

export interface SnapshotResult {
  passed: boolean
  message?: string
  diff?: string
  actual?: unknown
  expected?: unknown
}

/**
 * Create a snapshot tester for GraphQL responses
 */
export class GraphQLSnapshotTester {
  private snapshotDir: string
  private updateSnapshots: boolean

  constructor(options: { baseDir?: string; update?: boolean } = {}) {
    this.snapshotDir = options.baseDir || join(process.cwd(), '__snapshots__')
    this.updateSnapshots =
      options.update || process.env.UPDATE_SNAPSHOTS === 'true'

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
    // Generate snapshot path
    const snapshotPath = this.getSnapshotPath(options)

    // Normalize response
    const normalized = this.normalizeResponse(response, options)

    // Check if snapshot exists
    if (!existsSync(snapshotPath) || this.updateSnapshots) {
      // Create or update snapshot
      this.writeSnapshot(snapshotPath, normalized)
      return {
        passed: true,
        message: this.updateSnapshots
          ? `Snapshot updated: ${options.name}`
          : `Snapshot created: ${options.name}`,
      }
    }

    // Compare with existing snapshot
    const expected = this.readSnapshot(snapshotPath)
    const passed = this.compareSnapshots(normalized, expected)

    if (!passed) {
      return {
        passed: false,
        message: `Snapshot mismatch: ${options.name}`,
        diff:
          diff(expected, normalized, {
            aAnnotation: 'Expected',
            bAnnotation: 'Received',
            expand: false,
          }) || undefined,
        actual: normalized,
        expected,
      }
    }

    return { passed: true }
  }

  /**
   * Test multiple GraphQL responses
   */
  async testSnapshots(
    snapshots: Array<{
      name: string
      response: GraphQLResponse
      normalizers?: Array<(data: unknown) => unknown>
    }>,
    baseOptions: Omit<SnapshotOptions, 'name'>,
  ): Promise<SnapshotResult[]> {
    const results: SnapshotResult[] = []

    for (const snapshot of snapshots) {
      const result = await this.testSnapshot(snapshot.response, {
        ...baseOptions,
        ...snapshot,
      })
      results.push(result)
    }

    return results
  }

  /**
   * Normalize GraphQL response for snapshot comparison
   */
  private normalizeResponse(
    response: GraphQLResponse,
    options: SnapshotOptions,
  ): unknown {
    let normalized = JSON.parse(JSON.stringify(response))

    // Apply default normalizers
    normalized = this.applyDefaultNormalizers(normalized)

    // Apply custom normalizers
    if (options.normalizers) {
      for (const normalizer of options.normalizers) {
        normalized = normalizer(normalized)
      }
    }

    // Redact sensitive fields
    if (options.redactFields) {
      normalized = this.redactFields(normalized, options.redactFields)
    }

    return normalized
  }

  /**
   * Apply default normalizers
   */
  private applyDefaultNormalizers(data: unknown): unknown {
    const normalized = JSON.parse(JSON.stringify(data))

    // Sort arrays for consistent ordering
    const sortArrays = (obj: unknown): unknown => {
      if (Array.isArray(obj)) {
        return obj.map(sortArrays).sort((a, b) => {
          const aStr = JSON.stringify(a)
          const bStr = JSON.stringify(b)
          return aStr.localeCompare(bStr)
        })
      }
      if (obj && typeof obj === 'object') {
        const sorted: Record<string, unknown> = {}
        const keys = Object.keys(obj as Record<string, unknown>).sort()
        for (const key of keys) {
          sorted[key] = sortArrays((obj as Record<string, unknown>)[key])
        }
        return sorted
      }
      return obj
    }

    return sortArrays(normalized)
  }

  /**
   * Redact sensitive fields
   */
  private redactFields(data: unknown, fields: string[]): unknown {
    const redact = (obj: unknown, path = ''): unknown => {
      if (Array.isArray(obj)) {
        return obj.map((item, index) => redact(item, `${path}[${index}]`))
      }
      if (obj && typeof obj === 'object') {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(
          obj as Record<string, unknown>,
        )) {
          const currentPath = path ? `${path}.${key}` : key
          if (fields.includes(currentPath)) {
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
    const directory = options.directory
      ? join(this.snapshotDir, options.directory)
      : this.snapshotDir

    // Ensure directory exists
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true })
    }

    // Generate filename from name
    const filename = `${options.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.snap.json`
    return join(directory, filename)
  }

  /**
   * Write snapshot to file
   */
  private writeSnapshot(path: string, data: unknown): void {
    writeFileSync(path, JSON.stringify(data, null, 2))
  }

  /**
   * Read snapshot from file
   */
  private readSnapshot(path: string): unknown {
    const content = readFileSync(path, 'utf-8')
    return JSON.parse(content)
  }

  /**
   * Compare two snapshots
   */
  private compareSnapshots(actual: unknown, expected: unknown): boolean {
    return JSON.stringify(actual) === JSON.stringify(expected)
  }

  /**
   * Generate a stable hash for snapshot naming
   */
  static generateSnapshotName(input: string | object): string {
    const content = typeof input === 'string' ? input : JSON.stringify(input)
    return createHash('sha256').update(content).digest('hex').slice(0, 8)
  }
}

/**
 * Default snapshot normalizers
 */
export const defaultNormalizers = {
  /**
   * Remove timestamps
   */
  removeTimestamps: (data: unknown): unknown => {
    const remove = (obj: unknown): unknown => {
      if (Array.isArray(obj)) {
        return obj.map(remove)
      }
      if (obj && typeof obj === 'object') {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(
          obj as Record<string, unknown>,
        )) {
          if (
            !(
              key.toLowerCase().includes('timestamp') ||
              key.toLowerCase().includes('createdat') ||
              key.toLowerCase().includes('updatedat') ||
              key.toLowerCase().includes('date')
            )
          ) {
            result[key] = remove(value)
          }
        }
        return result
      }
      return obj
    }
    return remove(data)
  },

  /**
   * Remove IDs
   */
  removeIds: (data: unknown): unknown => {
    const remove = (obj: unknown): unknown => {
      if (Array.isArray(obj)) {
        return obj.map(remove)
      }
      if (obj && typeof obj === 'object') {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(
          obj as Record<string, unknown>,
        )) {
          if (key !== 'id' && !key.endsWith('Id')) {
            result[key] = remove(value)
          }
        }
        return result
      }
      return obj
    }
    return remove(data)
  },

  /**
   * Replace dynamic values with placeholders
   */
  replaceDynamicValues: (
    patterns: Array<{ pattern: RegExp; replacement: string }>,
  ) => {
    return (data: unknown): unknown => {
      const replace = (obj: unknown): unknown => {
        if (typeof obj === 'string') {
          let result = obj
          for (const { pattern, replacement } of patterns) {
            result = result.replace(pattern, replacement)
          }
          return result
        }
        if (Array.isArray(obj)) {
          return obj.map(replace)
        }
        if (obj && typeof obj === 'object') {
          const result: Record<string, unknown> = {}
          for (const [key, value] of Object.entries(
            obj as Record<string, unknown>,
          )) {
            result[key] = replace(value)
          }
          return result
        }
        return obj
      }
      return replace(data)
    }
  },
}

/**
 * Create a snapshot tester instance
 */
export function createSnapshotTester(
  options: { baseDir?: string; update?: boolean } = {},
): GraphQLSnapshotTester {
  return new GraphQLSnapshotTester(options)
}
