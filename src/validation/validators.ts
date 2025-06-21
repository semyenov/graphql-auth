/**
 * Custom Validators
 *
 * Reusable validation functions for complex validation logic
 */

import { z } from 'zod'
import { prisma } from '../prisma'

/**
 * Validate email uniqueness
 */
export async function isEmailUnique(
  email: string,
  excludeUserId?: number,
): Promise<boolean> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!existingUser) return true
  if (excludeUserId && existingUser.id === excludeUserId) return true

  return false
}

/**
 * Validate strong password
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false

  return true
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Validate global ID format
 */
export function isValidGlobalId(
  globalId: string,
  expectedType?: string,
): boolean {
  try {
    const decoded = Buffer.from(globalId, 'base64').toString('utf-8')
    const [type, id] = decoded.split(':')

    if (!(type && id)) return false
    if (expectedType && type !== expectedType) return false

    const numericId = Number.parseInt(id, 10)
    return !Number.isNaN(numericId) && numericId > 0
  } catch {
    return false
  }
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username)
}

/**
 * Validate phone number (basic international format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ''))
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Validate date is in future
 */
export function isDateInFuture(date: Date): boolean {
  return date > new Date()
}

/**
 * Validate date is in past
 */
export function isDateInPast(date: Date): boolean {
  return date < new Date()
}

/**
 * Validate date range
 */
export function isValidDateRange(
  startDate: Date,
  endDate: Date,
  maxDays?: number,
): boolean {
  if (startDate > endDate) return false

  if (maxDays) {
    const diffInDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    if (diffInDays > maxDays) return false
  }

  return true
}

/**
 * Validate file extension
 */
export function isValidFileExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return false

  return allowedExtensions.includes(ext)
}

/**
 * Validate image dimensions (requires external library in real app)
 */
export async function isValidImageDimensions(
  _imageUrl: string,
  _maxWidth: number,
  _maxHeight: number,
): Promise<boolean> {
  // This would require an image processing library
  // For now, return true as placeholder
  return true
}

/**
 * Create async validator for Zod
 */
export function createAsyncValidator<T>(
  validatorFn: (value: T) => Promise<boolean> | boolean,
  errorMessage: string,
) {
  return z.custom<T>(
    async (value) => {
      const isValid = await validatorFn(value)
      return isValid
    },
    { message: errorMessage },
  )
}

/**
 * Create conditional validator
 */
export function createConditionalValidator<T>(
  condition: (value: T) => boolean,
  validator: z.ZodSchema<T>,
  fallback: z.ZodSchema<T> = z.any(),
) {
  return z.union([
    z.custom<T>((value) => condition(value)).pipe(validator),
    z.custom<T>((value) => !condition(value)).pipe(fallback),
  ])
}

/**
 * Validate array uniqueness
 */
export function hasUniqueElements<T>(array: T[]): boolean {
  return new Set(array).size === array.length
}

/**
 * Validate JSON string
 */
export function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * Check if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '')
  if (!/^\d+$/.test(digits)) return false

  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    const digitChar = digits[i]
    if (digitChar) {
      let digit = Number.parseInt(digitChar, 10)

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }
  }

  return sum % 10 === 0
}

/**
 * Validate timezone
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

/**
 * Validate locale
 */
export function isValidLocale(locale: string): boolean {
  try {
    new Intl.Locale(locale)
    return true
  } catch {
    return false
  }
}
