# DDD Migration Guide

## Overview

This guide provides a step-by-step approach for migrating existing codebases to the Domain-Driven Design (DDD) architecture demonstrated in this project. The migration can be done incrementally without disrupting existing functionality.

## 🎯 Migration Strategy

### Phase 1: Preparation and Planning
### Phase 2: Shared Kernel Implementation  
### Phase 3: Module-by-Module Migration
### Phase 4: Integration and Optimization
### Phase 5: Legacy Code Removal

---

## Phase 1: Preparation and Planning

### 1.1 Analyze Current Architecture

**Identify Bounded Contexts:**
```bash
# Create a domain map of your current system
# Example domains in this project:
- Authentication & Authorization (Auth)
- Content Management (Posts) 
- User Profile Management (Users)
```

**Document Current Dependencies:**
```typescript
// Map current service dependencies
// Example dependency graph:
UserService → AuthService → DatabaseService
PostService → UserService → ValidationService
```

**Assess Technical Debt:**
- Identify tightly coupled components
- Find business logic scattered across layers
- Document existing test coverage
- Map current data flow patterns

### 1.2 Create Migration Plan

**Timeline:** 3-6 months depending on codebase size

**Resource Allocation:**
- 1-2 senior developers for architecture design
- 2-4 developers for implementation
- 1 QA engineer for testing strategy

**Risk Mitigation:**
- Feature flags for gradual rollout
- Comprehensive testing at each phase
- Rollback procedures for each module

---

## Phase 2: Shared Kernel Implementation

### 2.1 Create Base Infrastructure

```bash
mkdir -p src/shared/{domain,application,infrastructure}
mkdir -p src/shared/domain/{base-classes,interfaces}
mkdir -p src/shared/application/interfaces
```

**Base Classes:**
```typescript
// src/shared/domain/base-classes/entity.base.ts
export abstract class Entity<T> {
  protected readonly _id: T;
  
  constructor(id: T) {
    this._id = id;
  }
  
  get id(): T {
    return this._id;
  }
  
  equals(entity?: Entity<T>): boolean {
    if (!entity || !(entity instanceof Entity)) {
      return false;
    }
    return this._id === entity._id;
  }
}
```

```typescript
// src/shared/domain/base-classes/value-object.base.ts
export abstract class ValueObject<T> {
  protected readonly props: T;
  
  constructor(props: T) {
    this.props = Object.freeze(props);
  }
  
  equals(vo?: ValueObject<T>): boolean {
    if (!vo || vo.constructor !== this.constructor) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
```

**Interfaces:**
```typescript
// src/shared/application/interfaces/use-case.interface.ts
export interface IUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

// src/shared/domain/interfaces/repository.interface.ts
export interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}
```

### 2.2 Set Up Module Infrastructure

```typescript
// src/shared/application/interfaces/module.interface.ts
export interface Module {
  getName(): string;
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
}

// src/shared/domain/base-classes/module.base.ts (for legacy modules)
export abstract class BaseModule {
  protected container: DependencyContainer;
  
  constructor() {
    this.container = container;
  }
  
  abstract register(): void;
}
```

### 2.3 Error Handling Foundation

```typescript
// src/shared/domain/errors/base.error.ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// src/shared/application/errors/application.error.ts
export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

export class NotFoundError extends BaseError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
}
```

---

## Phase 3: Module-by-Module Migration

### 3.1 Choose First Module

**Recommendation:** Start with the most isolated module with clear boundaries.

**Example: Users Module Migration**

#### Step 1: Create Module Structure
```bash
mkdir -p src/modules/users/{domain,application,infrastructure,presentation}
mkdir -p src/modules/users/domain/{entities,value-objects,repositories,services,errors}
mkdir -p src/modules/users/application/{use-cases,dto}
mkdir -p src/modules/users/infrastructure/{repositories,persistence}
mkdir -p src/modules/users/presentation/resolvers
```

#### Step 2: Extract Domain Model
```typescript
// Before: Service-heavy approach
class UserService {
  async updateProfile(userId: string, data: UpdateProfileData) {
    // Business logic mixed with infrastructure
    if (!data.name || data.name.length > 100) {
      throw new Error('Invalid name');
    }
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.name = data.name;
    return await this.userRepository.save(user);
  }
}

// After: Domain-driven approach
// Domain Entity
export class UserProfile extends Entity<UserId> {
  private props: UserProfileProps;
  
  updateName(name: string): void {
    if (!name || name.length > 100) {
      throw new InvalidUserDataError('name', 'Name cannot exceed 100 characters');
    }
    this.props.name = name;
    this.props.updatedAt = new Date();
  }
  
  canBeEditedBy(editorId: UserId): boolean {
    return this.id.equals(editorId);
  }
}

// Use Case
@injectable()
export class UpdateUserProfileUseCase implements IUseCase<UpdateProfileRequest, UserProfileDto> {
  constructor(
    @inject('IUserProfileRepository')
    private readonly userRepository: PrismaUserProfileRepository
  ) {}
  
  async execute(request: UpdateProfileRequest): Promise<UserProfileDto> {
    const userId = UserId.fromString(request.userId);
    const editorId = UserId.fromString(request.editorId);
    
    const userProfile = await this.userRepository.findById(userId);
    if (!userProfile) {
      throw new UserNotFoundError(request.userId);
    }
    
    if (!userProfile.canBeEditedBy(editorId)) {
      throw new AuthorizationError('Cannot edit this profile');
    }
    
    userProfile.updateName(request.name);
    
    const updated = await this.userRepository.update(userProfile);
    return UserProfileMapper.toDto(updated);
  }
}
```

#### Step 3: Implement Repository Pattern
```typescript
// Domain Repository Interface
export interface IUserProfileRepository extends IRepository<UserProfile, UserId> {
  findByEmail(email: Email): Promise<UserProfile | null>;
  findPublicProfiles(limit?: number): Promise<UserProfile[]>;
}

// Infrastructure Implementation
@injectable()
export class PrismaUserProfileRepository implements IUserProfileRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}
  
  async findById(id: UserId): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.value },
    });
    return user ? UserProfileMapper.toDomain(user) : null;
  }
  
  async save(userProfile: UserProfile): Promise<UserProfile> {
    const data = UserProfileMapper.toPersistence(userProfile);
    
    if (userProfile.id.isTransient()) {
      const created = await this.prisma.user.create({ data });
      return UserProfileMapper.toDomain(created);
    }
    
    const updated = await this.prisma.user.update({
      where: { id: userProfile.id.value },
      data,
    });
    return UserProfileMapper.toDomain(updated);
  }
}
```

#### Step 4: Create Presentation Layer
```typescript
// GraphQL Resolver
builder.queryField('userProfile', (t) =>
  t.field({
    type: UserProfile,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, context) => {
      try {
        const useCase = container.resolve(GetUserProfileUseCase);
        const viewerId = context.user?.id || null;
        
        return await useCase.execute({
          userId: args.id,
          viewerId,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  })
);
```

#### Step 5: Set Up Module Registration
```typescript
// src/modules/users/users.module.ts
export class UsersModule implements Module {
  getName(): string {
    return 'UsersModule';
  }

  async initialize(): Promise<void> {
    container.registerSingleton('IUserProfileRepository', PrismaUserProfileRepository);
    container.registerSingleton(GetUserProfileUseCase);
    container.registerSingleton(UpdateUserProfileUseCase);
    
    console.log('✅ Users module initialized');
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Users module cleaned up');
  }
}
```

---

## 📊 Success Metrics

### Technical Metrics

**Code Quality:**
- Cyclomatic complexity reduction
- Dependency coupling metrics
- Test coverage increase
- Technical debt reduction

**Performance:**
- Response time improvements
- Memory usage optimization
- Database query efficiency
- Concurrent request handling

**Maintainability:**
- Time to implement new features
- Bug fix turnaround time
- Onboarding time for new developers
- Code review efficiency

### Business Metrics

**Development Velocity:**
- Feature delivery speed
- Defect rate reduction
- Development team satisfaction
- Time to market for new features

**System Reliability:**
- Uptime improvements
- Error rate reduction
- Recovery time from failures
- System scalability

---

This migration guide provides a comprehensive roadmap for teams looking to adopt Domain-Driven Design principles. Remember that DDD is not just about code structure—it's about understanding and modeling your business domain effectively.