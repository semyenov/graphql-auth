/**
 * Utility functions to transform GraphQL filter inputs to Prisma where clauses
 */

import type {
    BooleanFilter,
    DateTimeFilter,
    IntFilter,
    PostWhereInput,
    StringFilter,
    UserWhereInput
} from '../inputs';

// Transform string filter to Prisma where clause
export function transformStringFilter(filter: typeof StringFilter | undefined) {
    if (!filter) return undefined;

    const prismaFilter: any = {};

    if (filter.equals !== undefined) prismaFilter.equals = filter.equals;
    if (filter.contains !== undefined) prismaFilter.contains = filter.contains;
    if (filter.startsWith !== undefined) prismaFilter.startsWith = filter.startsWith;
    if (filter.endsWith !== undefined) prismaFilter.endsWith = filter.endsWith;
    if (filter.not !== undefined) prismaFilter.not = filter.not;

    return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined;
}

// Transform integer filter to Prisma where clause
export function transformIntFilter(filter: typeof IntFilter | undefined) {
    if (!filter) return undefined;

    const prismaFilter: any = {};

    if (filter.equals !== undefined) prismaFilter.equals = filter.equals;
    if (filter.gt !== undefined) prismaFilter.gt = filter.gt;
    if (filter.gte !== undefined) prismaFilter.gte = filter.gte;
    if (filter.lt !== undefined) prismaFilter.lt = filter.lt;
    if (filter.lte !== undefined) prismaFilter.lte = filter.lte;
    if (filter.in !== undefined) prismaFilter.in = filter.in;
    if (filter.notIn !== undefined) prismaFilter.notIn = filter.notIn;

    return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined;
}

// Transform boolean filter to Prisma where clause
export function transformBooleanFilter(filter: typeof BooleanFilter | undefined) {
    if (!filter) return undefined;

    const prismaFilter: any = {};

    if (filter.equals !== undefined) prismaFilter.equals = filter.equals;
    if (filter.not !== undefined) prismaFilter.not = filter.not;

    return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined;
}

// Transform DateTime filter to Prisma where clause
export function transformDateTimeFilter(filter: typeof DateTimeFilter | undefined) {
    if (!filter) return undefined;

    const prismaFilter: any = {};

    if (filter.equals !== undefined) prismaFilter.equals = filter.equals;
    if (filter.gt !== undefined) prismaFilter.gt = filter.gt;
    if (filter.gte !== undefined) prismaFilter.gte = filter.gte;
    if (filter.lt !== undefined) prismaFilter.lt = filter.lt;
    if (filter.lte !== undefined) prismaFilter.lte = filter.lte;

    return Object.keys(prismaFilter).length > 0 ? prismaFilter : undefined;
}

// Transform PostWhereInput to Prisma where clause
export function transformPostWhereInput(where: any): any {
    if (!where) return undefined;

    const prismaWhere: any = {};

    // Transform field filters
    if (where.title) prismaWhere.title = transformStringFilter(where.title);
    if (where.content) prismaWhere.content = transformStringFilter(where.content);
    if (where.published) prismaWhere.published = transformBooleanFilter(where.published);
    if (where.viewCount) prismaWhere.viewCount = transformIntFilter(where.viewCount);
    if (where.createdAt) prismaWhere.createdAt = transformDateTimeFilter(where.createdAt);
    if (where.updatedAt) prismaWhere.updatedAt = transformDateTimeFilter(where.updatedAt);
    if (where.authorId) prismaWhere.authorId = transformIntFilter(where.authorId);

    // Remove undefined values
    Object.keys(prismaWhere).forEach(key => {
        if (prismaWhere[key] === undefined) {
            delete prismaWhere[key];
        }
    });

    return Object.keys(prismaWhere).length > 0 ? prismaWhere : undefined;
}

// Transform UserWhereInput to Prisma where clause
export function transformUserWhereInput(where: any): any {
    if (!where) return undefined;

    const prismaWhere: any = {};

    // Transform field filters
    if (where.name) prismaWhere.name = transformStringFilter(where.name);
    if (where.email) prismaWhere.email = transformStringFilter(where.email);

    // Remove undefined values
    Object.keys(prismaWhere).forEach(key => {
        if (prismaWhere[key] === undefined) {
            delete prismaWhere[key];
        }
    });

    return Object.keys(prismaWhere).length > 0 ? prismaWhere : undefined;
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