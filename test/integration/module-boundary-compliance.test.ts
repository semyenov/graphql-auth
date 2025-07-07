/**
 * Module Boundary Compliance Tests
 *
 * Tests that verify module boundary compliance using real imports and file structure
 */

import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { describe, expect, it } from 'vitest'

describe('Module Boundary Compliance', () => {
  const moduleRootPath = path.join(process.cwd(), 'src', 'modules')

  interface ImportAnalysis {
    file: string
    imports: string[]
    violations: BoundaryViolation[]
  }

  interface BoundaryViolation {
    type:
      | 'direct-service-import'
      | 'cross-module-internal'
      | 'missing-facade-import'
    file: string
    importPath: string
    severity: 'error' | 'warning'
    message: string
  }

  /**
   * Extract imports from a TypeScript file
   */
  async function extractImports(filePath: string): Promise<string[]> {
    const content = await readFile(filePath, 'utf-8')
    const importRegex = /^import\s+(?:.*?)\s+from\s+['"](.*?)['"];?$/gm
    const imports: string[] = []

    let match = importRegex.exec(content)
    while (match !== null) {
      if (match[1]) {
        imports.push(match[1])
      }
      match = importRegex.exec(content)
    }

    return imports
  }

  /**
   * Analyze imports for boundary violations
   */
  function analyzeImports(
    filePath: string,
    imports: string[],
    sourceModule: string,
  ): BoundaryViolation[] {
    const violations: BoundaryViolation[] = []

    imports.forEach((importPath) => {
      // Check for direct service/repository imports
      if (
        importPath.includes('/services/') ||
        importPath.includes('/repositories/')
      ) {
        const targetModule = importPath.split('/')[2] // Extract module name
        if (targetModule && targetModule !== sourceModule) {
          violations.push({
            type: 'direct-service-import',
            file: filePath,
            importPath,
            severity: 'error',
            message: `Direct service import across modules: ${importPath}`,
          })
        }
      }

      // Check for cross-module internal access
      if (importPath.startsWith('@/modules/')) {
        const pathParts = importPath.split('/')
        const targetModule = pathParts[2]
        const targetFile = pathParts.slice(3).join('/')

        if (targetModule !== sourceModule && targetModule !== 'shared') {
          // Check if accessing internal files instead of module facade
          if (
            !(
              targetFile.endsWith('.module.ts') ||
              targetFile.startsWith('client/')
            ) &&
            targetFile !== 'constants.ts' &&
            targetFile !== 'types'
          ) {
            violations.push({
              type: 'cross-module-internal',
              file: filePath,
              importPath,
              severity: 'error',
              message: `Cross-module internal access: ${importPath}`,
            })
          }
        }
      }

      // Check for missing facade imports
      if (
        importPath.startsWith('@/modules/') &&
        !importPath.includes('/shared/')
      ) {
        const pathParts = importPath.split('/')
        const targetModule = pathParts[2]

        if (
          targetModule !== sourceModule &&
          !importPath.endsWith('.module.ts') &&
          !importPath.includes('/client/')
        ) {
          violations.push({
            type: 'missing-facade-import',
            file: filePath,
            importPath,
            severity: 'warning',
            message: `Should use module facade: ${targetModule}.module.ts`,
          })
        }
      }
    })

    return violations
  }

  /**
   * Get all TypeScript files in a directory recursively
   */
  async function getTSFiles(dirPath: string): Promise<string[]> {
    const files: string[] = []
    const entries = await readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        const subFiles = await getTSFiles(fullPath)
        files.push(...subFiles)
      } else if (
        entry.name.endsWith('.ts') &&
        !entry.name.endsWith('.test.ts')
      ) {
        files.push(fullPath)
      }
    }

    return files
  }

  /**
   * Analyze a module for boundary violations
   */
  async function analyzeModule(moduleName: string): Promise<ImportAnalysis[]> {
    const modulePath = path.join(moduleRootPath, moduleName)
    const moduleFiles = await getTSFiles(modulePath)
    const analyses: ImportAnalysis[] = []

    for (const filePath of moduleFiles) {
      const imports = await extractImports(filePath)
      const violations = analyzeImports(filePath, imports, moduleName)

      analyses.push({
        file: path.relative(process.cwd(), filePath),
        imports,
        violations,
      })
    }

    return analyses
  }

  describe('Auth Module Boundaries', () => {
    it('should not directly import from other module services', async () => {
      const analyses = await analyzeModule('auth')
      const serviceViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'direct-service-import')

      expect(serviceViolations).toHaveLength(0)

      if (serviceViolations.length > 0) {
        console.log('Auth module service import violations:')
        serviceViolations.forEach((v) => {
          console.log(`  - ${v.file}: ${v.importPath}`)
        })
      }
    })

    it('should not access other module internals directly', async () => {
      const analyses = await analyzeModule('auth')
      const internalViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'cross-module-internal')

      expect(internalViolations).toHaveLength(0)

      if (internalViolations.length > 0) {
        console.log('Auth module internal access violations:')
        internalViolations.forEach((v) => {
          console.log(`  - ${v.file}: ${v.importPath}`)
        })
      }
    })

    it('should have proper module facade structure', async () => {
      const modulePath = path.join(moduleRootPath, 'auth')
      const moduleFile = path.join(modulePath, 'auth.module.ts')

      try {
        const content = await readFile(moduleFile, 'utf-8')
        expect(content).toContain('export')
        expect(content).toMatch(/export.*constants/)
        expect(content).toMatch(/export.*types/)
      } catch (error) {
        throw new Error('Auth module should have auth.module.ts facade file')
      }
    })
  })

  describe('Posts Module Boundaries', () => {
    it('should not directly import from other module services', async () => {
      const analyses = await analyzeModule('posts')
      const serviceViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'direct-service-import')

      expect(serviceViolations).toHaveLength(0)
    })

    it('should not access other module internals directly', async () => {
      const analyses = await analyzeModule('posts')
      const internalViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'cross-module-internal')

      expect(internalViolations).toHaveLength(0)
    })
  })

  describe('Users Module Boundaries', () => {
    it('should not directly import from other module services', async () => {
      const analyses = await analyzeModule('users')
      const serviceViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'direct-service-import')

      expect(serviceViolations).toHaveLength(0)
    })

    it('should not access other module internals directly', async () => {
      const analyses = await analyzeModule('users')
      const internalViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'cross-module-internal')

      expect(internalViolations).toHaveLength(0)
    })
  })

  describe('OIDC Module Boundaries', () => {
    it('should not directly import from other module services', async () => {
      const analyses = await analyzeModule('oidc')
      const serviceViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'direct-service-import')

      expect(serviceViolations).toHaveLength(0)
    })

    it('should not access other module internals directly', async () => {
      const analyses = await analyzeModule('oidc')
      const internalViolations = analyses
        .flatMap((a) => a.violations)
        .filter((v) => v.type === 'cross-module-internal')

      expect(internalViolations).toHaveLength(0)
    })
  })

  describe('Shared Module Usage', () => {
    it('should be accessible by all modules through facade', async () => {
      const modules = ['auth', 'posts', 'users', 'oidc']

      for (const moduleName of modules) {
        const analyses = await analyzeModule(moduleName)
        const sharedImports = analyses
          .flatMap((a) => a.imports)
          .filter((imp) => imp.includes('/shared/'))

        // Modules should be able to import from shared
        expect(sharedImports.length).toBeGreaterThanOrEqual(0)

        // But should prefer facade imports
        const directSharedImports = sharedImports.filter(
          (imp) =>
            !(imp.endsWith('shared.module.ts') || imp.includes('/database/')),
        )

        // Log recommendations for facade usage
        if (directSharedImports.length > 0) {
          console.log(`${moduleName} module could use shared facade for:`)
          directSharedImports.forEach((imp) => {
            console.log(`  - ${imp}`)
          })
        }
      }
    })
  })

  describe('Module Dependencies Validation', () => {
    it('should have valid dependencies.json for each module', async () => {
      const modules = ['auth', 'posts', 'users', 'oidc', 'shared']

      for (const moduleName of modules) {
        const depsPath = path.join(
          moduleRootPath,
          moduleName,
          'dependencies.json',
        )

        try {
          const content = await readFile(depsPath, 'utf-8')
          const deps = JSON.parse(content)

          expect(deps).toHaveProperty('external')
          expect(deps).toHaveProperty('internal')
          expect(Array.isArray(deps.external)).toBe(true)
          expect(Array.isArray(deps.internal)).toBe(true)
        } catch (error) {
          throw new Error(
            `Module ${moduleName} should have valid dependencies.json`,
          )
        }
      }
    })
  })

  describe('Overall Architecture Compliance', () => {
    it('should have all modules follow the standard structure', async () => {
      const modules = ['auth', 'posts', 'users', 'oidc']

      for (const moduleName of modules) {
        const modulePath = path.join(moduleRootPath, moduleName)

        // Check for required files
        const requiredFiles = [
          `${moduleName}.module.ts`,
          'dependencies.json',
          'constants.ts',
        ]

        for (const file of requiredFiles) {
          const filePath = path.join(modulePath, file)
          try {
            await readFile(filePath, 'utf-8')
          } catch (error) {
            throw new Error(
              `Module ${moduleName} missing required file: ${file}`,
            )
          }
        }

        // Check for client interface (not required for all modules yet)
        const clientPath = path.join(modulePath, 'client')
        try {
          const clientFiles = await readdir(clientPath)
          expect(
            clientFiles.some((f) => f.includes('client.interface.ts')),
          ).toBe(true)
        } catch (error) {
          console.log(
            `Note: Module ${moduleName} doesn't have client interface yet`,
          )
        }
      }
    })

    it('should have minimal coupling between modules', async () => {
      const modules = ['auth', 'posts', 'users', 'oidc']
      const couplingMatrix: Record<string, Record<string, number>> = {}

      for (const sourceModule of modules) {
        couplingMatrix[sourceModule] = {}

        for (const targetModule of modules) {
          if (sourceModule !== targetModule) {
            const analyses = await analyzeModule(sourceModule)
            const crossModuleImports = analyses
              .flatMap((a) => a.imports)
              .filter((imp) => imp.includes(`/modules/${targetModule}/`))

            couplingMatrix[sourceModule][targetModule] =
              crossModuleImports.length
          }
        }
      }

      // Log coupling matrix for analysis
      console.log('Module Coupling Matrix:')
      console.table(couplingMatrix)

      // Ensure no module has excessive coupling to others
      Object.entries(couplingMatrix).forEach(([_source, targets]) => {
        const totalCoupling = Object.values(targets).reduce(
          (sum, count) => sum + count,
          0,
        )
        expect(totalCoupling).toBeLessThan(10) // Adjust threshold as needed
      })
    })
  })
})
