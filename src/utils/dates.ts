/**
 * Date Utilities
 *
 * Common date and time helper functions
 */

/**
 * Add seconds to a date
 */
export function addSeconds(date: Date, seconds: number): Date {
  const result = new Date(date)
  result.setSeconds(result.getSeconds() + seconds)
  return result
}

/**
 * Add minutes to a date
 */
export function addMinutes(date: Date, minutes: number): Date {
  return addSeconds(date, minutes * 60)
}

/**
 * Add hours to a date
 */
export function addHours(date: Date, hours: number): Date {
  return addMinutes(date, hours * 60)
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date()
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date()
}

/**
 * Get the difference between two dates in seconds
 */
export function diffInSeconds(date1: Date, date2: Date): number {
  return Math.floor((date1.getTime() - date2.getTime()) / 1000)
}

/**
 * Get the difference between two dates in minutes
 */
export function diffInMinutes(date1: Date, date2: Date): number {
  return Math.floor(diffInSeconds(date1, date2) / 60)
}

/**
 * Get the difference between two dates in hours
 */
export function diffInHours(date1: Date, date2: Date): number {
  return Math.floor(diffInMinutes(date1, date2) / 60)
}

/**
 * Get the difference between two dates in days
 */
export function diffInDays(date1: Date, date2: Date): number {
  return Math.floor(diffInHours(date1, date2) / 24)
}

/**
 * Format a date to ISO string without milliseconds
 */
export function toISOStringWithoutMs(date: Date): string {
  return `${date.toISOString().split('.')[0]}Z`
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Parse a duration string (e.g., '7d', '2h', '30m', '60s') to seconds
 */
export function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/^(\d+)([dhms])$/)
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`)
  }

  const [, value, unit] = match
  const num = Number.parseInt(value ?? '0', 10)

  switch (unit) {
    case 'd':
      return num * 24 * 60 * 60
    case 'h':
      return num * 60 * 60
    case 'm':
      return num * 60
    case 's':
      return num
    default:
      throw new Error(`Invalid duration unit: ${unit}`)
  }
}
