#!/usr/bin/env tsx
/**
 * Module Boundary Fixer
 *
 * Automatically fixes common module boundary violations where possible.
 * Some violations require manual intervention, but this script handles the obvious cases.
 */

import * as fs from 'fs/promises'
import {
  ModuleBoundaryAnalyzer,
  type Violation,
} from './analyze-module-boundaries'

interface FixResult {
  violation: Violation
  fixed: boolean
  action: string
  newImport?: string
}

interface FixReport {
  totalViolations: number
  fixedCount: number
  manualFixRequired: number
  results: FixResult[]
}

class ModuleBoundaryFixer {
  private fixResults: FixResult[] = []

  async fix(): Promise<FixReport> {
    console.log('🔧 Starting automated module boundary fixes...')

    // First, analyze current violations
    const analyzer = new ModuleBoundaryAnalyzer()
    const report = await analyzer.analyze()

    if (report.totalViolations === 0) {
      console.log('✅ No violations to fix!')
      return {
        totalViolations: 0,
        fixedCount: 0,
        manualFixRequired: 0,
        results: [],
      }
    }

    console.log(`🎯 Found ${report.totalViolations} violations to process`)

    // Group violations by file for efficient processing
    const violationsByFile = this.groupViolationsByFile(report.violations)

    for (const [filePath, violations] of violationsByFile) {
      await this.fixFileViolations(filePath, violations)
    }

    return this.generateFixReport(report.totalViolations)
  }

  private groupViolationsByFile(
    violations: Violation[],
  ): Map<string, Violation[]> {
    const map = new Map<string, Violation[]>()

    for (const violation of violations) {
      const existing = map.get(violation.file) || []
      existing.push(violation)
      map.set(violation.file, existing)
    }

    return map
  }

  private async fixFileViolations(
    filePath: string,
    violations: Violation[],
  ): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const lines = content.split('\n')

      // Process violations in reverse order to maintain line numbers
      const sortedViolations = violations.sort((a, b) => b.line - a.line)

      for (const violation of sortedViolations) {
        const result = await this.fixViolation(lines, violation)
        this.fixResults.push(result)

        if (result.fixed && result.newImport) {
          // Update the line with the fixed import
          lines[violation.line - 1] = result.newImport
        }
      }

      // Write the file back if any fixes were made
      const hasFixedViolations = sortedViolations.some(
        (v) => this.fixResults.find((r) => r.violation === v)?.fixed,
      )

      if (hasFixedViolations) {
        await fs.writeFile(filePath, lines.join('\n'))
        console.log(`📝 Updated ${filePath}`)
      }
    } catch (error) {
      console.error(`❌ Error fixing file ${filePath}:`, error)
    }
  }

  private async fixViolation(
    lines: string[],
    violation: Violation,
  ): Promise<FixResult> {
    const line = lines[violation.line - 1]

    switch (violation.violationType) {
      case 'direct-database-import':
        return this.fixDatabaseImport(violation, line)

      case 'direct-service-import':
        return this.fixServiceImport(violation, line)

      case 'cross-module-internal':
        return this.fixCrossModuleInternal(violation, line)

      case 'direct-utils-import':
        return this.fixUtilsImport(violation, line)

      case 'direct-types-import':
        return this.fixTypesImport(violation, line)

      default:
        return {
          violation,
          fixed: false,
          action: 'Manual fix required - complex violation type',
        }
    }
  }

  private fixDatabaseImport(violation: Violation, line: string): FixResult {
    // Transform: import { prisma } from '@/modules/shared/database/prisma'
    // To: Use through shared module facade instead

    if (line.includes('prisma')) {
      return {
        violation,
        fixed: false,
        action:
          'Manual fix required - Use shared module facade and inject prisma through client interface',
      }
    }

    return {
      violation,
      fixed: false,
      action: 'Manual fix required - Replace with shared module facade',
    }
  }

  private fixServiceImport(violation: Violation, line: string): FixResult {
    // Extract the service being imported
    const importMatch = line.match(
      /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/,
    )
    if (!importMatch) {
      return {
        violation,
        fixed: false,
        action: 'Manual fix required - Complex import pattern',
      }
    }

    const [, imports, importPath] = importMatch
    const moduleMatch = importPath.match(/^@\/modules\/([^/]+)\//)

    if (!moduleMatch) {
      return {
        violation,
        fixed: false,
        action: 'Manual fix required - Cannot determine target module',
      }
    }

    const targetModule = moduleMatch[1]

    // Suggest using client interface instead
    const newImport = `// TODO: Replace with client interface injection\n// import type { I${targetModule.charAt(0).toUpperCase() + targetModule.slice(1)}Client } from '@/modules/${targetModule}/${targetModule}.module'`

    return {
      violation,
      fixed: false,
      action: `Manual fix required - Use I${targetModule.charAt(0).toUpperCase() + targetModule.slice(1)}Client interface instead`,
      newImport,
    }
  }

  private fixCrossModuleInternal(
    violation: Violation,
    line: string,
  ): FixResult {
    const importMatch = line.match(
      /from\s+['"]@\/modules\/([^/]+)\/([^'"]+)['"]/,
    )
    if (!importMatch) {
      return {
        violation,
        fixed: false,
        action: 'Manual fix required - Cannot parse import',
      }
    }

    const [, targetModule] = importMatch

    // Check if this is a simple case we can auto-fix
    if (
      line.includes('type ') &&
      (line.includes('interface') || line.includes('type'))
    ) {
      // Type-only import - redirect to module facade
      const newImport = line.replace(
        /from\s+['"]@\/modules\/[^/]+\/[^'"]+['"]/,
        `from '@/modules/${targetModule}/${targetModule}.module'`,
      )

      return {
        violation,
        fixed: true,
        action: 'Auto-fixed: Redirected type import to module facade',
        newImport,
      }
    }

    return {
      violation,
      fixed: false,
      action: `Manual fix required - Use module facade: '@/modules/${targetModule}/${targetModule}.module'`,
    }
  }

  private fixUtilsImport(violation: Violation, _line: string): FixResult {
    return {
      violation,
      fixed: false,
      action:
        'Manual fix required - Copy utility to your module or use client interface',
    }
  }

  private fixTypesImport(violation: Violation, line: string): FixResult {
    const importMatch = line.match(/from\s+['"]@\/modules\/([^/]+)\//)
    if (!importMatch) {
      return {
        violation,
        fixed: false,
        action: 'Manual fix required - Cannot determine target module',
      }
    }

    const [, targetModule] = importMatch

    // For type imports, try to redirect to client interface
    if (line.includes('type ')) {
      const newImport = line.replace(
        /from\s+['"]@\/modules\/[^/]+\/[^'"]+['"]/,
        `from '@/modules/${targetModule}/client/${targetModule}.client.interface'`,
      )

      return {
        violation,
        fixed: true,
        action: 'Auto-fixed: Redirected to client interface',
        newImport,
      }
    }

    return {
      violation,
      fixed: false,
      action: `Manual fix required - Import types from client interface: '@/modules/${targetModule}/client/${targetModule}.client.interface'`,
    }
  }

  private generateFixReport(totalViolations: number): FixReport {
    const fixedCount = this.fixResults.filter((r) => r.fixed).length
    const manualFixRequired = this.fixResults.filter((r) => !r.fixed).length

    return {
      totalViolations,
      fixedCount,
      manualFixRequired,
      results: this.fixResults,
    }
  }
}

class FixReportGenerator {
  static generateConsoleReport(report: FixReport): void {
    console.log('\n🔧 MODULE BOUNDARY FIX REPORT')
    console.log('═'.repeat(50))

    console.log(`\n📊 SUMMARY`)
    console.log(`Total violations: ${report.totalViolations}`)
    console.log(`Auto-fixed: ${report.fixedCount}`)
    console.log(`Manual fixes required: ${report.manualFixRequired}`)

    if (report.fixedCount > 0) {
      console.log(`\n✅ AUTO-FIXED VIOLATIONS`)
      for (const result of report.results.filter((r) => r.fixed)) {
        console.log(`✓ ${result.violation.file}:${result.violation.line}`)
        console.log(`  ${result.action}`)
      }
    }

    if (report.manualFixRequired > 0) {
      console.log(`\n🛠️  MANUAL FIXES REQUIRED`)

      // Group by action type for better readability
      const manualFixes = report.results.filter((r) => !r.fixed)
      const actionGroups = new Map<string, FixResult[]>()

      for (const result of manualFixes) {
        const group = actionGroups.get(result.action) || []
        group.push(result)
        actionGroups.set(result.action, group)
      }

      for (const [action, results] of actionGroups) {
        console.log(`\n📝 ${action}`)
        for (const result of results) {
          console.log(`   ${result.violation.file}:${result.violation.line}`)
          if (result.newImport) {
            console.log(`   Suggestion: ${result.newImport}`)
          }
        }
      }
    }

    console.log(`\n🎯 NEXT STEPS`)
    if (report.fixedCount > 0) {
      console.log(
        `✓ ${report.fixedCount} violations have been automatically fixed`,
      )
    }
    if (report.manualFixRequired > 0) {
      console.log(
        `📋 ${report.manualFixRequired} violations require manual attention`,
      )
      console.log(
        `📚 See: docs/architecture/module-interface-boundaries.md for guidance`,
      )
    }
    if (
      report.totalViolations === 0 ||
      report.fixedCount === report.totalViolations
    ) {
      console.log(`🎉 Run 'npm run validate:boundaries' to verify fixes`)
    }
  }

  static async generateMarkdownReport(report: FixReport): Promise<void> {
    const content = `# Module Boundary Fix Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Violations**: ${report.totalViolations}
- **Auto-Fixed**: ${report.fixedCount}
- **Manual Fixes Required**: ${report.manualFixRequired}

## Auto-Fixed Violations

${report.results
  .filter((r) => r.fixed)
  .map(
    (result) => `
### ✅ ${result.violation.violationType}

- **File**: \`${result.violation.file}:${result.violation.line}\`
- **Action**: ${result.action}
${result.newImport ? `- **New Import**: \`${result.newImport}\`` : ''}
`,
  )
  .join('\n')}

## Manual Fixes Required

${report.results
  .filter((r) => !r.fixed)
  .map(
    (result) => `
### 🛠️ ${result.violation.violationType}

- **File**: \`${result.violation.file}:${result.violation.line}\`
- **Original**: \`${result.violation.import}\`
- **Action Required**: ${result.action}
${result.newImport ? `- **Suggestion**: \`${result.newImport}\`` : ''}
`,
  )
  .join('\n')}

## Next Steps

1. **Review Auto-Fixes**: Verify that auto-fixed imports work correctly
2. **Manual Fixes**: Address remaining violations using the guidance above
3. **Validate**: Run \`npm run validate:boundaries\` to confirm all fixes
4. **Test**: Ensure all tests still pass after boundary changes

## Common Manual Fix Patterns

### Service Dependencies
Replace direct service imports with dependency injection:
\`\`\`typescript
// Before
import { AuthService } from '@/modules/auth/services/auth.service'

// After
constructor(
  @inject('IAuthClient') private authClient: IAuthClient
) {}
\`\`\`

### Database Access
Use shared module facade instead of direct database imports:
\`\`\`typescript
// Before
import { prisma } from '@/modules/shared/database/prisma'

// After
import { SharedModule } from '@/modules/shared/shared.module'
// Use SharedModule.getDatabaseClient() in your service
\`\`\`

### Type Imports
Import types through client interfaces:
\`\`\`typescript
// Before
import type { AuthUser } from '@/modules/auth/types/auth.types'

// After
import type { AuthUser } from '@/modules/auth/client/auth.client.interface'
\`\`\`
`

    await fs.writeFile('docs/architecture/boundary-fix-report.md', content)
    console.log(
      '\n📄 Detailed fix report saved to: docs/architecture/boundary-fix-report.md',
    )
  }
}

// Main execution
async function main() {
  try {
    const fixer = new ModuleBoundaryFixer()
    const report = await fixer.fix()

    FixReportGenerator.generateConsoleReport(report)
    await FixReportGenerator.generateMarkdownReport(report)

    if (report.manualFixRequired > 0) {
      console.log(
        `\n⚠️  ${report.manualFixRequired} violations require manual attention`,
      )
      process.exit(1)
    } else {
      console.log('\n🎉 All boundary violations have been automatically fixed!')
    }
  } catch (error) {
    console.error('❌ Error during fixing:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { ModuleBoundaryFixer, type FixReport, type FixResult }
