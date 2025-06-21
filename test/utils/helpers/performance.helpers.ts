/**
 * Performance testing utilities for measuring GraphQL operation performance
 */

import type { ApolloServer, GraphQLResponse } from '@apollo/server'
import type { Context } from '../../../src/graphql/context/context.types'
import { executeOperation } from '../core/graphql'

export interface PerformanceMetrics {
  operationName: string
  executionTime: number
  memoryUsed: number
  timestamp: number
  variables?: Record<string, unknown>
}

export interface PerformanceReport {
  totalOperations: number
  averageTime: number
  minTime: number
  maxTime: number
  p50Time: number
  p95Time: number
  p99Time: number
  memoryStats: {
    average: number
    peak: number
  }
  operations: PerformanceMetrics[]
}

/**
 * Measure the performance of a GraphQL operation
 */
export async function measureOperation<T = unknown>(
  server: ApolloServer<Context>,
  operation: string,
  variables: Record<string, unknown>,
  context: Context,
): Promise<{ result: GraphQLResponse<T>; metrics: PerformanceMetrics }> {
  const startMemory = process.memoryUsage().heapUsed
  const startTime = performance.now()

  const result = await executeOperation<T>(
    server,
    operation,
    variables,
    context,
  )

  const endTime = performance.now()
  const endMemory = process.memoryUsage().heapUsed

  const metrics: PerformanceMetrics = {
    operationName: extractOperationName(operation),
    executionTime: endTime - startTime,
    memoryUsed: endMemory - startMemory,
    timestamp: Date.now(),
    variables,
  }

  return { result, metrics }
}

/**
 * Run a performance benchmark for an operation
 */
export async function benchmark(
  server: ApolloServer<Context>,
  operation: string,
  variables: Record<string, unknown>,
  context: Context,
  options: {
    iterations?: number
    warmup?: number
  } = {},
): Promise<PerformanceReport> {
  const iterations = options.iterations ?? 100
  const warmup = options.warmup ?? 10

  // Warmup runs
  for (let i = 0; i < warmup; i++) {
    await executeOperation(server, operation, variables, context)
  }

  // Actual benchmark runs
  const metrics: PerformanceMetrics[] = []

  for (let i = 0; i < iterations; i++) {
    const { metrics: metric } = await measureOperation(
      server,
      operation,
      variables,
      context,
    )
    metrics.push(metric)
  }

  return generateReport(metrics)
}

/**
 * Benchmark multiple operations concurrently
 */
export async function benchmarkConcurrent(
  server: ApolloServer<Context>,
  operations: Array<{
    operation: string
    variables: Record<string, unknown>
    context: Context
  }>,
  options: {
    concurrency?: number
    iterations?: number
  } = {},
): Promise<Map<string, PerformanceReport>> {
  const concurrency = options.concurrency ?? 10
  const iterations = options.iterations ?? 100

  const results = new Map<string, PerformanceMetrics[]>()

  // Initialize result maps
  for (const op of operations) {
    const name = extractOperationName(op.operation)
    results.set(name, [])
  }

  // Run concurrent batches
  for (let i = 0; i < iterations; i += concurrency) {
    const batch: Promise<void>[] = []

    for (let j = 0; j < concurrency && i + j < iterations; j++) {
      const op = operations[(i + j) % operations.length]
      if (op) {
        batch.push(
          measureOperation(server, op.operation, op.variables, op.context).then(
            ({ metrics }) => {
              const name = extractOperationName(op.operation)
              results.get(name)?.push(metrics)
            },
          ),
        )
      }
    }

    await Promise.all(batch)
  }

  // Generate reports
  const reports = new Map<string, PerformanceReport>()
  for (const [name, metrics] of results) {
    reports.set(name, generateReport(metrics))
  }

  return reports
}

/**
 * Load test with gradually increasing concurrency
 */
export async function loadTest(
  server: ApolloServer<Context>,
  operation: string,
  variables: Record<string, unknown>,
  context: Context,
  options: {
    maxConcurrency?: number
    step?: number
    duration?: number // milliseconds per step
  } = {},
): Promise<Array<{ concurrency: number; report: PerformanceReport }>> {
  const maxConcurrency = options.maxConcurrency ?? 50
  const step = options.step ?? 5
  const duration = options.duration ?? 5000

  const results: Array<{ concurrency: number; report: PerformanceReport }> = []

  for (
    let concurrency = step;
    concurrency <= maxConcurrency;
    concurrency += step
  ) {
    const metrics: PerformanceMetrics[] = []
    const endTime = Date.now() + duration

    // Run operations for the specified duration
    while (Date.now() < endTime) {
      const batch: Promise<void>[] = []

      for (let i = 0; i < concurrency; i++) {
        batch.push(
          measureOperation(server, operation, variables, context).then(
            ({ metrics: metric }) => {
              metrics.push(metric)
            },
          ),
        )
      }

      await Promise.all(batch)
    }

    results.push({
      concurrency,
      report: generateReport(metrics),
    })
  }

  return results
}

/**
 * Extract operation name from GraphQL document
 */
function extractOperationName(operation: string): string {
  const match = operation.match(/(?:query|mutation|subscription)\s+(\w+)/)
  return match?.[1] || 'Anonymous'
}

/**
 * Generate performance report from metrics
 */
function generateReport(metrics: PerformanceMetrics[]): PerformanceReport {
  if (metrics.length === 0) {
    throw new Error('No metrics to generate report from')
  }

  const times = metrics.map((m) => m.executionTime).sort((a, b) => a - b)
  const memories = metrics.map((m) => m.memoryUsed)

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
  const avg = (arr: number[]) => sum(arr) / arr.length
  const percentile = (arr: number[], p: number) => {
    const index = Math.ceil((p / 100) * arr.length) - 1
    return arr[index]
  }

  return {
    totalOperations: metrics.length,
    averageTime: avg(times),
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
    p50Time: percentile(times, 50) ?? 0,
    p95Time: percentile(times, 95) ?? 0,
    p99Time: percentile(times, 99) ?? 0,
    memoryStats: {
      average: avg(memories),
      peak: Math.max(...memories),
    },
    operations: metrics,
  }
}

/**
 * Assert performance requirements
 */
export function assertPerformance(
  report: PerformanceReport,
  requirements: {
    maxAverageTime?: number
    maxP95Time?: number
    maxP99Time?: number
    maxMemory?: number
  },
): void {
  if (
    requirements.maxAverageTime &&
    report.averageTime > requirements.maxAverageTime
  ) {
    throw new Error(
      `Average execution time ${report.averageTime.toFixed(2)}ms exceeds maximum ${requirements.maxAverageTime}ms`,
    )
  }

  if (requirements.maxP95Time && report.p95Time > requirements.maxP95Time) {
    throw new Error(
      `95th percentile execution time ${report.p95Time.toFixed(2)}ms exceeds maximum ${requirements.maxP95Time}ms`,
    )
  }

  if (requirements.maxP99Time && report.p99Time > requirements.maxP99Time) {
    throw new Error(
      `99th percentile execution time ${report.p99Time.toFixed(2)}ms exceeds maximum ${requirements.maxP99Time}ms`,
    )
  }

  if (
    requirements.maxMemory &&
    report.memoryStats.peak > requirements.maxMemory
  ) {
    throw new Error(
      `Peak memory usage ${(report.memoryStats.peak / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(requirements.maxMemory / 1024 / 1024).toFixed(2)}MB`,
    )
  }
}

/**
 * Format performance report for console output
 */
export function formatReport(report: PerformanceReport): string {
  return `
Performance Report
==================
Total Operations: ${report.totalOperations}
Average Time: ${report.averageTime.toFixed(2)}ms
Min Time: ${report.minTime.toFixed(2)}ms
Max Time: ${report.maxTime.toFixed(2)}ms
P50 Time: ${report.p50Time.toFixed(2)}ms
P95 Time: ${report.p95Time.toFixed(2)}ms
P99 Time: ${report.p99Time.toFixed(2)}ms
Average Memory: ${(report.memoryStats.average / 1024 / 1024).toFixed(2)}MB
Peak Memory: ${(report.memoryStats.peak / 1024 / 1024).toFixed(2)}MB
`
}
