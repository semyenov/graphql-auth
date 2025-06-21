import { PrismaClient } from '@prisma/client'
import { TEST_DATABASE_URL } from '../test-database-url'

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: TEST_DATABASE_URL,
        },
    },
}) 