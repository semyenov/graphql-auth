/**
 * Users Module Client Interface
 * Following modular monolith pattern - defines the public API for inter-module communication
 *
 * This interface represents what other modules can do with the Users module.
 * It's the only entry point other modules should use to interact with user functionality.
 */

// Input/Output types for the client interface
export interface UserData {
  id: number
  email: string
  name: string | null
  role: string
  emailVerified: boolean
  emailVerifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserProfileData extends UserData {
  bio?: string
  avatar?: string
  location?: string
  website?: string
  postCount: number
  publishedPostCount: number
  followerCount: number
  followingCount: number
}

export interface UserCreateRequest {
  email: string
  name?: string
  role?: string
}

export interface UserUpdateRequest {
  name?: string
  bio?: string
  avatar?: string
  location?: string
  website?: string
}

export interface UserSearchCriteria {
  query?: string
  role?: string
  emailVerified?: boolean
  createdAfter?: Date
  createdBefore?: Date
}

export interface UserOrderBy {
  field: 'createdAt' | 'updatedAt' | 'name' | 'email' | 'postCount'
  direction: 'asc' | 'desc'
}

export interface PaginationOptions {
  skip?: number
  take?: number
  cursor?: string
}

export interface UsersResponse {
  users: UserData[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
}

export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
}

export interface UserActivity {
  userId: number
  type: 'login' | 'post_created' | 'post_published' | 'profile_updated'
  metadata: Record<string, unknown>
  timestamp: Date
}

/**
 * Users Module Client Interface
 *
 * This interface defines all operations that other modules can perform
 * on the Users module. It acts as a contract and abstraction layer.
 */
export interface IUsersClient {
  // User CRUD operations
  createUser(request: UserCreateRequest): Promise<UserData>
  getUserById(userId: number): Promise<UserData | null>
  getUserByEmail(email: string): Promise<UserData | null>
  updateUser(userId: number, request: UserUpdateRequest): Promise<UserData>
  deleteUser(userId: number): Promise<boolean>

  // User profile operations
  getUserProfile(userId: number): Promise<UserProfileData | null>
  updateUserProfile(
    userId: number,
    request: UserUpdateRequest,
  ): Promise<UserProfileData>

  // User search and listing
  searchUsers(
    criteria: UserSearchCriteria,
    pagination?: PaginationOptions,
  ): Promise<UsersResponse>
  getAllUsers(
    pagination?: PaginationOptions,
    orderBy?: UserOrderBy,
  ): Promise<UsersResponse>
  getUsersByRole(
    role: string,
    pagination?: PaginationOptions,
  ): Promise<UsersResponse>
  getActiveUsers(pagination?: PaginationOptions): Promise<UsersResponse>

  // User validation and permissions
  validateUserExists(userId: number): Promise<boolean>
  validateUserEmail(email: string): Promise<boolean>
  checkUserPermission(userId: number, permission: string): Promise<boolean>
  checkUserRole(userId: number, requiredRole: string): Promise<boolean>

  // User statistics and analytics
  getUserStatistics(): Promise<UserStatistics>
  getUserActivity(userId: number, limit?: number): Promise<UserActivity[]>
  getTopActiveUsers(
    timeframe: 'day' | 'week' | 'month',
    limit?: number,
  ): Promise<UserData[]>

  // User relationships (if applicable)
  followUser(followerId: number, followeeId: number): Promise<boolean>
  unfollowUser(followerId: number, followeeId: number): Promise<boolean>
  getFollowers(
    userId: number,
    pagination?: PaginationOptions,
  ): Promise<UsersResponse>
  getFollowing(
    userId: number,
    pagination?: PaginationOptions,
  ): Promise<UsersResponse>
  isFollowing(followerId: number, followeeId: number): Promise<boolean>

  // User moderation
  suspendUser(
    userId: number,
    reason: string,
    moderatorId: number,
  ): Promise<boolean>
  unsuspendUser(userId: number, moderatorId: number): Promise<boolean>
  banUser(userId: number, reason: string, moderatorId: number): Promise<boolean>
  unbanUser(userId: number, moderatorId: number): Promise<boolean>

  // User content aggregation
  getUserPostCount(userId: number): Promise<number>
  getUserPublishedPostCount(userId: number): Promise<number>
  getUserDraftCount(userId: number): Promise<number>
  getUserTotalViews(userId: number): Promise<number>
}

/**
 * Users Module Events
 *
 * Events that the Users module can publish for other modules to subscribe to.
 * This enables loose coupling between modules.
 */
export interface UsersModuleEvents {
  'user.created': {
    userId: number
    email: string
    name: string | null
    role: string
    timestamp: Date
  }
  'user.updated': {
    userId: number
    changes: string[]
    timestamp: Date
  }
  'user.deleted': {
    userId: number
    email: string
    deletedBy: number
    timestamp: Date
  }
  'user.profile.updated': {
    userId: number
    changes: string[]
    timestamp: Date
  }
  'user.followed': {
    followerId: number
    followeeId: number
    timestamp: Date
  }
  'user.unfollowed': {
    followerId: number
    followeeId: number
    timestamp: Date
  }
  'user.suspended': {
    userId: number
    reason: string
    moderatorId: number
    timestamp: Date
  }
  'user.unsuspended': {
    userId: number
    moderatorId: number
    timestamp: Date
  }
  'user.activity': {
    userId: number
    activityType: string
    metadata: Record<string, unknown>
    timestamp: Date
  }
}

/**
 * Error types that the Users module can return
 */
export class UsersClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'UsersClientError'
  }
}

export class UserNotFoundError extends UsersClientError {
  constructor(identifier: string | number) {
    super(`User with identifier ${identifier} not found`, 'USER_NOT_FOUND', 404)
  }
}

export class UserPermissionError extends UsersClientError {
  constructor(message = 'Insufficient permissions for this user operation') {
    super(message, 'USER_PERMISSION_DENIED', 403)
  }
}

export class UserValidationError extends UsersClientError {
  constructor(
    message: string,
    public readonly errors: string[],
  ) {
    super(message, 'USER_VALIDATION_ERROR', 422)
  }
}

export class UserConflictError extends UsersClientError {
  constructor(message: string) {
    super(message, 'USER_CONFLICT', 409)
  }
}
