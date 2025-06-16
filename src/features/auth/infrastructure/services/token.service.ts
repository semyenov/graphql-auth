import { signToken, verifyToken } from '../../../../utils/jwt'
import { JWTPayload } from '../../../../utils/jwt'

/**
 * Infrastructure service for JWT token management
 */
export class TokenService {
  generateToken(payload: { userId: number; email: string }): string {
    return signToken(payload)
  }

  verifyToken(token: string): JWTPayload {
    return verifyToken(token)
  }

  extractFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null
    
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null
    }
    
    return parts[1] || null
  }
}