import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { env } from './environment';

// Global variable to hold the prisma instance
export type PrismaClientType = PrismaClient
let globalPrisma: PrismaClientType | null = null;

// Factory function to create prisma client
function createPrismaClient() {
    const prismaOptions = {
        log: ['warn', 'error'],
        transactionOptions: {
            timeout: 10000,
        },
        datasources: {
            db: {
                url: env.DATABASE_URL,
            },
        },
    } satisfies PrismaClientOptions

    return new PrismaClient(prismaOptions);
}

// Function to get or create prisma instance
function getPrismaClient() {
    if (globalPrisma) {
        return globalPrisma;
    }

    globalPrisma = createPrismaClient();
    return globalPrisma;
}

// Function to set prisma instance (used by tests)
function setPrismaClient(prismaInstance: PrismaClient) {
    globalPrisma = prismaInstance;
}

export const prisma = getPrismaClient();
export { setPrismaClient };
