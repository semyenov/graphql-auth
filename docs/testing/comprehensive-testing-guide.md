# Comprehensive Testing Guide

This guide demonstrates all testing patterns and tools implemented in the GraphQL Auth project's modular monolith architecture.

## Table of Contents

1. [Overview](#overview)
2. [Testing Philosophy](#testing-philosophy)
3. [Testing Framework Architecture](#testing-framework-architecture)
4. [Module Testing Patterns](#module-testing-patterns)
5. [Integration Testing](#integration-testing)
6. [Boundary Compliance Testing](#boundary-compliance-testing)
7. [Performance Testing](#performance-testing)
8. [Documentation Generation](#documentation-generation)
9. [CI/CD Integration](#cicd-integration)
10. [Best Practices](#best-practices)

## Overview

The modular monolith testing approach ensures:

- **Module Isolation**: Each module can be tested independently
- **Boundary Compliance**: Automated detection of architectural violations
- **Inter-Module Communication**: Comprehensive testing of module interactions
- **Performance Monitoring**: Real-time performance tracking and thresholds
- **Documentation Generation**: Automated API and architecture documentation

## Testing Philosophy

### 1. Test Pyramid Adaptation

```
    E2E Tests (Cross-Module Flows)
   /                              \
  Integration Tests (Module Communication)
 /                                        \
Unit Tests (Individual Module Components)
```

### 2. Boundary-Aware Testing

All tests respect module boundaries and use proper communication channels:

- **Client Interfaces**: Tests access modules through defined APIs
- **Message Bus**: Inter-module communication via events
- **Mock Registry**: Centralized mocking that respects boundaries
- **Facade Pattern**: Tests use module facades, not internals

### 3. Testing Levels

#### Unit Level (Module Internal)
- Service method testing
- Input validation
- Error handling
- Type safety

#### Integration Level (Module Communication)
- Client interface compliance
- Event-driven communication
- Message bus functionality
- Performance thresholds

#### E2E Level (Complete Flows)
- Multi-module user journeys
- End-to-end data consistency
- Real-world scenarios

## Testing Framework Architecture

### Core Components

```typescript
// Framework structure
test/
├── framework/                          # Reusable testing utilities
│   ├── module-integration-test.framework.ts  # Main testing framework
│   └── helpers/                        # Test helper utilities
├── integration/                        # Integration tests
│   ├── module-communication.integration.test.ts
│   └── module-boundary-compliance.test.ts
├── config/                            # Test configuration
│   └── integration-test.config.ts    # Centralized test config
├── setup/                             # Test setup files
│   ├── global-setup.ts               # Global test setup
│   └── integration-setup.ts          # Integration test setup
└── utils/                             # Test utilities
    ├── database/                      # Database test utilities
    └── mocks/                         # Mock utilities
```

### Framework Components

#### 1. ModuleIntegrationTestFramework

The main testing framework that provides:

```typescript
import { createModuleTestFramework } from '@test/framework/module-integration-test.framework'

const framework = createModuleTestFramework()

// Setup test environment
await framework.setup({
  moduleName: 'auth',
  dependencies: ['shared'],
  clientInterface: 'IAuthClient',
  isolationLevel: 'integration',
  mockExternalDependencies: true,
  enableMessageBus: true,
})
```

#### 2. ModuleMockRegistry

Centralized mock management:

```typescript
const mockRegistry = framework.getMockRegistry()

// Register a mock service
mockRegistry.registerMock('users', 'userService', {
  getUserById: vi.fn().mockResolvedValue(mockUser),
  validateUser: vi.fn().mockResolvedValue(true),
})

// Verify interactions
const interactions = mockRegistry.verifyInteractions('users')
expect(interactions.called).toContain('getUserById')
```

#### 3. MessageBusTestHelper

Event-driven communication testing:

```typescript
const messageBusHelper = framework.getMessageBusHelper()

// Subscribe to events
const receivedEvents = await messageBusHelper.subscribeForTesting(
  'user.registered',
  'test-module'
)

// Publish test events
await messageBusHelper.publishTestMessage('user.registered', {
  userId: 1,
  email: 'test@example.com',
  timestamp: new Date(),
})

// Verify event processing
await messageBusHelper.waitForMessageProcessing()
expect(receivedEvents).toHaveLength(1)
```

#### 4. ModuleBoundaryValidator

Automated boundary compliance:

```typescript
const validator = framework.getBoundaryValidator()

// Validate dependencies
validator.validateDependencies(
  'auth',
  ['shared', 'core'],
  actualImports
)

// Validate client interface usage
validator.validateClientInterfaceUsage(
  'auth',
  'IUsersClient',
  actualUsagePatterns
)

// Check for violations
if (validator.hasErrors()) {
  const violations = validator.getViolations()
  throw new Error(`Boundary violations: ${violations.map(v => v.message).join(', ')}`)
}
```

## Module Testing Patterns

### 1. Module Isolation Testing

Test a module in complete isolation:

```typescript
import { testModuleInIsolation } from '@test/framework/module-integration-test.framework'

describe('Auth Module Isolation', () => {
  it('should handle authentication without external dependencies', async () => {
    await testModuleInIsolation('auth', ['shared'], async (fixtures) => {
      const { prisma, logger, context } = fixtures
      
      // Test auth functionality in isolation
      const result = await authenticateUser(credentials, context)
      expect(result.success).toBe(true)
    })
  })
})
```

### 2. Client Interface Testing

Verify modules use client interfaces properly:

```typescript
describe('Module Client Interface Compliance', () => {
  it('should use users client interface for user operations', async () => {
    const framework = createModuleTestFramework()
    
    await framework.setup({
      moduleName: 'auth',
      dependencies: ['users'],
      clientInterface: 'IAuthClient',
      isolationLevel: 'integration',
      mockExternalDependencies: false,
      enableMessageBus: false,
    })

    // Test that auth module uses users client interface
    await framework.testClientInterfaceCompliance(
      'users',
      IUsersClient,
      mockUsersClientImplementation
    )

    framework.assertBoundaryCompliance()
  })
})
```

### 3. Service Testing with Dependency Injection

Test services with proper DI:

```typescript
import { container } from '@/app/config/container'
import { AuthService } from '@/modules/auth/services/auth.service'

describe('AuthService', () => {
  let authService: AuthService
  
  beforeEach(() => {
    // Setup DI container for testing
    container.register('IPasswordService', {
      useValue: mockPasswordService
    })
    
    authService = container.resolve(AuthService)
  })

  it('should authenticate user with valid credentials', async () => {
    const result = await authService.authenticate(validCredentials)
    expect(result.success).toBe(true)
  })
})
```

## Integration Testing

### 1. Inter-Module Communication

Test communication between modules:

```typescript
import { testInterModuleCommunication } from '@test/framework/module-integration-test.framework'

describe('Auth-Users Communication', () => {
  it('should notify users module when user registers', async () => {
    await testInterModuleCommunication(
      'auth',
      'users',
      async (messageBus, fixtures) => {
        // Subscribe to user registration events
        const userEvents = await messageBus.subscribeForTesting(
          'user.registered',
          'users-module'
        )

        // Trigger user registration in auth module
        await authModule.registerUser(userInput)

        // Verify event was received by users module
        await messageBus.waitForMessageProcessing()
        expect(userEvents).toHaveLength(1)
        expect(userEvents[0]).toMatchObject({
          userId: expect.any(Number),
          email: userInput.email
        })
      }
    )
  })
})
```

### 2. Complete Flow Testing

Test end-to-end flows across multiple modules:

```typescript
describe('Complete Registration Flow', () => {
  it('should handle user registration across all modules', async () => {
    const framework = createModuleTestFramework()
    
    await framework.setup({
      moduleName: 'complete-flow',
      dependencies: ['auth', 'users', 'posts', 'shared'],
      clientInterface: 'ICompleteFlow',
      isolationLevel: 'e2e',
      mockExternalDependencies: false,
      enableMessageBus: true,
    })

    const messageBus = framework.getMessageBusHelper()!
    
    // Track all events in the flow
    const allEvents: any[] = []
    await messageBus.subscribeForTesting('*', 'flow-tracker')

    // Execute complete registration flow
    const registrationResult = await executeCompleteRegistrationFlow({
      email: 'newuser@example.com',
      password: 'SecurePassword123!',
      name: 'New User'
    })

    await messageBus.waitForMessageProcessing(5000)

    // Verify all expected events occurred
    expect(allEvents).toContainEqual(
      expect.objectContaining({ type: 'user.registered' })
    )
    expect(allEvents).toContainEqual(
      expect.objectContaining({ type: 'user.created' })
    )
    expect(allEvents).toContainEqual(
      expect.objectContaining({ type: 'email.sent' })
    )

    framework.assertBoundaryCompliance()
  })
})
```

## Boundary Compliance Testing

### 1. Automated Boundary Analysis

```typescript
describe('Module Boundary Compliance', () => {
  it('should not have any boundary violations', async () => {
    const violations = await analyzeModuleBoundaries()
    
    expect(violations.filter(v => v.severity === 'error')).toHaveLength(0)
    
    if (violations.length > 0) {
      console.log('Boundary analysis results:')
      violations.forEach(violation => {
        console.log(`  ${violation.severity}: ${violation.message}`)
      })
    }
  })

  it('should use facade imports instead of direct file imports', async () => {
    const analyses = await analyzeModule('auth')
    const directImports = analyses
      .flatMap(a => a.violations)
      .filter(v => v.type === 'missing-facade-import')

    // Allow warnings but log recommendations
    if (directImports.length > 0) {
      console.log('Recommendations for facade usage:')
      directImports.forEach(imp => {
        console.log(`  - ${imp.message}`)
      })
    }
  })
})
```

### 2. Real-Time Boundary Monitoring

```typescript
describe('Real-Time Boundary Monitoring', () => {
  it('should detect violations during test execution', async () => {
    const framework = createModuleTestFramework()
    const validator = framework.getBoundaryValidator()

    // Setup monitoring
    validator.startMonitoring()

    // Execute tests that might violate boundaries
    await executeTestThatMightViolateBoundaries()

    // Check for runtime violations
    const runtimeViolations = validator.getRuntimeViolations()
    expect(runtimeViolations).toHaveLength(0)
  })
})
```

## Performance Testing

### 1. Performance Thresholds

```typescript
describe('Performance Testing', () => {
  it('should meet performance thresholds', async () => {
    const framework = createModuleTestFramework()
    
    await framework.setup({
      moduleName: 'performance-test',
      dependencies: ['auth', 'users'],
      clientInterface: 'IPerformanceTest',
      isolationLevel: 'integration',
      mockExternalDependencies: false,
      enableMessageBus: true,
    })

    const startTime = performance.now()

    // Execute performance-sensitive operations
    await executePerformanceSensitiveOperations()

    const duration = performance.now() - startTime
    const results = framework.getTestResults()

    // Verify performance thresholds
    expect(duration).toBeLessThan(5000) // 5 seconds
    expect(results.performance.communicationLatency).toBeLessThan(100) // 100ms
    expect(results.performance.memoryUsage).toBeLessThan(50 * 1024 * 1024) // 50MB
  })
})
```

### 2. Load Testing

```typescript
describe('Load Testing', () => {
  it('should handle multiple concurrent requests', async () => {
    const framework = createModuleTestFramework()
    const messageBus = framework.getMessageBusHelper()!

    // Simulate high load
    const concurrentRequests = 100
    const promises = Array.from({ length: concurrentRequests }, async (_, i) => {
      await messageBus.publishTestMessage('load.test', {
        requestId: i,
        timestamp: new Date(),
      })
    })

    const startTime = performance.now()
    await Promise.all(promises)
    const duration = performance.now() - startTime

    // Verify load handling
    expect(duration).toBeLessThan(10000) // 10 seconds for 100 requests
    
    const stats = messageBus.getMessageStatistics()
    expect(stats.published).toBe(concurrentRequests)
  })
})
```

## Documentation Generation

### 1. Automated API Documentation

```bash
# Generate comprehensive module documentation
bun run docs:generate

# Generated files:
# docs/generated/
# ├── modules/              # Individual module docs
# │   ├── auth.md
# │   ├── users.md
# │   └── posts.md
# ├── architecture-overview.md
# ├── api-reference.md
# ├── dependency-graph.md
# └── testing-guide.md
```

### 2. Test-Driven Documentation

```typescript
describe('Documentation Generation', () => {
  it('should generate accurate API documentation', async () => {
    const generator = new ModuleDocumentationGenerator(
      'src/modules',
      'docs/generated'
    )

    await generator.generateDocumentation()

    // Verify documentation was generated
    const authDocs = await readFile('docs/generated/modules/auth.md', 'utf-8')
    expect(authDocs).toContain('# Auth Module')
    expect(authDocs).toContain('## Client Interface')
    expect(authDocs).toContain('IAuthClient')
  })

  it('should include code examples in documentation', async () => {
    const examples = await extractCodeExamples('src/modules/auth')
    expect(examples.length).toBeGreaterThan(0)
    
    // Verify examples are valid TypeScript
    for (const example of examples) {
      await validateTypeScriptCode(example.code)
    }
  })
})
```

## CI/CD Integration

### 1. NPM Scripts

```json
{
  "scripts": {
    // Testing
    "test": "vitest",
    "test:integration": "vitest run test/integration/",
    "test:boundaries": "vitest run test/integration/module-boundary-compliance.test.ts",
    "test:architecture": "vitest run test/architecture/",
    
    // Boundary Analysis
    "analyze:boundaries": "bun run scripts/analyze-module-boundaries.ts",
    "fix:boundaries": "bun run scripts/fix-module-boundaries.ts",
    "validate:boundaries": "bun run scripts/analyze-module-boundaries.ts && bun run test:architecture",
    
    // Documentation
    "docs:generate": "bun run scripts/generate-module-docs.ts",
    "docs:build": "bun run docs:clean && bun run docs:generate",
    
    // Combined workflows
    "test:full": "bun run test && bun run test:integration && bun run test:boundaries",
    "validate:all": "bun run validate:boundaries && bun run test:full && bun run docs:generate"
  }
}
```

### 2. GitHub Actions Workflow

```yaml
name: Module Testing and Validation

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
        
      - name: Generate types
        run: bun run generate
      
      - name: Run unit tests
        run: bun run test --run
        
      - name: Run integration tests
        run: bun run test:integration
        
      - name: Validate module boundaries
        run: bun run validate:boundaries
        
      - name: Test boundary compliance
        run: bun run test:boundaries
        
      - name: Generate documentation
        run: bun run docs:generate
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### 3. Pre-commit Hooks

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run boundary analysis
bun run analyze:boundaries

# Run quick test suite
bun run test --run --bail

# Validate architectural compliance
bun run test:architecture
```

## Best Practices

### 1. Module Testing Guidelines

#### ✅ Do
- Test through client interfaces, not direct imports
- Use the message bus for inter-module communication
- Mock external dependencies appropriately
- Validate boundary compliance in every test
- Include performance assertions in integration tests

#### ❌ Don't
- Import internal module files directly in tests
- Test modules in ways that violate architectural boundaries
- Skip boundary compliance validation
- Ignore performance thresholds
- Mix testing concerns (unit/integration/e2e)

### 2. Test Organization

```typescript
// Good: Clear separation of concerns
describe('Auth Module', () => {
  describe('Unit Tests', () => {
    // Service method tests
    // Input validation tests
    // Error handling tests
  })

  describe('Integration Tests', () => {
    // Client interface tests
    // Message bus communication tests
    // Cross-module interaction tests
  })

  describe('Boundary Compliance', () => {
    // Import validation tests
    // Facade usage tests
    // Dependency compliance tests
  })
})
```

### 3. Test Data Management

```typescript
// Use factories for consistent test data
const createTestUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  ...overrides,
})

// Use builders for complex scenarios
const TestScenarioBuilder = {
  userRegistration: () => ({
    input: createTestUser(),
    expectedEvents: ['user.registered', 'user.created'],
    expectedDbState: { users: 1, refreshTokens: 1 },
  }),
}
```

### 4. Error Testing

```typescript
describe('Error Scenarios', () => {
  it('should handle module communication failures gracefully', async () => {
    const framework = createModuleTestFramework()
    const messageBus = framework.getMessageBusHelper()!

    // Simulate message bus failure
    messageBus.simulateFailure('connection-lost')

    // Verify graceful degradation
    const result = await executeOperationThatUsesMessageBus()
    expect(result.success).toBe(false)
    expect(result.error).toContain('communication failure')
  })

  it('should maintain boundary compliance during error conditions', async () => {
    // Test that error conditions don't cause boundary violations
    await testErrorConditionsWithBoundaryValidation()
  })
})
```

### 5. Continuous Improvement

#### Metrics to Track
- **Boundary Violations**: Should trend towards zero
- **Test Coverage**: Should meet module-specific thresholds
- **Performance Metrics**: Should stay within defined limits
- **Module Coupling**: Should remain minimal

#### Regular Reviews
- Weekly boundary analysis reports
- Monthly architecture compliance reviews
- Quarterly testing strategy evaluations
- Annual framework improvements

## Conclusion

This comprehensive testing approach ensures:

1. **Architectural Integrity**: Automated boundary enforcement
2. **Module Quality**: Comprehensive testing at all levels
3. **Performance Assurance**: Real-time monitoring and thresholds
4. **Documentation Accuracy**: Test-driven documentation generation
5. **CI/CD Integration**: Seamless automation and reporting

The testing framework grows with the architecture, providing continuous validation and improvement of the modular monolith design. 