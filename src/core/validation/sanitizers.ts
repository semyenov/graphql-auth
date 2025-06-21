/**
 * Input Sanitizers
 *
 * Functions to clean and normalize user input
 */

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Sanitize username
 */
export function sanitizeUsername(username: string): string {
  return username.trim().replace(/\s+/g, '_')
}

/**
 * Sanitize HTML content (basic - use DOMPurify in production)
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production use DOMPurify or similar
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
}

/**
 * Sanitize plain text
 */
export function sanitizeText(text: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Control characters need to be removed for security
  const controlCharsRegex = /[\x00-\x1F\x7F]/g
  return text.trim().replace(/\s+/g, ' ').replace(controlCharsRegex, '')
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid chars with underscore
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.{2,}/g, '.') // Multiple dots to single
    .toLowerCase()
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.href
  } catch {
    return ''
  }
}

/**
 * Sanitize phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '')
}

/**
 * Sanitize numeric string
 */
export function sanitizeNumeric(value: string): string {
  return value.replace(/[^\d.-]/g, '')
}

/**
 * Sanitize alphanumeric string
 */
export function sanitizeAlphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * Sanitize slug
 */
export function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/[;'"\\]/g, '') // Remove SQL injection chars
    .slice(0, 100) // Limit length
}

/**
 * Sanitize JSON string
 */
export function sanitizeJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed)
  } catch {
    return '{}'
  }
}

/**
 * Remove invisible characters
 */
export function removeInvisibleChars(text: string): string {
  return (
    text
      // Remove individual zero-width characters
      .replace(/\u200B|\u200C|\u200D|\uFEFF/g, '')
      // Remove line/paragraph separators
      .replace(/\u2028|\u2029/g, '')
  )
}

/**
 * Normalize whitespace
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Windows to Unix line endings
    .replace(/\r/g, '\n') // Mac to Unix line endings
    .replace(/\t/g, '  ') // Tabs to spaces
    .replace(/ +$/gm, '') // Trailing spaces
}

/**
 * Escape HTML entities
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char] || char)
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis = '...',
): string {
  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength - ellipsis.length)
  // Try to break at word boundary
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + ellipsis
  }

  return truncated + ellipsis
}

/**
 * Remove emoji characters
 */
export function removeEmojis(text: string): string {
  return text.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    '',
  )
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(
  arr: string[],
  sanitizer: (s: string) => string,
): string[] {
  return arr.map(sanitizer).filter(Boolean)
}

/**
 * Create custom sanitizer pipeline
 */
export function createSanitizer(
  ...sanitizers: Array<(value: string) => string>
) {
  return (value: string): string => {
    return sanitizers.reduce((acc, sanitizer) => sanitizer(acc), value)
  }
}

/**
 * Common sanitizer combinations
 */
export const sanitizers = {
  email: createSanitizer(sanitizeText, sanitizeEmail),
  username: createSanitizer(sanitizeText, sanitizeUsername),
  name: createSanitizer(
    sanitizeText,
    removeInvisibleChars,
    normalizeWhitespace,
  ),
  content: createSanitizer(
    sanitizeText,
    removeInvisibleChars,
    normalizeWhitespace,
  ),
  html: createSanitizer(sanitizeHtml, removeInvisibleChars),
  url: createSanitizer(sanitizeText, sanitizeUrl),
  phone: createSanitizer(sanitizeText, sanitizePhoneNumber),
  slug: createSanitizer(sanitizeText, sanitizeSlug),
  search: createSanitizer(sanitizeText, sanitizeSearchQuery),
  filename: createSanitizer(sanitizeText, sanitizeFileName),
} as const
