/**
 * Validation Rules
 *
 * Reusable validation rules and rule builders
 */

import { z } from 'zod'
import * as sanitizers from './sanitizers'
import * as validators from './validators'

/**
 * Common validation rules
 */
export const rules = {
  // String rules
  requiredString: (fieldName: string, minLength = 1, maxLength = 255) =>
    z
      .string()
      .min(minLength, `${fieldName} must be at least ${minLength} characters`)
      .max(maxLength, `${fieldName} must be less than ${maxLength} characters`)
      .transform(sanitizers.sanitizeText),

  optionalString: (maxLength = 255) =>
    z
      .string()
      .max(maxLength, `Must be less than ${maxLength} characters`)
      .transform(sanitizers.sanitizeText)
      .optional(),

  // Email rule
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .transform(sanitizers.sanitizeEmail),

  // Password rules
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .refine(validators.isStrongPassword, {
      message: 'Password must contain uppercase, lowercase, number',
    }),

  // Username rule
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .transform(sanitizers.sanitizeUsername)
    .refine(validators.isValidUsername, {
      message:
        'Username can only contain letters, numbers, underscores, and hyphens',
    }),

  // URL rule
  url: z
    .string()
    .transform(sanitizers.sanitizeUrl)
    .refine(validators.isValidUrl, {
      message: 'Please enter a valid URL',
    }),

  // Phone number rule
  phoneNumber: z
    .string()
    .transform(sanitizers.sanitizePhoneNumber)
    .refine(validators.isValidPhoneNumber, {
      message: 'Please enter a valid phone number',
    }),

  // Slug rule
  slug: z
    .string()
    .transform(sanitizers.sanitizeSlug)
    .refine(validators.isValidSlug, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
    }),

  // Date rules
  futureDate: z.date().refine(validators.isDateInFuture, {
    message: 'Date must be in the future',
  }),

  pastDate: z.date().refine(validators.isDateInPast, {
    message: 'Date must be in the past',
  }),

  // Number rules
  positiveInt: z
    .number()
    .int('Must be a whole number')
    .positive('Must be positive'),

  nonNegativeInt: z
    .number()
    .int('Must be a whole number')
    .nonnegative('Must be non-negative'),

  percentage: z
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage must be at most 100'),

  // Array rules
  uniqueStringArray: (itemSchema?: z.ZodSchema<string>) =>
    z.array(itemSchema || z.string()).refine(validators.hasUniqueElements, {
      message: 'All items must be unique',
    }),

  // File rules
  fileName: z.string().transform(sanitizers.sanitizeFileName),

  // JSON rule
  jsonString: z
    .string()
    .transform(sanitizers.sanitizeJson)
    .refine(validators.isValidJson, {
      message: 'Must be valid JSON',
    }),

  // Global ID rule
  globalId: (expectedType?: string) =>
    z.string().refine((id) => validators.isValidGlobalId(id, expectedType), {
      message: expectedType
        ? `Must be a valid ${expectedType} ID`
        : 'Must be a valid global ID',
    }),

  // Hex color rule
  hexColor: z.string().refine(validators.isValidHexColor, {
    message: 'Must be a valid hex color (e.g., #FF0000)',
  }),

  // Timezone rule
  timezone: z.string().refine(validators.isValidTimezone, {
    message: 'Must be a valid timezone',
  }),

  // Locale rule
  locale: z.string().refine(validators.isValidLocale, {
    message: 'Must be a valid locale',
  }),
} as const

/**
 * Rule builders for complex validation scenarios
 */
export const ruleBuilders = {
  // String with custom length
  stringWithLength: (min: number, max: number) =>
    z
      .string()
      .min(min, `Must be at least ${min} characters`)
      .max(max, `Must be at most ${max} characters`)
      .transform(sanitizers.sanitizeText),

  // Date range validation
  dateRange: (maxDays?: number) =>
    z
      .object({
        start: z.date(),
        end: z.date(),
      })
      .refine(
        (data) => validators.isValidDateRange(data.start, data.end, maxDays),
        {
          message: maxDays
            ? `Date range cannot exceed ${maxDays} days`
            : 'End date must be after start date',
          path: ['end'],
        },
      ),

  // File validation
  file: (allowedExtensions: string[], maxSizeMB?: number) =>
    z
      .object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      })
      .refine(
        (file) => validators.isValidFileExtension(file.name, allowedExtensions),
        {
          message: `File must be one of: ${allowedExtensions.join(', ')}`,
        },
      )
      .refine((file) => !maxSizeMB || file.size <= maxSizeMB * 1024 * 1024, {
        message: `File size must not exceed ${maxSizeMB}MB`,
      }),

  // Enum validation
  enum: <T extends [string, ...string[]]>(values: T) => z.enum(values),

  // Conditional validation
  conditionalField: <T>(
    condition: (value: unknown) => boolean,
    thenSchema: z.ZodSchema<T>,
    elseSchema: z.ZodSchema<T> = z.any() as z.ZodSchema<T>,
  ) =>
    z.union([
      z.any().refine(condition).pipe(thenSchema),
      z
        .any()
        .refine((v) => !condition(v))
        .pipe(elseSchema),
    ]) as z.ZodSchema<T>,

  // Array with size constraints
  arrayWithSize: <T>(itemSchema: z.ZodSchema<T>, min: number, max: number) =>
    z
      .array(itemSchema)
      .min(min, `Must have at least ${min} items`)
      .max(max, `Must have at most ${max} items`),

  // Async unique validation
  asyncUnique: <T>(
    checkFn: (value: T) => Promise<boolean>,
    errorMessage: string,
  ) =>
    z.custom<T>(
      async (value) => {
        const isUnique = await checkFn(value)
        return isUnique
      },
      { message: errorMessage },
    ),

  // Search query validation
  searchQuery: (minLength = 2, maxLength = 100) =>
    z
      .string()
      .min(minLength, `Search query must be at least ${minLength} characters`)
      .max(maxLength, `Search query must be at most ${maxLength} characters`)
      .transform(sanitizers.sanitizeSearchQuery),

  // Content validation with HTML sanitization
  htmlContent: (maxLength = 10000) =>
    z
      .string()
      .max(maxLength, `Content must be less than ${maxLength} characters`)
      .transform(sanitizers.sanitizeHtml),

  // Credit card validation
  creditCard: z
    .string()
    .transform((s) => s.replace(/\s/g, ''))
    .refine(validators.isValidCreditCard, {
      message: 'Invalid credit card number',
    }),

  // Range validation
  numberInRange: (min: number, max: number) =>
    z.number().refine((n) => validators.isInRange(n, min, max), {
      message: `Must be between ${min} and ${max}`,
    }),

  // Sorting options validation
  sortOptions: <T extends [string, ...string[]]>(fields: T) =>
    z.object({
      field: z.enum(fields),
      direction: z.enum(['asc', 'desc']).default('asc'),
    }),
} as const

/**
 * Composite validation schemas
 */
export const compositeRules = {
  // Login credentials
  loginCredentials: z.object({
    email: rules.email,
    password: z.string().min(1, 'Password is required'),
  }),

  // User registration
  userRegistration: z.object({
    email: rules.email,
    password: rules.password,
    username: rules.username.optional(),
    name: rules.requiredString('Name', 2, 50).optional(),
  }),

  // Profile update
  profileUpdate: z
    .object({
      name: rules.requiredString('Name', 2, 50).optional(),
      bio: rules.optionalString(500),
      website: rules.url.optional(),
      phoneNumber: rules.phoneNumber.optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
      message: 'At least one field must be provided',
    }),

  // Pagination
  pagination: z.object({
    page: rules.positiveInt.default(1),
    pageSize: rules.positiveInt.max(100).default(20),
  }),

  // Cursor pagination
  cursorPagination: z.object({
    first: rules.positiveInt.max(100).optional(),
    after: z.string().optional(),
    last: rules.positiveInt.max(100).optional(),
    before: z.string().optional(),
  }),

  // Address
  address: z.object({
    street: rules.requiredString('Street', 1, 100),
    city: rules.requiredString('City', 1, 50),
    state: rules.requiredString('State', 2, 50),
    country: rules.requiredString('Country', 2, 2), // ISO code
    postalCode: rules.requiredString('Postal code', 1, 20),
  }),
} as const

/**
 * Create custom validation rule
 */
export function createRule<T>(
  baseSchema: z.ZodSchema<T>,
  refinements: Array<{
    check: (value: T) => boolean | Promise<boolean>
    message: string
    path?: string[]
  }>,
): z.ZodSchema<T> {
  return refinements.reduce(
    (schema, refinement) =>
      schema.refine(refinement.check, {
        message: refinement.message,
        path: refinement.path,
      }),
    baseSchema,
  )
}

/**
 * Merge multiple Zod object schemas
 */
export function mergeSchemas(
  ...schemas: z.AnyZodObject[]
): z.ZodObject<any, any, any> {
  return schemas.reduce(
    (acc, schema) => acc.merge(schema),
    z.object({}),
  );
}
