import { getUserId } from '../../context/utils'
import { parseGlobalId } from '../../shared/infrastructure/graphql/relay-helpers'
import { builder } from '../builder'
import { UserOrderByInput, UserWhereInput } from '../inputs'
import { transformOrderBy, transformUserWhereInput } from '../utils/filter-transform'

// Enhanced users query with filtering and ordering
builder.queryField('users', (t) =>
    t.prismaConnection({
        type: 'User',
        cursor: 'id',
        description: 'Get all users with advanced filtering and pagination',
        args: {
            where: t.arg({
                type: UserWhereInput,
                description: 'Filtering options for users',
            }),
            orderBy: t.arg({
                type: [UserOrderByInput],
                defaultValue: [{ id: 'asc' }],
                description: 'Ordering options (default: by ID ascending)',
            }),
        },
        resolve: (query, _parent, args, ctx) => {
            // Apply filtering
            const where = transformUserWhereInput(args.where) || {};

            // Transform order by
            const orderBy = args.orderBy?.map(transformOrderBy).filter(Boolean) || [{ id: 'asc' }];

            return ctx.repositories.users.findMany({
                ...query,
                where,
                orderBy,
            });
        },
        totalCount: (_parent, args, ctx) => {
            const where = transformUserWhereInput(args.where) || {};
            return ctx.repositories.users.count(where);
        },
    })
)

// Current user query with enhanced description
builder.queryField('me', (t) =>
    t.prismaField({
        type: 'User',
        nullable: true,
        description: 'Get the currently authenticated user',
        resolve: (query, _parent, _args, context) => {
            const userId = getUserId(context)
            if (!userId) return null

            return context.repositories.users.findById(userId)
        },
    })
)

// Enhanced user by ID query with error handling
builder.queryField('user', (t) =>
    t.prismaField({
        type: 'User',
        nullable: true,
        args: {
            id: t.arg.id({
                required: true,
                description: 'Global ID of the user to retrieve',
            }),
        },
        resolve: async (query, _parent, args, ctx) => {
            try {
                const userId = parseGlobalId(args.id.toString(), 'User')

                return ctx.repositories.users.findById(userId)
            } catch (error) {
                // Invalid global ID format
                return null;
            }
        },
    })
)

// New: Search users query for finding users by name or email
builder.queryField('searchUsers', (t) =>
    t.prismaConnection({
        type: 'User',
        cursor: 'id',
        description: 'Search users by name or email',
        args: {
            searchTerm: t.arg.string({
                required: true,
                description: 'Search term to match against name or email',
            }),
            orderBy: t.arg({
                type: [UserOrderByInput],
                defaultValue: [{ name: 'asc' }],
                description: 'Ordering options (default: by name ascending)',
            }),
        },
        resolve: (query, _parent, args, ctx) => {
            const searchTerm = args.searchTerm.trim();

            if (!searchTerm) {
                return [];
            }

            // Search in both name and email fields
            const where = {
                OR: [
                    { name: { contains: searchTerm } },
                    { email: { contains: searchTerm } },
                ],
            };

            // Transform order by
            const orderBy = args.orderBy?.map(transformOrderBy).filter(Boolean) || [{ name: 'asc' }];

            return ctx.repositories.users.findMany({
                ...query,
                where,
                orderBy,
            });
        },
        totalCount: (_parent, args, ctx) => {
            const searchTerm = args.searchTerm.trim();

            if (!searchTerm) {
                return 0;
            }

            const where = {
                OR: [
                    { name: { contains: searchTerm } },
                    { email: { contains: searchTerm } },
                ],
            };

            return ctx.repositories.users.count(where);
        },
    })
) 