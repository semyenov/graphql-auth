import { verify } from 'jsonwebtoken'
import type { Context } from './types.d'

interface Token {
    userId: string
}

export function getUserId(context: Context): number | null {
    console.log(context.req)
    if (context.req.headers) {
        const authHeader = context.req.headers['authorization'] as string | undefined
        if (authHeader && typeof authHeader === 'string') {
            const token = authHeader.replace('Bearer ', '')
            const verifiedToken = verify(token, process.env.APP_SECRET || '') as Token
            return verifiedToken && Number(verifiedToken.userId)
        }
    }

    return null
}
