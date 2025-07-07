#!/usr/bin/env tsx
/**
 * Module Boundary Analyzer
 *
 * Analyzes the codebase for module boundary violations and generates a detailed report.
 * This script identifies imports that violate the modular monolith principles.
 */

import * as fs from 'fs/promises'
import { glob } from 'glob'

// Types
interface Violation {
  file: string
  line: number
  import: string
  violationType: ViolationType
  message: string
  severity: 'error' | 'warning'
}

type ViolationType =
  | 'direct-service-import'
  | 'direct-repository-import'
  | 'direct-utils-import'
  | 'direct-types-import'
  | 'direct-database-import'
  | 'cross-module-internal'
  | 'missing-facade-import'

interface ModuleBoundaryReport {
  totalViolations: number
  violationsByType: Record<ViolationType, number>
  violationsByModule: Record<string, number>
  violations: Violation[]
  summary: {
    mostViolatedModule: string
    mostCommonViolationType: ViolationType
    criticalViolations: number
  }
}

// Configuration
const ALLOWED_PATTERNS = [
  // Module facades
  /^@\/modules\/[^/]+\/[^/]+\.module$/,
  // Client interfaces
  /^@\/modules\/[^/]+\/client\/[^/]+\.client\.interface$/,
  // Shared interfaces (infrastructure)
  /^@\/modules\/shared\/interfaces\/[^/]+\.interface$/,
  // Same module imports
  /^\.\/.*$/,
  // Relative imports within module
  /^\.\.\/.*$/,
]

const FORBIDDEN_PATTERNS = [
  // Direct service imports from other modules
  {
    pattern: /^@\/modules\/([^/]+)\/services\/.*$/,
    exclude: /^@\/modules\/shared\/services\/.*$/,
    type: 'direct-service-import' as ViolationType,
    message:
      'Direct service imports violate module boundaries. Use client interfaces.',
    severity: 'error' as const,
  },
  // Direct repository imports
  {
    pattern: /^@\/modules\/([^/]+)\/repositories\/.*$/,
    type: 'direct-repository-import' as ViolationType,
    message:
      'Direct repository imports violate module boundaries. Use client interfaces.',
    severity: 'error' as const,
  },
  // Direct utils imports from other modules
  {
    pattern: /^@\/modules\/([^/]+)\/utils\/.*$/,
    exclude: /^@\/modules\/shared\/utils\/.*$/,
    type: 'direct-utils-import' as ViolationType,
    message:
      'Direct utility imports violate module boundaries. Copy to your module or use client interface.',
    severity: 'warning' as const,
  },
  // Direct types imports
  {
    pattern: /^@\/modules\/([^/]+)\/types\/.*$/,
    type: 'direct-types-import' as ViolationType,
    message:
      'Direct type imports violate module boundaries. Use client interfaces.',
    severity: 'warning' as const,
  },
  // Direct database imports (except from shared module internally)
  {
    pattern: /^@\/modules\/shared\/database\/.*$/,
    exclude: /^@\/modules\/shared\/.*$/,
    type: 'direct-database-import' as ViolationType,
    message:
      'Direct database imports violate module boundaries. Use shared module facade.',
    severity: 'error' as const,
  },
]

class ModuleBoundaryAnalyzer {
  private violations: Violation[] = []

  async analyze(): Promise<ModuleBoundaryReport> {
    console.log('🔍 Analyzing module boundaries...')

    // Find all TypeScript files in modules
    const files = await glob('src/modules/**/*.ts', {
      ignore: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
    })

    console.log(`📁 Found ${files.length} files to analyze`)

    for (const file of files) {
      await this.analyzeFile(file)
    }

    return this.generateReport()
  }

  private async analyzeFile(filePath: string): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const lines = content.split('\n')

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]?.trim()
        const lineNumber = i + 1

        // Check for import statements
        const importMatch = line?.match(
          /^import\s+.*?\s+from\s+['"]([^'"]+)['"]/,
        )
        if (importMatch) {
          const importPath = importMatch[1]
          const violation = this.checkImportViolation(
            filePath,
            lineNumber,
            line || '',
            importPath || '',
          )
          if (violation) {
            this.violations.push(violation)
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error analyzing file ${filePath}:`, error)
    }
  }

  private checkImportViolation(
    filePath: string,
    lineNumber: number,
    line: string,
    importPath: string,
  ): Violation | null {
    // Skip non-module imports
    if (!importPath.startsWith('@/modules/')) {
      return null
    }

    // Check if import is allowed
    for (const allowedPattern of ALLOWED_PATTERNS) {
      if (allowedPattern.test(importPath)) {
        return null
      }
    }

    // Check for forbidden patterns
    for (const forbidden of FORBIDDEN_PATTERNS) {
      const match = forbidden.pattern.exec(importPath)
      if (match) {
        // Check exclude pattern if exists
        if (forbidden.exclude?.test(importPath)) {
          continue
        }

        // Check if this is a same-module import
        const currentModule = this.extractModuleName(filePath)
        const targetModule = match[1]

        if (currentModule === targetModule) {
          continue // Allow same-module imports
        }

        return {
          file: filePath,
          line: lineNumber,
          import: line,
          violationType: forbidden.type,
          message: forbidden.message,
          severity: forbidden.severity,
        }
      }
    }

    // Check for cross-module internal access
    const moduleMatch = importPath.match(/^@\/modules\/([^/]+)\/(.+)$/)
    if (moduleMatch) {
      const [, targetModule, internalPath] = moduleMatch
      const currentModule = this.extractModuleName(filePath)

      if (currentModule !== targetModule) {
        // This is cross-module access to internals
        if (
          !(
            internalPath?.endsWith('.module') ||
            internalPath?.includes('client.interface')
          )
        ) {
          return {
            file: filePath,
            line: lineNumber,
            import: line,
            violationType: 'cross-module-internal',
            message: `Cross-module internal access. Use module facade: '@/modules/${targetModule}/${targetModule}.module'`,
            severity: 'error',
          }
        }
      }
    }

    return null
  }

  private extractModuleName(filePath: string): string {
    const match = filePath.match(/src\/modules\/([^/]+)\//)
    return match ? match[1] || 'unknown' : 'unknown'
  }

  private generateReport(): ModuleBoundaryReport {
    const violationsByType: Record<ViolationType, number> = {
      'direct-service-import': 0,
      'direct-repository-import': 0,
      'direct-utils-import': 0,
      'direct-types-import': 0,
      'direct-database-import': 0,
      'cross-module-internal': 0,
      'missing-facade-import': 0,
    }

    const violationsByModule: Record<string, number> = {}
    let criticalViolations = 0

    for (const violation of this.violations) {
      violationsByType[violation.violationType]++

      const module = this.extractModuleName(violation.file)
      violationsByModule[module] = (violationsByModule[module] || 0) + 1

      if (violation.severity === 'error') {
        criticalViolations++
      }
    }

    const mostViolatedModule =
      Object.entries(violationsByModule).sort(
        ([, a], [, b]) => b - a,
      )[0]?.[0] || 'none'

    const mostCommonViolationType =
      (Object.entries(violationsByType).sort(
        ([, a], [, b]) => b - a,
      )[0]?.[0] as ViolationType) || 'direct-service-import'

    return {
      totalViolations: this.violations.length,
      violationsByType,
      violationsByModule,
      violations: this.violations,
      summary: {
        mostViolatedModule,
        mostCommonViolationType,
        criticalViolations,
      },
    }
  }
}

class ReportGenerator {
  static generateConsoleReport(report: ModuleBoundaryReport): void {
    console.log('\n📊 MODULE BOUNDARY ANALYSIS REPORT')
    console.log('═'.repeat(50))

    if (report.totalViolations === 0) {
      console.log('✅ No module boundary violations found!')
      return
    }

    // Summary
    console.log(`\n📈 SUMMARY`)
    console.log(`Total violations: ${report.totalViolations}`)
    console.log(`Critical violations: ${report.summary.criticalViolations}`)
    console.log(`Most violated module: ${report.summary.mostViolatedModule}`)
    console.log(
      `Most common violation: ${report.summary.mostCommonViolationType}`,
    )

    // Violations by type
    console.log(`\n🔍 VIOLATIONS BY TYPE`)
    for (const [type, count] of Object.entries(report.violationsByType)) {
      if (count > 0) {
        console.log(`  ${type}: ${count}`)
      }
    }

    // Violations by module
    console.log(`\n📁 VIOLATIONS BY MODULE`)
    for (const [module, count] of Object.entries(report.violationsByModule)) {
      console.log(`  ${module}: ${count}`)
    }

    // Detailed violations
    console.log(`\n🚨 DETAILED VIOLATIONS`)
    for (const violation of report.violations) {
      const icon = violation.severity === 'error' ? '❌' : '⚠️'
      console.log(`\n${icon} ${violation.violationType}`)
      console.log(`   File: ${violation.file}:${violation.line}`)
      console.log(`   Import: ${violation.import}`)
      console.log(`   Message: ${violation.message}`)
    }
  }

  static async generateMarkdownReport(
    report: ModuleBoundaryReport,
  ): Promise<void> {
    const content = `# Module Boundary Violations Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Violations**: ${report.totalViolations}
- **Critical Violations**: ${report.summary.criticalViolations}
- **Most Violated Module**: ${report.summary.mostViolatedModule}
- **Most Common Violation Type**: ${report.summary.mostCommonViolationType}

## Violations by Type

| Type | Count |
|------|-------|
${Object.entries(report.violationsByType)
  .filter(([, count]) => count > 0)
  .map(([type, count]) => `| ${type} | ${count} |`)
  .join('\n')}

## Violations by Module

| Module | Count |
|--------|-------|
${Object.entries(report.violationsByModule)
  .map(([module, count]) => `| ${module} | ${count} |`)
  .join('\n')}

## Detailed Violations

${report.violations
  .map(
    (violation) => `
### ${violation.violationType} ${violation.severity === 'error' ? '❌' : '⚠️'}

- **File**: \`${violation.file}:${violation.line}\`
- **Import**: \`${violation.import}\`
- **Message**: ${violation.message}
`,
  )
  .join('\n')}

## Recommended Actions

1. **Phase 1**: Fix critical violations (❌ errors)
2. **Phase 2**: Address warnings (⚠️ warnings)
3. **Phase 3**: Implement automated boundary checking

### Quick Fixes

\`\`\`bash
# Run automated boundary fixer
npm run fix:boundaries

# Validate boundaries after fixes
npm run validate:boundaries
\`\`\`
`

    await fs.writeFile(
      'docs/architecture/boundary-violations-report.md',
      content,
    )
    console.log(
      '\n📄 Detailed report saved to: docs/architecture/boundary-violations-report.md',
    )
  }
}

// Main execution
async function main() {
  try {
    const analyzer = new ModuleBoundaryAnalyzer()
    const report = await analyzer.analyze()

    ReportGenerator.generateConsoleReport(report)
    await ReportGenerator.generateMarkdownReport(report)

    // Exit with error code if critical violations found
    if (report.summary.criticalViolations > 0) {
      console.log(
        `\n💥 Found ${report.summary.criticalViolations} critical violations`,
      )
      console.log(
        '🔧 Run: npm run fix:boundaries to automatically fix some violations',
      )
      process.exit(1)
    } else if (report.totalViolations > 0) {
      console.log(`\n⚠️  Found ${report.totalViolations} warnings`)
      console.log(
        '📚 See: docs/architecture/module-interface-boundaries.md for guidance',
      )
    } else {
      console.log('\n🎉 All module boundaries are properly enforced!')
    }
  } catch (error) {
    console.error('❌ Error during analysis:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { ModuleBoundaryAnalyzer, type ModuleBoundaryReport, type Violation }
