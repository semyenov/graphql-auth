import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

export const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    transactionOptions: {
        timeout: 10000,
    },
}).$extends(withAccelerate({
    fetch: (input, init) => {
        console.log('fetch', input, init)
        return fetch(input, init)
    }
}))
