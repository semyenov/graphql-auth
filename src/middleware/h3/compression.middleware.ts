/**
 * H3 Compression Middleware
 *
 * Compresses HTTP responses using gzip/brotli based on Accept-Encoding header
 */

import {
  type BrotliCompress,
  createBrotliCompress,
  createGzip,
  type Gzip,
  constants as zlibConstants,
} from 'node:zlib'
import {
  defineEventHandler,
  getHeader,
  type H3Event,
  type NodeServerResponse,
  setHeader,
} from 'h3'
import type { IncomingMessage } from 'http'

/**
 * Check if content type should be compressed
 */
function shouldCompress(contentType: string | undefined): boolean {
  if (!contentType) return false

  // Compress text-based content
  const compressibleTypes = [
    'text/',
    'application/json',
    'application/javascript',
    'application/xml',
    'application/graphql',
    'image/svg+xml',
  ]

  return compressibleTypes.some((type) => contentType.includes(type))
}

/**
 * Get accepted encodings from request
 */
function getAcceptedEncodings(event: H3Event): string[] {
  const acceptEncoding = getHeader(event, 'accept-encoding') || ''
  return acceptEncoding.split(',').map((e) => e.trim().toLowerCase())
}

/**
 * Create compression middleware
 */
export function createCompressionMiddleware(
  options: {
    threshold?: number // Minimum size in bytes to compress (default: 1024)
    brotli?: boolean // Enable Brotli compression (default: true)
    gzip?: boolean // Enable Gzip compression (default: true)
  } = {},
) {
  const { threshold = 1024, brotli = true, gzip = true } = options

  return defineEventHandler(async (event) => {
    // Skip if already compressed or method doesn't support body
    if (event.method === 'HEAD' || event.method === 'OPTIONS') {
      return
    }

    const acceptedEncodings = getAcceptedEncodings(event)
    const originalWrite = event.node.res.write
    const originalEnd = event.node.res.end

    let compressionStream: Gzip | BrotliCompress | null = null
    let encoding: string | null = null

    // Determine compression method
    if (brotli && acceptedEncodings.includes('br')) {
      encoding = 'br'
    } else if (
      gzip &&
      (acceptedEncodings.includes('gzip') || acceptedEncodings.includes('*'))
    ) {
      encoding = 'gzip'
    }

    if (!encoding) {
      return // No compression
    }

    // Buffer to accumulate data
    const buffer: Buffer[] = []
    let totalSize = 0

    // Override write method
    event.node.res.write = (
      chunk: unknown,
      encodingOrCb?: unknown,
      cb?: unknown,
    ) => {
      const callback = typeof encodingOrCb === 'function' ? encodingOrCb : cb

      if (chunk) {
        const buf = Buffer.isBuffer(chunk)
          ? chunk
          : Buffer.from(chunk as string, encodingOrCb as BufferEncoding)
        buffer.push(buf)
        totalSize += buf.length
      }

      if (callback) (callback as () => void)()
      return true
    }

    // Override end method - use any to handle different signatures
    event.node.res.end = (
      ...args: unknown[]
    ): NodeServerResponse<IncomingMessage> => {
      const [chunk, encodingOrCb, cb] = args
      const callback = typeof encodingOrCb === 'function' ? encodingOrCb : cb

      if (chunk) {
        const buf = Buffer.isBuffer(chunk)
          ? chunk
          : Buffer.from(chunk as string, encodingOrCb as BufferEncoding)
        buffer.push(buf)
        totalSize += buf.length
      }

      // Check if we should compress
      const contentType = event.node.res.getHeader('content-type') as
        | string
        | undefined
      const shouldCompressContent =
        shouldCompress(contentType) && totalSize >= threshold

      if (!(shouldCompressContent && encoding)) {
        // No compression - write original data
        event.node.res.write = originalWrite
        event.node.res.end = originalEnd

        if (buffer.length > 0) {
          const data = Buffer.concat(buffer)
          // @ts-ignore - handling buffer write
          originalWrite.call(event.node.res, data)
        }
        // @ts-ignore - complex overloaded signature
        return originalEnd.apply(event.node.res, args)
      }

      // Set compression headers
      setHeader(event, 'content-encoding', encoding)
      event.node.res.removeHeader('content-length') // Length will change
      setHeader(event, 'vary', 'accept-encoding')

      // Create compression stream
      if (encoding === 'br') {
        compressionStream = createBrotliCompress({
          params: {
            [zlibConstants.BROTLI_PARAM_QUALITY]: 4,
          },
        })
      } else {
        compressionStream = createGzip({ level: 6 })
      }

      // Pipe through compression
      compressionStream.on('data', (chunk) => {
        // @ts-ignore - handling compressed chunk write
        originalWrite.call(event.node.res, chunk)
      })

      compressionStream.on('end', () => {
        // @ts-ignore - complex overloaded signature
        originalEnd.call(event.node.res, callback)
      })

      compressionStream.on('error', (err) => {
        console.error('Compression error:', err)
        // @ts-ignore - complex overloaded signature
        originalEnd.call(event.node.res, callback)
      })

      // Write buffered data to compression stream
      if (buffer.length > 0) {
        const data = Buffer.concat(buffer)
        compressionStream.write(data)
      }

      compressionStream.end()
      return event.node.res
    }
  })
}
