# Automated Migration Tools

This document describes the automated tools and scripts available for migrating to a modular monolith architecture.

## Overview

The migration to a modular monolith involves several repetitive tasks that can be automated:

1. **Boundary Analysis**: Detecting module boundary violations
2. **File Migration**: Moving files to appropriate module directories
3. **Import Path Updates**: Updating import statements after file moves
4. **Module Template Generation**: Creating standard module structures
5. **Dependency Validation**: Ensuring proper dependency declarations

## Available Tools

### 1. Module Boundary Analyzer

**File**: `scripts/analyze-module-boundaries.ts`

Analyzes the codebase to detect module boundary violations and generates detailed reports.

#### Usage

```bash
# Analyze all modules
npm run analyze:boundaries

# Analyze specific module
npm run analyze:boundaries -- --module=auth

# Generate markdown report
npm run analyze:boundaries -- --output=markdown
```

#### Violation Types Detected

- **Direct Service Import**: Importing services directly instead of through client interfaces
- **Direct Repository Import**: Accessing repositories from other modules
- **Direct Utils Import**: Using utilities without copying to module scope
- **Cross-Module Internal**: Accessing internal files from other modules
- **Missing Facade Import**: Not using module facades for public access

#### Sample Output

```
Module Boundary Analysis Report
Generated: 2024-01-15 10:30:00

Summary:
- Total files analyzed: 127
- Violations found: 8
- Clean files: 119

Violations by Type:
- cross-module-internal: 5
- direct-service-import: 2
- missing-facade-import: 1

Violations by Module:
- auth: 3 violations
- posts: 2 violations
- users: 3 violations
```

### 2. Automated Boundary Fixer

**File**: `scripts/fix-module-boundaries.ts`

Automatically fixes simple boundary violations where possible.

#### Usage

```bash
# Fix all violations
npm run fix:boundaries

# Dry run (show what would be fixed)
npm run fix:boundaries -- --dry-run

# Fix specific module
npm run fix:boundaries -- --module=auth
```

#### Auto-Fixable Violations

- Simple import path updates
- Adding missing facade imports
- Converting direct type imports to module imports

#### Manual Intervention Required

- Complex service dependencies
- Database access patterns
- Business logic reorganization

### 3. Module Generator

**File**: `scripts/generate-module.ts`

Generates complete module structure with all necessary files and boilerplate.

#### Usage

```bash
# Generate new module
npm run generate:module -- --name=notifications

# Generate with specific features
npm run generate:module -- --name=payments --features=resolver,service,repository

# Generate from template
npm run generate:module -- --name=analytics --template=domain-module
```

#### Generated Structure

```
src/modules/notifications/
├── notifications.module.ts
├── client/
│   └── notifications.client.interface.ts
├── services/
│   ├── notification.service.ts
│   └── notification.service.interface.ts
├── repositories/
│   ├── notification.repository.ts
│   └── notification.repository.interface.ts
├── types/
│   └── notification.types.ts
├── tests/
│   └── notifications.integration.test.ts
├── constants.ts
└── dependencies.json
```

### 4. Import Path Updater

**File**: `scripts/update-imports.ts`

Updates import paths after files are moved to new module locations.

#### Usage

```bash
# Update all import paths
npm run update:imports

# Update specific file patterns
npm run update:imports -- --pattern="src/auth/**/*.ts"

# Preview changes without applying
npm run update:imports -- --dry-run
```

#### Transformation Examples

```typescript
// Before
import { PasswordService } from '@/services/auth/password.service'
import { AuthTypes } from '@/types/auth.types'

// After
import { IPasswordService } from '@/modules/auth/services/password.service'
import { AuthTypes } from '@/modules/auth/types/auth.types'
```

### 5. Dependency Validator

**File**: `scripts/validate-dependencies.ts`

Validates that all module dependencies are properly declared and that no circular dependencies exist.

#### Usage

```bash
# Validate all dependencies
npm run validate:dependencies

# Check for circular dependencies
npm run validate:dependencies -- --check-circular

# Generate dependency graph
npm run validate:dependencies -- --graph
```

#### Validation Checks

- All external dependencies declared in dependencies.json
- No undeclared internal dependencies
- No circular dependencies between modules
- Proper dependency hierarchy

### 6. Migration Assistant

**File**: `scripts/migration-assistant.ts`

Interactive tool that guides through the migration process step by step.

#### Usage

```bash
# Start migration wizard
npm run migrate:wizard

# Resume previous migration
npm run migrate:resume

# Check migration status
npm run migrate:status
```

#### Migration Steps

1. **Assessment**: Analyze current state
2. **Planning**: Create migration plan
3. **Execution**: Execute migration steps
4. **Validation**: Verify migration success
5. **Cleanup**: Remove obsolete code

## Configuration

### Tool Configuration File

**File**: `migration.config.js`

```javascript
module.exports = {
  // Source directory
  sourceDir: 'src',
  
  // Module directory
  moduleDir: 'src/modules',
  
  // Boundary analysis settings
  boundaryAnalysis: {
    ignorePatterns: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/test/**'
    ],
    violationThreshold: 0, // Fail if any violations found
    reportFormat: 'console' // 'console' | 'markdown' | 'json'
  },
  
  // Module generation settings
  moduleGeneration: {
    templates: {
      'domain-module': 'templates/domain-module',
      'infrastructure-module': 'templates/infrastructure-module'
    },
    defaultTemplate: 'domain-module'
  },
  
  // Import update settings
  importUpdates: {
    preserveComments: true,
    updateRelativePaths: true,
    addModuleAliases: true
  }
}
```

## Integration with CI/CD

### GitHub Actions Workflow

**File**: `.github/workflows/module-boundaries.yml`

```yaml
name: Module Boundary Validation

on:
  pull_request:
    paths:
      - 'src/**'

jobs:
  validate-boundaries:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Analyze module boundaries
        run: npm run analyze:boundaries
        
      - name: Validate dependencies
        run: npm run validate:dependencies
        
      - name: Run architecture tests
        run: npm run test:architecture
```

### Pre-commit Hooks

**File**: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate module boundaries before commit
npm run validate:boundaries

# Run architecture tests
npm run test:architecture

# Ensure no boundary violations
npm run analyze:boundaries -- --fail-on-violations
```

## Usage Examples

### Complete Module Migration

```bash
# Step 1: Create new module structure
npm run generate:module -- --name=payments

# Step 2: Move existing files
mv src/services/payment/* src/modules/payments/services/
mv src/types/payment.types.ts src/modules/payments/types/

# Step 3: Update import paths
npm run update:imports -- --pattern="src/modules/payments/**/*.ts"

# Step 4: Analyze boundaries
npm run analyze:boundaries -- --module=payments

# Step 5: Fix violations
npm run fix:boundaries -- --module=payments

# Step 6: Validate dependencies
npm run validate:dependencies -- --module=payments
```

### Gradual Migration Strategy

```bash
# Week 1: Migrate shared module
npm run migrate:module -- --name=shared --priority=high

# Week 2: Migrate auth module
npm run migrate:module -- --name=auth --depends-on=shared

# Week 3: Migrate posts module
npm run migrate:module -- --name=posts --depends-on=auth,shared

# Week 4: Final validation
npm run validate:complete-migration
```

### Quality Assurance

```bash
# Check migration progress
npm run migrate:progress

# Validate all boundaries
npm run validate:boundaries -- --strict

# Generate migration report
npm run migrate:report -- --format=markdown

# Test module isolation
npm run test:module-isolation
```

## Troubleshooting

### Common Issues

#### 1. Import Resolution Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Regenerate type definitions
npm run generate

# Update import paths
npm run update:imports
```

#### 2. Circular Dependency Errors

```bash
# Analyze dependency graph
npm run validate:dependencies -- --graph

# Find circular dependencies
npm run validate:dependencies -- --check-circular --verbose

# Suggest fixes
npm run fix:circular-dependencies
```

#### 3. Test Failures After Migration

```bash
# Update test imports
npm run update:test-imports

# Regenerate test fixtures
npm run test:regenerate-fixtures

# Run module-specific tests
npm run test:module -- --module=auth
```

## Advanced Features

### Custom Violation Rules

```typescript
// scripts/custom-rules.ts
export const customRules: BoundaryRule[] = [
  {
    name: 'no-direct-database-access',
    pattern: /import.*prisma.*from '@\/(?!modules\/shared\/database)/,
    message: 'Database access must go through shared module'
  },
  
  {
    name: 'require-client-interface',
    pattern: /import.*from '@\/modules\/(?!shared).*(?<!client\.interface)'/,
    message: 'Must use client interfaces for inter-module communication'
  }
]
```

### Migration Metrics

```bash
# Track migration progress
npm run metrics:migration-progress

# Measure code quality improvements
npm run metrics:quality-score

# Generate migration timeline
npm run metrics:timeline
```

## Conclusion

These automated tools significantly reduce the manual effort required for migrating to a modular monolith architecture. They provide:

1. **Consistency**: Ensure all modules follow the same patterns
2. **Quality**: Automatically detect and fix violations
3. **Speed**: Accelerate the migration process
4. **Confidence**: Validate that migration preserves functionality

The tools are designed to work together as part of a comprehensive migration strategy, enabling teams to transform their codebase systematically and safely. 