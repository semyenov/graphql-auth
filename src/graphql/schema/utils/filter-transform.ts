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

export function transformUserWhereInput(where: any) {
    if (!where) return undefined;

    const prismaWhere: Prisma.UserWhereInput = {};

    Object.keys(where).forEach(key => {
        if (where[key] !== undefined) {
            prismaWhere[key as keyof Prisma.UserWhereInput] = where[key as keyof Prisma.UserWhereInput];
        }
    });

    return Object.keys(prismaWhere).length > 0 ? prismaWhere : undefined;
}

// Transform post where input to Prisma where clause
export function transformPostWhereInput(where: any) {
    if (!where) return undefined;

    const prismaWhere: Prisma.PostWhereInput = {};

    Object.keys(where).forEach(key => {
        if (where[key] !== undefined) {
            prismaWhere[key as keyof Prisma.PostWhereInput] = where[key as keyof Prisma.PostWhereInput];
        }
    });

    return Object.keys(prismaWhere).length > 0 ? prismaWhere : undefined;
}

// Transform order by input to Prisma orderBy clause
export function transformOrderBy(orderBy: any) {
    if (!orderBy) return undefined;

    const prismaOrderBy: Prisma.PostOrderByWithRelationInput = {};

    Object.keys(orderBy).forEach(key => {
        if (orderBy[key] !== undefined) {
            prismaOrderBy[key as keyof Prisma.PostOrderByWithRelationInput] = orderBy[key] as Prisma.SortOrder;
        }
    });

    return Object.keys(prismaOrderBy).length > 0 ? prismaOrderBy : undefined;
}