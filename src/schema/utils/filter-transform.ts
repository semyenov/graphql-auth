/**
 * Utility functions to transform GraphQL filter inputs to Prisma where clauses
 */

import { Prisma } from "@prisma/client";

// Transform string filter to Prisma where clause
export function transformStringFilter(filter: Prisma.StringFilter | undefined): Prisma.StringFilter | undefined {
    if (!filter) return undefined;

    const prismaFilter: Prisma.StringFilter = {};

    if (filter.equals !== undefined) prismaFilter.equals = filter.equals;
    if (filter.contains !== undefined) prismaFilter.contains = filter.contains;
    if (filter.startsWith !== undefined) prismaFilter.startsWith = filter.startsWith;
    if (filter.endsWith !== undefined) prismaFilter.endsWith = filter.endsWith;
    if (filter.not !== undefined) prismaFilter.not = filter.not;

    return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined;
}

// Transform order by input to Prisma orderBy clause
export function transformOrderBy(orderBy: any): any {
    if (!orderBy) return undefined;

    const prismaOrderBy: any = {};

    Object.keys(orderBy).forEach(key => {
        if (orderBy[key] !== undefined) {
            prismaOrderBy[key] = orderBy[key];
        }
    });

    return Object.keys(prismaOrderBy).length > 0 ? prismaOrderBy : undefined;
}