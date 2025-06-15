import { builder } from './builder';
import { SortOrder } from './enums';

// Define input types
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
        id: t.int(),
        email: t.string(),
    }),
});

export const PostCreateInput = builder.inputType('PostCreateInput', {
    fields: (t) => ({
        title: t.string({ required: true }),
        content: t.string(),
    }),
}); 