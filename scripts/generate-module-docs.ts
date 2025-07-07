/**
 * Module Documentation Generator
 *
 * Automatically generates comprehensive documentation for modular monolith architecture
 */

import { existsSync } from 'fs'
import { mkdir, readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

interface ModuleInfo {
  name: string
  path: string
  description: string
  dependencies: ModuleDependencies
  exports: ModuleExports
  clientInterface?: ClientInterface
  constants: Record<string, any>
  types: TypeDefinition[]
  services: ServiceInfo[]
  resolvers: ResolverInfo[]
  tests: TestInfo[]
  health: HealthCheckInfo
}

interface ModuleDependencies {
  external: string[]
  internal: string[]
  provides: string[]
}

interface ModuleExports {
  types: string[]
  constants: string[]
  utilities: string[]
  services: string[]
}

interface ClientInterface {
  name: string
  methods: InterfaceMethod[]
  events: EventDefinition[]
}

interface InterfaceMethod {
  name: string
  description: string
  parameters: Parameter[]
  returnType: string
  examples: string[]
}

interface EventDefinition {
  name: string
  description: string
  payload: Record<string, string>
}

interface Parameter {
  name: string
  type: string
  description: string
  optional: boolean
}

interface TypeDefinition {
  name: string
  type: 'interface' | 'type' | 'enum' | 'class'
  description: string
  properties?: Property[]
}

interface Property {
  name: string
  type: string
  description: string
  optional: boolean
}

interface ServiceInfo {
  name: string
  description: string
  methods: string[]
  dependencies: string[]
}

interface ResolverInfo {
  name: string
  type: 'Query' | 'Mutation' | 'Subscription'
  description: string
  schema: string
}

interface TestInfo {
  file: string
  coverage: number
  testCount: number
}

interface HealthCheckInfo {
  endpoint?: string
  dependencies: string[]
  metrics: string[]
}

/**
 * Documentation generator class
 */
export class ModuleDocumentationGenerator {
  private moduleRootPath: string
  private outputPath: string
  private modules: ModuleInfo[] = []

  constructor(moduleRootPath: string, outputPath: string) {
    this.moduleRootPath = moduleRootPath
    this.outputPath = outputPath
  }

  /**
   * Generate documentation for all modules
   */
  async generateDocumentation(): Promise<void> {
    console.log('🔍 Discovering modules...')
    await this.discoverModules()

    console.log('📊 Analyzing module structure...')
    await this.analyzeModules()

    console.log('📝 Generating documentation...')
    await this.generateModuleDocs()
    await this.generateArchitectureOverview()
    await this.generateApiReference()
    await this.generateDependencyGraph()
    await this.generateTestingGuide()

    console.log('✅ Documentation generation complete!')
  }

  /**
   * Discover all modules in the modules directory
   */
  private async discoverModules(): Promise<void> {
    const entries = await readdir(this.moduleRootPath, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const modulePath = path.join(this.moduleRootPath, entry.name)
        this.modules.push({
          name: entry.name,
          path: modulePath,
          description: '',
          dependencies: { external: [], internal: [], provides: [] },
          exports: { types: [], constants: [], utilities: [], services: [] },
          constants: {},
          types: [],
          services: [],
          resolvers: [],
          tests: [],
          health: { dependencies: [], metrics: [] },
        })
      }
    }
  }

  /**
   * Analyze each module's structure and extract information
   */
  private async analyzeModules(): Promise<void> {
    for (const module of this.modules) {
      console.log(`  Analyzing ${module.name} module...`)

      await this.analyzeModuleDependencies(module)
      await this.analyzeModuleExports(module)
      await this.analyzeClientInterface(module)
      await this.analyzeConstants(module)
      await this.analyzeTypes(module)
      await this.analyzeServices(module)
      await this.analyzeResolvers(module)
      await this.analyzeTests(module)
      await this.analyzeHealth(module)
      await this.extractModuleDescription(module)
    }
  }

  /**
   * Analyze module dependencies from dependencies.json
   */
  private async analyzeModuleDependencies(module: ModuleInfo): Promise<void> {
    const depsPath = path.join(module.path, 'dependencies.json')

    try {
      const content = await readFile(depsPath, 'utf-8')
      const deps = JSON.parse(content)
      module.dependencies = {
        external: deps.external || [],
        internal: deps.internal || [],
        provides: deps.provides || [],
      }
    } catch (error) {
      // Module may not have dependencies.json yet
    }
  }

  /**
   * Analyze module exports from facade file
   */
  private async analyzeModuleExports(module: ModuleInfo): Promise<void> {
    const facadePath = path.join(module.path, `${module.name}.module.ts`)

    try {
      const content = await readFile(facadePath, 'utf-8')

      // Extract exports using regex patterns
      const exportRegex =
        /export\s+(?:type\s+|interface\s+|const\s+|class\s+|function\s+)?(\w+)/g
      let match

      while ((match = exportRegex.exec(content)) !== null) {
        if (match[1]) {
          // Categorize exports based on patterns
          if (content.includes(`interface ${match[1]}`)) {
            module.exports.types.push(match[1])
          } else if (content.includes(`const ${match[1]}`)) {
            module.exports.constants.push(match[1])
          } else if (content.includes(`class ${match[1]}`)) {
            module.exports.services.push(match[1])
          } else {
            module.exports.utilities.push(match[1])
          }
        }
      }
    } catch (error) {
      // Module may not have facade file yet
    }
  }

  /**
   * Analyze client interface
   */
  private async analyzeClientInterface(module: ModuleInfo): Promise<void> {
    const clientPath = path.join(module.path, 'client')

    try {
      const clientFiles = await readdir(clientPath)
      const interfaceFile = clientFiles.find((f) =>
        f.includes('client.interface.ts'),
      )

      if (interfaceFile) {
        const content = await readFile(
          path.join(clientPath, interfaceFile),
          'utf-8',
        )

        module.clientInterface = {
          name: `I${module.name.charAt(0).toUpperCase() + module.name.slice(1)}Client`,
          methods: this.extractInterfaceMethods(content),
          events: this.extractEventDefinitions(content),
        }
      }
    } catch (error) {
      // Module may not have client interface
    }
  }

  /**
   * Extract interface methods from TypeScript content
   */
  private extractInterfaceMethods(content: string): InterfaceMethod[] {
    const methods: InterfaceMethod[] = []
    const methodRegex = /(\w+)\s*\([^)]*\)\s*:\s*([^;{]+)/g
    let match

    while ((match = methodRegex.exec(content)) !== null) {
      if (match[1] && match[2]) {
        methods.push({
          name: match[1],
          description: '', // Would need JSDoc parsing for descriptions
          parameters: [], // Would need parameter parsing
          returnType: match[2].trim(),
          examples: [],
        })
      }
    }

    return methods
  }

  /**
   * Extract event definitions from TypeScript content
   */
  private extractEventDefinitions(content: string): EventDefinition[] {
    const events: EventDefinition[] = []
    const eventRegex = /'([^']+)':\s*{([^}]+)}/g
    let match

    while ((match = eventRegex.exec(content)) !== null) {
      if (match[1] && match[2]) {
        events.push({
          name: match[1],
          description: '',
          payload: {}, // Would need property parsing
        })
      }
    }

    return events
  }

  /**
   * Analyze module constants
   */
  private async analyzeConstants(module: ModuleInfo): Promise<void> {
    const constantsPath = path.join(module.path, 'constants.ts')

    try {
      const content = await readFile(constantsPath, 'utf-8')

      // Extract exported constants
      const constantRegex = /export\s+const\s+(\w+)\s*=\s*([^;]+)/g
      let match

      while ((match = constantRegex.exec(content)) !== null) {
        if (match[1] && match[2]) {
          module.constants[match[1]] = match[2].trim()
        }
      }
    } catch (error) {
      // Module may not have constants file
    }
  }

  /**
   * Analyze type definitions
   */
  private async analyzeTypes(module: ModuleInfo): Promise<void> {
    const typesPath = path.join(module.path, 'types')

    try {
      const typeFiles = await readdir(typesPath)

      for (const typeFile of typeFiles) {
        if (typeFile.endsWith('.ts')) {
          const content = await readFile(
            path.join(typesPath, typeFile),
            'utf-8',
          )
          module.types.push(...this.extractTypeDefinitions(content))
        }
      }
    } catch (error) {
      // Module may not have types directory
    }
  }

  /**
   * Extract type definitions from TypeScript content
   */
  private extractTypeDefinitions(content: string): TypeDefinition[] {
    const types: TypeDefinition[] = []

    // Extract interfaces
    const interfaceRegex = /export\s+interface\s+(\w+)\s*{([^}]+)}/g
    let match

    while ((match = interfaceRegex.exec(content)) !== null) {
      if (match[1]) {
        types.push({
          name: match[1],
          type: 'interface',
          description: '',
          properties: [], // Would need property parsing
        })
      }
    }

    // Extract types
    const typeRegex = /export\s+type\s+(\w+)\s*=\s*([^;]+)/g
    match = typeRegex.exec(content)
    while (match !== null) {
      if (match[1]) {
        types.push({
          name: match[1],
          type: 'type',
          description: '',
        })
      }
      match = typeRegex.exec(content)
    }

    return types
  }

  /**
   * Analyze services
   */
  private async analyzeServices(module: ModuleInfo): Promise<void> {
    const servicesPath = path.join(module.path, 'services')

    try {
      const serviceFiles = await readdir(servicesPath)

      for (const serviceFile of serviceFiles) {
        if (serviceFile.endsWith('.ts') && !serviceFile.endsWith('.test.ts')) {
          const content = await readFile(
            path.join(servicesPath, serviceFile),
            'utf-8',
          )
          const serviceName = serviceFile.replace('.ts', '')

          module.services.push({
            name: serviceName,
            description: '',
            methods: this.extractServiceMethods(content),
            dependencies: this.extractServiceDependencies(content),
          })
        }
      }
    } catch (error) {
      // Module may not have services directory
    }
  }

  /**
   * Extract service methods from TypeScript content
   */
  private extractServiceMethods(content: string): string[] {
    const methods: string[] = []
    const methodRegex =
      /(?:public\s+|private\s+|protected\s+)?(\w+)\s*\([^)]*\)\s*:\s*[^{]+{/g
    let match

    while ((match = methodRegex.exec(content)) !== null) {
      if (match[1] && match[1] !== 'constructor') {
        methods.push(match[1])
      }
    }

    return methods
  }

  /**
   * Extract service dependencies from constructor injection
   */
  private extractServiceDependencies(content: string): string[] {
    const dependencies: string[] = []
    const injectRegex = /@inject\(['"]([^'"]+)['"]\)/g
    let match

    while ((match = injectRegex.exec(content)) !== null) {
      if (match[1]) {
        dependencies.push(match[1])
      }
    }

    return dependencies
  }

  /**
   * Analyze GraphQL resolvers
   */
  private async analyzeResolvers(module: ModuleInfo): Promise<void> {
    const resolverFiles = await this.findFiles(module.path, '*.resolver.ts')

    for (const resolverFile of resolverFiles) {
      const content = await readFile(resolverFile, 'utf-8')

      // Extract resolver definitions
      const queryRegex = /builder\.query\('(\w+)'/g
      const mutationRegex = /builder\.mutation\('(\w+)'/g

      let match = queryRegex.exec(content)
      while (match !== null) {
        if (match[1]) {
          module.resolvers.push({
            name: match[1],
            type: 'Query',
            description: '',
            schema: '',
          })
        }
        match = queryRegex.exec(content)
      }

      match = mutationRegex.exec(content)
      while (match !== null) {
        if (match[1]) {
          module.resolvers.push({
            name: match[1],
            type: 'Mutation',
            description: '',
            schema: '',
          })
        }
        match = mutationRegex.exec(content)
      }
    }
  }

  /**
   * Analyze test files
   */
  private async analyzeTests(module: ModuleInfo): Promise<void> {
    const testFiles = await this.findFiles(module.path, '*.test.ts')

    for (const testFile of testFiles) {
      const content = await readFile(testFile, 'utf-8')
      const testCount = (content.match(/it\(/g) || []).length

      module.tests.push({
        file: path.relative(module.path, testFile),
        coverage: 0, // Would need coverage analysis
        testCount,
      })
    }
  }

  /**
   * Analyze health check information
   */
  private async analyzeHealth(module: ModuleInfo): Promise<void> {
    // Check if module has health check endpoint
    const facadePath = path.join(module.path, `${module.name}.module.ts`)

    try {
      const content = await readFile(facadePath, 'utf-8')

      if (content.includes('healthCheck')) {
        module.health.endpoint = `/health/${module.name}`
      }

      // Extract health dependencies from facade
      module.health.dependencies = module.dependencies.external
      module.health.metrics = ['status', 'dependencies', 'performance']
    } catch (error) {
      // Module may not have health checks
    }
  }

  /**
   * Extract module description from README
   */
  private async extractModuleDescription(module: ModuleInfo): Promise<void> {
    const readmePath = path.join(module.path, 'README.md')

    try {
      const content = await readFile(readmePath, 'utf-8')

      // Extract first paragraph as description
      const paragraphs = content.split('\n\n')
      const firstParagraph = paragraphs.find(
        (p) => p.trim() && !p.startsWith('#'),
      )

      if (firstParagraph) {
        module.description = firstParagraph.trim()
      }
    } catch (error) {
      module.description = `${module.name.charAt(0).toUpperCase() + module.name.slice(1)} module`
    }
  }

  /**
   * Find files matching pattern recursively
   */
  private async findFiles(dirPath: string, pattern: string): Promise<string[]> {
    const files: string[] = []
    const regex = new RegExp(pattern.replace('*', '.*'))

    try {
      const entries = await readdir(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)

        if (entry.isDirectory()) {
          const subFiles = await this.findFiles(fullPath, pattern)
          files.push(...subFiles)
        } else if (regex.test(entry.name)) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      // Directory may not exist
    }

    return files
  }

  /**
   * Generate individual module documentation
   */
  private async generateModuleDocs(): Promise<void> {
    const modulesDir = path.join(this.outputPath, 'modules')
    await this.ensureDir(modulesDir)

    for (const module of this.modules) {
      const moduleDoc = this.generateModuleMarkdown(module)
      const filePath = path.join(modulesDir, `${module.name}.md`)
      await writeFile(filePath, moduleDoc)
    }
  }

  /**
   * Generate module markdown documentation
   */
  private generateModuleMarkdown(module: ModuleInfo): string {
    return `# ${module.name.charAt(0).toUpperCase() + module.name.slice(1)} Module

${module.description}

## Overview

- **Path**: \`${path.relative(process.cwd(), module.path)}\`
- **Dependencies**: ${module.dependencies.external.length + module.dependencies.internal.length}
- **Services**: ${module.services.length}
- **Resolvers**: ${module.resolvers.length}
- **Tests**: ${module.tests.reduce((sum, t) => sum + t.testCount, 0)}

## Dependencies

### External Dependencies
${module.dependencies.external.map((dep) => `- \`${dep}\``).join('\n') || '- None'}

### Internal Dependencies
${module.dependencies.internal.map((dep) => `- \`${dep}\``).join('\n') || '- None'}

### Provides
${module.dependencies.provides.map((dep) => `- \`${dep}\``).join('\n') || '- None'}

## Exports

### Types
${module.exports.types.map((type) => `- \`${type}\``).join('\n') || '- None'}

### Constants
${module.exports.constants.map((constant) => `- \`${constant}\``).join('\n') || '- None'}

### Services
${module.exports.services.map((service) => `- \`${service}\``).join('\n') || '- None'}

## Client Interface

${
  module.clientInterface
    ? `
### Interface: \`${module.clientInterface.name}\`

#### Methods
${module.clientInterface.methods
  .map(
    (method) => `
- **\`${method.name}\`**: \`${method.returnType}\`
  - Description: ${method.description || 'No description available'}
`,
  )
  .join('\n')}

#### Events
${module.clientInterface.events
  .map(
    (event) => `
- **\`${event.name}\`**
  - Description: ${event.description || 'No description available'}
`,
  )
  .join('\n')}
`
    : 'No client interface defined'
}

## Constants

${
  Object.entries(module.constants)
    .map(
      ([name, value]) => `
- **\`${name}\`**: \`${value}\`
`,
    )
    .join('\n') || 'No constants defined'
}

## Types

${
  module.types
    .map(
      (type) => `
### \`${type.name}\` (${type.type})
${type.description || 'No description available'}
`,
    )
    .join('\n') || 'No types defined'
}

## Services

${
  module.services
    .map(
      (service) => `
### \`${service.name}\`
${service.description || 'No description available'}

**Methods**: ${service.methods.join(', ') || 'None'}
**Dependencies**: ${service.dependencies.join(', ') || 'None'}
`,
    )
    .join('\n') || 'No services defined'
}

## GraphQL Resolvers

${
  module.resolvers
    .map(
      (resolver) => `
### \`${resolver.name}\` (${resolver.type})
${resolver.description || 'No description available'}
`,
    )
    .join('\n') || 'No resolvers defined'
}

## Tests

${
  module.tests
    .map(
      (test) => `
- **\`${test.file}\`**: ${test.testCount} tests
`,
    )
    .join('\n') || 'No tests found'
}

## Health Checks

${
  module.health.endpoint
    ? `
- **Endpoint**: \`${module.health.endpoint}\`
- **Dependencies**: ${module.health.dependencies.join(', ') || 'None'}
- **Metrics**: ${module.health.metrics.join(', ') || 'None'}
`
    : 'No health checks configured'
}
`
  }

  /**
   * Generate architecture overview documentation
   */
  private async generateArchitectureOverview(): Promise<void> {
    const overview = `# Modular Monolith Architecture Overview

## Module Summary

| Module | Description | Dependencies | Services | Resolvers | Tests |
|--------|-------------|--------------|----------|-----------|--------|
${this.modules.map((module) => `| ${module.name} | ${module.description.substring(0, 50)}... | ${module.dependencies.external.length + module.dependencies.internal.length} | ${module.services.length} | ${module.resolvers.length} | ${module.tests.reduce((sum, t) => sum + t.testCount, 0)} |`).join('\n')}

## Architecture Patterns

### Modular Structure
The system follows modular monolith patterns with clear boundaries between modules:

${this.modules
  .map(
    (module) => `
#### ${module.name.charAt(0).toUpperCase() + module.name.slice(1)} Module
- **Purpose**: ${module.description}
- **Boundary**: Well-defined facade with client interface
- **Communication**: Event-driven through message bus
- **Isolation**: No direct cross-module dependencies
`,
  )
  .join('\n')}

### Dependency Flow

\`\`\`
${this.generateDependencyFlowDiagram()}
\`\`\`

### Communication Patterns

1. **Client Interfaces**: Modules expose clean APIs through client interfaces
2. **Event-Driven**: Inter-module communication via message bus
3. **Facade Pattern**: Single entry points hide internal complexity
4. **Dependency Injection**: Clean dependency management with TSyringe

## Module Health

${this.modules
  .map(
    (module) => `
### ${module.name.charAt(0).toUpperCase() + module.name.slice(1)}
- **Health Endpoint**: ${module.health.endpoint || 'Not configured'}
- **External Dependencies**: ${module.dependencies.external.length}
- **Test Coverage**: ${module.tests.length} test files
`,
  )
  .join('\n')}
`

    await writeFile(
      path.join(this.outputPath, 'architecture-overview.md'),
      overview,
    )
  }

  /**
   * Generate dependency flow diagram
   */
  private generateDependencyFlowDiagram(): string {
    const lines: string[] = []

    this.modules.forEach((module) => {
      module.dependencies.internal.forEach((dep) => {
        lines.push(`${module.name} --> ${dep}`)
      })

      if (module.dependencies.internal.length === 0) {
        lines.push(`${module.name}`)
      }
    })

    return lines.join('\n')
  }

  /**
   * Generate API reference
   */
  private async generateApiReference(): Promise<void> {
    const apiRef = `# API Reference

## Module Client Interfaces

${this.modules
  .filter((m) => m.clientInterface)
  .map(
    (module) => `
### ${module.clientInterface!.name}

#### Methods
${module
  .clientInterface!.methods.map(
    (method) => `
##### \`${method.name}()\`
- **Returns**: \`${method.returnType}\`
- **Description**: ${method.description || 'No description available'}
`,
  )
  .join('\n')}

#### Events
${module
  .clientInterface!.events.map(
    (event) => `
##### \`${event.name}\`
- **Description**: ${event.description || 'No description available'}
`,
  )
  .join('\n')}
`,
  )
  .join('\n')}

## GraphQL Schema

### Queries
${this.modules
  .flatMap((m) => m.resolvers.filter((r) => r.type === 'Query'))
  .map(
    (resolver) => `
#### \`${resolver.name}\`
${resolver.description || 'No description available'}
`,
  )
  .join('\n')}

### Mutations
${this.modules
  .flatMap((m) => m.resolvers.filter((r) => r.type === 'Mutation'))
  .map(
    (resolver) => `
#### \`${resolver.name}\`
${resolver.description || 'No description available'}
`,
  )
  .join('\n')}
`

    await writeFile(path.join(this.outputPath, 'api-reference.md'), apiRef)
  }

  /**
   * Generate dependency graph
   */
  private async generateDependencyGraph(): Promise<void> {
    const graph = `# Module Dependency Graph

## Mermaid Diagram

\`\`\`mermaid
graph TD
${this.modules
  .map((module) => {
    const deps = module.dependencies.internal
      .map((dep) => `    ${module.name} --> ${dep}`)
      .join('\n')
    return deps || `    ${module.name}`
  })
  .join('\n')}
\`\`\`

## Dependency Matrix

| Module | ${this.modules.map((m) => m.name).join(' | ')} |
|--------|${this.modules.map(() => '---').join('|')}|
${this.modules
  .map(
    (sourceModule) =>
      `| ${sourceModule.name} | ${this.modules
        .map((targetModule) =>
          sourceModule.dependencies.internal.includes(targetModule.name)
            ? '✓'
            : '-',
        )
        .join(' | ')} |`,
  )
  .join('\n')}

## Circular Dependencies

${
  this.detectCircularDependencies().length > 0
    ? this.detectCircularDependencies()
        .map((cycle) => `⚠️ ${cycle}`)
        .join('\n')
    : '✅ No circular dependencies detected'
}
`

    await writeFile(path.join(this.outputPath, 'dependency-graph.md'), graph)
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(): string[] {
    const cycles: string[] = []

    // Simple cycle detection - would need more sophisticated algorithm for complex cycles
    this.modules.forEach((module) => {
      module.dependencies.internal.forEach((dep) => {
        const depModule = this.modules.find((m) => m.name === dep)
        if (
          depModule &&
          depModule.dependencies.internal.includes(module.name)
        ) {
          cycles.push(`${module.name} ↔ ${dep}`)
        }
      })
    })

    return cycles
  }

  /**
   * Generate testing guide
   */
  private async generateTestingGuide(): Promise<void> {
    const guide = `# Testing Guide

## Module Testing Overview

### Test Coverage by Module

| Module | Test Files | Test Count | Integration Tests |
|--------|------------|------------|-------------------|
${this.modules.map((module) => `| ${module.name} | ${module.tests.length} | ${module.tests.reduce((sum, t) => sum + t.testCount, 0)} | ${module.tests.filter((t) => t.file.includes('integration')).length} |`).join('\n')}

### Testing Patterns

#### Unit Testing
Each module should have comprehensive unit tests for:
- Service methods and business logic
- Input validation and error handling
- Type definitions and constants

#### Integration Testing
Modules are tested together using the integration test framework:
- Inter-module communication via message bus
- Client interface compliance
- Boundary violation detection

#### End-to-End Testing
Complete user flows tested across multiple modules:
- Authentication and authorization flows
- CRUD operations with proper permissions
- Event propagation and consistency

### Test Commands

\`\`\`bash
# Run all tests
bun run test

# Run tests for specific module
bun test src/modules/auth/**/*.test.ts

# Run integration tests
bun test test/integration/**/*.test.ts

# Run boundary compliance tests
bun test test/integration/module-boundary-compliance.test.ts

# Run with coverage
bun run test:coverage
\`\`\`

### Testing Framework Usage

#### Module Isolation Testing
\`\`\`typescript
import { testModuleInIsolation } from '@test/framework/module-integration-test.framework'

await testModuleInIsolation('auth', ['shared'], async (fixtures) => {
  // Test auth module in isolation
})
\`\`\`

#### Inter-Module Communication Testing
\`\`\`typescript
import { testInterModuleCommunication } from '@test/framework/module-integration-test.framework'

await testInterModuleCommunication('auth', 'users', async (messageBus, fixtures) => {
  // Test communication between auth and users modules
})
\`\`\`

### Best Practices

1. **Test Module Boundaries**: Always verify modules respect boundaries
2. **Use Client Interfaces**: Test through client interfaces, not direct imports
3. **Mock External Dependencies**: Use framework mock registry for clean tests
4. **Event-Driven Testing**: Test module communication via events
5. **Performance Testing**: Include performance thresholds in integration tests
`

    await writeFile(path.join(this.outputPath, 'testing-guide.md'), guide)
  }

  /**
   * Ensure directory exists
   */
  private async ensureDir(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  const moduleRootPath = path.join(process.cwd(), 'src', 'modules')
  const outputPath = path.join(process.cwd(), 'docs', 'generated')

  const generator = new ModuleDocumentationGenerator(moduleRootPath, outputPath)
  await generator.generateDocumentation()
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}
