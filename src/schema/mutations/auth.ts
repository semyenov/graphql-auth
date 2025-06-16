import bcrypt from 'bcryptjs'
import { AUTH, ERROR_MESSAGES } from '../../constants'
import { AuthenticationError, ConflictError, normalizeError } from '../../errors'
import { prisma } from '../../prisma'
import { signToken } from '../../utils/jwt'
import { loginSchema, signupSchema, validateInput } from '../../utils/validation'
import { builder } from '../builder'

/**
 * User signup mutation
 * Creates a new user account with hashed password
 */
builder.mutationField('signup', (t) =>
    t.field({
        type: 'String',
        description: 'Create a new user account and return JWT token',
        args: {
            name: t.arg.string({
                description: 'Optional display name for the user',
            }),
            email: t.arg.string({
                required: true,
                description: 'Unique email address for the account',
            }),
            password: t.arg.string({
                required: true,
                description: 'Password for the account (min 8 characters)',
            }),
        },
        resolve: async (_parent, args) => {
            try {
                // Validate input
                const validatedData = validateInput(signupSchema, args)

                // Check if user already exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: validatedData.email },
                    select: { id: true },
                })

                if (existingUser) {
                    throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(
                    validatedData.password,
                    AUTH.BCRYPT_ROUNDS
                )

                // Create user
                const user = await prisma.user.create({
                    data: {
                        name: validatedData.name,
                        email: validatedData.email,
                        password: hashedPassword,
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
            } catch (error) {
                throw normalizeError(error)
            }
        },
    })
)

/**
 * User login mutation
 * Authenticates user and returns JWT token
 */
builder.mutationField('login', (t) =>
    t.field({
        type: 'String',
        description: 'Authenticate user and return JWT token',
        args: {
            email: t.arg.string({
                required: true,
                description: 'Email address of the account',
            }),
            password: t.arg.string({
                required: true,
                description: 'Account password',
            }),
        },
        resolve: async (_parent, args) => {
            try {
                // Validate input
                const validatedData = validateInput(loginSchema, args)

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: { email: validatedData.email },
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
                const isValidPassword = await bcrypt.compare(
                    validatedData.password,
                    user.password
                )

                if (!isValidPassword) {
                    throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS)
                }

                // Generate and return JWT token
                return signToken({
                    userId: user.id,
                    email: user.email,
                })
            } catch (error) {
                throw normalizeError(error)
            }
        },
    })
)