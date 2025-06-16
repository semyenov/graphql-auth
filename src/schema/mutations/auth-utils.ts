import bcrypt from 'bcryptjs'
import { AUTH, ERROR_MESSAGES } from '../../constants'
import { AuthenticationError, ConflictError } from '../../errors'
import { prisma } from '../../prisma'
import { signToken } from '../../utils/jwt'

/**
 * User creation data after validation
 */
export interface UserCreationData {
  email: string
  password: string
  name?: string | null
}

/**
 * Authentication result containing the JWT token
 */
export interface AuthenticationResult {
  token: string
}

/**
 * Checks if a user with the given email already exists
 * 
 * @param email - The email address to check
 * @returns True if user exists, false otherwise
 */
export async function checkUserExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
  return !!user
}

/**
 * Hashes a password using bcrypt
 * 
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, AUTH.BCRYPT_ROUNDS)
}

/**
 * Verifies a password against a hash
 * 
 * @param password - The plain text password
 * @param hash - The hashed password to compare against
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Creates a new user with the provided data
 * 
 * @param data - The validated user creation data
 * @returns The created user with JWT token
 * @throws ConflictError if email already exists
 */
export async function createUser(data: UserCreationData): Promise<string> {
  // Check if user already exists
  if (await checkUserExists(data.email)) {
    throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
  }

  // Hash the password
  const hashedPassword = await hashPassword(data.password)

  // Create the user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
    select: {
      id: true,
      email: true,
    },
  })

  // Generate and return JWT token
  return signToken({
    userId: user.id,
    email: user.email,
  })
}

/**
 * Authenticates a user with email and password
 * 
 * @param email - The user's email
 * @param password - The user's password
 * @returns JWT token if authentication successful
 * @throws AuthenticationError if credentials are invalid
 */
export async function authenticateUser(email: string, password: string): Promise<string> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  })

  if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password)

  if (!isValidPassword) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
  }

  // Generate and return JWT token
  return signToken({
    userId: user.id,
    email: user.email,
  })
}

/**
 * Finds a user by their ID
 * 
 * @param userId - The user's ID
 * @returns The user data or null if not found
 */
export async function findUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          viewCount: true,
        },
      },
    },
  })
}