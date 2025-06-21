/**
 * Performance Monitoring Integration Example
 *
 * Demonstrates how to integrate performance monitoring into the GraphQL application.
 */

import 'reflect-metadata'
import { PerformanceCollector } from '../shared/infrastructure/monitoring/performance.collector'
import {
  withCacheMetrics,
  withDatabaseMetrics,
} from '../shared/infrastructure/monitoring/performance.middleware'
import { PerformanceMonitor } from '../shared/infrastructure/monitoring/performance.monitor'
import { PerformanceReporter } from '../shared/infrastructure/monitoring/performance.reporter'

/**
 * Setup Performance Monitoring System
 */
export function setupPerformanceMonitoring() {
  console.log('🚀 Setting up performance monitoring system...')

  // Create core components
  const collector = new PerformanceCollector()
  const monitor = new PerformanceMonitor(collector)
  const reporter = new PerformanceReporter(collector, monitor)

  // Configure alerts
  monitor.addAlert({
    id: 'high_response_time',
    name: 'High Response Time',
    condition: {
      metric: 'avg_response_time',
      operator: '>',
      threshold: 500, // 500ms
      duration: 60000, // 1 minute
    },
    actions: [
      { type: 'log', config: { level: 'warn' } },
      { type: 'email', config: { to: 'ops@company.com' } },
    ],
    enabled: true,
  })

  monitor.addAlert({
    id: 'high_error_rate',
    name: 'High Error Rate',
    condition: {
      metric: 'error_rate',
      operator: '>',
      threshold: 5, // 5%
    },
    actions: [
      { type: 'log', config: { level: 'error' } },
      { type: 'webhook', config: { url: 'https://hooks.slack.com/...' } },
    ],
    enabled: true,
  })

  // Start monitoring
  monitor.start()

  console.log('✅ Performance monitoring system initialized')

  return { collector, monitor, reporter }
}

/**
 * Example: Database method with performance monitoring
 */
export const getUserById = withDatabaseMetrics(
  'getUserById',
  async (id: string) => {
    // Simulate database query
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 100 + 50),
    )

    if (Math.random() < 0.1) {
      // 10% error rate
      throw new Error('Database connection failed')
    }

    return {
      id,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    }
  },
)

/**
 * Example: Cache method with performance monitoring
 */
export const getCachedUser = withCacheMetrics('get', async (key: string) => {
  // Simulate cache lookup
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 10 + 5))

  // 70% cache hit rate
  if (Math.random() < 0.7) {
    return {
      id: key,
      name: 'Cached User',
      email: 'cached@example.com',
    }
  }

  return null // Cache miss
})

/**
 * Simulate Application Load
 */
export async function simulateApplicationLoad(collector: PerformanceCollector) {
  console.log('📊 Simulating application load...')

  const operations = [
    { name: 'user_login', weight: 30 },
    { name: 'user_profile', weight: 25 },
    { name: 'create_post', weight: 15 },
    { name: 'get_feed', weight: 20 },
    { name: 'search_users', weight: 10 },
  ]

  // Simulate 100 requests
  for (let i = 0; i < 100; i++) {
    const operation = selectWeightedOperation(operations)
    const timer = collector.startTimer('graphql_operation', {
      operation: operation.name,
      type: 'query',
    })

    try {
      // Simulate operation duration (50-300ms)
      const duration = Math.random() * 250 + 50
      await new Promise((resolve) => setTimeout(resolve, duration))

      // 95% success rate
      if (Math.random() < 0.05) {
        throw new Error('Operation failed')
      }

      // Count successful operation
      collector.incrementCounter('operations_success', 1, {
        operation: operation.name,
      })

      // Record request size
      collector.recordHistogram(
        'request_size_bytes',
        Math.random() * 5000 + 1000,
        {
          operation: operation.name,
        },
      )
    } catch (error) {
      // Count error
      collector.incrementCounter('operations_error', 1, {
        operation: operation.name,
        errorType: 'OperationError',
      })
    } finally {
      timer.stop()
    }

    // Random delay between requests (0-100ms)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100))
  }

  // Update resource metrics
  collector.setGauge('active_connections', Math.floor(Math.random() * 50) + 10)
  collector.setGauge('memory_usage_mb', Math.floor(Math.random() * 200) + 100)
  collector.setGauge('cpu_usage_percent', Math.floor(Math.random() * 50) + 20)

  console.log('✅ Application load simulation completed')
}

/**
 * Generate Performance Report
 */
export async function generatePerformanceReport(reporter: PerformanceReporter) {
  console.log('📈 Generating performance report...')

  const endTime = new Date()
  const startTime = new Date(endTime.getTime() - 5 * 60 * 1000) // Last 5 minutes

  const report = reporter.generateReport({
    start: startTime,
    end: endTime,
  })

  console.log('\n📊 Performance Report Summary:')
  console.log('=================================')
  console.log(`Period: ${startTime.toISOString()} to ${endTime.toISOString()}`)
  console.log(`Total Requests: ${report.overview.totalRequests}`)
  console.log(`Success Rate: ${report.overview.successRate.toFixed(1)}%`)
  console.log(
    `Average Response Time: ${report.overview.averageResponseTime.toFixed(2)}ms`,
  )
  console.log(`Peak Throughput: ${report.overview.peakThroughput} req/hour`)
  console.log(`Error Count: ${report.overview.errorCount}`)

  console.log('\n📈 Performance Trends:')
  Object.entries(report.trends.responseTimePercentiles).forEach(
    ([percentile, value]) => {
      console.log(`  ${percentile}: ${value.toFixed(2)}ms`)
    },
  )

  console.log('\n💾 Resource Usage:')
  console.log(
    `  Average Memory: ${(report.resources.averageMemoryUsage / 1024 / 1024).toFixed(1)}MB`,
  )
  console.log(
    `  Peak Memory: ${(report.resources.peakMemoryUsage / 1024 / 1024).toFixed(1)}MB`,
  )
  console.log(
    `  Cache Efficiency: ${(report.resources.cacheEfficiency * 100).toFixed(1)}%`,
  )
  console.log(
    `  Average Query Time: ${report.resources.databasePerformance.averageQueryTime.toFixed(2)}ms`,
  )

  console.log('\n💡 Recommendations:')
  report.recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec}`)
  })

  // Get health status
  const health = reporter.getHealthStatus()
  console.log(
    `\n🏥 System Health: ${health.status.toUpperCase()} (Score: ${health.score}/100)`,
  )

  health.checks.forEach((check) => {
    const icon =
      check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌'
    console.log(
      `  ${icon} ${check.name}: ${check.message} (${check.duration.toFixed(2)}ms)`,
    )
  })

  return report
}

/**
 * Export Metrics in Different Formats
 */
export function demonstrateMetricExports(reporter: PerformanceReporter) {
  console.log('\n📤 Demonstrating metric exports...')

  // JSON Export
  const jsonMetrics = reporter.exportMetrics('json')
  console.log(`📄 JSON Export: ${jsonMetrics.split('\n').length} lines`)

  // CSV Export
  const csvMetrics = reporter.exportMetrics('csv')
  console.log(`📊 CSV Export: ${csvMetrics.split('\n').length} rows`)

  // Prometheus Export
  const prometheusMetrics = reporter.exportMetrics('prometheus')
  console.log(
    `📈 Prometheus Export: ${prometheusMetrics.split('\n').length} metrics`,
  )

  console.log('✅ All export formats generated successfully')
}

/**
 * Full Performance Monitoring Demo
 */
export async function runPerformanceMonitoringDemo() {
  console.log('🌟 Performance Monitoring System Demo\n')

  try {
    // Setup
    const { collector, monitor, reporter } = setupPerformanceMonitoring()

    // Simulate load
    await simulateApplicationLoad(collector)

    // Test database operations
    console.log('\n🗄️ Testing database operations...')
    for (let i = 0; i < 10; i++) {
      try {
        await getUserById(`user-${i}`)
      } catch (error) {
        // Errors are tracked by the monitoring wrapper
      }
    }

    // Test cache operations
    console.log('💾 Testing cache operations...')
    for (let i = 0; i < 20; i++) {
      await getCachedUser(`cache-key-${i}`)
    }

    // Wait a moment for metrics to settle
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate report
    const report = await generatePerformanceReport(reporter)

    // Demonstrate exports
    demonstrateMetricExports(reporter)

    // Show monitoring status
    const status = monitor.getStatus()
    console.log('\n📊 Monitoring Status:')
    console.log(`  Running: ${status.isRunning}`)
    console.log(`  Snapshots: ${status.snapshotCount}`)
    console.log(`  Alerts: ${status.alertCount}`)
    console.log(`  Active Alerts: ${status.activeAlerts}`)

    // Check for triggered alerts
    const triggeredAlerts = monitor.checkAlerts()
    if (triggeredAlerts.length > 0) {
      console.log('\n🚨 Triggered Alerts:')
      triggeredAlerts.forEach((alert) => {
        console.log(`  - ${alert.alert.name}: ${alert.message}`)
      })
    }

    // Stop monitoring
    monitor.stop()

    console.log('\n✅ Performance monitoring demo completed successfully!')
    console.log(
      `📊 Final metrics collected: ${collector.getSummary().totalMetrics}`,
    )

    return report
  } catch (error) {
    console.error('❌ Performance monitoring demo failed:', error)
    throw error
  }
}

// Helper functions

function selectWeightedOperation(
  operations: Array<{ name: string; weight: number }>,
) {
  const totalWeight = operations.reduce((sum, op) => sum + op.weight, 0)
  let random = Math.random() * totalWeight

  for (const operation of operations) {
    random -= operation.weight
    if (random <= 0) {
      return operation
    }
  }

  return operations[0] // Fallback
}

// Export for potential scripting
if (require.main === module) {
  runPerformanceMonitoringDemo().catch(console.error)
}

export default runPerformanceMonitoringDemo
