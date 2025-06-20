import { builder } from './builder';
import { SortOrder } from './enums';

// Enhanced string filtering input type
export const StringFilter = builder.inputType('StringFilter', {
    fields: (t) => ({
        equals: t.string({
            description: 'Exact string match',
        }),
        contains: t.string({
            description: 'String contains this value (case-insensitive)',
        }),
        startsWith: t.string({
            description: 'String starts with this value',
        }),
        endsWith: t.string({
            description: 'String ends with this value',
        }),
        not: t.string({
            description: 'String does not equal this value',
        }),
    }),
});

// Enhanced integer filtering input type
export const IntFilter = builder.inputType('IntFilter', {
    fields: (t) => ({
        equals: t.int({
            description: 'Exact number match',
        }),
        gt: t.int({
            description: 'Greater than this value',
        }),
        gte: t.int({
            description: 'Greater than or equal to this value',
        }),
        lt: t.int({
            description: 'Less than this value',
        }),
        lte: t.int({
            description: 'Less than or equal to this value',
        }),
        in: t.intList({
            description: 'Value is in this list',
        }),
        notIn: t.intList({
            description: 'Value is not in this list',
        }),
    }),
});

// Enhanced boolean filtering input type
export const BooleanFilter = builder.inputType('BooleanFilter', {
    fields: (t) => ({
        equals: t.boolean({
            description: 'Exact boolean match',
        }),
        not: t.boolean({
            description: 'Boolean does not equal this value',
        }),
    }),
});

// Enhanced date filtering input type
export const DateTimeFilter = builder.inputType('DateTimeFilter', {
    fields: (t) => ({
        equals: t.field({
            type: 'DateTime',
            description: 'Exact date match',
        }),
        gt: t.field({
            type: 'DateTime',
            description: 'Date after this value',
        }),
        gte: t.field({
            type: 'DateTime',
            description: 'Date on or after this value',
        }),
        lt: t.field({
            type: 'DateTime',
            description: 'Date before this value',
        }),
        lte: t.field({
            type: 'DateTime',
            description: 'Date on or before this value',
        }),
    }),
});

// Comprehensive post filtering input type
export const PostWhereInput = builder.inputType('PostWhereInput', {
    fields: (t) => ({
        title: t.field({
            type: StringFilter,
            description: 'Filter posts by title',
        }),
        content: t.field({
            type: StringFilter,
            description: 'Filter posts by content',
        }),
        published: t.field({
            type: BooleanFilter,
            description: 'Filter posts by published status',
        }),
        viewCount: t.field({
            type: IntFilter,
            description: 'Filter posts by view count',
        }),
        createdAt: t.field({
            type: DateTimeFilter,
            description: 'Filter posts by creation date',
        }),
        updatedAt: t.field({
            type: DateTimeFilter,
            description: 'Filter posts by last update date',
        }),
        authorId: t.field({
            type: IntFilter,
            description: 'Filter posts by author ID',
        }),
        // Note: Logical operators (AND, OR, NOT) omitted for now
        // These require special handling in Pothos for recursive types
    }),
});

// Enhanced post ordering input type
export const PostOrderByInput = builder.inputType('PostOrderByInput', {
    fields: (t) => ({
        id: t.field({
            type: SortOrder,
            description: 'Order by post ID',
        }),
        title: t.field({
            type: SortOrder,
            description: 'Order by post title',
        }),
        published: t.field({
            type: SortOrder,
            description: 'Order by published status',
        }),
        viewCount: t.field({
            type: SortOrder,
            description: 'Order by view count',
        }),
        createdAt: t.field({
            type: SortOrder,
            description: 'Order by creation date',
        }),
        updatedAt: t.field({
            type: SortOrder,
            description: 'Order by last update date',
        }),
    }),
});

// Keep existing input types for backward compatibility
export const PostOrderByUpdatedAtInput = builder.inputType('PostOrderByUpdatedAtInput', {
    fields: (t) => ({
        updatedAt: t.field({
            type: SortOrder,
            required: true,
        }),
    }),
});

export const UserUniqueInput = builder.inputType('UserUniqueInput', {
    fields: (t) => ({
        id: t.int({
            description: 'User ID',
        }),
        email: t.string({
            description: 'User email address',
        }),
    }),
});

export const PostCreateInput = builder.inputType('PostCreateInput', {
    fields: (t) => ({
        title: t.string({
            required: true,
            description: 'The title of the post',
        }),
        content: t.string({
            description: 'The content/body of the post',
        }),
    }),
});

// Enhanced post update input type
export const PostUpdateInput = builder.inputType('PostUpdateInput', {
    fields: (t) => ({
        title: t.string({
            description: 'New title for the post',
        }),
        content: t.string({
            description: 'New content for the post',
        }),
        published: t.boolean({
            description: 'New published status for the post',
        }),
    }),
});

// User filtering input type
export const UserWhereInput = builder.inputType('UserWhereInput', {
    fields: (t) => ({
        name: t.field({
            type: StringFilter,
            description: 'Filter users by name',
        }),
        email: t.field({
            type: StringFilter,
            description: 'Filter users by email',
        }),
        // Note: Logical operators (AND, OR, NOT) omitted for now
        // These require special handling in Pothos for recursive types
    }),
});

export const UserSearchInput = builder.inputType('UserSearchInput', {
    fields: (t) => ({
        query: t.string({
            description: 'Search query',
        })
    }),
});

// User ordering input type
export const UserOrderByInput = builder.inputType('UserOrderByInput', {
    fields: (t) => ({
        id: t.field({
            type: SortOrder,
            description: 'Order by user ID',
            defaultValue: 'asc',
        }),
        name: t.field({
            type: SortOrder,
            description: 'Order by user name',
        }),
        email: t.field({
            type: SortOrder,
            description: 'Order by user email',
        }),
    }),
}); 