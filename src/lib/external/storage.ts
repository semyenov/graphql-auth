/**
 * Storage Service Adapter
 * 
 * Interface and implementations for file storage
 */

import { promises as fs } from 'fs'
import path from 'path'

/**
 * File upload interface
 */
export interface FileUpload {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => NodeJS.ReadableStream
}

/**
 * Storage file interface
 */
export interface StorageFile {
  key: string
  url: string
  size: number
  mimetype: string
  metadata?: Record<string, string>
}

/**
 * Storage service interface
 */
export interface IStorageService {
  upload(file: FileUpload, key: string): Promise<StorageFile>
  delete(key: string): Promise<void>
  getUrl(key: string): Promise<string>
  exists(key: string): Promise<boolean>
  list(prefix?: string): Promise<StorageFile[]>
}

/**
 * Local file system storage
 */
export class LocalStorageService implements IStorageService {
  private basePath: string
  private baseUrl: string

  constructor(config: { basePath: string; baseUrl: string }) {
    this.basePath = config.basePath
    this.baseUrl = config.baseUrl
  }

  async upload(file: FileUpload, key: string): Promise<StorageFile> {
    const filePath = path.join(this.basePath, key)
    const dir = path.dirname(filePath)

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true })

    // Stream file to disk
    const writeStream = require('fs').createWriteStream(filePath)
    const readStream = file.createReadStream()
    
    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject)
    })

    const stats = await fs.stat(filePath)

    return {
      key,
      url: `${this.baseUrl}/${key}`,
      size: stats.size,
      mimetype: file.mimetype,
    }
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key)
    await fs.unlink(filePath).catch(() => {
      // Ignore if file doesn't exist
    })
  }

  async getUrl(key: string): Promise<string> {
    return `${this.baseUrl}/${key}`
  }

  async exists(key: string): Promise<boolean> {
    const filePath = path.join(this.basePath, key)
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    const files: StorageFile[] = []
    const searchPath = prefix ? path.join(this.basePath, prefix) : this.basePath

    const walk = async (dir: string): Promise<void> => {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory()) {
          await walk(fullPath)
        } else {
          const key = path.relative(this.basePath, fullPath)
          const stats = await fs.stat(fullPath)
          
          files.push({
            key,
            url: `${this.baseUrl}/${key}`,
            size: stats.size,
            mimetype: 'application/octet-stream', // Would need to detect
          })
        }
      }
    }

    await walk(searchPath)
    return files
  }
}

/**
 * S3-compatible storage (AWS S3, MinIO, etc.)
 */
export class S3StorageService implements IStorageService {
  private client: any
  private bucket: string

  constructor(config: {
    endpoint?: string
    region: string
    accessKeyId: string
    secretAccessKey: string
    bucket: string
  }) {
    // In real implementation, initialize S3 client
    this.bucket = config.bucket
    this.client = config
  }

  async upload(file: FileUpload, key: string): Promise<StorageFile> {
    // In real implementation, use S3 client
    console.log('S3: Uploading file', key)
    
    return {
      key,
      url: `https://${this.bucket}.s3.amazonaws.com/${key}`,
      size: 0,
      mimetype: file.mimetype,
    }
  }

  async delete(key: string): Promise<void> {
    console.log('S3: Deleting file', key)
  }

  async getUrl(key: string): Promise<string> {
    // Could generate signed URL
    return `https://${this.bucket}.s3.amazonaws.com/${key}`
  }

  async exists(key: string): Promise<boolean> {
    console.log('S3: Checking file exists', key)
    return false
  }

  async list(prefix?: string): Promise<StorageFile[]> {
    console.log('S3: Listing files with prefix', prefix)
    return []
  }
}

/**
 * Storage utilities
 */
export class StorageUtils {
  /**
   * Generate unique file key
   */
  static generateKey(filename: string, prefix?: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(filename)
    const name = path.basename(filename, ext)
    
    const safeFilename = name.replace(/[^a-zA-Z0-9-_]/g, '_')
    const key = `${timestamp}-${random}-${safeFilename}${ext}`
    
    return prefix ? `${prefix}/${key}` : key
  }

  /**
   * Get file extension from mimetype
   */
  static getExtensionFromMimetype(mimetype: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'text/plain': '.txt',
      'application/json': '.json',
    }
    
    return mimeMap[mimetype] || ''
  }

  /**
   * Validate file type
   */
  static isValidFileType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Wildcard match (e.g., image/*)
        const prefix = type.slice(0, -2)
        return mimetype.startsWith(prefix)
      }
      return mimetype === type
    })
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }
}

/**
 * Create storage service based on environment
 */
export function createStorageService(): IStorageService {
  if (process.env.S3_BUCKET) {
    return new S3StorageService({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      bucket: process.env.S3_BUCKET,
      endpoint: process.env.S3_ENDPOINT,
    })
  }

  return new LocalStorageService({
    basePath: process.env.UPLOAD_PATH || './uploads',
    baseUrl: process.env.UPLOAD_URL || 'http://localhost:4000/uploads',
  })
}