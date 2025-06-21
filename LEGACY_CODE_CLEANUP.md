# Legacy Code Cleanup Plan

## Overview

This document outlines the plan to remove legacy code identified through coverage analysis. The goal is to eliminate unused code, reduce maintenance burden, and improve code clarity while maintaining existing functionality.

## Analysis Summary

Based on `bun test --coverage` results, several files have very low coverage indicating unused or legacy code:

- `src/graphql/schema/utils/filter-transform.ts` (4.29% coverage)
- `test/utils/helpers/subscription.helpers.ts` (4.41% coverage)
- `src/app/errors/handlers.ts` (8.28% coverage)
- `src/utils/jwt.ts` (21.21% coverage)
- `src/utils/logger.ts` (20% function coverage)
- `src/app/services/email.service.ts` (2.87% coverage)

## High Priority - Remove Completely

### 1. Delete `src/graphql/schema/utils/filter-transform.ts`

**Reason**: Only 4.29% coverage, complex unused filter transformations

**Impact**: 
- Remove from `src/modules/users/resolvers/users.resolver.ts` imports
- Replace with simple inline filter logic
- Remove unused `transformPostWhereInput` and `transformOrderBy` functions

**Steps**:
1. Remove file completely
2. Update users resolver to use simple inline filtering
3. Remove import references

### 2. Delete `test/utils/helpers/subscription.helpers.ts`

**Reason**: 4.41% coverage, duplicated subscription utilities not in use

**Impact**: 
- Project doesn't implement GraphQL subscriptions
- Duplicates functionality in `test/subscription-utils.ts`

**Steps**:
1. Verify no imports reference this file
2. Delete file completely
3. Keep `test/subscription-utils.ts` for future subscription implementation

### 3. Delete `src/utils/logger.ts`

**Reason**: 20% function coverage, superseded by proper DI logger

**Impact**:
- Application uses proper Logger service via dependency injection
- Simple console logger is no longer needed

**Steps**:
1. Check for any remaining imports
2. Replace any usage with `ILogger` from DI container
3. Delete file completely

## Medium Priority - Simplify and Refactor

### 4. Simplify `src/app/errors/handlers.ts`

**Reason**: 8.28% coverage, many unused specialized handlers

**Current State**:
- Only `normalizeError` is actively used
- `handleGraphQLError`, `handleAuthError`, `handleDatabaseError`, `handleRateLimitError` are unused
- Complex error handling logic is duplicated

**Refactoring Plan**:
1. Keep only `normalizeError`, `isBaseError`, `hasErrorCode`
2. Remove unused handler functions
3. Move specialized error handling inline where needed
4. Update exports in `src/app/errors/index.ts`

### 5. Simplify `src/utils/jwt.ts`

**Reason**: 21.21% coverage, partially superseded by TokenService

**Current State**:
- Core functions `signToken`, `verifyToken`, `extractBearerToken` are used
- `decodeToken`, `isTokenExpired`, `getUserIdFromAuthHeader` are unused
- Some functionality duplicated in TokenService

**Refactoring Plan**:
1. Keep only actively used functions
2. Remove unused utility functions
3. Consider moving remaining functions to TokenService
4. Update imports in dependent files

### 6. Simplify `src/app/services/email.service.ts`

**Reason**: 2.87% coverage, mock service with unused functionality

**Current State**:
- Used only in tests as mock
- Complex email templates unused in development
- Most implementation not tested

**Refactoring Plan**:
1. Simplify to basic interface and mock implementation
2. Remove complex HTML email templates (move to production implementation later)
3. Focus on test coverage for essential functionality
4. Consider moving to dedicated test utilities

## Low Priority - Code Quality Improvements

### 7. Review Other Low Coverage Files

Files with coverage between 30-60% that may need attention:

- `src/modules/shared/pagination/pagination.utils.ts` (45.96% coverage)
- `src/modules/posts/resolvers/posts.resolver.ts` (65.65% coverage)
- `src/modules/users/resolvers/users.resolver.ts` (57.23% coverage)

**Plan**: Review after high/medium priority cleanup to identify additional unused code.

## Implementation Timeline

### Phase 1 (Week 1): High Priority Removals
- [ ] Delete `filter-transform.ts` and update users resolver
- [ ] Delete `subscription.helpers.ts`
- [ ] Delete `logger.ts` and verify no dependencies

### Phase 2 (Week 2): Error Handler Simplification
- [ ] Refactor `errors/handlers.ts`
- [ ] Update error handling across codebase
- [ ] Ensure test coverage maintained

### Phase 3 (Week 3): JWT and Email Service Cleanup
- [ ] Simplify `jwt.ts`
- [ ] Simplify `email.service.ts`
- [ ] Update dependent code

### Phase 4 (Week 4): Validation and Optimization
- [ ] Run full test suite
- [ ] Verify coverage improvements
- [ ] Review remaining low-coverage files

## Testing Strategy

### Before Each Change:
1. Run `bun test --coverage` to establish baseline
2. Identify all files importing the target file
3. Run affected tests to ensure functionality

### After Each Change:
1. Run full test suite: `bun test`
2. Verify coverage improvement: `bun test --coverage`
3. Check for any broken imports or dependencies
4. Test affected GraphQL operations

### Success Criteria:
- Overall test coverage maintained or improved
- All existing tests continue to pass
- No broken imports or missing dependencies
- Reduced file count and LOC metrics

## Risk Mitigation

### Backup Strategy:
- Create feature branch for each cleanup phase
- Commit changes incrementally
- Keep detailed changelog of removed functionality

### Rollback Plan:
- Tag current state before starting cleanup
- Document any removed functionality that might be needed later
- Maintain git history for easy restoration if needed

### Communication:
- Update team on progress weekly
- Flag any unexpected dependencies discovered
- Document any breaking changes in CHANGELOG.md

## Post-Cleanup Monitoring

### Metrics to Track:
- Test coverage percentage improvement
- Build time reduction
- Bundle size reduction
- Number of files and LOC reduction

### Follow-up Actions:
- Update CI/CD to prevent similar legacy code accumulation
- Add coverage thresholds to prevent regression
- Schedule quarterly code cleanup reviews
- Update development guidelines to prevent unused code