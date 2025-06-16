import { normalizeError } from '../../errors'
import { loginSchema, signupSchema, validateInput } from '../../utils/validation'
import { builder } from '../builder'
import { authenticateUser, createUser } from './auth-utils'

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

                // Create user and return JWT token
                return await createUser(validatedData)
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

                // Authenticate user and return JWT token
                return await authenticateUser(
                    validatedData.email,
                    validatedData.password
                )
            } catch (error) {
                throw normalizeError(error)
            }
        },
    })
)