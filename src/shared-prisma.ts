import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { withAccelerate } from '@prisma/extension-accelerate';

// Global variable to hold the prisma instance
let globalPrisma: ReturnType<typeof createPrismaClient> | null = null;

// Factory function to create prisma client
function createPrismaClient() {
    const prismaOptions = {
        log: ['warn', 'error'],
        transactionOptions: {
            timeout: 10000,
        },
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    } satisfies PrismaClientOptions

    return new PrismaClient(prismaOptions).$extends(withAccelerate({
        fetch: (input, init) => {
            return fetch(input, init)
        }
    }));
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
function setPrismaClient(prismaInstance: any) {
    globalPrisma = prismaInstance;
}

export const prisma = getPrismaClient();
export { setPrismaClient };
