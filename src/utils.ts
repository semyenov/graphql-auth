import { verify } from 'jsonwebtoken'
import type { Context } from './context'

export const APP_SECRET = 'appsecret321'

interface Token {
    userId: string
}

export function getUserId(context: Context): number | null {
    if (context.req.headers) {
        const authHeader = context.req.headers.authorization
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '')
            const verifiedToken = verify(token, APP_SECRET) as Token
            return verifiedToken && Number(verifiedToken.userId)
        }
    }

    return null
}   