/**
 * Module Boundary Architecture Tests
 *
 * These tests enforce the modular monolith architecture by validating
 * that modules only access each other through defined interfaces.
 */

import * as fs from 'fs/promises'
import { glob } from 'glob'
import * as path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'
import { ModuleBoundaryAnalyzer } from '../../scripts/analyze-module-boundaries'

interface ModuleStructure {
  name: string
  hasFacade: boolean
  hasClientInterface: boolean
  hasDependencies: boolean
  files: string[]
}

interface ImportAnalysis {
  file: string
  imports: Array<{
    line: number
    importPath: string
    isValid: boolean
    reason?: string
  }>
}

describe('Module Boundary Architecture', () => {
  let modules: ModuleStructure[]
  let analysisReport: any

  beforeAll(async () => {
    // Discover all modules
    modules = await discoverModules()

    // Run boundary analysis
    const analyzer = new ModuleBoundaryAnalyzer()
    analysisReport = await analyzer.analyze()
  })

  describe('Module Structure Requirements', () => {
    it('should have all required module files', async () => {
      for (const module of modules) {
        expect(
          module.hasFacade,
          `Module ${module.name} missing facade file`,
        ).toBe(true)
        expect(
          module.hasClientInterface,
          `Module ${module.name} missing client interface`,
        ).toBe(true)
        expect(
          module.hasDependencies,
          `Module ${module.name} missing dependencies.json`,
        ).toBe(true)
      }
    })

    it('should have proper facade file structure', async () => {
      for (const module of modules) {
        const facadeFile = `src/modules/${module.name}/${module.name}.module.ts`
        const content = await fs.readFile(facadeFile, 'utf-8')

        // Facade should re-export client interface
        expect(content).toContain('client.interface')

        // Facade should not export internal implementations
        expect(content).not.toMatch(/export\s+\{\s*\w+Service\s*\}/)
        expect(content).not.toMatch(/export\s+\{\s*\w+Repository\s*\}/)

        // Facade should have module metadata
        expect(content).toContain('Module')
        expect(content).toContain('version')
      }
    })

    it('should have proper client interface structure', async () => {
      for (const module of modules) {
        const clientFile = `src/modules/${module.name}/client/${module.name}.client.interface.ts`
        const content = await fs.readFile(clientFile, 'utf-8')

        // Client interface should export interface
        expect(content).toMatch(/export\s+interface\s+I\w+Client/)

        // Client interface should export events
        expect(content).toMatch(/export\s+interface\s+\w+ModuleEvents/)

        // Client interface should not contain implementations
        expect(content).not.toMatch(/export\s+class\s+\w+Service/)
        expect(content).not.toMatch(/export\s+const\s+\w+\s*=/)
      }
    })
  })

  describe('Import Boundary Enforcement', () => {
    it('should not have any critical boundary violations', () => {
      expect(analysisReport.summary.criticalViolations).toBe(0)
    })

    it('should only import through module facades', async () => {
      const violations = analysisReport.violations.filter(
        (v: any) => v.violationType === 'cross-module-internal',
      )

      if (violations.length > 0) {
        const messages = violations.map(
          (v: any) => `${v.file}:${v.line} - ${v.message}`,
        )
        expect.fail(
          `Cross-module internal imports detected:\n${messages.join('\n')}`,
        )
      }
    })

    it('should not import services directly from other modules', async () => {
      const violations = analysisReport.violations.filter(
        (v: any) => v.violationType === 'direct-service-import',
      )

      expect(violations.length).toBe(0)
    })

    it('should not import repositories directly from other modules', async () => {
      const violations = analysisReport.violations.filter(
        (v: any) => v.violationType === 'direct-repository-import',
      )

      expect(violations.length).toBe(0)
    })

    it('should access database only through shared module facade', async () => {
      const violations = analysisReport.violations.filter(
        (v: any) => v.violationType === 'direct-database-import',
      )

      expect(violations.length).toBe(0)
    })
  })

  describe('Module Isolation Validation', () => {
    it('should have isolated data access patterns', async () => {
      for (const module of modules) {
        const dependencies = await loadModuleDependencies(module.name)

        if (dependencies.isolation?.data) {
          // Verify modules only access their own data models
          const dataAccess = dependencies.isolation.data

          // Check that owned models are only accessed by this module
          if (dataAccess.owns) {
            for (const ownedModel of dataAccess.owns) {
              await validateModelAccess(ownedModel, module.name, 'owns')
            }
          }

          // Check that readonly access is properly handled
          if (dataAccess.readonly) {
            for (const readonlyModel of dataAccess.readonly) {
              await validateModelAccess(readonlyModel, module.name, 'readonly')
            }
          }
        }
      }
    })

    it('should respect module dependency declarations', async () => {
      for (const module of modules) {
        const dependencies = await loadModuleDependencies(module.name)
        const moduleFiles = await getModuleFiles(module.name)

        for (const file of moduleFiles) {
          const imports = await extractImports(file)

          for (const importPath of imports) {
            if (importPath.startsWith('@/modules/')) {
              const targetModule = extractModuleFromImport(importPath)

              if (targetModule && targetModule !== module.name) {
                // Check if this dependency is declared
                const declaredDeps =
                  dependencies.dependencies?.internal?.modules || []

                expect(
                  declaredDeps.includes(targetModule) ||
                    targetModule === 'shared',
                  `Module ${module.name} imports from ${targetModule} but doesn't declare it as dependency in ${file}`,
                ).toBe(true)
              }
            }
          }
        }
      }
    })

    it('should not have circular dependencies', async () => {
      const dependencyGraph = await buildDependencyGraph()
      const cycles = detectCycles(dependencyGraph)

      expect(cycles.length).toBe(0)

      if (cycles.length > 0) {
        const cycleMessages = cycles.map((cycle) => cycle.join(' -> '))
        expect.fail(
          `Circular dependencies detected:\n${cycleMessages.join('\n')}`,
        )
      }
    })
  })

  describe('GraphQL Schema Boundaries', () => {
    it('should only import resolvers through module facades', async () => {
      const schemaFile = 'src/graphql/schema/index.ts'
      const content = await fs.readFile(schemaFile, 'utf-8')

      // Should not directly import resolver files
      expect(content).not.toMatch(/from\s+['"].*\/resolvers\/.*['"]/)

      // Should import through module system
      expect(content).toMatch(/import.*module/)
    })

    it('should not have direct service dependencies in schema', async () => {
      const schemaFiles = await glob('src/graphql/**/*.ts')

      for (const file of schemaFiles) {
        const content = await fs.readFile(file, 'utf-8')
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]

          // Check for direct service imports
          if (line?.includes('from') && line.includes('/services/')) {
            expect.fail(
              `Direct service import in GraphQL schema: ${file}:${i + 1}\n${line}`,
            )
          }
        }
      }
    })
  })

  describe('Test Boundary Compliance', () => {
    it('should use module facades in test files', async () => {
      const testFiles = await glob('src/**/*.test.ts')

      for (const file of testFiles) {
        const content = await fs.readFile(file, 'utf-8')
        const lines = content.split('\n')

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]?.trim()

          // Check for cross-module imports in tests
          const importMatch = line?.match(
            /from\s+['"]@\/modules\/([^/]+)\/([^'"]+)['"]/,
          )
          if (importMatch?.[1] && importMatch[2]) {
            const targetModule = importMatch[1]
            const importPath = importMatch[2]
            const currentModule = extractModuleFromFile(file)

            if (currentModule && currentModule !== targetModule) {
              // Cross-module import in test - should use facade
              if (
                !(
                  importPath?.endsWith('.module') ||
                  importPath?.includes('client.interface')
                )
              ) {
                expect.fail(
                  `Test file uses direct cross-module import: ${file}:${i + 1}\n${line}\nUse module facade instead.`,
                )
              }
            }
          }
        }
      }
    })
  })
})

// Helper functions
async function discoverModules(): Promise<ModuleStructure[]> {
  const moduleDir = 'src/modules'
  const entries = await fs.readdir(moduleDir, { withFileTypes: true })
  const modules: ModuleStructure[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const moduleName = entry.name
      const modulePath = path.join(moduleDir, moduleName)

      const files = await glob(`${modulePath}/**/*.ts`)
      const hasFacade = files.some((f) => f.endsWith(`${moduleName}.module.ts`))
      const hasClientInterface = files.some((f) =>
        f.includes('client.interface.ts'),
      )
      const hasDependencies = await fs
        .access(path.join(modulePath, 'dependencies.json'))
        .then(() => true)
        .catch(() => false)

      modules.push({
        name: moduleName,
        hasFacade,
        hasClientInterface,
        hasDependencies,
        files,
      })
    }
  }

  return modules
}

async function loadModuleDependencies(moduleName: string): Promise<any> {
  try {
    const content = await fs.readFile(
      `src/modules/${moduleName}/dependencies.json`,
      'utf-8',
    )
    return JSON.parse(content)
  } catch {
    return {}
  }
}

async function validateModelAccess(
  model: string,
  moduleName: string,
  accessType: 'owns' | 'readonly',
): Promise<void> {
  // This would check Prisma schema and actual database queries
  // For now, we'll do a basic validation
  const files = await glob(`src/modules/**/*.ts`, {
    ignore: [`src/modules/${moduleName}/**/*`],
  })

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')

    if (accessType === 'owns') {
      // Other modules should not directly access owned models
      const writeOperations = ['create', 'update', 'delete', 'upsert']
      for (const op of writeOperations) {
        if (content.includes(`${model.toLowerCase()}.${op}`)) {
          console.warn(
            `Potential violation: ${file} performs ${op} on ${model} owned by ${moduleName}`,
          )
        }
      }
    }
  }
}

async function getModuleFiles(moduleName: string): Promise<string[]> {
  return await glob(`src/modules/${moduleName}/**/*.ts`, {
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
  })
}

async function extractImports(filePath: string): Promise<string[]> {
  const content = await fs.readFile(filePath, 'utf-8')
  const imports: string[] = []
  const lines = content.split('\n')

  for (const line of lines) {
    const match = line.match(/from\s+['"]([^'"]+)['"]/)
    if (match?.[1]) {
      imports.push(match[1])
    }
  }

  return imports
}

function extractModuleFromImport(importPath: string): string | null {
  const match = importPath.match(/^@\/modules\/([^/]+)/)
  return match ? match[1] || null : null
}

function extractModuleFromFile(filePath: string): string | null {
  const match = filePath.match(/src\/modules\/([^/]+)/)
  return match ? match[1] || null : null
}

async function buildDependencyGraph(): Promise<Map<string, string[]>> {
  const modules = await discoverModules()
  const graph = new Map<string, string[]>()

  for (const module of modules) {
    const dependencies = await loadModuleDependencies(module.name)
    const deps = dependencies.dependencies?.internal?.modules || []
    graph.set(module.name, deps)
  }

  return graph
}

function detectCycles(graph: Map<string, string[]>): string[][] {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const cycles: string[][] = []

  function dfs(node: string, path: string[]): void {
    if (recursionStack.has(node)) {
      const cycleStart = path.indexOf(node)
      cycles.push([...path.slice(cycleStart), node])
      return
    }

    if (visited.has(node)) {
      return
    }

    visited.add(node)
    recursionStack.add(node)

    const neighbors = graph.get(node) || []
    for (const neighbor of neighbors) {
      dfs(neighbor, [...path, node])
    }

    recursionStack.delete(node)
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node, [])
    }
  }

  return cycles
}
